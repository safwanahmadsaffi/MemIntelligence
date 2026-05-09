'use client';
import { useState, useEffect } from 'react';

export default function ExplorerPage() {
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  useEffect(() => { fetch('/api/transactions').then(r => r.json()).then(d => { setTxns(d.transactions || []); setLoading(false); }); }, []);

  const filtered = filter === 'all' ? txns : txns.filter(t => t.type === filter);
  const totalVolume = txns.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="flex-between">
          <div><h1>Transaction Explorer</h1><p>On-chain micro-payments settled via Circle Nanopayments on Arc</p></div>
          <div className="heartbeat-panel" style={{ padding: 'var(--space-3) var(--space-5)', minWidth: '160px' }}>
            <div className="heartbeat-counter" style={{ fontSize: '2rem' }}>{txns.length}</div>
            <div className="heartbeat-label" style={{ fontSize: '0.6875rem' }}>On-Chain Txns</div>
          </div>
        </div>
      </div>
      <div className="page-body flex-col gap-6">
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div className="stat-card"><div className="stat-label">Total Transactions</div><div className="stat-value text-success">{txns.length}</div></div>
          <div className="stat-card"><div className="stat-label">Total Volume</div><div className="stat-value" style={{ color: 'var(--accent-blue)' }}>${totalVolume.toFixed(4)}</div></div>
          <div className="stat-card"><div className="stat-label">Agent Payments</div><div className="stat-value" style={{ color: 'var(--color-purple)' }}>{txns.filter(t => t.type === 'agent_payment').length}</div></div>
          <div className="stat-card"><div className="stat-label">Subcontracts</div><div className="stat-value" style={{ color: 'var(--color-warning)' }}>{txns.filter(t => t.type === 'subcontract').length}</div></div>
        </div>

        <div className="flex gap-2">
          {['all', 'escrow_deposit', 'agent_payment', 'subcontract', 'platform_fee'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}>
              {f === 'all' ? 'All' : f.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="table-wrap">
          <table>
            <thead><tr><th>Tx Hash</th><th>Type</th><th>From</th><th>To</th><th>Amount</th><th>Description</th><th>Status</th><th>Explorer</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: 'var(--space-8)' }}><div className="shimmer" style={{ height: '20px', width: '200px', margin: '0 auto', borderRadius: '4px' }}></div></td></tr>
              : filtered.length === 0 ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>No transactions found</td></tr>
              : filtered.map(txn => (
                <tr key={txn.id}>
                  <td><span className="txn-hash" title={txn.arcTxHash}>{txn.arcTxHash?.slice(0, 8)}...{txn.arcTxHash?.slice(-4)}</span></td>
                  <td><span className={`badge ${txn.type === 'escrow_deposit' ? 'badge-blue' : txn.type === 'platform_fee' ? 'badge-yellow' : txn.type === 'subcontract' ? 'badge-purple' : 'badge-green'}`}>{txn.type.replace(/_/g, ' ')}</span></td>
                  <td style={{ fontSize: '0.8125rem' }}>{txn.fromLabel}</td>
                  <td style={{ fontSize: '0.8125rem' }}>{txn.toLabel}</td>
                  <td className="txn-amount">${txn.amount.toFixed(4)}</td>
                  <td className="text-xs text-secondary" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{txn.description}</td>
                  <td><span className="badge badge-green">confirmed</span></td>
                  <td><a href={txn.arcExplorerUrl} target="_blank" rel="noopener" className="btn btn-sm btn-secondary">Arc</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ borderColor: 'var(--color-success)', background: 'var(--color-success-bg)' }}>
          <div className="flex-between">
            <div><div style={{ fontWeight: 600, color: 'var(--color-success)' }}>On-Chain Proof</div><p className="text-sm text-secondary" style={{ marginTop: 'var(--space-1)' }}>All {txns.length} transactions settled via Circle Nanopayments with USDC on Arc. Each is independently verifiable.</p></div>
            <div style={{ textAlign: 'right' }}><div className="price price-lg">{txns.length} txns</div><div className="text-xs text-muted">${totalVolume.toFixed(4)} USDC</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
