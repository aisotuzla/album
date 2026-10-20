# 🇧🇦 Zmajevi BiH - NFT Sticker Album

Welcome to the **Zmajevi BiH NFT Sticker Album**, an interactive web application that brings the classic football sticker collection experience into the Web3 era. Dedicated to the national team of Bosnia and Herzegovina ("Zmajevi"), this application allows fans and collectors to open digital sticker packs, paste them into a virtual album, trade duplicates with other collectors in a peer-to-peer (P2P) marketplace, and mint their collection on the Solana blockchain.

---

## 🚀 Features

* **Dual-Language Localization (`BS` / `EN`):** Fully localized interface supporting both Bosnian (Bosanski) and English.
* **Solana Sandbox & Wallet Integration:** Simulates real-world interaction with a Solflare wallet or utilizes an onboard sandbox environment initialized with $5.0\text{ SOL}$.
* **Interactive Pack Opener:** Purchase and rip open booster packs to find missing player stickers.
* **Virtual Pouch & Album Placement:** Manage duplicates in your pouch and dynamically "paste" stickers onto designated album pages.
* **P2P Trade Market:** A fully populated trading marketplace out of the box where collectors can post sticker-for-sticker trade proposals or sell premium assets directly for SOL.
* **Blockchain Minting Simulation:** Register and mint your completed digital collection directly to your connected public address.
* **Audio FX Engine:** Native synthesizer sounds providing immediate audio feedback for pack openings, and successful trades.

---

## 🛠️ Architecture & Core Components

The codebase is built entirely with **React** and **TypeScript**, styled with **Tailwind CSS**, and optimized for deployment monitoring via Vercel Speed Insights.

* `SolflareWallet`: Oversees authentication context, public address truncation, and simulated transactional native asset balances.
* `AlbumPage`: Handles grid rendering of the 25-player album, visual completion tracking, and page progression.
* `PackOpener`: Manages the pseudorandom logic for distribution and state insertion for newly acquired assets.
* `TradeMarket`: Implements filtering, structural posting schemas, and structural escrow deduction logic for peer-to-peer token transfers.
* `CardDetail`: A multi-state modal ($600\text{px} \times 700\text{px}$) highlighting asset statistics, duplicate counts, and interaction pathways (Paste / Mint).


## ⚽ Default Starter Kit Seeding

To provide a fully alive ecosystem immediately upon onboarding, the app pre-populates state files for first-time visitors with:

* **Starting Collection:** Edin Džeko and Ermedin Demirović are pasted into the album, with two Dennis Hadžikadunić duplicates in the pouch.
* **Live Market Offers:** Active player sticker listings from simulated local collectors.

