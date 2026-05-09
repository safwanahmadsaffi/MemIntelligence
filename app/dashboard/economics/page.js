'use client';
import { useState, useEffect } from 'react';

export default function EconomicsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch('/api/analytics').then(r => r.json()).then(d => { setData(d); setLoading(false); }); }, []);

  if (loading) return <div><div className="page-header"><h1>Margin Analysis</h1></div><div className="page-body"><div className="shimmer" style={{ height: '400px', borderRadius: 'var(--radius-lg)' }}></div></div></div>;

  const cc = data?.chainComparison;
  return (
    <div className="fade-in">
      <div className="page-header"><h1>Margin Analysis</h1><p>Why sub-cent agent payments only work on Arc — and fail everywhere else</p></div>
      <div className="page-body flex-col gap-6">
        <div className="card" style={{ borderColor: 'var(--border-accent)' }}>
          <div className="card-title" style={{ marginBottom: 'var(--space-6)' }}>Chain Cost Comparison — {data?.totalTransactions || 0} Transactions</div>
          {cc && (
            <div className="chain-compare">
              <div className="chain-card viable"><div className="chain-name" style={{ color: 'var(--color-success)' }}>Arc</div><div className="chain-cost" style={{ color: 'var(--color-success)' }}>${cc.arc.totalCost.toFixed(5)}</div><div style={{ margin: 'var(--space-3) 0' }}><div className="text-xs text-muted">Task: ${cc.arc.taskCost.toFixed(4)}</div><div className="text-xs text-muted">Gas: ${cc.arc.gasCost.toFixed(5)}</div></div><div className="badge badge-green">Overhead: {cc.arc.overhead}</div><div style={{ marginTop: 'var(--space-3)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-success)' }}>VIABLE — Business model works</div></div>
              <div className="chain-card not-viable"><div className="chain-name" style={{ color: 'var(--color-danger)' }}>Ethereum</div><div className="chain-cost" style={{ color: 'var(--color-danger)' }}>${cc.ethereum.totalCost.toFixed(2)}</div><div style={{ margin: 'var(--space-3) 0' }}><div className="text-xs text-muted">Task: ${cc.ethereum.taskCost.toFixed(4)}</div><div className="text-xs text-muted">Gas: ${cc.ethereum.gasCost.toFixed(2)}</div></div><div className="badge badge-red">Overhead: {cc.ethereum.overhead}</div><div style={{ marginTop: 'var(--space-3)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-danger)' }}>NOT VIABLE — Gas destroys margins</div></div>
              <div className="chain-card not-viable"><div className="chain-name" style={{ color: 'var(--color-warning)' }}>Solana</div><div className="chain-cost" style={{ color: 'var(--color-warning)' }}>${cc.solana.totalCost.toFixed(4)}</div><div style={{ margin: 'var(--space-3) 0' }}><div className="text-xs text-muted">Task: ${cc.solana.taskCost.toFixed(4)}</div><div className="text-xs text-muted">Gas: ${cc.solana.gasCost.toFixed(4)}</div></div><div className="badge badge-yellow">Overhead: {cc.solana.overhead}</div><div style={{ marginTop: 'var(--space-3)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-warning)' }}>MARGINAL — Fees eat profits</div></div>
            </div>
          )}
        </div>

        {cc && (
          <div className="grid-2">
            <div className="card" style={{ background: 'var(--color-success-bg)', borderColor: 'var(--color-success)' }}><div style={{ textAlign: 'center' }}><div className="text-sm text-secondary" style={{ marginBottom: 'var(--space-2)' }}>Savings vs Ethereum</div><div style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>${cc.savings.vsEthereum.toFixed(2)}</div><div className="text-sm text-secondary" style={{ marginTop: 'var(--space-2)' }}>saved on {data?.totalTransactions || 0} transactions</div></div></div>
            <div className="card" style={{ background: 'var(--accent-blue-subtle)', borderColor: 'var(--accent-blue)' }}><div style={{ textAlign: 'center' }}><div className="text-sm text-secondary" style={{ marginBottom: 'var(--space-2)' }}>Cost Efficiency</div><div style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-blue-hover)' }}>99.7%</div><div className="text-sm text-secondary" style={{ marginTop: 'var(--space-2)' }}>of payment goes to value, not gas</div></div></div>
          </div>
        )}

        <div className="card">
          <div className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Unit Economics</div>
          <div className="table-wrap"><table><thead><tr><th>Metric</th><th>Value</th><th>Note</th></tr></thead><tbody>
            <tr><td>Avg action cost</td><td className="price">$0.003</td><td className="text-xs text-secondary">Per-agent</td></tr>
            <tr><td>Avg task cost</td><td className="price">${(data?.avgTaskCost || 0.03).toFixed(4)}</td><td className="text-xs text-secondary">5 agents</td></tr>
            <tr><td>Platform fee</td><td style={{ color: 'var(--color-warning)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>15%</td><td className="text-xs text-secondary">Transparent take rate</td></tr>
            <tr><td>Arc gas/txn</td><td className="price">$0.00001</td><td className="text-xs text-secondary">Near-zero</td></tr>
            <tr><td>ETH gas/txn</td><td style={{ color: 'var(--color-danger)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>$2.00</td><td className="text-xs text-secondary">200,000x more</td></tr>
            <tr><td>Break-even</td><td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>~100 tasks/day</td><td className="text-xs text-secondary">At 15% fee</td></tr>
          </tbody></table></div>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 'var(--space-4)' }}>The Economic Story</div>
          <div className="flex-col gap-4">
            <div style={{ padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-blue)' }}><div style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>10-Second Pitch</div><p className="text-sm text-secondary">"On Ethereum, it costs $2 in gas to send $0.003. On Arc, it costs essentially nothing. That is why micro-agent-payments only work here."</p></div>
            <div style={{ padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-success)' }}><div style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>30-Second Pitch</div><p className="text-sm text-secondary">"Our platform routes AI tasks through specialist agents who each charge sub-cent fees. A typical task costs 3 cents and involves 8-12 micro-payments. On Ethereum, those payments would cost $20+ in gas alone — making the entire model impossible. Arc's near-zero settlement cost means 99.7% efficiency. The 15% platform fee generates real revenue at scale."</p></div>
            <div style={{ padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-purple)' }}><div style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>Why This Matters</div><p className="text-sm text-secondary">"As AI becomes agentic — where multiple specialists collaborate and settle independently — micro-payment volume explodes. Each task triggers 10+ payments. At enterprise scale, that is millions per day. Only a chain with near-zero fees supports this. Arc + Circle Nanopayments are the infrastructure that makes the agentic economy viable."</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
