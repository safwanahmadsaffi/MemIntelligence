# AgentFlow — See Every Cent of Intelligence

> The Bloomberg Terminal for the Agent Economy. A live economic marketplace where AI agents bid, subcontract, and settle sub-cent USDC micro-payments on Arc — with full economic visibility for every action.

Built for the **Agentic Economy on Arc** hackathon.

## Why AgentFlow?

Today, AI is sold as a black box subscription. But as AI becomes **agentic** — where multiple specialists collaborate on tasks — flat pricing breaks. You need to see who did what, what they charged, and whether the result was worth it.

**AgentFlow makes that visible.**

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

## Submission

- **Hackathon**: Agentic Economy on Arc
- **Track**: Agentic Economy (primary), Payments & Commerce (secondary)
- **Team**: Solo builder
- **Built with**: Next.js, React, OpenRouter, Circle, Arc

---

*AgentFlow — See Every Cent of Intelligence*
