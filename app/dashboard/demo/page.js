'use client';
import { useState } from 'react';

export default function DemoPage() {
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [execResult, setExecResult] = useState(null);

  const handleSeed = async () => { setSeeding(true); setSeedResult(null); try { const res = await fetch('/api/seed', { method: 'POST' }); setSeedResult(await res.json()); } catch (err) { setSeedResult({ error: err.message }); } setSeeding(false); };

  const handleQuickExecute = async (s) => { setExecuting(true); setExecResult(null); try { const res = await fetch('/api/execute', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: s.title, description: s.description, category: s.category, complexity: 2 }) }); const data = await res.json(); setExecResult({ cost: data.task?.actualCost, txns: data.task?.transactions?.length }); } catch (err) { setExecResult({ error: err.message }); } setExecuting(false); };

  const scenarios = [
    { title: 'Research quantum computing trends for 2025', description: 'Analyze latest developments and market projections.', category: 'research' },
    { title: 'Build a rate limiter middleware in Node.js', description: 'Sliding window algorithm with Redis backing.', category: 'engineering' },
    { title: 'Competitive analysis of AI coding assistants', description: 'Compare top 5 on features, pricing, and DX.', category: 'analysis' },
  ];

  return (
    <div className="fade-in">
      <div className="page-header"><h1>Demo Control Panel</h1><p>Seed data, trigger scenarios, and prepare for demo</p></div>
      <div className="page-body flex-col gap-6">
        <div className="card" style={{ borderColor: 'var(--border-accent)' }}>
          <div className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Demo Data Seeding</div>
          <p className="text-sm text-secondary" style={{ marginBottom: 'var(--space-4)' }}>Reset and generate 5 completed tasks with 50+ on-chain transactions.</p>
          <div className="flex gap-4" style={{ alignItems: 'center' }}>
            <button onClick={handleSeed} disabled={seeding} className="btn btn-primary btn-lg">{seeding ? 'Seeding...' : 'Seed Demo Data (50+ Transactions)'}</button>
            {seedResult && !seedResult.error && <div className="badge badge-green" style={{ padding: 'var(--space-2) var(--space-3)' }}>Seeded {seedResult.tasksSeeded} tasks, {seedResult.transactionsSeeded} transactions</div>}
          </div>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Quick Execute — Live Scenarios</div>
          <p className="text-sm text-secondary" style={{ marginBottom: 'var(--space-4)' }}>Execute a task through the full 5-agent pipeline. Each generates 8-12 new transactions.</p>
          <div className="flex-col gap-3">
            {scenarios.map((s, i) => (
              <div key={i} className="flex-between" style={{ padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div><div style={{ fontWeight: 500 }}>{s.title}</div><div className="text-xs text-muted">{s.description}</div></div>
                <button onClick={() => handleQuickExecute(s)} disabled={executing} className="btn btn-success btn-sm">{executing ? '...' : 'Execute'}</button>
              </div>
            ))}
          </div>
          {execResult && !execResult.error && <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--color-success-bg)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--color-success)' }}>Task executed: ${execResult.cost?.toFixed(4)} USDC / {execResult.txns} transactions</div>}
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Presentation Checklist</div>
          <div className="flex-col gap-2">
            {['Seed demo data (50+ transactions)', 'Show Dashboard with live heartbeat', 'Create and execute a live task', 'Show task detail with economic graph', 'Show transaction explorer (50+ txns)', 'Show margin analysis (Arc vs ETH)', 'Show Agent marketplace', 'Show Circle Developer Console', 'Show Arc Block Explorer tx'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-3)' }}>
                <input type="checkbox" style={{ accentColor: 'var(--color-success)' }} />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ borderColor: 'var(--color-warning)', background: 'var(--color-warning-bg)' }}>
          <div style={{ fontWeight: 600, color: 'var(--color-warning)', marginBottom: 'var(--space-2)' }}>Demo Mode Active</div>
          <p className="text-sm text-secondary">Agents use cached responses for deterministic behavior. Transactions are still generated. Set OPENROUTER_API_KEY and DEMO_MODE=false for live inference.</p>
        </div>
      </div>
    </div>
  );
}
