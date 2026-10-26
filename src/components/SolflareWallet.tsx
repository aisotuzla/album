import React, { useState, useEffect } from "react";
import { Wallet, Check, AlertCircle, Coins, ExternalLink, Loader2 } from "../icons";
import { WalletState } from "../types";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { Language } from "../data/translations";
import { getSolanaNetworkConfig } from "../solana/network";

interface SolflareWalletProps {
  wallet: WalletState;
  onWalletChange: (newWallet: WalletState) => void;
  lang: Language;
  sandboxMode: boolean;
  onToggleSandbox: () => void;
}

export default function SolflareWallet({ wallet, onWalletChange, lang, sandboxMode, onToggleSandbox }: SolflareWalletProps) {
  const { publicKey, connected, disconnect } = useWallet();
  const { connection } = useConnection();
  const [error, setError] = useState<string | null>(null);
  const [rpcStatus, setRpcStatus] = useState<"checking" | "online" | "offline" | "sandbox">("checking");
  const networkConfig = getSolanaNetworkConfig({
    network: import.meta.env.VITE_SOLANA_NETWORK,
    devnetEndpoint: import.meta.env.VITE_SOLANA_DEVNET_NETWORK,
    mainnetEndpoint: import.meta.env.VITE_SOLANA_MAINNET_NETWORK,
  });
  const networkLabel = networkConfig.network === "devnet" ? "Solana Devnet" : "Solana Mainnet";
  const explorerCluster = networkConfig.network === "devnet" ? "devnet" : "mainnet-beta";

  useEffect(() => {
    if (sandboxMode) {
      setRpcStatus("sandbox");
      setError(null);
      return;
    }

    let active = true;
    let timeout: ReturnType<typeof setTimeout>;

    const refreshConnection = async () => {
      try {
        await connection.getVersion();
        const balance = connected && publicKey
          ? await connection.getBalance(publicKey)
          : null;

        if (!active) return;
        setRpcStatus("online");
        setError(null);

        if (publicKey && balance !== null) {
          onWalletChange({
            connected: true,
            publicKey: publicKey.toBase58(),
            balance: balance / LAMPORTS_PER_SOL,
          });
        } else if (!connected && wallet.connected) {
          onWalletChange({ connected: false, publicKey: null, balance: 0 });
        }
      } catch (err: unknown) {
        if (!active) return;
        const message = err instanceof Error ? err.message : String(err);
        console.error("Failed to check Solana RPC or fetch wallet balance:", err);
        setRpcStatus("offline");
        setError(message);
      } finally {
        if (active) {
          timeout = setTimeout(() => void refreshConnection(), 15000);
        }
      }
    };

    setRpcStatus("checking");
    void refreshConnection();

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [connected, publicKey, connection, onWalletChange, sandboxMode, wallet.connected]);

  const handleFaucetClaim = () => {
    window.open("https://faucet.solana.com/", "_blank", "noopener,noreferrer");
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div id="solflare-wallet-card" className="bg-white border border-gray-300 rounded-2xl p-5 md:p-6 shadow-sm max-w-md w-full text-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="p-2 bg-[#002F6C]/10 rounded-lg text-[#002F6C]">
              <Wallet className="h-6 w-6" id="wallet-icon-svg" />
            </div>
            {wallet.connected && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#14F195] border-2 border-white inline-block animate-pulse" />
            )}
          </div>
          <div className="text-left">
            <h3 className="font-sans font-bold text-base text-[#002F6C] uppercase tracking-tight leading-none">Solana Node Wallet</h3>
            <span className="text-[10px] font-serif text-gray-500 italic block mt-1">
              {sandboxMode ? "Sandbox (mock wallet; not connected to Solana)" : `${networkLabel} · RPC ${rpcStatus}`}
            </span>
          </div>
        </div>
        {!sandboxMode && (
          <span className={`text-[9px] font-sans font-bold px-2 py-0.5 rounded border ${rpcStatus === "online"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : rpcStatus === "offline"
              ? "bg-rose-50 text-rose-700 border-rose-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
            }`}>
            {rpcStatus === "checking" ? <Loader2 className="inline h-3 w-3 animate-spin mr-1" /> : null}
            {rpcStatus === "online" ? "RPC ONLINE" : rpcStatus === "offline" ? "RPC OFFLINE" : "RPC CHECKING"}
          </span>
        )}
      </div>

      {!wallet.connected ? (
        <div className="space-y-3">
          <p className="text-xs font-serif text-gray-600 leading-relaxed text-left">
            Connect Solflare to check your {networkLabel} address and balance. Pack purchases and trades are demo-only until an on-chain program is configured. Sandbox mode does not connect to Solana.
          </p>

          <div className="flex justify-center py-2 [&_.wallet-adapter-button]:!bg-[#002F6C] [&_.wallet-adapter-button]:hover:!opacity-95 [&_.wallet-adapter-button]:!h-auto [&_.wallet-adapter-button]:!py-2.5 [&_.wallet-adapter-button]:!px-4 [&_.wallet-adapter-button]:!rounded-lg [&_.wallet-adapter-button]:!font-sans [&_.wallet-adapter-button]:!font-bold [&_.wallet-adapter-button]:!text-xs [&_.wallet-adapter-button]:!uppercase [&_.wallet-adapter-button]:!tracking-wider [&_.wallet-adapter-button]:!transition [&_.wallet-adapter-button]:!shadow-sm [&_.wallet-adapter-button]:!w-full [&_.wallet-adapter-button]:!flex [&_.wallet-adapter-button]:!justify-center">
            <WalletMultiButton />
          </div>

          {error && (
            <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-600 font-mono text-left mt-2">
              RPC connection failed: {error}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={onToggleSandbox}
              className="w-full py-2.5 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-sans font-bold text-xs uppercase tracking-wider transition border border-gray-300"
            >
              Enable Sandbox Mode
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-[#fdfcf7] border border-gray-300 rounded-xl p-3.5 space-y-2 text-left">
            <div className="flex justify-between items-center text-[10px] font-sans font-bold text-gray-400">
              <span>SOLANA ADDRESS:</span>
              <span className="text-emerald-600 font-bold font-mono text-[9px] flex items-center">
                <Check className="h-3 w-3 mr-0.5" /> CONNECTED
              </span>
            </div>
            <a
              className="font-mono text-xs text-gray-700 select-all break-all bg-white p-2 rounded border border-gray-300 flex items-center justify-between gap-2"
              href={`https://explorer.solana.com/address/${wallet.publicKey}?cluster=${explorerCluster}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {wallet.publicKey}
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            </a>

            <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-xs font-sans">
              <span className="text-gray-500">SOLANA BALANCE:</span>
              <span className="font-mono font-bold text-[#002F6C] flex items-center space-x-1">
                <span>{rpcStatus === "online" ? `${wallet.balance.toFixed(4)} SOL` : "Unavailable"}</span>
              </span>
            </div>
          </div>

          <div className="flex space-x-2">
            {!sandboxMode && networkConfig.network === "devnet" && (
              <button
                id="btn-solana-faucet-airdrop"
                onClick={handleFaucetClaim}
                className="flex-1 py-2 px-3 rounded bg-[#FFCD00]/25 hover:bg-[#FFCD00]/40 text-[#002F6C] font-bold text-xs font-sans transition border border-[#FFCD00]/50 flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Coins className="h-3.5 w-3.5 text-[#002F6C]" />
                <span>OPEN DEVNET FAUCET</span>
              </button>
            )}

            <button
              id="btn-disconnect-solana"
              onClick={sandboxMode ? onToggleSandbox : handleDisconnect}
              className="py-2 px-3 rounded hover:bg-rose-50 hover:text-rose-700 text-rose-600 font-sans font-bold text-xs transition border border-rose-200 flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>{sandboxMode ? "EXIT SANDBOX" : "DISCONNECT"}</span>
            </button>
          </div>
          
          {error && (
            <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-[10px] text-rose-600 font-mono text-left">
              RPC connection failed: {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
