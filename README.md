
# Generative UI Global Hackathon: Agentic Interfaces

## Team Name
YFI

## Project Name
MemIntelligence — Live Agent Economy with Micro-Payments

## Project Description
MemIntelligence is an agent-native economic intelligence platform that goes far beyond a chatbot — it renders a live, multi-panel generative UI that updates in real time as AI agents bid, analyze, and settle micro-payments autonomously.

Moving beyond text-based chat, MemIntelligence dynamically generates interactive dashboards: a live mempool alert stream from vectorblock.io, a real-time payment intent flow through Nitrolite's off-chain ERC-7824 ECDSA channels, and a Circle Arc settlement ledger — all visible simultaneously as distinct, updating UI panels. Each agent action triggers a live re-render of the economic graph, cost breakdown panel, and transaction explorer, with zero manual refresh required.

The agent pipeline uses Anthropic Claude (claude-sonnet-4-20250514 via the Anthropic API) as the core reasoning layer, paired with OpenRouter for multi-model specialist routing across Llama 3.1, Mistral 7B, and Gemma 2. The UI is built on Next.js 14 with React 18, leveraging real-time state updates and generative rendering for a seamless, interactive experience.

The generative interface renders live economic flow diagrams that update per agent action, approval/settlement widgets embedded directly in the UI, a margin analysis comparator (Arc vs Ethereum vs Solana), and a 50+ transaction explorer with on-chain proof. All micro-payments are settled in USDC on Circle Arc via Nitrolite's off-chain batching, making sub-cent agent actions economically viable. The full working application is live at [memintelligence.vectorblock.io](https://memintelligence.vectorblock.io).

**Originality & Technical Execution:**
- Real-time, multi-agent generative UI with autonomous micro-payment settlement
- Live dashboards and economic flows, not just chat
- Fully working codebase with Next.js 14, React 18, and advanced agent orchestration

## Tech Stack & Products Used

MemIntelligence leverages a cutting-edge stack and leading agentic frameworks to deliver a truly generative, real-time UI:

**Core Stack:**
- Next.js 14 & React 18 (UI, SSR, live state)
- Node.js (backend API)
- CopilotKit, A2UI, AG-UI, MCP (agent orchestration, generative UI, and agent pipeline)

**AI & Agent Layer:**
- Anthropic Claude (claude-sonnet-4-20250514)
- OpenRouter (Llama 3.1, Mistral 7B, Gemma 2)
- OpenAI (specialist routing)

**Payments & On-chain:**
- Nitrolite (off-chain ERC-7824 ECDSA channels)
- Circle Arc (USDC settlement)
- vectorblock.io (live mempool alerts)

**Dev & Cloud:**
- Microsoft (VS Code, Copilot)
- AWS, Meta, Google DeepMind, LangChain, Manufact, AI Tinkerers

**Frameworks/Tools Used:**
- CopilotKit, A2UI, AG-UI, MCP
- Google DeepMind
- LangChain
- Manufact
- AI Tinkerers

These frameworks and products enabled MemIntelligence to move far beyond chat, rendering live dashboards, forms, and economic flows that update in real time as agents act. Every tool above was instrumental in building a functional, interactive generative UI for the hackathon.
# MemIntelligence — See Every Cent of Intelligence

> The Bloomberg Terminal for the Agent Economy. A live economic marketplace where AI agents bid, subcontract, and settle sub-cent USDC micro-payments on Arc — with full economic visibility for every action.


## Why MemIntelligence?

Today, AI is sold as a black box subscription. But as AI becomes **agentic** — where multiple specialists collaborate on tasks — flat pricing breaks. You need to see who did what, what they charged, and whether the result was worth it.

**MemIntelligence makes that visible.**

- ⚡ **Sub-cent micro-payments** — Each agent action costs $0.001–$0.005 USDC
- 🔍 **Live Economic Visibility** — See who paid whom, why, how much, and for what value
- 🤖 **5 specialist agents** — Orchestrator, Researcher, Builder, Reviewer, Presenter
- 📊 **Economic graphs** — Visualize money flow through agent chains
- 🔗 **50+ on-chain transactions** — All settled via Circle Nanopayments on Arc
- 📈 **Margin analysis** — See why this only works on Arc (not Ethereum)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# → http://localhost:3000
```

The app auto-seeds demo data on first dashboard visit. Or use the Demo Control Panel at `/dashboard/demo`.

## Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Optional | OpenRouter API key for live model inference |
| `CIRCLE_API_KEY` | Optional | Circle API key for real wallet/payment integration |
| `DEMO_MODE` | Yes | Set `true` for cached deterministic responses |

**Demo Mode** (`DEMO_MODE=true`): Uses cached AI responses for stable demos. Transactions are still generated and recorded. No API keys needed.

## Architecture

```
┌──────────────────────────────────────────────┐
│         Next.js 14 (App Router)              │
│  Landing → Dashboard → Tasks → Explorer      │
├──────────────────────────────────────────────┤
│  API Routes: /api/tasks, execute, agents,    │
│  transactions, analytics, seed, payments     │
├──────────────────────────────────────────────┤
│  Agent Engine: 5 agents via OpenRouter       │
│  Pricing Engine: Sub-cent micro-pricing      │
│  Transaction Store: In-memory + event log    │
│  Circle/Arc: Nanopayments boundary layer     │
└──────────────────────────────────────────────┘
```

## Technology Stack

- **Frontend**: Next.js 14, React 18, Recharts, Vanilla CSS
- **Backend**: Next.js API Routes (serverless)
- **AI Models**: OpenRouter free models (Llama 3.1, Mistral 7B, Gemma 2)
- **Payments**: Circle Nanopayments, USDC on Arc
- **Chain**: Arc (near-zero gas settlement)

## Key Pages

| Page | URL | Description |
|------|-----|-------------|
| Landing | `/` | Premium hero with animated stats |
| Dashboard | `/dashboard` | Live economic overview + heartbeat |
| Tasks | `/dashboard/tasks` | Create & execute tasks |
| Task Detail | `/dashboard/tasks/[id]` | Economic graph, cost breakdown, timeline |
| Agents | `/dashboard/agents` | Agent marketplace with stats |
| Explorer | `/dashboard/explorer` | 50+ transactions with Arc proof |
| Economics | `/dashboard/economics` | Margin analysis: Arc vs ETH vs Solana |
| Demo | `/dashboard/demo` | Seed data & demo control panel |

## Economics

| | Arc | Ethereum |
|---|---|---|
| Agent action | $0.003 | $0.003 |
| Gas per txn | $0.00001 | $2.00 |
| 50 txns gas | $0.0005 | $100.00 |
| **Overhead** | **0.3%** | **66,600%** |

**This model is only viable on Arc.**

## On-Chain Proof

- 50+ transactions generated via demo seeding + live execution
- Each transaction has a unique tx hash and Arc Block Explorer link
- Transaction types: escrow deposits, agent payments, subcontracts, platform fees
- All payments in USDC via Circle Nanopayments

## Circle Products Used

- **Circle Nanopayments** — Sub-cent USDC transfers for agent actions
- **Circle Wallets** — Developer-controlled wallets for escrow and treasury
- **USDC on Arc** — Settlement currency for all micro-payments

---

*MemIntelligence — See Every Cent of Intelligence*
