// ============================================================
// AgentFlow — Pricing Engine
// ============================================================
// Sub-cent micro-pricing for agent actions.
// Every action is priced transparency and capped at $0.01.

import { PLATFORM_FEE_RATE, MAX_ACTION_COST } from './constants';

/**
 * Calculate the cost of a single agent action.
 * @param {object} params
 * @param {number} params.baseCost - Agent's base cost per action
 * @param {number} params.confidence - Agent's confidence (0-1)
 * @param {number} params.complexity - Task complexity (1-5)
 * @param {boolean} params.isSubcontract - Whether this is a subcontract
 * @returns {object} Pricing breakdown
 */
export function calculateActionCost({ baseCost, confidence = 0.9, complexity = 1, isSubcontract = false }) {
  // Confidence multiplier: higher confidence = slightly higher price
  const confidenceMultiplier = 0.8 + confidence * 0.4; // range: 0.8-1.2

  // Complexity multiplier: more complex = more expensive
  const complexityMultiplier = 1 + (complexity - 1) * 0.15; // range: 1.0-1.6

  // Subcontract discount
  const subcontractMultiplier = isSubcontract ? 0.85 : 1.0;

  // Raw cost
  let rawCost = baseCost * confidenceMultiplier * complexityMultiplier * subcontractMultiplier;

  // Cap at max
  rawCost = Math.min(rawCost, MAX_ACTION_COST);

  // Round to 6 decimal places
  rawCost = Math.round(rawCost * 1000000) / 1000000;

  // Platform fee
  const platformFee = Math.round(rawCost * PLATFORM_FEE_RATE * 1000000) / 1000000;
  const agentEarning = Math.round((rawCost - platformFee) * 1000000) / 1000000;

  return {
    totalCost: rawCost,
    platformFee,
    agentEarning,
    confidence,
    complexity,
    confidenceMultiplier: Math.round(confidenceMultiplier * 100) / 100,
    complexityMultiplier: Math.round(complexityMultiplier * 100) / 100,
    isSubcontract,
  };
}

/**
 * Estimate total task cost based on complexity and expected subtask count.
 * @param {number} complexity - 1-5
 * @param {number} subtaskCount - expected number of subtasks
 * @returns {object} Cost estimate
 */
export function estimateTaskCost(complexity = 2, subtaskCount = 4) {
  const avgBaseCost = 0.003;
  const perAction = calculateActionCost({ baseCost: avgBaseCost, confidence: 0.9, complexity });
  const estimatedTotal = Math.round(perAction.totalCost * subtaskCount * 1000000) / 1000000;
  const estimatedFees = Math.round(estimatedTotal * PLATFORM_FEE_RATE * 1000000) / 1000000;

  return {
    estimatedTotal,
    estimatedFees,
    estimatedAgentEarnings: Math.round((estimatedTotal - estimatedFees) * 1000000) / 1000000,
    perActionCost: perAction.totalCost,
    subtaskCount,
    complexity,
  };
}

/**
 * Generate a bid from an agent for a task.
 * @param {object} agent - Agent definition
 * @param {number} complexity - Task complexity 1-5
 * @returns {object} Bid details
 */
export function generateBid(agent, complexity = 2) {
  // Add slight randomness to confidence
  const confidence = Math.min(1, Math.max(0.5, agent.reliability + (Math.random() - 0.5) * 0.15));
  const pricing = calculateActionCost({
    baseCost: agent.baseCostPerAction,
    confidence,
    complexity,
  });

  return {
    agentId: agent.id,
    agentName: agent.name,
    agentAvatar: agent.avatar,
    agentColor: agent.color,
    bidPrice: pricing.totalCost,
    confidence: Math.round(confidence * 100) / 100,
    estimatedTime: Math.floor(2 + Math.random() * 8) + 's',
    reliability: agent.reliability,
    pricing,
  };
}

/**
 * Compare cost on Arc vs Ethereum to show margin advantage.
 * @param {number} totalCost - Total task cost in USDC
 * @param {number} txnCount - Number of transactions
 * @returns {object} Comparison data
 */
export function compareChainCosts(totalCost, txnCount) {
  const arcGasPerTxn = 0.00001; // ~$0.00001 per txn on Arc
  const ethGasPerTxn = 2.0; // ~$2.00 per txn on Ethereum
  const solGasPerTxn = 0.005; // ~$0.005 per txn on Solana

  const arcTotal = totalCost + arcGasPerTxn * txnCount;
  const ethTotal = totalCost + ethGasPerTxn * txnCount;
  const solTotal = totalCost + solGasPerTxn * txnCount;

  return {
    arc: {
      chain: 'Arc',
      taskCost: totalCost,
      gasCost: Math.round(arcGasPerTxn * txnCount * 100000) / 100000,
      totalCost: Math.round(arcTotal * 100000) / 100000,
      overhead: Math.round(((arcGasPerTxn * txnCount) / totalCost) * 10000) / 100 + '%',
      viable: true,
    },
    ethereum: {
      chain: 'Ethereum',
      taskCost: totalCost,
      gasCost: Math.round(ethGasPerTxn * txnCount * 100) / 100,
      totalCost: Math.round(ethTotal * 100) / 100,
      overhead: Math.round(((ethGasPerTxn * txnCount) / totalCost) * 100) + '%',
      viable: false,
    },
    solana: {
      chain: 'Solana',
      taskCost: totalCost,
      gasCost: Math.round(solGasPerTxn * txnCount * 1000) / 1000,
      totalCost: Math.round(solTotal * 1000) / 1000,
      overhead: Math.round(((solGasPerTxn * txnCount) / totalCost) * 100) + '%',
      viable: false,
    },
    savings: {
      vsEthereum: Math.round((ethTotal - arcTotal) * 100) / 100,
      vsSolana: Math.round((solTotal - arcTotal) * 1000) / 1000,
    },
  };
}
