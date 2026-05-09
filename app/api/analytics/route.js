// ============================================================
// AgentFlow — Analytics API
// ============================================================

import { NextResponse } from 'next/server';
import { getAnalytics, initAgents } from '@/lib/store';
import { AGENTS } from '@/lib/constants';
import { compareChainCosts } from '@/lib/pricing';

initAgents(AGENTS);

export async function GET() {
  const analytics = getAnalytics();

  // Add chain cost comparison
  const chainComparison = compareChainCosts(
    analytics.totalVolume || 0.15,
    analytics.totalTransactions || 50
  );

  return NextResponse.json({
    ...analytics,
    chainComparison,
  });
}
