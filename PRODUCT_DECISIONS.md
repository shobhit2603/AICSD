# Product Decisions Document

## Overview

This document outlines the product decisions, design rationale, and tradeoffs made while building the AI-Powered Customer Support Dashboard for ReeRoute. Every decision was made with the goal of maximizing agent productivity while maintaining trust in AI-assisted workflows.

---

## Features Implemented

### 1. Ticket Management (Core)
- **Full CRUD** with create, list, detail view, and update capabilities
- **Multi-dimensional Filtering** — Agents can filter by status, priority, category, sentiment, and escalation state simultaneously
- **Full-Text Search** — MongoDB text indexes on ticket title, customer name, and tags for instant search
- **Configurable Sorting** — Sort by any field (created date, priority, status) in ascending or descending order
- **Pagination** — Server-side pagination (default 20, max 100 per page) to handle large ticket volumes efficiently

### 2. Conversation History
- **Threaded Messages** — Each ticket has a chronological message thread with customer, agent, and AI-labeled messages
- **Internal Notes** — Private notes visible only to agents, supporting team collaboration without customer visibility

### 3. Activity Timeline
- Every mutation is logged: status changes, priority updates, notes, messages, and AI actions
- Provides a complete audit trail for accountability and onboarding new agents mid-ticket

### 4. AI-Powered Workflows

| Feature | How It Works | Agent Experience |
|---------|-------------|-----------------|
| **Ticket Summarization** | Condenses full conversation into 2-3 sentences | Agent clicks "Summarize" to get instant context without reading entire thread |
| **Suggested Replies** | Drafts empathetic, contextual response | Agent reviews, edits, and sends — AI as co-pilot, not autopilot |
| **Sentiment Analysis** | Auto-analyzes last 3 customer messages | Sentiment badge updates automatically, enabling at-a-glance triage |
| **Issue Categorization** | Classifies into billing/technical/shipping/account/general with confidence score | Agents see category + confidence %, can override if AI is uncertain |
| **Similar Ticket Discovery** | AI matches current ticket against recent history | Surfaces past solutions, reducing duplicate investigation work |
| **Escalation Recommendations** | Evaluates urgency from sentiment, priority, and content | AI explains reasoning; auto-escalates only for high-urgency + negative sentiment |

### 5. Dashboard Statistics
- Aggregated counts by status, priority, and sentiment
- Escalation count for management visibility
- Enables agents and managers to identify bottlenecks at a glance

---

## How Agents Discover Important Tickets

This was a key product question from the assignment. My approach uses a **multi-signal prioritization** strategy:

1. **Escalated tickets surface first** — Escalated tickets are flagged with a boolean that can be filtered on. Auto-escalation ensures the most critical tickets don't stay buried.
2. **Sentiment-based filtering** — Agents can filter for `sentiment=negative` to immediately see frustrated customers.
3. **Priority + Status combination** — Default sort is `createdAt: desc`, but agents can sort by priority to surface urgent tickets.
4. **AI confidence signals** — Low AI confidence scores indicate tickets that need human judgment, prompting agents to review them first.

---

## How AI Confidence Is Communicated

AI confidence is **not hidden from agents** — this was a deliberate trust decision:

- **Categorization** returns a 0-1 confidence score displayed alongside the category
- Scores **above 0.8** are presented as high-confidence (green)
- Scores **between 0.5-0.8** are shown as moderate (yellow), signaling the agent should verify
- Scores **below 0.5** trigger a "Low Confidence" warning, encouraging manual review
- **Escalation** returns structured reasoning (not just yes/no), so agents understand _why_ the AI recommends escalation

This transparency prevents agents from blindly trusting AI and maintains human oversight.

---

## What Happens When AI Is Uncertain

When AI confidence is low or the model returns unexpected output:

1. **Graceful degradation** — The system never crashes on AI failure. Sentiment defaults to "neutral", category defaults to "general", and escalation defaults to "not needed"
2. **Fallback messaging** — When AI can't generate a useful reply, the system returns a safe default rather than nothing
3. **Logging** — All AI errors are logged with context for debugging, without exposing raw errors to the agent

