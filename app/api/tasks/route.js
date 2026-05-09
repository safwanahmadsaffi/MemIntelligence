// ============================================================
// AgentFlow — Tasks API
// ============================================================

import { NextResponse } from 'next/server';
import { getAllTasks, getTask, addTask, initAgents } from '@/lib/store';
import { AGENTS, TASK_STATUS } from '@/lib/constants';
import { estimateTaskCost } from '@/lib/pricing';

// Initialize agents on first request
initAgents(AGENTS);

export async function GET() {
  const tasks = getAllTasks();
  return NextResponse.json({ tasks, count: tasks.length });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, category, complexity } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const estimate = estimateTaskCost(complexity || 2, 5);

    const task = addTask({
      id: `task_${Date.now()}`,
      title,
      description: description || '',
      category: category || 'general',
      status: TASK_STATUS.PENDING,
      complexity: complexity || 2,
      budget: estimate.estimatedTotal * 1.5,
      estimatedCost: estimate.estimatedTotal,
      actualCost: 0,
      platformFee: 0,
      createdAt: new Date().toISOString(),
      completedAt: null,
      subtasks: [],
      bids: [],
      result: null,
      transactions: [],
      economicGraph: null,
      estimate,
    });

    return NextResponse.json({ task, estimate });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
