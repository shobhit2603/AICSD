# 🛡️ ReeRoute: AI-Powered Customer Support Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb)](https://mongodb.com/)
[![Mistral AI](https://img.shields.io/badge/AI-Mistral_Medium-F58025?style=flat)](https://mistral.ai/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

> **ReeRoute** is a modern, AI-assisted support operations platform designed to empower customer service teams.

Built for the Full Stack Engineering Assignment, this dashboard allows support agents to manage tickets, track conversations, and leverage advanced AI-powered workflows to resolve customer issues efficiently while maintaining human-in-the-loop oversight.

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js + TailwindCSS | Server-side rendered React dashboard with modern glassmorphism UI |
| **Backend** | Node.js + Express 5 | RESTful API using layered monolithic architecture |
| **Database** | MongoDB + Mongoose 9 | Document store with advanced indexing and text search |
| **AI Engine** | Mistral AI | Core AI capabilities (Summarization, categorization, sentiment, escalation) |
| **Validation** | Zod v4 | Strict schema-based request and environment validation |
| **Security** | Helmet + Rate Limit | HTTP hardening and robust API rate limiting |

```mermaid
graph LR
    A[Next.js Frontend] <-->|REST API| B(Express Backend)
    B <-->|Mongoose| C[(MongoDB Atlas)]
    B <-->|SDK| D{Mistral AI}
```

## ✨ Key Features

### Ticket Management
- **Full CRUD** — Create, view, update, and manage support tickets
- **Advanced Filtering** — Filter by status, priority, category, sentiment, and escalation state
- **Full-Text Search** — Search across ticket titles, customer names, and tags
- **Pagination** — Cursor-based pagination with configurable page sizes (max 100/page)
- **Activity Timeline** — Every action (status change, note, AI action) is logged chronologically

### AI-Powered Workflows
- **🧠 Ticket Summarization** — AI generates concise 2-3 sentence summaries of long conversations
- **💬 Suggested Replies** — Context-aware response drafting based on full conversation history
- **📊 Sentiment Analysis** — Auto-detects customer mood (positive/neutral/negative) on each message
- **🏷️ Issue Categorization** — AI classifies tickets (billing, technical, shipping, account, general) with confidence scores
- **🔍 Similar Ticket Discovery** — Finds related tickets to surface past solutions
- **🚨 Escalation Recommendations** — AI analyzes urgency and recommends escalation with reasoning

### Support Operations
- **Internal Notes** — Agents can add private notes invisible to customers
- **Dashboard Statistics** — Real-time aggregated counts by status, priority, sentiment
- **Smart Escalation** — Auto-escalates urgent tickets with negative sentiment

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB instance (local or Atlas)
- Mistral AI API key

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd AICSD

# Install backend dependencies
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and Mistral API key
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
MISTRAL_API_KEY=your_mistral_api_key
NODE_ENV=development
```

### Seed the Database

Populate the database with 100 realistic e-commerce support tickets:

```bash
npm run seed
```

### Run the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

---

## 📡 API Reference

### Base URL
```
http://localhost:8080/api
```

### Health Check
```
GET /api/health → { status: 'ok', message: 'API is running' }
```

### Tickets

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tickets` | List tickets (paginated, filterable) |
| `GET` | `/tickets/stats` | Dashboard statistics |
| `POST` | `/tickets` | Create a new ticket |
| `GET` | `/tickets/:id` | Get ticket detail with messages |
| `PATCH` | `/tickets/:id` | Update ticket (status, priority, etc.) |
| `POST` | `/tickets/:id/notes` | Add internal note |
| `POST` | `/tickets/:id/messages` | Add conversation message |

#### Query Parameters for `GET /tickets`

| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `status` | string | `open` | Filter by status (open, in-progress, resolved, closed) |
| `priority` | string | `high` | Filter by priority (low, medium, high, urgent) |
| `category` | string | `billing` | Filter by category |
| `sentiment` | string | `negative` | Filter by sentiment |
| `escalated` | boolean | `true` | Filter escalated tickets |
| `q` | string | `refund` | Full-text search |
| `sortBy` | string | `createdAt` | Sort field |
| `sortOrder` | string | `desc` | Sort direction (asc/desc) |
| `page` | number | `1` | Page number |
| `limit` | number | `20` | Items per page (max 100) |

### AI Features

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/tickets/:id/ai/summary` | Generate AI summary |
| `POST` | `/tickets/:id/ai/reply` | Generate suggested reply |
| `POST` | `/tickets/:id/ai/categorize` | AI categorization with confidence |
| `POST` | `/tickets/:id/ai/similar` | Find similar tickets |
| `POST` | `/tickets/:id/ai/escalation` | Escalation recommendation |

---

## 📂 Project Structure

```
backend/
├── server.js                    # Entry point, graceful shutdown
├── src/
│   ├── app.js                   # Express app config, middleware stack
│   ├── config/
│   │   ├── ai.js                # Mistral AI client initialization
│   │   ├── db.js                # MongoDB connection
│   │   └── env.js               # Environment validation (Zod)
│   ├── controllers/
│   │   ├── ticketController.js  # Ticket HTTP handlers
│   │   └── aiController.js      # AI feature HTTP handlers
│   ├── dao/
│   │   ├── ticketDao.js         # Ticket database operations
│   │   └── messageDao.js        # Message database operations
│   ├── middlewares/
│   │   ├── errorHandler.js      # Global error handling
│   │   └── validateRequest.js   # Zod schema validation
│   ├── models/
│   │   ├── Ticket.js            # Ticket Mongoose schema
│   │   └── Message.js           # Message Mongoose schema
│   ├── routes/
│   │   ├── index.js             # Route aggregator
│   │   └── ticketRoutes.js      # Ticket + AI route definitions
│   ├── scripts/
│   │   └── seed.js              # Database seeder (100 tickets)
│   ├── services/
│   │   ├── ticketService.js     # Business logic orchestration
│   │   └── aiService.js         # Mistral AI integration
│   ├── utils/
│   │   ├── apiError.js          # Custom error class
│   │   └── asyncHandler.js      # Async route wrapper
│   └── validators/
│       └── ticketValidator.js   # Zod request schemas
```

---

## 📄 Documentation

- [Product Decisions](./PRODUCT_DECISIONS.md) — Feature rationale, tradeoffs, and future roadmap
- [Architecture Notes](./ARCHITECTURE.md) — System design, database schema, AI pipeline, scalability
- [AI Usage Report](./AI_USAGE_REPORT.md) — How AI tools were used in development and the product

---

## 📝 License

ISC
