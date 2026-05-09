// ============================================================
// AgentFlow — Demo Seed API
// ============================================================

import { NextResponse } from 'next/server';
import { seedDemoData } from '@/lib/demo';
import { resetStore, initAgents } from '@/lib/store';
import { AGENTS } from '@/lib/constants';

export async function POST() {
  try {
    // Reset and re-seed
    resetStore();
    initAgents(AGENTS);
    const result = seedDemoData();
    return NextResponse.json({
      success: true,
      message: `Seeded ${result.tasksSeeded} tasks with ${result.transactionsSeeded} transactions`,
      ...result,
    });
  } catch (err) {
    console.error('Seed error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
