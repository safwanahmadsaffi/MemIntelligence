'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'research', complexity: 2 });

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    setTasks(data.tasks || []);
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleCreateAndExecute = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setExecuting(true);
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, description: form.description, category: form.category, complexity: parseInt(form.complexity) }),
      });
      const data = await res.json();
      if (data.task) { setForm({ title: '', description: '', category: 'research', complexity: 2 }); setCreating(false); fetchTasks(); }
    } catch (err) { console.error('Execution failed:', err); }
    setExecuting(false);
  };

  const quickTasks = [
    { title: 'Research quantum computing trends for 2025', description: 'Analyze latest developments and market projections.', category: 'research', complexity: 2 },
    { title: 'Build a rate limiter middleware in Node.js', description: 'Sliding window algorithm with Redis backing.', category: 'engineering', complexity: 3 },
    { title: 'Competitive analysis of AI coding assistants', description: 'Compare top 5 on features, pricing, and DX.', category: 'analysis', complexity: 2 },
  ];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="flex-between">
          <div><h1>Task Console</h1><p>Create tasks and watch agents compete with real-time pricing</p></div>
          <button className="btn btn-primary" onClick={() => setCreating(!creating)}>{creating ? 'Cancel' : '+ New Task'}</button>
        </div>
      </div>

      <div className="page-body flex-col gap-6">
        {creating && (
          <div className="card slide-up" style={{ borderColor: 'var(--border-accent)' }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Create New Task</h3>
            <form onSubmit={handleCreateAndExecute} className="flex-col gap-4">
              <div>
                <label className="text-sm text-secondary" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Task Title</label>
                <input className="input" placeholder="e.g., Research quantum computing trends for 2025" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm text-secondary" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Description</label>
                <textarea className="input" placeholder="Describe what you need..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <div className="grid-2">
                <div>
                  <label className="text-sm text-secondary" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Category</label>
                  <select className="input select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="research">Research</option>
                    <option value="engineering">Engineering</option>
                    <option value="analysis">Analysis</option>
                    <option value="content">Content</option>
                    <option value="security">Security</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-secondary" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Complexity (1-5)</label>
                  <select className="input select" value={form.complexity} onChange={(e) => setForm({ ...form, complexity: e.target.value })}>
                    <option value={1}>1 — Simple</option>
                    <option value={2}>2 — Standard</option>
                    <option value={3}>3 — Complex</option>
                    <option value={4}>4 — Advanced</option>
                    <option value={5}>5 — Expert</option>
                  </select>
                </div>
              </div>
              <div style={{ padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex-between" style={{ marginBottom: 'var(--space-2)' }}>
                  <span className="text-sm text-secondary">Estimated Cost</span>
                  <span className="price price-lg">~$0.{String(28 + parseInt(form.complexity) * 3).padStart(3, '0')}</span>
                </div>
                <div className="flex-between">
                  <span className="text-xs text-muted">5 agents x ~$0.005/action</span>
                  <span className="text-xs text-muted">15% platform fee included</span>
                </div>
              </div>
              <button className="btn btn-success btn-lg" type="submit" disabled={executing || !form.title.trim()}>
                {executing ? 'Executing with 5 agents...' : 'Execute Task — Sub-Cent Cost'}
              </button>
            </form>
          </div>
        )}

        {!creating && (
          <div className="card">
            <div className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Quick Tasks — Try These</div>
            <div className="flex-col gap-2">
              {quickTasks.map((qt, i) => (
                <button key={i} onClick={() => { setForm(qt); setCreating(true); }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', cursor: 'pointer', width: '100%', textAlign: 'left', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', transition: 'all 0.15s ease' }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--border-accent)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{qt.title}</div>
                    <div className="text-xs text-muted" style={{ marginTop: '2px' }}>{qt.category} / complexity {qt.complexity}</div>
                  </div>
                  <span className="price price-sm">~$0.03</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <div className="card-title">All Tasks</div>
            <span className="text-xs text-muted">{tasks.length} tasks</span>
          </div>
          {loading ? <div className="shimmer" style={{ height: '200px', borderRadius: 'var(--radius-md)' }}></div>
          : tasks.length === 0 ? <div className="text-sm text-muted" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>No tasks yet.</div>
          : (
            <div className="flex-col gap-2">
              {tasks.map((task) => (
                <Link key={task.id} href={`/dashboard/tasks/${task.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'all 0.15s ease' }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}>
                    <div>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>{task.title}</div>
                      <div className="flex gap-3" style={{ alignItems: 'center' }}>
                        <span className={`badge ${task.status === 'completed' ? 'badge-green' : task.status === 'executing' ? 'badge-blue' : 'badge-yellow'}`}>{task.status}</span>
                        <span className="text-xs text-muted">{task.category}</span>
                        <span className="text-xs text-muted">{task.subtasks?.length || 0} agents / {task.transactions?.length || 0} txns</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="price">${(task.actualCost || 0).toFixed(4)}</div>
                      <div className="text-xs text-muted">USDC</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
