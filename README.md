# 🇧🇦 Zmajevi BiH - NFT Sticker Album

Welcome to the **Zmajevi BiH NFT Sticker Album**, an interactive web application that brings the classic football sticker collection experience into the Web3 era. Dedicated to the national team of Bosnia and Herzegovina ("Zmajevi"), this application lets fans open local demo packs, paste stickers into a virtual album, try local demo trades, and experiment with minting individual assets on Solana.

---

## 🚀 Features

* **Dual-Language Localization (`BS` / `EN`):** Fully localized interface supporting both Bosnian (Bosanski) and English.
* **Solana Sandbox & Wallet Integration:** Connects a Solflare wallet to the configured cluster and reads its real SOL balance; sandbox mode uses a mock balance.
* **Interactive Pack Opener:** Open local demo packs to find stickers. Purchases are not currently settled on-chain.
* **Virtual Pouch & Album Placement:** Manage duplicates in your pouch and dynamically "paste" stickers onto designated album pages.
* **Trade Market Demo:** Browse sample listings and simulate trades locally. On-chain listings, escrow, and settlement are not implemented.
* **Experimental NFT Minting:** Mint individual assets to the connected wallet; album inventory and sticker ownership are still local application state.
* **Audio FX Engine:** Native synthesizer sounds providing immediate audio feedback for pack openings, and successful trades.

---

## 🛠️ Architecture & Core Components

The codebase is built entirely with **React** and **TypeScript**, styled with **Tailwind CSS**, and optimized for deployment monitoring via Vercel Speed Insights.

* `SolflareWallet`: Connects through Wallet Adapter, checks RPC availability, and reads the wallet's native SOL balance.
* `AlbumPage`: Handles grid rendering of the 25-player album, visual completion tracking, and page progression.
* `PackOpener`: Manages the pseudorandom logic for distribution and state insertion for newly acquired assets.
* `TradeMarket`: Shows sample offers and simulates posting/acceptance locally in Sandbox Mode; it does not implement on-chain escrow.
* `CardDetail`: A multi-state modal ($600\text{px} \times 700\text{px}$) highlighting asset statistics, duplicate counts, and interaction pathways (Paste / Mint).


## ⚽ Default Starter Kit Seeding

To provide a fully alive ecosystem immediately upon onboarding, the app pre-populates state files for first-time visitors with:

* **Starting Collection:** Edin Džeko and Ermedin Demirović are pasted into the album, with two Dennis Hadžikadunić duplicates in the pouch.
* **Sample Market Offers:** Player sticker listings stored locally for the demo.

## Solana network setup

The wallet provider defaults to Devnet. Set `VITE_SOLANA_NETWORK=mainnet` only when intentionally using Mainnet; otherwise leave it unset or set it to `devnet`.

Use `VITE_SOLANA_DEVNET_NETWORK` to override the Devnet RPC URL. Mainnet has a separate `VITE_SOLANA_MAINNET_NETWORK` override, so a Devnet URL is never reused for Mainnet.

The wallet screen checks RPC availability and displays the connected network and current SOL balance. Pack purchases and trade escrow remain local demos; live-wallet pack and trade actions do not send SOL until an on-chain program and settlement flow are configured. Keep wallet keypairs and RPC credentials out of the browser bundle and Git.
