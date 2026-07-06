# AI Usage Report

## AI Tools Used

### In the Product (Runtime AI)
- **Mistral AI** (`mistral-medium-latest` model) via the `@mistralai/mistralai` SDK
  - Used for all 6 AI-powered features: summarization, suggested replies, sentiment analysis, categorization, similar ticket discovery, and escalation recommendations

### In Development (AI-Assisted Coding)
- **Gemini (Antigravity IDE)** — Primary AI coding assistant used for architecture review, code optimization, bug detection, and documentation generation
- **ChatGPT** — Used for brainstorming product decisions and rubber-ducking architecture choices

---

## How AI Tools Were Used

### Runtime AI Integration

Mistral AI was integrated as a centralized `AiService` class in the backend that wraps the Mistral chat completion API. All 6 features use a shared `_callMistral()` helper for consistent configuration (model selection, temperature, max tokens).

**Design Decision: Structured Output Prompts**
Rather than using free-form prompts, every AI feature uses a structured output format. For example, the categorization prompt instructs the AI to respond in exactly this format:
```
CATEGORY: billing
CONFIDENCE: 0.85
```

This makes parsing reliable and eliminates fragile regex matching on free-form text.

### AI-Assisted Development

- **Architecture Design** — Used Gemini to review the layered architecture (Routes → Controllers → Services → DAOs) and identify missing patterns (asyncHandler, activity logging, graceful shutdown)
- **Bug Detection** — Gemini identified a critical operator precedence bug in the error handler and deprecated Mongoose options that would have caused production issues
- **Seed Data Generation** — Used AI to generate 55 unique, realistic e-commerce support ticket scenarios with authentic customer-agent conversations
- **Documentation** — Architecture diagrams, API documentation, and this report were co-authored with AI assistance

---

## Example Prompts That Were Effective

### 1. Ticket Summarization
```text
You are a customer support analyst. Summarize the following support ticket 
conversation in 2-3 concise sentences. Focus on the core issue, what has been 
done so far, and the current status.

Conversation:
CUSTOMER: I was charged twice for order #ORD-2847...
AGENT: I can confirm there was a duplicate charge...
```
**Why it works:** Clear role assignment ("support analyst"), explicit length constraint ("2-3 sentences"), and structured focus areas ("core issue, what has been done, current status") prevent the AI from generating verbose, unfocused summaries.

### 2. Sentiment Analysis
```text
Analyze the sentiment of the following customer support messages. Classify 
the overall sentiment as exactly one of: positive, neutral, negative.

Respond with ONLY one word.
```
**Why it works:** The "ONLY one word" instruction combined with a closed set of options makes the output deterministic and trivially parseable. The code also includes fallback logic to extract sentiment from longer responses in case the AI doesn't comply perfectly.

### 3. Issue Categorization
```text
You are a support ticket classifier. Classify the following support ticket 
into exactly ONE of these categories: billing, technical, account, shipping, 
general, other.

Also provide a confidence score from 0.0 to 1.0 indicating how certain you are.

Respond in EXACTLY this format (nothing else):
CATEGORY: <category>
CONFIDENCE: <score>
```
**Why it works:** Explicit formatting instructions with placeholder examples produce consistently structured output. Adding "nothing else" prevents the AI from adding explanatory text that would break parsing.

### 4. Escalation Recommendation
```text
Consider escalation if:
- Customer is frustrated or angry
- Issue has been unresolved for many messages
- Issue involves financial loss, security, or data concerns
- Priority is high/urgent with negative sentiment

Respond in EXACTLY this format:
ESCALATE: YES or NO
URGENCY: low, medium, or high
REASON: <one sentence explanation>
```
**Why it works:** Providing explicit escalation criteria gives the AI a decision framework rather than relying on its own judgment. The structured output with reasoning enables transparency — agents see WHY the AI recommends escalation.

---

## Where AI Helped Significantly

### 1. Cognitive Load Reduction
The summarization feature eliminates the need for agents to read 20+ message threads. In testing, a ticket with 5 messages produces a summary in ~1 second that captures the essential context.

### 2. Consistent Tone in Replies
AI-suggested replies maintain a professional, empathetic tone consistently — something that's hard for human agents under pressure. The suggestions serve as a starting point that agents can personalize.

### 3. Proactive Sentiment Monitoring
Auto-analyzing sentiment on every customer message means frustrated customers are surfaced before an agent explicitly checks. Combined with negative-sentiment filtering, this enables proactive intervention.

### 4. Development Velocity
AI-assisted coding (Gemini) caught 6 bugs during the review phase that would have required debugging later, and generated the comprehensive seed data that would have taken hours to write manually.

---

## Where AI Produced Poor Results

### 1. Vague Customer Messages
When a customer sends a short, context-free message like "it's broken" or "help", the AI's suggested replies are generic ("I'm sorry to hear that. Could you provide more details?"). While safe, this lacks the personal touch a human agent could provide by checking order history or account context.

### 2. Similar Ticket Matching
Finding similar tickets by comparing only titles and categories has limited accuracy. Without embeddings or vector search, the AI relies on surface-level text comparison, which can miss semantically similar but differently worded tickets.

### 3. Confidence Calibration
The AI's self-reported confidence scores (0-1) are not well-calibrated. An AI might report 0.9 confidence for a categorization that's actually wrong. This is why the product design treats confidence scores as advisory rather than authoritative.

### 4. Edge Cases in Sentiment
Sarcasm, mixed-sentiment messages ("Your product is great but the shipping was terrible"), and non-English text cause unreliable sentiment classifications. The current fallback to "neutral" is safe but not informative.

---

## Decisions That Remained Human-Driven

| Decision Area | Why It Stays Human |
|---|---|
| **Final Ticket Resolution** | AI summarizes and suggests, but closing a ticket is an explicit human action with accountability |
| **Escalation Execution** | Auto-escalation only triggers with strict guards (high urgency + negative sentiment). All other escalations require human judgment |
| **Response Editing** | AI drafts are always editable. Agents are expected to review, personalize, and approve before sending |
| **Priority Assessment** | While AI can recommend priority, agents can always override based on business context the AI doesn't have |
| **Data Model Design** | Schema design and database architecture required human engineering judgment about tradeoffs, indexing strategy, and scalability |
| **Security Decisions** | Rate limiting thresholds, CORS policy, and error exposure were all human decisions based on security best practices |
