// ============================================================
// AgentFlow — Agents API
// ============================================================

import { NextResponse } from 'next/server';
import { getAgents, initAgents } from '@/lib/store';
import { AGENTS } from '@/lib/constants';

initAgents(AGENTS);

export async function GET() {
  const agents = getAgents();
  return NextResponse.json({ agents });
}
