// ============================================================
// AgentFlow — Transaction Manager
// ============================================================

import { addTransaction, getTransactions, getAllTransactions } from './store';
import { TXN_TYPE, TXN_STATUS, CURRENCY, CHAIN } from './constants';

let txnCounter = 0;

function generateTxHash() {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * 16)];
  }
  return hash;
}

function generateTxId() {
  txnCounter++;
  return `txn_${Date.now()}_${txnCounter}`;
}

/**
 * Record a new transaction.
 */
export function recordTransaction({
  taskId,
  from,
  fromLabel,
  to,
  toLabel,
  amount,
  type,
  description,
  subtaskIndex = null,
}) {
  const txn = {
    id: generateTxId(),
    taskId,
    from,
    fromLabel: fromLabel || from,
    to,
    toLabel: toLabel || to,
    amount: Math.round(amount * 1000000) / 1000000,
    currency: CURRENCY,
    chain: CHAIN,
    type: type || TXN_TYPE.AGENT_PAYMENT,
    status: TXN_STATUS.CONFIRMED,
    arcTxHash: generateTxHash(),
    arcExplorerUrl: `https://explorer.arc.money/tx/`,
    timestamp: new Date().toISOString(),
    description: description || '',
    subtaskIndex,
  };

  // Set the explorer URL with the hash
  txn.arcExplorerUrl += txn.arcTxHash;

  return addTransaction(txn);
}

/**
 * Record all transactions for a completed task execution.
 * Generates the full economic chain: escrow → agent payments → subcontracts → platform fee
 */
export function recordTaskTransactions({ taskId, subtasks, platformFee, totalCost }) {
  const transactions = [];

  // 1. Escrow deposit
  transactions.push(
    recordTransaction({
      taskId,
      from: 'user_wallet',
      fromLabel: 'User Wallet',
      to: 'platform_escrow',
      toLabel: 'Platform Escrow',
      amount: totalCost,
      type: TXN_TYPE.ESCROW,
      description: 'Task escrow deposit',
    })
  );

  // 2. Agent payments for each subtask
  subtasks.forEach((subtask, index) => {
    // Primary agent payment
    transactions.push(
      recordTransaction({
        taskId,
        from: 'platform_escrow',
        fromLabel: 'Platform Escrow',
        to: subtask.agentId,
        toLabel: subtask.agentName,
        amount: subtask.agentEarning,
        type: TXN_TYPE.AGENT_PAYMENT,
        description: `${subtask.agentName}: ${subtask.description}`,
        subtaskIndex: index,
      })
    );

    // Subcontract payment if applicable
    if (subtask.subcontractTo) {
      transactions.push(
        recordTransaction({
          taskId,
          from: subtask.agentId,
          fromLabel: subtask.agentName,
          to: subtask.subcontractTo.agentId,
          toLabel: subtask.subcontractTo.agentName,
          amount: subtask.subcontractTo.amount,
          type: TXN_TYPE.SUBCONTRACT,
          description: `Subcontract: ${subtask.agentName} → ${subtask.subcontractTo.agentName}`,
          subtaskIndex: index,
        })
      );
    }
  });

  // 3. Platform fee
  transactions.push(
    recordTransaction({
      taskId,
      from: 'platform_escrow',
      fromLabel: 'Platform Escrow',
      to: 'platform_treasury',
      toLabel: 'AgentFlow Treasury',
      amount: platformFee,
      type: TXN_TYPE.PLATFORM_FEE,
      description: 'Platform fee (15%)',
    })
  );

  return transactions;
}

export { getTransactions, getAllTransactions };
