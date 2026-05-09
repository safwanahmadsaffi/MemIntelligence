'use client';
import { useState, useEffect } from 'react';

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch('/api/agents').then(r => r.json()).then(d => { setAgents(d.agents || []); setLoading(false); }); }, []);

  return (
    <div className="fade-in">
      <div className="page-header"><h1>Agent Marketplace</h1><p>Specialist AI agents competing on price, quality, and reliability</p></div>
      <div className="page-body flex-col gap-6">
        {loading ? <div className="stats-grid">{[1,2,3,4,5].map(i => <div key={i} className="shimmer" style={{ height: '200px', borderRadius: 'var(--radius-lg)' }}></div>)}</div> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
            {agents.map((agent) => (
              <div key={agent.id} className="card" style={{ borderLeft: `3px solid ${agent.color}` }}>
                <div className="flex gap-4" style={{ alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: agent.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem', flexShrink: 0 }}>{agent.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: 'var(--space-1)' }}>{agent.name}</h3>
                    <span className="badge badge-blue" style={{ marginBottom: 'var(--space-2)', display: 'inline-flex' }}>{agent.role}</span>
                    <p className="text-sm text-secondary" style={{ marginTop: 'var(--space-2)' }}>{agent.specialty}</p>
                  </div>
                </div>
                <div style={{ marginTop: 'var(--space-4)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}><div className="text-xs text-muted">Cost/Action</div><div className="price" style={{ fontSize: '1rem' }}>${agent.baseCostPerAction?.toFixed(3)}</div></div>
                  <div style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}><div className="text-xs text-muted">Reliability</div><div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: agent.reliability >= 0.93 ? 'var(--color-success)' : 'var(--color-warning)' }}>{Math.round(agent.reliability * 100)}%</div></div>
                  <div style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}><div className="text-xs text-muted">Total Earned</div><div className="price" style={{ fontSize: '1rem' }}>${(agent.totalEarnings || 0).toFixed(4)}</div></div>
                  <div style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}><div className="text-xs text-muted">Tasks Done</div><div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-purple)' }}>{agent.tasksCompleted || 0}</div></div>
                </div>
                <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-2) var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Model: {agent.model}</div>
              </div>
            ))}
          </div>
        )}

        <div className="card">
          <div className="card-title" style={{ marginBottom: 'var(--space-4)' }}>How Agent Routing Works</div>
          <div className="grid-3" style={{ gap: 'var(--space-4)' }}>
            {[
              { step: '01', title: 'Task Submitted', desc: 'User creates a task with budget. All agents receive the task and generate bids based on their confidence and cost.' },
              { step: '02', title: 'Orchestrator Routes', desc: 'The Orchestrator plans execution, breaks task into subtasks, and assigns specialists. Agents can subcontract each other.' },
              { step: '03', title: 'Settle and Verify', desc: 'Each action triggers a sub-cent USDC payment on Arc. All transactions verified on-chain via Arc Block Explorer.' },
            ].map((s, i) => (
              <div key={i} style={{ padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)', marginBottom: 'var(--space-2)' }}>{s.step}</div>
                <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>{s.title}</div>
                <p className="text-xs text-secondary">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
