// ============================================================
// AgentFlow — Transactions API
// ============================================================

import { NextResponse } from 'next/server';
import { getAllTransactions } from '@/lib/store';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');

  let txns = getAllTransactions();
  if (taskId) {
    txns = txns.filter((t) => t.taskId === taskId);
  }

  return NextResponse.json({ transactions: txns, count: txns.length });
}
