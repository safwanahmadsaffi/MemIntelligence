// ============================================================
// AgentFlow — OpenRouter Client
// ============================================================
// Abstracted LLM client using OpenRouter free models.
// Supports deterministic demo mode with cached responses.

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1/chat/completions';

const DEMO_RESPONSES = {
  orchestrator: {
    demo_research: `## Execution Plan

I'll break this research task into 3 focused subtasks:

1. **Research Phase** → Researcher agent will gather latest quantum computing developments, key players (IBM, Google, IonQ, Rigetti), and breakthrough papers from 2024-2025.

2. **Analysis Phase** → Builder agent will synthesize findings into structured market analysis with projections, competitive landscape, and technology readiness levels.

3. **Review & Present** → Reviewer will score quality, then Presenter will format the final deliverable.

**Estimated total cost: $0.028 USDC**
**Estimated completion: 15 seconds**`,
    demo_code: `## Execution Plan

Breaking this engineering task into 3 subtasks:

1. **Architecture Phase** → Researcher agent will analyze rate limiter patterns (token bucket, sliding window, fixed window) and recommend the optimal approach.

2. **Build Phase** → Builder agent will implement the sliding window rate limiter with Redis backing, including middleware wrapper and configuration options.

3. **Review & Present** → Reviewer will audit the code for edge cases and performance, then Presenter will format with documentation.

**Estimated total cost: $0.032 USDC**
**Estimated completion: 18 seconds**`,
    demo_analysis: `## Execution Plan

Breaking this analysis task into 3 subtasks:

1. **Research Phase** → Researcher agent will gather data on top 5 AI coding assistants: GitHub Copilot, Cursor, Cody, Tabnine, and Amazon CodeWhisperer.

2. **Comparison Phase** → Builder agent will create structured comparison matrix across features, pricing, accuracy benchmarks, and developer experience ratings.

3. **Review & Present** → Reviewer scores analytical rigor, Presenter formats into executive-ready deliverable.

**Estimated total cost: $0.030 USDC**
**Estimated completion: 16 seconds**`,
    demo_content: `## Execution Plan

Breaking this content task into 3 subtasks:

1. **Research Phase** → Researcher will gather WebAssembly use cases, performance benchmarks, and real-world adoption examples.

2. **Writing Phase** → Builder will draft the 1500-word blog post with technical depth, code examples, and practical guidance.

3. **Review & Polish** → Reviewer scores technical accuracy and readability, Presenter finalizes formatting and adds finishing touches.

**Estimated total cost: $0.029 USDC**
**Estimated completion: 20 seconds**`,
    demo_review: `## Execution Plan

Breaking this security audit into 3 subtasks:

1. **Analysis Phase** → Researcher will catalog common OAuth2/JWT vulnerabilities: token leakage, CSRF, replay attacks, key rotation issues.

2. **Audit Phase** → Builder will systematically review the auth flow against OWASP guidelines and produce findings report.

3. **Review & Present** → Reviewer validates findings severity, Presenter formats into professional security audit report.

**Estimated total cost: $0.034 USDC**
**Estimated completion: 17 seconds**`,
  },
  researcher: {
    default: `## Research Findings

### Key Developments
- **IBM Quantum Condor**: 1,121-qubit processor achieved quantum advantage in specific optimization problems
- **Google Willow**: Error-corrected logical qubits demonstrated below threshold for the first time
- **IonQ Forte Enterprise**: Trapped-ion systems reaching 35 algorithmic qubits with 99.7% fidelity

### Market Projections
- Global quantum computing market: $8.6B in 2025 (up 32% YoY)
- Enterprise adoption: 40% of Fortune 500 running quantum experiments
- Key sectors: financial modeling, drug discovery, logistics optimization, cybersecurity

### Critical Insights
- Hybrid classical-quantum approaches dominating practical applications
- Post-quantum cryptography standards finalized by NIST driving enterprise urgency
- Cloud quantum access (IBM Quantum Network, Amazon Braket) lowering entry barriers

**Confidence: 92%**`,
  },
  builder: {
    default: `## Implementation

\`\`\`javascript
// Sliding Window Rate Limiter with Redis
class RateLimiter {
  constructor(redis, options = {}) {
    this.redis = redis;
    this.windowMs = options.windowMs || 60000;
    this.maxRequests = options.maxRequests || 100;
    this.keyPrefix = options.keyPrefix || 'rl:';
  }

  async isAllowed(identifier) {
    const key = this.keyPrefix + identifier;
    const now = Date.now();
    const windowStart = now - this.windowMs;

    const pipeline = this.redis.pipeline();
    pipeline.zremrangebyscore(key, 0, windowStart);
    pipeline.zadd(key, now, now.toString());
    pipeline.zcard(key);
    pipeline.expire(key, Math.ceil(this.windowMs / 1000));

    const results = await pipeline.exec();
    const requestCount = results[2][1];

    return {
      allowed: requestCount <= this.maxRequests,
      remaining: Math.max(0, this.maxRequests - requestCount),
      resetAt: new Date(now + this.windowMs),
    };
  }

  middleware() {
    return async (req, res, next) => {
      const identifier = req.ip || req.headers['x-forwarded-for'];
      const result = await this.isAllowed(identifier);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      if (!result.allowed) {
        return res.status(429).json({ error: 'Rate limit exceeded' });
      }
      next();
    };
  }
}
\`\`\`

Production-ready implementation with O(log n) complexity per request.

**Confidence: 94%**`,
  },
  reviewer: {
    default: `## Quality Review

### Score: 8.5/10

**Strengths:**
- Comprehensive coverage of key points
- Well-structured with clear sections
- Accurate data and citations
- Actionable insights provided

**Minor Issues:**
- Could include more specific numerical benchmarks
- Missing discussion of potential risks/limitations
- Would benefit from visual diagrams

**Recommendation:** Approved with minor enhancements. Quality meets production standards.

**Confidence: 91%**`,
  },
  presenter: {
    default: `## Final Deliverable

---

# Executive Summary

This deliverable has been reviewed and scored **8.5/10** by our quality assurance agent. All key requirements have been addressed with high confidence.

## Key Findings

The analysis reveals significant developments in the target domain with clear actionable insights for stakeholders. Our multi-agent pipeline processed this task through 4 specialist stages, each contributing domain-specific expertise.

## Detailed Results

The full analysis, implementation, and review are compiled above. Each section has been validated for accuracy and completeness.

## Methodology

- **Orchestrator** planned the execution across 3 specialist stages
- **Researcher** gathered and synthesized primary data with 92% confidence
- **Builder** created structured deliverable with 94% confidence
- **Reviewer** scored quality at 8.5/10 with 91% confidence
- **Presenter** formatted the final output

---

*Processed by AgentFlow • 5 agent actions • Total cost: $0.031 USDC • Settled on Arc*`,
  },
};

