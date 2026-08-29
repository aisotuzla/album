import './polyfills.ts';
import React, { StrictMode, useMemo, Component, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[RootErrorBoundary caught error]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          fontFamily: 'sans-serif',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#f59e0b', fontSize: '1.5rem', marginBottom: '1rem' }}>
            ⚠️ Application Error
          </h1>
          <p style={{ maxWidth: '600px', marginBottom: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>
            {this.state.error?.message || 'An unexpected error occurred while rendering.'}
          </p>
          <pre style={{
            background: '#1e293b',
            padding: '1rem',
            borderRadius: '0.5rem',
            fontSize: '0.75rem',
            textAlign: 'left',
            maxWidth: '800px',
            overflowX: 'auto',
            color: '#f87171'
          }}>
            {this.state.error?.stack}
          </pre>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              marginTop: '1.5rem',
              padding: '0.6rem 1.5rem',
              borderRadius: '0.5rem',
              backgroundColor: '#002F6C',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Clear Stored Data & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function SolanaWalletApp() {
  const network = import.meta.env.VITE_SOLANA_NETWORK === 'mainnet'
    ? WalletAdapterNetwork.Mainnet
    : WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(
    () => import.meta.env.VITE_SOLANA_DEVNET_NETWORK || clusterApiUrl(network),
    [network]
  );

  const wallets = useMemo(
    () => [new SolflareWalletAdapter()],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <SolanaWalletApp />
    </RootErrorBoundary>
  </StrictMode>,
);
