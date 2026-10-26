/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOLANA_NETWORK?: string;
  readonly VITE_SOLANA_DEVNET_NETWORK?: string;
  readonly VITE_SOLANA_MAINNET_NETWORK?: string;
}

declare module "*.webp" {
  const value: string;
  export default value;
}
