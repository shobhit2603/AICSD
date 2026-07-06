# Architecture Notes

## System Architecture

The backend follows a **layered monolithic architecture** with clear separation of concerns. Each layer has a single responsibility, making the codebase testable, maintainable, and easy to extend.

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Frontend)                       │
│                   Next.js + TailwindCSS                     │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP (REST)
┌──────────────────────────▼──────────────────────────────────┐
│                    API GATEWAY LAYER                         │
│  ┌──────────┐ ┌──────┐ ┌────────────┐ ┌───────────────────┐│
│  │  Helmet   │ │ CORS │ │ Rate Limit │ │  Morgan Logger    ││
│  └──────────┘ └──────┘ └────────────┘ └───────────────────┘│
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                     ROUTES LAYER                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Zod Validation Middleware → Controller Dispatch       │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                   CONTROLLER LAYER                           │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │ ticketController  │  │  aiController    │                 │
│  │ (asyncHandler)    │  │  (asyncHandler)  │                 │
│  └────────┬─────────┘  └────────┬─────────┘                 │
└───────────┼──────────────────────┼──────────────────────────┘
            │                      │
┌───────────▼──────────────────────▼──────────────────────────┐
│                    SERVICE LAYER                             │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │  ticketService    │──│    aiService     │                 │
│  │  (Business Logic) │  │  (Mistral AI)    │                 │
│  └────────┬─────────┘  └──────────────────┘                 │
└───────────┼─────────────────────────────────────────────────┘
            │
┌───────────▼─────────────────────────────────────────────────┐
│                      DAO LAYER                               │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │    ticketDao      │  │   messageDao     │                 │
│  │  (Mongoose Ops)   │  │  (Mongoose Ops)  │                 │
│  └────────┬─────────┘  └────────┬─────────┘                 │
└───────────┼──────────────────────┼──────────────────────────┘
            │                      │
┌───────────▼──────────────────────▼──────────────────────────┐
│                     DATA LAYER                               │
│              MongoDB (Atlas / Local)                         │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │  Tickets          │  │   Messages       │                 │
│  │  Collection       │  │   Collection     │                 │
│  └──────────────────┘  └──────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Responsibility | Does NOT |
|-------|---------------|----------|
| **Routes** | URL mapping, middleware chaining, validation | Contain business logic |
| **Controllers** | HTTP request/response handling, status codes | Call database directly |
| **Services** | Business logic, AI orchestration, workflow coordination | Know about HTTP or Express |
| **DAOs** | Database operations, query building, aggregation | Know about business rules |
| **Models** | Schema definition, indexes, validation constraints | Contain query logic |

---

## Database Design

### Collections

#### Tickets Collection
```javascript
{
  _id: ObjectId,
  title: String,                    // Ticket subject line
  customer: {
    name: String,                   // Customer display name
    email: String                   // Customer email (lowercase, trimmed)
  },
  status: Enum['open', 'in-progress', 'resolved', 'closed'],
  priority: Enum['low', 'medium', 'high', 'urgent'],
  category: Enum['billing', 'technical', 'account', 'shipping', 'general', 'other'],
  tags: [String],                   // Flexible labels for search
  
  // AI-Generated Fields
  sentiment: Enum['positive', 'neutral', 'negative', null],
  summary: String | null,           // AI-generated summary
  aiConfidence: Number (0-1),       // Confidence score for last AI classification
  
  // Escalation
  escalated: Boolean,
  escalationReason: String | null,
  assignedAgent: String | null,
  
  // Embedded Sub-documents
  internalNotes: [{
    content: String,
    createdBy: String,
    createdAt: Date
  }],
  activityLog: [{
    action: Enum[...],              // 11 possible action types
    details: String,
    performedBy: String,
    createdAt: Date
  }],
  
  createdAt: Date,                  // Mongoose timestamps
  updatedAt: Date
}
```

#### Messages Collection
```javascript
{
  _id: ObjectId,
  ticketId: ObjectId (ref: Ticket), // Foreign key
  senderType: Enum['customer', 'agent', 'ai'],
  content: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Indexing Strategy

| Index | Type | Purpose |
|-------|------|---------|
| `{ status: 1, priority: 1 }` | Compound | Fast filtering by status + priority |
| `{ category: 1 }` | Single | Category-based filtering |
| `{ escalated: 1 }` | Single | Escalated ticket queries |
| `{ 'customer.email': 1 }` | Single | Customer lookup |
| `{ 'customer.name': 'text', title: 'text', tags: 'text' }` | Text | Full-text search |
| `{ createdAt: -1 }` | Single | Default sort optimization |
| `{ ticketId: 1, createdAt: 1 }` | Compound (Messages) | Conversation history retrieval |

### Why Separate Collections?

**Tickets and Messages are in separate collections** because:
1. **16MB Document Limit** — MongoDB documents can't exceed 16MB. Long conversations with embedded messages would eventually hit this limit.
2. **Read Performance** — The ticket listing page only needs ticket metadata, not full conversations. Separate collections avoid loading unnecessary data.
3. **Write Performance** — Appending messages to a separate collection is an O(1) insert, vs. O(n) for pushing to an embedded array in a growing document.

---

## AI Architecture

### AI Pipeline

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  Controller  │────▶│  TicketService   │────▶│    AiService     │
│  (HTTP)      │     │  (Orchestrator)  │     │  (_callMistral)  │
└──────────────┘     └────────┬────────┘     └────────┬─────────┘
                              │                        │
                     ┌────────▼────────┐     ┌────────▼─────────┐
                     │     DAO Layer   │     │  Mistral AI API  │
                     │  (Read context) │     │  (Chat Complete) │
                     └─────────────────┘     └──────────────────┘
```

