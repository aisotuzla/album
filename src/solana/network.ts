import { clusterApiUrl } from "@solana/web3.js";

export type SolanaNetwork = "devnet" | "mainnet";

export interface SolanaNetworkConfig {
  network: SolanaNetwork;
  endpoint: string;
}

interface SolanaNetworkOptions {
  network?: string;
  devnetEndpoint?: string;
  mainnetEndpoint?: string;
}

export function getSolanaNetworkConfig({
  network: requestedNetwork,
  devnetEndpoint,
  mainnetEndpoint,
}: SolanaNetworkOptions): SolanaNetworkConfig {
  const network = requestedNetwork?.trim().toLowerCase() || "devnet";
  if (network !== "devnet" && network !== "mainnet") {
    throw new Error(
      `Unsupported VITE_SOLANA_NETWORK "${network}". Expected "devnet" or "mainnet".`,
    );
  }

  if (network === "mainnet") {
    return {
      network,
      endpoint: mainnetEndpoint?.trim() || clusterApiUrl("mainnet-beta"),
    };
  }

  return {
    network,
    endpoint: devnetEndpoint?.trim() || clusterApiUrl("devnet"),
  };
}
