// ============================================================
// AgentFlow — Payments API (Demo Mode)
// ============================================================

import { NextResponse } from 'next/server';
import { createWallet, transferUSDC, getWalletBalance, verifyTransaction } from '@/lib/circle';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'create-wallet': {
        const wallet = await createWallet(body.label || 'agent-wallet');
        return NextResponse.json({ success: true, wallet });
      }
      case 'transfer': {
        const transfer = await transferUSDC({
          fromWalletId: body.fromWalletId,
          toAddress: body.toAddress,
          amount: body.amount,
          description: body.description,
        });
        return NextResponse.json({ success: true, transfer });
      }
      case 'balance': {
        const balance = await getWalletBalance(body.walletId);
        return NextResponse.json({ success: true, balance });
      }
      case 'verify': {
        const result = await verifyTransaction(body.transactionHash);
        return NextResponse.json({ success: true, verification: result });
      }
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
