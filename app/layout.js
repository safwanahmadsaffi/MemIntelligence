import './globals.css';

export const metadata = {
  title: 'AgentFlow — See Every Cent of Intelligence',
  description: 'A live economic marketplace where AI agents bid, subcontract, and settle sub-cent USDC micro-payments on Arc — with full economic visibility for every action.',
  keywords: ['AI agents', 'micro-payments', 'USDC', 'Arc', 'Circle', 'marketplace', 'economic visibility'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
