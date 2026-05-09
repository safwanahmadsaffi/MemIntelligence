// ============================================================
// AgentFlow — Circle/Arc Integration (Demo Mode)
// ============================================================
// In demo mode, all Circle operations are simulated.
// The app works 100% without Circle API keys.

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

/**
 * Simulated wallet creation.
 */
export async function createWallet(label = 'agent-wallet') {
  return {
    id: `wallet_${generateUUID()}`,
    label,
    address: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    blockchain: 'ARC',
    state: 'LIVE',
    balance: '0.00',
    currency: 'USDC',
  };
}

/**
 * Simulated USDC transfer.
 */
export async function transferUSDC({ fromWalletId, toAddress, amount, description }) {
  return {
    id: `transfer_${generateUUID()}`,
    source: fromWalletId,
    destination: toAddress,
    amount: { amount: String(amount), currency: 'USDC' },
    transactionHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    status: 'COMPLETE',
    blockchain: 'ARC',
    description,
    createDate: new Date().toISOString(),
  };
}

/**
 * Simulated balance check.
 */
export async function getWalletBalance(walletId) {
  return {
    walletId,
    balances: [{ amount: '100.00', currency: 'USDC' }],
  };
}

/**
 * Simulated transaction verification.
 */
export async function verifyTransaction(transactionHash) {
  return {
    hash: transactionHash,
    status: 'CONFIRMED',
    block: Math.floor(Math.random() * 1000000) + 5000000,
    confirmations: 12,
    chain: 'ARC',
  };
}
