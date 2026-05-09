'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { section: 'Overview', items: [
    { href: '/dashboard', label: 'Dashboard' },
  ]},
  { section: 'Marketplace', items: [
    { href: '/dashboard/tasks', label: 'Tasks' },
    { href: '/dashboard/agents', label: 'Agents' },
  ]},
  { section: 'Economics', items: [
    { href: '/dashboard/explorer', label: 'Transactions' },
    { href: '/dashboard/economics', label: 'Margin Analysis' },
  ]},
  { section: 'System', items: [
    { href: '/dashboard/demo', label: 'Demo Control' },
  ]},
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link href="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>AgentFlow</Link>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((group) => (
            <div key={group.section}>
              <div className="nav-section">{group.section}</div>
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${pathname === item.href ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <span className="pulse-dot"></span>
            <span className="text-xs text-secondary">Live on Arc</span>
          </div>
          <div className="text-xs text-muted">Circle Nanopayments / USDC</div>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
