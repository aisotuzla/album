import './polyfills.ts';
import React, { StrictMode, useMemo, Component, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import '@solana/wallet-adapter-react-ui/styles.css';
import { getSolanaNetworkConfig } from './solana/network';

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
          backgroundColor: '#0a1657',
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
            background: '#040b6be3',
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
  const { endpoint } = getSolanaNetworkConfig({
    network: import.meta.env.VITE_SOLANA_NETWORK,
    devnetEndpoint: import.meta.env.VITE_SOLANA_DEVNET_NETWORK,
    mainnetEndpoint: import.meta.env.VITE_SOLANA_MAINNET_NETWORK,
  });

  const wallets = useMemo(
    () => [new SolflareWalletAdapter()],
    []
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
