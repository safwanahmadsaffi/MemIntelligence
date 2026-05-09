'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function TaskDetailPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('economics');

  useEffect(() => {
    const fetchTask = async () => {
      const [taskRes, txnsRes] = await Promise.all([
        fetch(`/api/tasks/${id}`), fetch(`/api/transactions?taskId=${id}`),
      ]);
      const taskData = await taskRes.json();
      const txnsData = await txnsRes.json();
      setTask(taskData.task);
      setTxns(txnsData.transactions || []);
      setLoading(false);
    };
    if (id) fetchTask();
  }, [id]);

  if (loading) return <div className="page-body"><div className="shimmer" style={{ height: '400px', borderRadius: 'var(--radius-lg)' }}></div></div>;
  if (!task) return <div className="page-body"><div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}><h3>Task not found</h3><Link href="/dashboard/tasks" className="btn btn-secondary" style={{ marginTop: 'var(--space-4)' }}>Back to Tasks</Link></div></div>;

  const totalAgentEarnings = (task.subtasks || []).reduce((sum, s) => sum + (s.agentEarning || 0), 0);
  const tabs = [{ id: 'economics', label: 'Economics' }, { id: 'agents', label: 'Agents' }, { id: 'timeline', label: 'Timeline' }, { id: 'results', label: 'Results' }];

  return (
    <div className="fade-in">
      <div className="page-header" style={{ borderBottom: `2px solid ${task.status === 'completed' ? 'var(--color-success)' : 'var(--accent-blue)'}` }}>
        <div className="flex-between">
          <div>
            <div className="flex gap-3" style={{ alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <Link href="/dashboard/tasks" className="btn btn-sm btn-secondary">Back</Link>
              <span className={`badge ${task.status === 'completed' ? 'badge-green' : 'badge-blue'}`}>{task.status === 'completed' ? 'SETTLED' : task.status.toUpperCase()}</span>
              <span className="badge badge-blue">{task.category}</span>
              <span className="badge badge-purple">Complexity {task.complexity}/5</span>
            </div>
            <h1 style={{ fontSize: '1.375rem' }}>{task.title}</h1>
            {task.description && <p style={{ marginTop: 'var(--space-1)' }}>{task.description}</p>}
          </div>
          <div style={{ textAlign: 'right', minWidth: '140px' }}>
            <div className="price price-xl">${(task.actualCost || 0).toFixed(4)}</div>
            <div className="text-xs text-muted">USDC on Arc</div>
          </div>
        </div>
      </div>

      <div className="page-body flex-col gap-6">
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          <div className="stat-card" style={{ borderTop: '2px solid var(--color-success)' }}><div className="stat-label">Total Cost</div><div className="stat-value price" style={{ fontSize: '1.375rem' }}>${(task.actualCost || 0).toFixed(4)}</div></div>
          <div className="stat-card" style={{ borderTop: '2px solid var(--color-warning)' }}><div className="stat-label">Platform Fee</div><div className="stat-value" style={{ color: 'var(--color-warning)', fontSize: '1.375rem' }}>${(task.platformFee || 0).toFixed(4)}</div><div className="stat-change">15%</div></div>
          <div className="stat-card" style={{ borderTop: '2px solid var(--color-purple)' }}><div className="stat-label">Agent Earnings</div><div className="stat-value" style={{ color: 'var(--color-purple)', fontSize: '1.375rem' }}>${totalAgentEarnings.toFixed(4)}</div><div className="stat-change">85%</div></div>
          <div className="stat-card" style={{ borderTop: '2px solid var(--accent-blue)' }}><div className="stat-label">Transactions</div><div className="stat-value" style={{ color: 'var(--accent-blue)', fontSize: '1.375rem' }}>{txns.length}</div></div>
          <div className="stat-card" style={{ borderTop: '2px solid var(--color-cyan)' }}><div className="stat-label">Agents</div><div className="stat-value" style={{ color: 'var(--color-cyan)', fontSize: '1.375rem' }}>{task.subtasks?.length || 0}</div></div>
        </div>

        <div className="flex gap-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: 'var(--space-3) var(--space-4)', background: activeTab === tab.id ? 'var(--accent-blue-subtle)' : 'transparent', border: 'none', borderBottom: activeTab === tab.id ? '2px solid var(--accent-blue)' : '2px solid transparent', color: activeTab === tab.id ? 'var(--accent-blue-hover)' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.15s ease' }}>{tab.label}</button>
          ))}
        </div>

        {activeTab === 'economics' && (
          <div className="flex-col gap-6 fade-in">
            {task.economicGraph && (
              <div className="card" style={{ borderColor: 'var(--border-accent)' }}>
                <div className="card-header"><div className="card-title">Money Flow</div><span className="badge badge-green">SETTLED</span></div>
                <div style={{ padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
                    <div className="graph-node" style={{ borderColor: '#60a5fa', background: 'rgba(96,165,250,0.1)', padding: 'var(--space-2) var(--space-5)' }}>User Wallet</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, #60a5fa, #f59e0b)' }}></div>
                      <span className="price price-sm">${(task.actualCost || 0).toFixed(4)}</span>
                      <div style={{ width: '60px', height: '2px', background: '#f59e0b' }}></div>
                    </div>
                    <div className="graph-node" style={{ borderColor: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: 'var(--space-2) var(--space-5)' }}>Escrow</div>
                  </div>
                  <div style={{ textAlign: 'center', marginBottom: 'var(--space-3)' }}><span className="text-xs text-muted">Distributes to {task.subtasks?.length || 0} agents + platform</span></div>
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${(task.subtasks?.length || 0) + 1}, 1fr)`, gap: 'var(--space-3)' }}>
                    {(task.subtasks || []).map((st, i) => (
                      <div key={i} style={{ padding: 'var(--space-4)', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', borderTop: `3px solid ${st.agentColor}`, textAlign: 'center' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', background: st.agentColor, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', marginBottom: 'var(--space-2)' }}>{st.agentAvatar}</div>
                        <div style={{ fontWeight: 600, fontSize: '0.8125rem', marginBottom: 'var(--space-1)' }}>{st.agentName}</div>
                        <div className="price" style={{ fontSize: '0.875rem' }}>${(st.agentEarning || 0).toFixed(4)}</div>
                        <div className="text-xs text-muted" style={{ marginTop: 'var(--space-1)' }}>{Math.round((st.agentEarning / (task.actualCost || 1)) * 100)}%</div>
                        {st.subcontractTo && <div style={{ marginTop: 'var(--space-2)', padding: 'var(--space-1) var(--space-2)', background: 'var(--color-purple-bg)', borderRadius: 'var(--radius-sm)', fontSize: '0.6875rem', color: 'var(--color-purple)' }}>Sub: {st.subcontractTo.agentName} ${st.subcontractTo.amount?.toFixed(4)}</div>}
                      </div>
                    ))}
                    <div style={{ padding: 'var(--space-4)', background: 'var(--color-danger-bg)', borderRadius: 'var(--radius-md)', borderTop: '3px solid var(--color-danger)', textAlign: 'center' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', background: 'var(--color-danger)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', marginBottom: 'var(--space-2)' }}>F</div>
                      <div style={{ fontWeight: 600, fontSize: '0.8125rem', marginBottom: 'var(--space-1)' }}>Platform</div>
                      <div style={{ color: 'var(--color-warning)', fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.875rem' }}>${(task.platformFee || 0).toFixed(4)}</div>
                      <div className="text-xs text-muted" style={{ marginTop: 'var(--space-1)' }}>15%</div>
                    </div>
                  </div>
                </div>
                <div style={{ padding: 'var(--space-3)', background: 'var(--color-success-bg)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: 'var(--color-success)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{txns.length} micro-payments settled on Arc</span>
                  <span className="mono" style={{ fontWeight: 600 }}>Saved ~${(txns.length * 2).toFixed(2)} vs Ethereum</span>
                </div>
              </div>
            )}

            {task.subtasks && task.subtasks.length > 0 && (
              <div className="card">
                <div className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Cost Breakdown</div>
                <div className="cost-ladder">
                  {task.subtasks.map((st, i) => {
                    const pct = task.actualCost ? ((st.totalCost / task.actualCost) * 100).toFixed(1) : 0;
                    return (
                      <div key={i} className="cost-step" style={{ borderColor: st.agentColor }}>
                        <div className="cost-step-label" style={{ flex: 1 }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-sm)', background: st.agentColor, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>{st.agentAvatar}</div>
                          <div style={{ flex: 1 }}><div style={{ fontWeight: 500 }}>{st.agentName}</div><div className="text-xs text-muted">{st.description}</div></div>
                          <div style={{ width: '80px', height: '4px', background: 'var(--bg-primary)', borderRadius: '2px', overflow: 'hidden' }}><div style={{ width: `${pct}%`, height: '100%', background: st.agentColor, borderRadius: '2px' }}></div></div>
                        </div>
                        <div style={{ textAlign: 'right', minWidth: '100px' }}><div className="cost-step-amount price">${(st.totalCost || 0).toFixed(4)}</div><div className="text-xs text-muted">{pct}%</div></div>
                      </div>
                    );
                  })}
                  <div className="cost-total" style={{ marginTop: 'var(--space-2)' }}><span>Total (incl. 15% fee)</span><span className="price price-lg">${(task.actualCost || 0).toFixed(4)} USDC</span></div>
                </div>
              </div>
            )}

            {task.bids && task.bids.length > 0 && (
              <div className="card">
                <div className="card-header"><div className="card-title">Bid Competition</div><span className="text-xs text-muted">{task.bids.length} agents</span></div>
                <div className="bid-feed">
                  {task.bids.sort((a, b) => (a.bidPrice || 0) - (b.bidPrice || 0)).map((bid, i) => (
                    <div key={i} className="bid-item" style={{ borderColor: i === 0 ? 'var(--color-success)' : 'var(--border-subtle)', background: i === 0 ? 'var(--color-success-bg)' : 'var(--bg-card)' }}>
                      <div className="bid-agent">
                        <div><div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{bid.agentName}{i === 0 && <span className="badge badge-green" style={{ marginLeft: 'var(--space-2)' }}>BEST</span>}</div><div className="text-xs text-muted">ETA: {bid.estimatedTime} | {Math.round((bid.confidence || 0) * 100)}% reliability</div></div>
                      </div>
                      <div style={{ textAlign: 'right' }}><div className="bid-price" style={{ fontSize: '1rem' }}>${bid.bidPrice?.toFixed(4)}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="flex-col gap-4 fade-in">
            {(task.subtasks || []).map((st, i) => (
              <div key={i} className="card" style={{ borderLeft: `3px solid ${st.agentColor}` }}>
                <div className="flex-between" style={{ marginBottom: 'var(--space-3)' }}>
                  <div className="flex gap-3" style={{ alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: st.agentColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem' }}>{st.agentAvatar}</div>
                    <div><h3 style={{ fontSize: '1rem' }}>{st.agentName}</h3><div className="text-xs text-muted">{st.description}</div></div>
                  </div>
                  <div style={{ textAlign: 'right' }}><div className="price">${(st.totalCost || 0).toFixed(4)}</div><div className="text-xs text-muted">earned ${(st.agentEarning || 0).toFixed(4)}</div></div>
                </div>
                <div className="grid-4" style={{ gap: 'var(--space-2)' }}>
                  {[{ l: 'Cost', v: `$${(st.totalCost||0).toFixed(4)}`, c: 'var(--color-success)' }, { l: 'Fee', v: `$${(st.platformFee||0).toFixed(4)}`, c: 'var(--color-warning)' }, { l: 'Confidence', v: `${st.confidenceMultiplier||'-'}x`, c: 'var(--text-primary)' }, { l: 'Complexity', v: `${st.complexityMultiplier||'-'}x`, c: 'var(--text-primary)' }].map((m,j) => (
                    <div key={j} style={{ padding: 'var(--space-2)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}><div className="text-xs text-muted">{m.l}</div><div className="mono text-sm" style={{ fontWeight: 600, color: m.c }}>{m.v}</div></div>
                  ))}
                </div>
                {st.subcontractTo && <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--color-purple-bg)', borderRadius: 'var(--radius-md)' }}><div className="text-sm" style={{ fontWeight: 500, color: 'var(--color-purple)' }}>Subcontracted to {st.subcontractTo.agentName} — ${st.subcontractTo.amount?.toFixed(4)} USDC</div></div>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="card fade-in">
            <div className="card-header"><div className="card-title">Settlement Timeline</div><span className="text-xs text-muted">{txns.length} settlements</span></div>
            <div className="timeline">
              {txns.map((txn, i) => (
                <div key={txn.id} className="timeline-item">
                  <div className="timeline-marker">
                    <div className="timeline-dot" style={{ background: txn.type === 'platform_fee' ? 'var(--color-warning)' : txn.type === 'subcontract' ? 'var(--color-purple)' : txn.type === 'escrow_deposit' ? 'var(--accent-blue)' : 'var(--color-success)' }}></div>
                    {i < txns.length - 1 && <div className="timeline-line"></div>}
                  </div>
                  <div className="timeline-content">
                    <div className="flex-between">
                      <div><div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{txn.description}</div><div className="text-xs text-muted">{txn.fromLabel} &rarr; {txn.toLabel}</div></div>
                      <div style={{ textAlign: 'right' }}><div className="price price-sm">${txn.amount.toFixed(6)}</div><a href={txn.arcExplorerUrl} target="_blank" rel="noopener" className="txn-hash" style={{ fontSize: '0.6875rem' }}>{txn.arcTxHash?.slice(0, 10)}...{txn.arcTxHash?.slice(-6)}</a></div>
                    </div>
                    <div className="flex gap-2" style={{ marginTop: 'var(--space-2)' }}>
                      <span className={`badge ${txn.type === 'escrow_deposit' ? 'badge-blue' : txn.type === 'platform_fee' ? 'badge-yellow' : txn.type === 'subcontract' ? 'badge-purple' : 'badge-green'}`}>{txn.type.replace(/_/g, ' ')}</span>
                      <span className="badge badge-green">confirmed</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="flex-col gap-4 fade-in">
            {task.result && <div className="card" style={{ borderColor: 'var(--color-success)' }}><div className="card-header"><div className="card-title" style={{ color: 'var(--color-success)' }}>Final Deliverable</div><span className="badge badge-green">8.5/10</span></div><div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.8, padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>{task.result}</div></div>}
            {(task.subtasks || []).filter(s => s.result).map((st, i) => (
              <div key={i} className="card"><div className="flex-between" style={{ marginBottom: 'var(--space-3)' }}><div className="flex gap-2" style={{ alignItems: 'center' }}><span style={{ fontWeight: 600 }}>{st.agentName}</span><span className="badge badge-blue">{st.description}</span></div><span className="price price-sm">${(st.totalCost || 0).toFixed(4)}</span></div><div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.7, padding: 'var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', maxHeight: '300px', overflowY: 'auto' }}>{st.result}</div></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
