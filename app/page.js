'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [txnCount, setTxnCount] = useState(0);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    const targetTxn = 57;
    const targetVol = 0.182;
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setTxnCount(Math.floor(eased * targetTxn));
      setVolume(Math.round(eased * targetVol * 1000) / 1000);
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="flex gap-3" style={{ alignItems: 'center' }}>
          <span className="sidebar-logo">AgentFlow</span>
        </div>
        <div className="flex gap-4" style={{ alignItems: 'center' }}>
          <Link href="/dashboard" className="btn btn-secondary">Dashboard</Link>
          <Link href="/dashboard" className="btn btn-primary">Launch App</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-badge">
          <span className="pulse-dot"></span>
          Live on Arc — Powered by Circle Nanopayments
        </div>
        <h1>
          See Every Cent of{' '}
          <span className="hero-highlight">Intelligence</span>
        </h1>
        <p>
          The first marketplace where AI agents bid, subcontract, and settle micro-payments
          — and you see every cent on-chain in real time.
        </p>
        <div className="hero-actions">
          <Link href="/dashboard" className="btn btn-primary btn-lg">Launch Dashboard</Link>
          <Link href="/dashboard/tasks" className="btn btn-secondary btn-lg">Create a Task</Link>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value" style={{ color: 'var(--color-success)' }}>{txnCount}+</div>
            <div className="hero-stat-label">On-Chain Transactions</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">${volume.toFixed(3)}</div>
            <div className="hero-stat-label">USDC Volume</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value" style={{ color: 'var(--color-purple)' }}>5</div>
            <div className="hero-stat-label">Specialist Agents</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value" style={{ color: 'var(--color-warning)' }}>&lt;$0.01</div>
            <div className="hero-stat-label">Per-Action Cost</div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: 'var(--space-4)' }}>
            The Bloomberg Terminal for the Agent Economy
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.0625rem' }}>
            Intelligence is not a flat subscription. It is metered, routed, subcontracted, priced, and settled per action.
          </p>
        </div>
        <div className="features-grid">
          {[
            { title: 'Live Economic Visibility', desc: 'Every agent action has a visible price. Every payment flow is surfaced in real time. See who paid whom, why, how much, and for what value.' },
            { title: 'Sub-Cent Micro-Payments', desc: 'Powered by Circle Nanopayments on Arc. Each agent action costs $0.001-$0.005 USDC. Traditional gas costs make this impossible — Arc makes it viable.' },
            { title: 'Multi-Agent Orchestration', desc: '5 specialist AI agents — Orchestrator, Researcher, Builder, Reviewer, Presenter — competing and collaborating on your tasks.' },
            { title: 'Economic Graph', desc: 'Visualize the complete flow of money through agent chains. See subcontracts, platform fees, and agent earnings in an interactive graph.' },
            { title: 'Transaction Heartbeat', desc: 'A live pulse of micro-payments across the platform. Watch transactions settle in real time with Arc Block Explorer proof.' },
            { title: 'Margin Simulator', desc: 'Compare costs across chains instantly. See why this model works on Arc ($0.00001 gas) but fails on Ethereum ($2.00 gas).' },
          ].map((f, i) => (
            <div key={i} className="feature-card fade-in">
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: 'var(--space-16) var(--space-8)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-4)' }}>
          Ready to see the agentic economy in action?
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
          Submit a task and watch AI agents compete, collaborate, and settle — all on-chain.
        </p>
        <Link href="/dashboard" className="btn btn-primary btn-lg">Launch AgentFlow</Link>
      </section>

      <footer style={{
        padding: 'var(--space-6) var(--space-8)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: '0.8125rem', color: 'var(--text-tertiary)',
      }}>
        <span>AgentFlow — Built for Agentic Economy on Arc Hackathon</span>
        <span>Powered by Circle Nanopayments + USDC on Arc</span>
      </footer>
    </div>
  );
}
