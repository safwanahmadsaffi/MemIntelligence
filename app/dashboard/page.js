'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animateCounter, setAnimateCounter] = useState(false);
  const prevCountRef = useRef(0);

  const fetchData = useCallback(async () => {
    try {
      const [analyticsRes, tasksRes, txnsRes] = await Promise.all([
        fetch('/api/analytics'), fetch('/api/tasks'), fetch('/api/transactions'),
      ]);
      const [analytics, tasksData, txnsData] = await Promise.all([
        analyticsRes.json(), tasksRes.json(), txnsRes.json(),
      ]);
      setData(analytics);
      setTasks(tasksData.tasks || []);
      const newTxns = txnsData.transactions || [];
      if (newTxns.length !== prevCountRef.current) {
        setAnimateCounter(true);
        setTimeout(() => setAnimateCounter(false), 600);
      }
      prevCountRef.current = newTxns.length;
      setTxns(newTxns);
      setLoading(false);
    } catch (err) { setLoading(false); }
  }, []);

  useEffect(() => {
    const init = async () => {
      const res = await fetch('/api/tasks');
      const d = await res.json();
      if (!d.tasks || d.tasks.length === 0) await fetch('/api/seed', { method: 'POST' });
      fetchData();
    };
    init();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) return (
    <div>
      <div className="page-header"><h1>Dashboard</h1><p>Loading...</p></div>
      <div className="page-body">
        <div className="stats-grid">{[1,2,3,4].map(i => <div key={i} className="stat-card shimmer" style={{ height: '100px' }}></div>)}</div>
      </div>
    </div>
  );

  const recentTxns = txns.slice(0, 10);
  const recentTasks = tasks.slice(0, 5);
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const avgCost = completedTasks.length > 0 ? completedTasks.reduce((s, t) => s + (t.actualCost || 0), 0) / completedTasks.length : 0;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="flex-between">
          <div>
            <div className="flex gap-3" style={{ alignItems: 'center', marginBottom: 'var(--space-1)' }}>
              <h1>Economic Dashboard</h1>
              <span className="badge badge-green" style={{ padding: 'var(--space-1) var(--space-3)' }}>
                <span className="pulse-dot" style={{ width: '6px', height: '6px', marginRight: 'var(--space-2)' }}></span>
                LIVE
              </span>
            </div>
            <p>Real-time visibility into agent micro-payments on Arc</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/demo" className="btn btn-secondary">Seed Data</Link>
            <Link href="/dashboard/tasks" className="btn btn-primary">+ New Task</Link>
          </div>
        </div>
      </div>

      <div className="page-body flex-col gap-6">
        {/* KPI Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          <div className="stat-card" style={{ borderLeft: '3px solid var(--color-success)' }}>
            <div className="stat-label">Total Transactions</div>
            <div className={`stat-value text-success ${animateCounter ? 'counter-animate' : ''}`}>{data?.totalTransactions || 0}</div>
            <div className="stat-change">On-chain on Arc</div>
          </div>
          <div className="stat-card" style={{ borderLeft: '3px solid var(--accent-blue)' }}>
            <div className="stat-label">USDC Volume</div>
            <div className="stat-value" style={{ color: 'var(--accent-blue)' }}>${(data?.totalVolume || 0).toFixed(4)}</div>
            <div className="stat-change">Micro-payments</div>
          </div>
          <div className="stat-card" style={{ borderLeft: '3px solid var(--color-purple)' }}>
            <div className="stat-label">Tasks Completed</div>
            <div className="stat-value" style={{ color: 'var(--color-purple)' }}>{data?.completedTasks || 0}</div>
            <div className="stat-change">Multi-agent executions</div>
          </div>
          <div className="stat-card" style={{ borderLeft: '3px solid var(--color-warning)' }}>
            <div className="stat-label">Platform Revenue</div>
            <div className="stat-value" style={{ color: 'var(--color-warning)' }}>${(data?.totalPlatformFees || 0).toFixed(4)}</div>
            <div className="stat-change">15% fee collected</div>
          </div>
          <div className="stat-card" style={{ borderLeft: '3px solid var(--color-cyan)' }}>
            <div className="stat-label">Avg Task Cost</div>
            <div className="stat-value" style={{ color: 'var(--color-cyan)' }}>${avgCost.toFixed(4)}</div>
            <div className="stat-change">Per execution</div>
          </div>
        </div>

        {/* Heartbeat + Chain Comparison */}
        <div className="grid-2">
          <div className="heartbeat-panel" style={{ borderColor: 'var(--color-success)' }}>
            <div className="card-header">
              <div className="card-title">Transaction Heartbeat</div>
              <div className="flex gap-2" style={{ alignItems: 'center' }}>
                <span className="pulse-dot"></span>
                <span className="badge badge-green">LIVE</span>
              </div>
            </div>
            <div className={`heartbeat-counter ${animateCounter ? 'counter-animate' : ''}`}>{data?.totalTransactions || 0}</div>
            <div className="heartbeat-label">On-Chain Settlements</div>
            <div className="heartbeat-bar" style={{ marginTop: 'var(--space-4)' }}></div>
            <div style={{ marginTop: 'var(--space-4)', maxHeight: '140px', overflowY: 'auto' }}>
              {recentTxns.slice(0, 4).map((txn, i) => (
                <div key={txn.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-1) 0', fontSize: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span className="text-muted">{txn.fromLabel} &rarr; {txn.toLabel}</span>
                  <span className="price mono" style={{ fontSize: '0.75rem' }}>${txn.amount.toFixed(4)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
              <div className="card-title">Why Arc Wins</div>
              <Link href="/dashboard/economics" className="btn btn-sm btn-secondary">Full Analysis</Link>
            </div>
            {data?.chainComparison && (
              <>
                <div className="grid-2" style={{ flex: 1, gap: 'var(--space-3)' }}>
                  <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '2px solid var(--color-success)', background: 'var(--color-success-bg)', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-success)', marginBottom: 'var(--space-2)' }}>ARC</div>
                    <div className="mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-success)' }}>${data.chainComparison.arc.totalCost.toFixed(4)}</div>
                    <div className="text-xs text-muted" style={{ marginTop: 'var(--space-1)' }}>Gas: ${data.chainComparison.arc.gasCost.toFixed(5)}</div>
                    <div className="badge badge-green" style={{ marginTop: 'var(--space-2)', alignSelf: 'center' }}>{data.chainComparison.arc.overhead} overhead</div>
                  </div>
                  <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-tertiary)', textAlign: 'center', opacity: 0.7, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-danger)', marginBottom: 'var(--space-2)' }}>ETHEREUM</div>
                    <div className="mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-danger)' }}>${data.chainComparison.ethereum.totalCost.toFixed(2)}</div>
                    <div className="text-xs text-muted" style={{ marginTop: 'var(--space-1)' }}>Gas: ${data.chainComparison.ethereum.gasCost.toFixed(2)}</div>
                    <div className="badge badge-red" style={{ marginTop: 'var(--space-2)', alignSelf: 'center' }}>{data.chainComparison.ethereum.overhead} overhead</div>
                  </div>
                </div>
                <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--color-success-bg)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-success)' }}>
                    You save ${data.chainComparison.savings?.vsEthereum?.toFixed(2) || '0'} vs Ethereum on {data?.totalTransactions || 0} txns
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tasks + Transactions */}
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Recent Tasks</div>
              <Link href="/dashboard/tasks" className="btn btn-sm btn-secondary">All Tasks</Link>
            </div>
            <div className="flex-col gap-2">
              {recentTasks.map((task) => (
                <Link key={task.id} href={`/dashboard/tasks/${task.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', cursor: 'pointer', transition: 'all 0.15s ease', border: '1px solid transparent' }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--border-accent)'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '2px' }}>{task.title}</div>
                      <div className="flex gap-2" style={{ alignItems: 'center' }}>
                        <span className={`badge ${task.status === 'completed' ? 'badge-green' : 'badge-blue'}`}>{task.status}</span>
                        <span className="text-xs text-muted">{task.subtasks?.length || 0} agents / {task.transactions?.length || 0} txns</span>
                      </div>
                    </div>
                    <div className="price price-sm">${(task.actualCost || 0).toFixed(4)}</div>
                  </div>
                </Link>
              ))}
              {recentTasks.length === 0 && <div className="text-sm text-muted" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>No tasks yet.</div>}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Transaction Feed</div>
              <Link href="/dashboard/explorer" className="btn btn-sm btn-secondary">Explorer</Link>
            </div>
            <div className="flex-col gap-1">
              {recentTxns.map((txn) => (
                <div key={txn.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)', borderLeft: `2px solid ${txn.type === 'escrow_deposit' ? 'var(--accent-blue)' : txn.type === 'platform_fee' ? 'var(--color-warning)' : txn.type === 'subcontract' ? 'var(--color-purple)' : 'var(--color-success)'}`, fontSize: '0.8125rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{txn.fromLabel} &rarr; {txn.toLabel}</div>
                    <span className={`badge ${txn.type === 'escrow_deposit' ? 'badge-blue' : txn.type === 'platform_fee' ? 'badge-yellow' : txn.type === 'subcontract' ? 'badge-purple' : 'badge-green'}`} style={{ marginTop: '2px' }}>{txn.type.replace(/_/g, ' ')}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="price" style={{ fontSize: '0.8125rem' }}>${txn.amount.toFixed(4)}</div>
                    <div className="txn-hash" style={{ fontSize: '0.625rem' }}>{txn.arcTxHash?.slice(0, 8)}...</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Agent Leaderboard */}
        {data?.agents && data.agents.length > 0 && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">Agent Leaderboard</div>
              <Link href="/dashboard/agents" className="btn btn-sm btn-secondary">Marketplace</Link>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Agent</th><th>Role</th><th>Tasks</th><th>Earned</th><th>Reliability</th><th>Cost/Action</th></tr></thead>
                <tbody>
                  {data.agents.sort((a, b) => (b.totalEarnings || 0) - (a.totalEarnings || 0)).map((agent) => (
                    <tr key={agent.id}>
                      <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{agent.name}</td>
                      <td><span className="badge badge-blue">{agent.role}</span></td>
                      <td className="mono" style={{ fontWeight: 600 }}>{agent.tasksCompleted || 0}</td>
                      <td className="price">${(agent.totalEarnings || 0).toFixed(4)}</td>
                      <td><span style={{ color: agent.reliability >= 0.93 ? 'var(--color-success)' : 'var(--color-warning)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{Math.round(agent.reliability * 100)}%</span></td>
                      <td className="mono text-sm">${agent.baseCostPerAction?.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
