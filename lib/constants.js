// ============================================================
// AgentFlow — Constants & Configuration
// ============================================================

export const APP_NAME = 'AgentFlow';
export const APP_TAGLINE = 'See Every Cent of Intelligence';
export const PLATFORM_FEE_RATE = 0.15; // 15%
export const MAX_ACTION_COST = 0.01; // $0.01 cap
export const CURRENCY = 'USDC';
export const CHAIN = 'Arc';

// Agent Definitions
export const AGENTS = [
  {
    id: 'agent_orchestrator',
    name: 'Orchestrator',
    role: 'orchestrator',
    avatar: 'O',
    specialty: 'Task planning, decomposition, and routing',
    model: 'meta-llama/llama-3.1-8b-instruct:free',
    baseCostPerAction: 0.002,
    reliability: 0.95,
    totalEarnings: 0,
    tasksCompleted: 0,
    color: '#3b82f6',
  },
  {
    id: 'agent_researcher',
    name: 'Researcher',
    role: 'researcher',
    avatar: 'R',
    specialty: 'Deep analysis, fact-finding, and research synthesis',
    model: 'mistralai/mistral-7b-instruct:free',
    baseCostPerAction: 0.003,
    reliability: 0.92,
    totalEarnings: 0,
    tasksCompleted: 0,
    color: '#8b5cf6',
  },
  {
    id: 'agent_builder',
    name: 'Builder',
    role: 'builder',
    avatar: 'B',
    specialty: 'Code generation, technical implementation, and solutions',
    model: 'meta-llama/llama-3.1-8b-instruct:free',
    baseCostPerAction: 0.004,
    reliability: 0.90,
    totalEarnings: 0,
    tasksCompleted: 0,
    color: '#10b981',
  },
  {
    id: 'agent_reviewer',
    name: 'Reviewer',
    role: 'reviewer',
    avatar: 'V',
    specialty: 'Quality assurance, critique, and scoring',
    model: 'google/gemma-2-9b-it:free',
    baseCostPerAction: 0.002,
    reliability: 0.93,
    totalEarnings: 0,
    tasksCompleted: 0,
    color: '#f59e0b',
  },
  {
    id: 'agent_presenter',
    name: 'Presenter',
    role: 'presenter',
    avatar: 'P',
    specialty: 'Final formatting, polish, and professional presentation',
    model: 'mistralai/mistral-7b-instruct:free',
    baseCostPerAction: 0.002,
    reliability: 0.94,
    totalEarnings: 0,
    tasksCompleted: 0,
    color: '#ec4899',
  },
];

// Task statuses
export const TASK_STATUS = {
  PENDING: 'pending',
  ROUTING: 'routing',
  EXECUTING: 'executing',
  REVIEWING: 'reviewing',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

// Transaction types
export const TXN_TYPE = {
  ESCROW: 'escrow_deposit',
  AGENT_PAYMENT: 'agent_payment',
  SUBCONTRACT: 'subcontract',
  PLATFORM_FEE: 'platform_fee',
  REFUND: 'refund',
};

export const TXN_STATUS = {
  PENDING: 'pending',
  SETTLED: 'settled',
  CONFIRMED: 'confirmed',
};

// Demo scenarios for deterministic mode
export const DEMO_SCENARIOS = [
  {
    id: 'demo_research',
    title: 'Research quantum computing trends for 2025',
    description: 'Analyze the latest quantum computing developments, key players, and market projections for 2025.',
    category: 'research',
  },
  {
    id: 'demo_code',
    title: 'Build a rate limiter middleware in Node.js',
    description: 'Create a production-ready rate limiter with sliding window algorithm and Redis backing.',
    category: 'engineering',
  },
  {
    id: 'demo_analysis',
    title: 'Competitive analysis of AI coding assistants',
    description: 'Compare top 5 AI coding assistants on features, pricing, accuracy, and developer experience.',
    category: 'analysis',
  },
  {
    id: 'demo_content',
    title: 'Write a technical blog post on WebAssembly',
    description: 'Create a 1500-word technical blog post explaining WebAssembly use cases for web developers.',
    category: 'content',
  },
  {
    id: 'demo_review',
    title: 'Security audit of authentication flow',
    description: 'Review an OAuth2 + JWT authentication implementation for common security vulnerabilities.',
    category: 'security',
  },
];