/**
 * Call OpenRouter with a given model and prompt.
 * Falls back to demo cache if DEMO_MODE is enabled or API fails.
 */
export async function callAgent({ model, systemPrompt, userPrompt, agentRole, scenarioId }) {
  const isDemoMode = process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  // In demo mode, use cached responses
  if (isDemoMode) {
    return getDemoResponse(agentRole, scenarioId);
  }

  // Live mode: call OpenRouter
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.warn('No OPENROUTER_API_KEY set, falling back to demo mode');
      return getDemoResponse(agentRole, scenarioId);
    }

    const response = await fetch(OPENROUTER_BASE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'AgentFlow',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.warn(`OpenRouter returned ${response.status}, falling back to demo`);
      return getDemoResponse(agentRole, scenarioId);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || getDemoResponse(agentRole, scenarioId);
  } catch (err) {
    console.warn('OpenRouter call failed, falling back to demo:', err.message);
    return getDemoResponse(agentRole, scenarioId);
  }
}

function getDemoResponse(agentRole, scenarioId) {
  const roleResponses = DEMO_RESPONSES[agentRole];
  if (!roleResponses) return 'Task processed successfully.';

  if (scenarioId && roleResponses[scenarioId]) {
    return roleResponses[scenarioId];
  }

  return roleResponses.default || roleResponses[Object.keys(roleResponses)[0]] || 'Task processed successfully.';
}

// System prompts for each agent role
export const SYSTEM_PROMPTS = {
  orchestrator: `You are the Orchestrator agent in AgentFlow, a multi-agent task execution platform. Your role is to:
1. Analyze the incoming task
2. Break it into 2-4 focused subtasks
3. Assign each subtask to the appropriate specialist agent (Researcher, Builder, Reviewer, Presenter)
4. Estimate costs for each subtask
5. Provide a clear execution plan

Be concise, structured, and actionable. Format your response with clear headers and bullet points. Always include estimated cost and completion time.`,

  researcher: `You are the Researcher agent in AgentFlow. Your role is to:
1. Gather and synthesize information on the given topic
2. Provide accurate, well-sourced analysis
3. Structure findings with clear sections
4. Include data points, numbers, and specific examples
5. Rate your confidence level

Be thorough but concise. Focus on actionable insights. Always end with your confidence percentage.`,

  builder: `You are the Builder agent in AgentFlow. Your role is to:
1. Create technical implementations, solutions, or structured deliverables
2. Write clean, production-ready code when applicable
3. Follow best practices and include error handling
4. Document key decisions
5. Rate your confidence level

Be practical and implementation-focused. Always end with your confidence percentage.`,

  reviewer: `You are the Reviewer agent in AgentFlow. Your role is to:
1. Score the work on a scale of 1-10
2. Identify strengths and weaknesses
3. Flag any accuracy issues or gaps
4. Provide specific improvement suggestions
5. Give a final recommendation (Approved/Needs Revision)

Be constructive and specific. Always include a numerical score and confidence percentage.`,

  presenter: `You are the Presenter agent in AgentFlow. Your role is to:
1. Take all previous agent outputs and compile into a polished final deliverable
2. Add executive summary
3. Ensure consistent formatting and professional tone
4. Include methodology section showing which agents contributed
5. Add cost summary footer

Create a deliverable that looks professional and complete. Include the processing metadata at the end.`,
};
