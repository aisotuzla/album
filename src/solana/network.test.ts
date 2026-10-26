import { describe, expect, it } from "vitest";
import { clusterApiUrl } from "@solana/web3.js";
import { getSolanaNetworkConfig } from "./network";

describe("getSolanaNetworkConfig", () => {
  it("defaults to Devnet", () => {
    expect(getSolanaNetworkConfig({})).toEqual({
      network: "devnet",
      endpoint: clusterApiUrl("devnet"),
    });
  });

  it("uses a Devnet RPC override only for Devnet", () => {
    expect(getSolanaNetworkConfig({
      devnetEndpoint: "https://devnet.example/rpc",
    })).toEqual({
      network: "devnet",
      endpoint: "https://devnet.example/rpc",
    });

    expect(getSolanaNetworkConfig({
      network: "mainnet",
      devnetEndpoint: "https://devnet.example/rpc",
    })).toEqual({
      network: "mainnet",
      endpoint: clusterApiUrl("mainnet-beta"),
    });
  });

  it("supports a separate Mainnet RPC override", () => {
    expect(getSolanaNetworkConfig({
      network: "mainnet",
      devnetEndpoint: "https://devnet.example/rpc",
      mainnetEndpoint: "https://mainnet.example/rpc",
    })).toEqual({
      network: "mainnet",
      endpoint: "https://mainnet.example/rpc",
    });
  });

  it("rejects unknown network names", () => {
    expect(() => getSolanaNetworkConfig({ network: "testnet" })).toThrow(
      'Unsupported VITE_SOLANA_NETWORK "testnet". Expected "devnet" or "mainnet".',
    );
  });
});
