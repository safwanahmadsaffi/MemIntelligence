// ============================================================
// AgentFlow — Agent Orchestration Engine
// ============================================================
// Orchestrates multi-agent task execution with pricing,
// subcontracting, and transaction recording.

import { AGENTS, TASK_STATUS } from './constants';
import { callAgent, SYSTEM_PROMPTS } from './openrouter';
import { calculateActionCost, generateBid } from './pricing';
import { recordTaskTransactions } from './transactions';
import { addTask, updateTask, initAgents, updateAgentStats } from './store';

// Ensure agents are initialized
initAgents(AGENTS);

/**
 * Execute a full task through the multi-agent pipeline.
 * Returns the completed task with all economic data.
 */
export async function executeTask(taskInput) {
  const taskId = `task_${Date.now()}`;
  const complexity = taskInput.complexity || 2;
  const scenarioId = taskInput.scenarioId || null;

  // Create the task record
  const task = addTask({
    id: taskId,
    title: taskInput.title,
    description: taskInput.description,
    category: taskInput.category || 'general',
    status: TASK_STATUS.ROUTING,
    complexity,
    budget: taskInput.budget || 0.05,
    actualCost: 0,
    platformFee: 0,
    createdAt: new Date().toISOString(),
    completedAt: null,
    subtasks: [],
    bids: [],
    result: null,
    transactions: [],
    economicGraph: null,
  });

  try {
    // === PHASE 1: BIDDING ===
    const bids = AGENTS.map((agent) => generateBid(agent, complexity));
    updateTask(taskId, { bids, status: TASK_STATUS.ROUTING });

    // Small delay to simulate routing
    await delay(300);

    // === PHASE 2: ORCHESTRATOR PLANS ===
    const orchestrator = AGENTS.find((a) => a.role === 'orchestrator');
    const orchestratorPricing = calculateActionCost({
      baseCost: orchestrator.baseCostPerAction,
      confidence: 0.95,
      complexity,
    });

    const planResult = await callAgent({
      model: orchestrator.model,
      systemPrompt: SYSTEM_PROMPTS.orchestrator,
      userPrompt: `Task: ${taskInput.title}\n\nDescription: ${taskInput.description}\n\nProvide an execution plan with subtasks.`,
      agentRole: 'orchestrator',
      scenarioId,
    });

    updateTask(taskId, { status: TASK_STATUS.EXECUTING });
    await delay(200);

    // === PHASE 3: SPECIALIST EXECUTION ===
    const researcher = AGENTS.find((a) => a.role === 'researcher');
    const researcherPricing = calculateActionCost({
      baseCost: researcher.baseCostPerAction,
      confidence: 0.92,
      complexity,
    });

    const researchResult = await callAgent({
      model: researcher.model,
      systemPrompt: SYSTEM_PROMPTS.researcher,
      userPrompt: `Based on this plan:\n${planResult}\n\nResearch the following: ${taskInput.title}\n${taskInput.description}`,
      agentRole: 'researcher',
      scenarioId,
    });

    await delay(200);

    const builder = AGENTS.find((a) => a.role === 'builder');
    const builderPricing = calculateActionCost({
      baseCost: builder.baseCostPerAction,
      confidence: 0.90,
      complexity,
    });

    const buildResult = await callAgent({
      model: builder.model,
      systemPrompt: SYSTEM_PROMPTS.builder,
      userPrompt: `Based on this research:\n${researchResult}\n\nBuild/synthesize the deliverable for: ${taskInput.title}`,
      agentRole: 'builder',
      scenarioId,
    });

    await delay(200);

    // === PHASE 4: REVIEW ===
    updateTask(taskId, { status: TASK_STATUS.REVIEWING });

    const reviewer = AGENTS.find((a) => a.role === 'reviewer');
    const reviewerPricing = calculateActionCost({
      baseCost: reviewer.baseCostPerAction,
      confidence: 0.93,
      complexity,
    });

    const reviewResult = await callAgent({
      model: reviewer.model,
      systemPrompt: SYSTEM_PROMPTS.reviewer,
      userPrompt: `Review this work:\n\nResearch:\n${researchResult}\n\nImplementation:\n${buildResult}\n\nScore it 1-10 and provide feedback.`,
      agentRole: 'reviewer',
      scenarioId,
    });

    await delay(200);

    // === PHASE 5: PRESENT ===
    const presenter = AGENTS.find((a) => a.role === 'presenter');
    const presenterPricing = calculateActionCost({
      baseCost: presenter.baseCostPerAction,
      confidence: 0.94,
      complexity,
    });

    const presentResult = await callAgent({
      model: presenter.model,
      systemPrompt: SYSTEM_PROMPTS.presenter,
      userPrompt: `Compile all outputs into a final professional deliverable:\n\nPlan:\n${planResult}\n\nResearch:\n${researchResult}\n\nImplementation:\n${buildResult}\n\nReview:\n${reviewResult}`,
      agentRole: 'presenter',
      scenarioId,
    });

    // === BUILD SUBTASK RECORDS ===
    const subtasks = [
      {
        index: 0,
        agentId: orchestrator.id,
        agentName: orchestrator.name,
        agentAvatar: orchestrator.avatar,
        agentColor: orchestrator.color,
        description: 'Task planning and routing',
        result: planResult,
        ...orchestratorPricing,
      },
      {
        index: 1,
        agentId: researcher.id,
        agentName: researcher.name,
        agentAvatar: researcher.avatar,
        agentColor: researcher.color,
        description: 'Research and analysis',
        result: researchResult,
        ...researcherPricing,
        // Researcher subcontracts to Builder
        subcontractTo: {
          agentId: builder.id,
          agentName: builder.name,
          amount: Math.round(builderPricing.totalCost * 0.3 * 1000000) / 1000000,
        },
      },
      {
        index: 2,
        agentId: builder.id,
        agentName: builder.name,
        agentAvatar: builder.avatar,
        agentColor: builder.color,
        description: 'Implementation and synthesis',
        result: buildResult,
        ...builderPricing,
      },
      {
        index: 3,
        agentId: reviewer.id,
        agentName: reviewer.name,
        agentAvatar: reviewer.avatar,
        agentColor: reviewer.color,
        description: 'Quality review and scoring',
        result: reviewResult,
        ...reviewerPricing,
      },
      {
        index: 4,
        agentId: presenter.id,
        agentName: presenter.name,
        agentAvatar: presenter.avatar,
        agentColor: presenter.color,
        description: 'Final formatting and presentation',
        result: presentResult,
        ...presenterPricing,
      },
    ];

    // Calculate totals
    const totalAgentCosts = subtasks.reduce((sum, s) => sum + s.totalCost, 0);
    const totalPlatformFee = subtasks.reduce((sum, s) => sum + s.platformFee, 0);
    const totalCost = Math.round((totalAgentCosts + totalPlatformFee) * 1000000) / 1000000;

    // Record all transactions on-chain
    const txns = recordTaskTransactions({
      taskId,
      subtasks,
      platformFee: totalPlatformFee,
      totalCost,
    });

    // Update agent stats
    subtasks.forEach((s) => {
      updateAgentStats(s.agentId, s.agentEarning);
    });

    // Build economic graph
    const economicGraph = {
      nodes: [
        { id: 'user', label: 'User', type: 'user', color: '#60a5fa' },
        { id: 'escrow', label: 'Escrow', type: 'escrow', color: '#f59e0b' },
        ...subtasks.map((s) => ({
          id: s.agentId,
          label: s.agentName,
          type: 'agent',
          color: s.agentColor,
          cost: s.totalCost,
        })),
        { id: 'treasury', label: 'Platform', type: 'platform', color: '#ef4444' },
      ],
      edges: [
        { from: 'user', to: 'escrow', amount: totalCost, label: `$${totalCost.toFixed(4)}` },
        ...subtasks.map((s) => ({
          from: 'escrow',
          to: s.agentId,
          amount: s.agentEarning,
          label: `$${s.agentEarning.toFixed(4)}`,
        })),
        {
          from: 'escrow',
          to: 'treasury',
          amount: totalPlatformFee,
          label: `$${totalPlatformFee.toFixed(4)}`,
        },
      ],
    };

    // Add subcontract edges
    subtasks.forEach((s) => {
      if (s.subcontractTo) {
        economicGraph.edges.push({
          from: s.agentId,
          to: s.subcontractTo.agentId,
          amount: s.subcontractTo.amount,
          label: `$${s.subcontractTo.amount.toFixed(4)}`,
          type: 'subcontract',
        });
      }
    });

    // Finalize the task
    const completedTask = updateTask(taskId, {
      status: TASK_STATUS.COMPLETED,
      subtasks,
      actualCost: totalCost,
      platformFee: totalPlatformFee,
      result: presentResult,
      transactions: txns.map((t) => t.id),
      economicGraph,
      completedAt: new Date().toISOString(),
    });

    return completedTask;
  } catch (err) {
    console.error('Task execution failed:', err);
    updateTask(taskId, { status: TASK_STATUS.FAILED });
    throw err;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
