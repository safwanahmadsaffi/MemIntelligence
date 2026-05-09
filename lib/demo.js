// ============================================================
// AgentFlow — Demo Seed Utilities
// ============================================================
// Generates realistic demo data including completed tasks,
// transaction histories, and agent stats for 50+ transactions.

import { AGENTS, DEMO_SCENARIOS, TXN_TYPE, TXN_STATUS, CURRENCY, CHAIN, TASK_STATUS } from './constants';
import { addTask, addTransaction, initAgents, updateAgentStats, isSeeded, markSeeded } from './store';
import { calculateActionCost } from './pricing';

function generateHex(len) {
  const chars = '0123456789abcdef';
  let r = '';
  for (let i = 0; i < len; i++) r += chars[Math.floor(Math.random() * 16)];
  return r;
}

function pastTime(minutesAgo) {
  return new Date(Date.now() - minutesAgo * 60000).toISOString();
}

/**
 * Seed the store with pre-built demo data.
 * Returns early if already seeded.
 */
export function seedDemoData() {
  // Always re-init agents
  initAgents(AGENTS);

  // Check if already seeded
  if (isSeeded()) {
    return { tasksSeeded: 0, transactionsSeeded: 0, alreadySeeded: true };
  }

  const scenarios = DEMO_SCENARIOS.slice(0, 5);
  let totalTxnCount = 0;
  let seedTxnCounter = 0;

  function createSeedTxn(taskId, from, fromLabel, to, toLabel, amount, type, description, minutesAgo) {
    seedTxnCounter++;
    const txn = {
      id: `txn_seed_${seedTxnCounter}`,
      taskId,
      from, fromLabel,
      to, toLabel,
      amount: Math.round(amount * 1000000) / 1000000,
      currency: CURRENCY,
      chain: CHAIN,
      type,
      status: TXN_STATUS.CONFIRMED,
      arcTxHash: `0x${generateHex(64)}`,
      arcExplorerUrl: '',
      timestamp: pastTime(minutesAgo),
      description,
    };
    txn.arcExplorerUrl = `https://explorer.arc.money/tx/${txn.arcTxHash}`;
    return addTransaction(txn);
  }

  scenarios.forEach((scenario, scenarioIdx) => {
    const taskId = `task_seed_${scenarioIdx + 1}`;
    const complexity = 2 + (scenarioIdx % 3);
    const timeOffset = (scenarios.length - scenarioIdx) * 12;

    const agentPricings = AGENTS.map((agent) => {
      const pricing = calculateActionCost({
        baseCost: agent.baseCostPerAction,
        confidence: 0.85 + Math.random() * 0.1,
        complexity,
      });
      return { agent, pricing };
    });

    const subtasks = agentPricings.map((ap, idx) => ({
      index: idx,
      agentId: ap.agent.id,
      agentName: ap.agent.name,
      agentAvatar: ap.agent.avatar,
      agentColor: ap.agent.color,
      description: getSubtaskDescription(ap.agent.role),
      totalCost: ap.pricing.totalCost,
      platformFee: ap.pricing.platformFee,
      agentEarning: ap.pricing.agentEarning,
      confidence: ap.pricing.confidence,
      confidenceMultiplier: ap.pricing.confidenceMultiplier,
      complexityMultiplier: ap.pricing.complexityMultiplier,
      result: `[Completed] ${ap.agent.name} processed subtask successfully.`,
      subcontractTo: idx === 1 ? {
        agentId: AGENTS[2].id,
        agentName: AGENTS[2].name,
        amount: Math.round(ap.pricing.totalCost * 0.3 * 1000000) / 1000000,
      } : null,
    }));

    const totalCost = Math.round(subtasks.reduce((s, st) => s + st.totalCost, 0) * 1000000) / 1000000;
    const totalPlatformFee = Math.round(subtasks.reduce((s, st) => s + st.platformFee, 0) * 1000000) / 1000000;

    const economicGraph = {
      nodes: [
        { id: 'user', label: 'User', type: 'user', color: '#60a5fa' },
        { id: 'escrow', label: 'Escrow', type: 'escrow', color: '#f59e0b' },
        ...subtasks.map((s) => ({ id: s.agentId, label: s.agentName, type: 'agent', color: s.agentColor, cost: s.totalCost })),
        { id: 'treasury', label: 'Platform', type: 'platform', color: '#ef4444' },
      ],
      edges: [
        { from: 'user', to: 'escrow', amount: totalCost, label: `$${totalCost.toFixed(4)}` },
        ...subtasks.map((s) => ({ from: 'escrow', to: s.agentId, amount: s.agentEarning, label: `$${s.agentEarning.toFixed(4)}` })),
        { from: 'escrow', to: 'treasury', amount: totalPlatformFee, label: `$${totalPlatformFee.toFixed(4)}` },
      ],
    };

    subtasks.forEach((s) => {
      if (s.subcontractTo) {
        economicGraph.edges.push({
          from: s.agentId, to: s.subcontractTo.agentId, amount: s.subcontractTo.amount,
          label: `$${s.subcontractTo.amount.toFixed(4)}`, type: 'subcontract',
        });
      }
    });

    const taskTxnIds = [];

    const escrowTxn = createSeedTxn(taskId, 'user_wallet', 'User Wallet', 'platform_escrow', 'Platform Escrow', totalCost, TXN_TYPE.ESCROW, 'Task escrow deposit', timeOffset);
    taskTxnIds.push(escrowTxn.id);

    subtasks.forEach((st, idx) => {
      const agentTxn = createSeedTxn(taskId, 'platform_escrow', 'Platform Escrow', st.agentId, st.agentName, st.agentEarning, TXN_TYPE.AGENT_PAYMENT, `${st.agentName}: ${st.description}`, timeOffset - idx - 1);
      taskTxnIds.push(agentTxn.id);

      if (st.subcontractTo) {
        const subTxn = createSeedTxn(taskId, st.agentId, st.agentName, st.subcontractTo.agentId, st.subcontractTo.agentName, st.subcontractTo.amount, TXN_TYPE.SUBCONTRACT, `Subcontract: ${st.agentName} to ${st.subcontractTo.agentName}`, timeOffset - idx - 0.5);
        taskTxnIds.push(subTxn.id);
      }

      updateAgentStats(st.agentId, st.agentEarning, true);
    });

    const feeTxn = createSeedTxn(taskId, 'platform_escrow', 'Platform Escrow', 'platform_treasury', 'AgentFlow Treasury', totalPlatformFee, TXN_TYPE.PLATFORM_FEE, 'Platform fee (15%)', timeOffset - 6);
    taskTxnIds.push(feeTxn.id);

    totalTxnCount += taskTxnIds.length;

    addTask({
      id: taskId,
      title: scenario.title,
      description: scenario.description,
      category: scenario.category,
      status: TASK_STATUS.COMPLETED,
      complexity,
      budget: 0.05,
      actualCost: totalCost,
      platformFee: totalPlatformFee,
      createdAt: pastTime(timeOffset),
      completedAt: pastTime(timeOffset - 7),
      subtasks,
      bids: AGENTS.map((a) => ({
        agentId: a.id, agentName: a.name, agentAvatar: a.avatar, agentColor: a.color,
        bidPrice: calculateActionCost({ baseCost: a.baseCostPerAction, confidence: a.reliability, complexity }).totalCost,
        confidence: a.reliability,
        estimatedTime: `${Math.floor(3 + Math.random() * 10)}s`,
      })),
      result: `Task "${scenario.title}" completed successfully by 5 specialist agents.`,
      transactions: taskTxnIds,
      economicGraph,
    });
  });

  markSeeded();
  return { tasksSeeded: scenarios.length, transactionsSeeded: totalTxnCount };
}

function getSubtaskDescription(role) {
  const descs = {
    orchestrator: 'Task planning and routing',
    researcher: 'Research and analysis',
    builder: 'Implementation and synthesis',
    reviewer: 'Quality review and scoring',
    presenter: 'Final formatting and presentation',
  };
  return descs[role] || 'Processing';
}
