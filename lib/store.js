// ============================================================
// AgentFlow — In-Memory Data Store
// ============================================================
// Uses globalThis to persist across Next.js hot reloads.
// This is the standard pattern for in-memory stores in Next.js.

function getGlobalStore() {
  if (!globalThis.__agentflow_store) {
    globalThis.__agentflow_store = {
      tasks: [],
      transactions: [],
      agents: [],
      analytics: {
        totalTasks: 0,
        totalTransactions: 0,
        totalVolume: 0,
        totalPlatformFees: 0,
        avgTaskCost: 0,
      },
      seeded: false,
    };
  }
  return globalThis.__agentflow_store;
}

export function getStore() {
  return getGlobalStore();
}

export function addTask(task) {
  const store = getGlobalStore();
  store.tasks.push(task);
  store.analytics.totalTasks = store.tasks.length;
  recalcAnalytics();
  return task;
}

export function updateTask(taskId, updates) {
  const store = getGlobalStore();
  const idx = store.tasks.findIndex((t) => t.id === taskId);
  if (idx !== -1) {
    store.tasks[idx] = { ...store.tasks[idx], ...updates };
    recalcAnalytics();
    return store.tasks[idx];
  }
  return null;
}

export function getTask(taskId) {
  const store = getGlobalStore();
  return store.tasks.find((t) => t.id === taskId) || null;
}

export function getAllTasks() {
  const store = getGlobalStore();
  return [...store.tasks].reverse();
}

export function addTransaction(txn) {
  const store = getGlobalStore();
  store.transactions.push(txn);
  store.analytics.totalTransactions = store.transactions.length;
  recalcAnalytics();
  return txn;
}

export function getTransactions(filter = {}) {
  const store = getGlobalStore();
  let txns = [...store.transactions];
  if (filter.taskId) txns = txns.filter((t) => t.taskId === filter.taskId);
  if (filter.type) txns = txns.filter((t) => t.type === filter.type);
  if (filter.agentId) txns = txns.filter((t) => t.to === filter.agentId || t.from === filter.agentId);
  return txns.reverse();
}

export function getAllTransactions() {
  const store = getGlobalStore();
  return [...store.transactions].reverse();
}

export function updateAgentStats(agentId, earnings, completed = true) {
  const store = getGlobalStore();
  const agent = store.agents.find((a) => a.id === agentId);
  if (agent) {
    agent.totalEarnings += earnings;
    if (completed) agent.tasksCompleted += 1;
  }
}

export function getAgents() {
  const store = getGlobalStore();
  return [...store.agents];
}

export function initAgents(agentDefs) {
  const store = getGlobalStore();
  if (store.agents.length === 0) {
    store.agents = agentDefs.map((a) => ({ ...a }));
  }
}

export function isSeeded() {
  const store = getGlobalStore();
  return store.seeded;
}

export function markSeeded() {
  const store = getGlobalStore();
  store.seeded = true;
}

function recalcAnalytics() {
  const store = getGlobalStore();
  const completedTasks = store.tasks.filter((t) => t.status === 'completed');
  const totalVolume = store.transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const platformFees = store.transactions
    .filter((t) => t.type === 'platform_fee')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  store.analytics = {
    totalTasks: store.tasks.length,
    completedTasks: completedTasks.length,
    totalTransactions: store.transactions.length,
    totalVolume: Math.round(totalVolume * 100000) / 100000,
    totalPlatformFees: Math.round(platformFees * 100000) / 100000,
    avgTaskCost:
      completedTasks.length > 0
        ? Math.round((completedTasks.reduce((s, t) => s + (t.actualCost || 0), 0) / completedTasks.length) * 100000) / 100000
        : 0,
  };
}

export function getAnalytics() {
  recalcAnalytics();
  const store = getGlobalStore();
  return { ...store.analytics, agents: getAgents() };
}

export function resetStore() {
  const store = getGlobalStore();
  store.tasks = [];
  store.transactions = [];
  store.agents = [];
  store.seeded = false;
  store.analytics = {
    totalTasks: 0,
    totalTransactions: 0,
    totalVolume: 0,
    totalPlatformFees: 0,
    avgTaskCost: 0,
  };
}