### Prompt Engineering Strategy

All prompts follow a **structured output pattern** to ensure reliable parsing:

1. **Role Assignment** — Every prompt starts with "You are a [specific role]" to set context
2. **Closed Set Constraints** — Categories and sentiments are limited to predefined enums
3. **Format Instructions** — Explicit output format with placeholders (e.g., `CATEGORY: <category>`)
4. **"Nothing else" Guard** — Prevents the AI from adding explanatory text that breaks parsing
5. **Fallback Logic** — Every AI method has graceful degradation if parsing fails

### AI Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Model | `mistral-medium-latest` | Best balance of quality, speed, and cost |
| Temperature | `0.3` | Low temperature for consistent, deterministic outputs |
| Max Tokens | 50-300 | Constrained per feature to prevent verbose responses |

### Error Handling Strategy

```
AI Call ──▶ Success ──▶ Parse Response ──▶ Validate ──▶ Return
  │                           │
  ▼                           ▼
Error ──▶ Log Error    Parse Fail ──▶ Return Default
  │
  ▼
Graceful Degradation
(neutral sentiment, general category, no escalation)
```

---

## Security Architecture

| Concern | Solution |
|---------|----------|
| HTTP Headers | `helmet` sets security headers (X-Frame-Options, CSP, etc.) |
| Rate Limiting | General: 200 req/15min. AI endpoints: 20 req/min (protects Mistral API costs) |
| CORS | Restricted to frontend origin in production, open in development |
| Input Validation | Zod schemas validate all request bodies, params, and query strings |
| Error Exposure | Stack traces only included in development mode responses |
| Body Size Limit | 10MB max request body to prevent DoS |
| Graceful Shutdown | SIGTERM/SIGINT handlers close connections cleanly |

---

## Scalability Considerations

### Current Architecture Strengths
1. **Stateless Backend** — The Express server holds no session state. It can be horizontally scaled across multiple instances using PM2 cluster mode or Kubernetes pods without session affinity requirements.
2. **Database Indexing** — 7 indexes across 2 collections ensure sub-millisecond query times even at high ticket volumes.
3. **Pagination** — Server-side pagination prevents memory exhaustion from large result sets.
4. **Non-Blocking AI** — Sentiment analysis runs as a fire-and-forget background task, never blocking the HTTP response.
5. **Efficient Reads** — `.lean()` on read queries returns plain JS objects instead of Mongoose documents, reducing memory overhead by ~50%.
6. **Selective Projection** — Activity logs are excluded from list queries (`.select('-activityLog')`) to minimize payload size.

### Scaling Bottlenecks & Solutions

| Bottleneck | Current Impact | Solution |
|------------|---------------|----------|
| Mistral API Latency | 1-3 seconds per AI call | Add Redis caching for summaries and categories |
| MongoDB Single Instance | Sufficient for 10K+ tickets | MongoDB Atlas auto-scaling or sharding on `customer.email` |
| No Connection Pooling | Default Mongoose pool (5 connections) | Increase pool size or use connection multiplexing |
| Full-Text Search Limits | MongoDB text search lacks relevance ranking | Migrate to Elasticsearch for advanced search |
| Similar Ticket Discovery | Loads 50 tickets into AI context | Implement vector embeddings (e.g., Pinecone, pgvector) for semantic search |

### Production Deployment Recommendations

```
                    ┌─────────────┐
                    │   Nginx /   │
                    │  CloudFlare │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────▼────┐ ┌────▼─────┐ ┌────▼─────┐
        │ Node.js  │ │ Node.js  │ │ Node.js  │
        │ Instance │ │ Instance │ │ Instance │
        └─────┬────┘ └────┬─────┘ └────┬─────┘
              │            │            │
              └────────────┼────────────┘
                           │
              ┌────────────┼────────────┐
              │                         │
        ┌─────▼────┐            ┌──────▼──────┐
        │  Redis   │            │  MongoDB    │
        │ (Cache)  │            │  (Atlas)    │
        └──────────┘            └─────────────┘
```

This architecture supports horizontal scaling of the application tier while using managed services for data persistence and caching.