---

## How Previous Tickets Influence AI Suggestions

The **Similar Ticket Discovery** feature directly addresses this:

- When an agent requests similar tickets, the system pulls the 50 most recent tickets
- AI compares titles, categories, and context to find up to 3 similar tickets
- Each similar ticket includes a one-line explanation of _why_ it's similar
- This allows agents to reference past resolutions, reducing resolution time for recurring issues

---

## Escalation Workflow

Escalation follows a **human-in-the-loop with AI safety net** model:

1. **Manual Escalation** — Agents can always escalate manually via the ticket update endpoint
2. **AI Recommendation** — The `/ai/escalation` endpoint provides a structured recommendation with:
   - `shouldEscalate` (boolean)
   - `urgency` (low/medium/high)
   - `reason` (human-readable explanation)
3. **Auto-Escalation Guard Rail** — Only triggers when BOTH conditions are met:
   - AI recommends escalation
   - Urgency is rated "high"
   - This prevents false-positive escalations from overwhelming senior staff
4. **Audit Trail** — Every escalation check (manual or AI) is logged in the activity timeline

---

## Features Intentionally Excluded

| Feature | Reasoning |
|---------|-----------|
| **Authentication & User Management** | Per assignment instructions — assumes logged-in agent context |
| **Real-Time WebSockets** | REST API provides cleaner architecture for this scope. WebSockets would be a Day 2 feature with Redis pub/sub |
| **Email/SMS Notifications** | Out of scope — would require third-party integrations (SendGrid, Twilio) |
| **SLA Tracking** | Important for production but adds complexity beyond the assignment scope |
| **Bulk Operations** | Batch ticket updates would be useful but aren't core to the AI integration story |
| **Customer-Facing Portal** | Focused purely on the agent-side experience |

---

## Product Tradeoffs Made

### 1. AI Latency vs. User Experience
- **Explicit AI actions** (summarize, categorize, suggest reply) are triggered by the agent, making 1-3 second latency acceptable since the agent opted into waiting
- **Background AI actions** (sentiment analysis) run asynchronously and don't block the HTTP response, prioritizing perceived speed

### 2. MongoDB over PostgreSQL
- Support tickets have variable shapes (different tags, notes, metadata per category)
- MongoDB's flexible schema enables rapid iteration without migrations
- Trade-off: Lose SQL joins and strict relational integrity, but the document model naturally fits ticket-conversation hierarchies

### 3. Separate Messages Collection
- Messages stored separately from tickets prevents the 16MB MongoDB document limit from being hit
- Trade-off: Requires a second query to load conversation history, but this only happens on the detail view, not the listing page

### 4. AI as Co-Pilot, Not Autopilot
- AI generates suggestions, but **never takes autonomous action** on behalf of the agent (except background sentiment and auto-escalation with strict guards)
- Agents always have the final say on responses, status changes, and resolutions
- This builds trust and avoids liability from fully automated customer interactions

---

## Future Improvements to Prioritize

### Short Term (Week 1-2)
1. **Caching Layer (Redis)** — Cache ticket lists, AI summaries, and stats to reduce API latency and Mistral API costs
2. **Real-Time Updates (WebSockets)** — Agents see new messages instantly without page refresh
3. **Ticket Assignment Workflows** — Round-robin or skill-based auto-assignment

### Medium Term (Month 1)
4. **Knowledge Base Integration** — AI references internal documentation when generating replies
5. **Custom AI Prompts** — Let agents configure AI behavior per category (e.g., more formal for billing, more casual for general)
6. **Batch AI Operations** — "Summarize all open tickets" for shift handoffs
7. **SLA Timer** — Track response time commitments with visual warnings

### Long Term (Quarter 1)
8. **Multi-Language Support** — AI-powered translation for international customer support
9. **Analytics Dashboard** — Ticket volume trends, resolution times, agent performance, AI accuracy tracking
10. **Custom Workflow Builder** — No-code automation rules (e.g., "If sentiment is negative AND priority is high, auto-assign to senior agent")
