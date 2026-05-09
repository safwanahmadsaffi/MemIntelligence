// ============================================================
// AgentFlow — Execute Task API
// ============================================================

import { NextResponse } from 'next/server';
import { executeTask } from '@/lib/agents';
import { initAgents } from '@/lib/store';
import { AGENTS } from '@/lib/constants';

initAgents(AGENTS);

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, category, complexity, scenarioId } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const completedTask = await executeTask({
      title,
      description: description || '',
      category: category || 'general',
      complexity: complexity || 2,
      scenarioId: scenarioId || null,
    });

    return NextResponse.json({ task: completedTask });
  } catch (err) {
    console.error('Execute failed:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
