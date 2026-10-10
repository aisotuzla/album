# Copilot Instructions - Zmajevi BiH NFT Sticker Album

Welcome to the Zmajevi BiH NFT Sticker Album codebase! This file provides guidance to help Copilot sessions work effectively with this project.

## Build, Test, and Lint Commands

The project uses **Vite** + **React** + **TypeScript** with **Vitest** for testing.

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server at `http://localhost:3000` (host: 0.0.0.0) |
| `npm run build` | Build production bundle with Vite |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run TypeScript type checking (`tsc --noEmit`) |
| `npm test` | Run Vitest test suite (currently no test files exist) |

**Running a single test:**
```bash
npx vitest run --reporter=verbose
```

**Running tests in watch mode:**
```bash
npx vitest
```

*Note: Vitest is installed as a dev dependency (`vitest@^4.1.8`). No test files (`.test.ts` or `.spec.ts`) currently exist in the codebase. The lint command (`tsc --noEmit`) is the primary quality gate. Tests can be added under `src/**/*.test.ts` or `src/**/*.spec.ts` and run with Vitest.*

## High-Level Architecture

This is a **React + TypeScript** application styled with **Tailwind CSS** that simulates a football sticker album collection with Solana blockchain integration.

### Core Structure

```text
src/
├── App.tsx           - Root component with error boundary + Solana wallet providers
├── main.tsx          - Application entry point with RootErrorBoundary
├── index.css         - Global Tailwind imports and custom animations
├── types.ts          - Shared TypeScript interfaces (PlayerStats, Sticker, TradeOffer, WalletState)
├── components/       - React UI components
│   ├── AlbumPage.tsx     - 29-sticker album grid with completion tracking
│   ├── HistoryPage.tsx   - National team qualification history & stats
│   ├── CardDetail.tsx    - Multi-state modal (600px × 700px) for asset stats
│   ├── TradeMarket.tsx   - P2P marketplace for sticker trades
│   ├── PackOpener.tsx    - Booster pack opening with pseudorandom distribution
│   └── SolflareWallet.tsx - Solflare wallet connection & balance display
├── data/             - Application data and constants
│   ├── players.ts        - Player/sticker data (29 players with stats)
│   ├── qualificationHistory.ts - Bosnia-Herzegovina World Cup qualification data
│   └── translations.ts   - BS / EN localization strings
├── polyfills.ts       - Node.js polyfills for browser environment (Buffer, process, globalThis)
└── vite-env.d.ts      - TypeScript environment declarations
```

### Key Flows

1. **Wallet Connection** (`main.tsx` → `SolflareWallet`): Users connect via Solflare wallet on Devnet or Mainnet. Sandbox mode enables testing without a real wallet ($5.0 SOL$ starter balance).

2. **Album Completion** (`AlbumPage.tsx`): 29 player stickers to collect. Duplicates go into the pouch. Completed stickers "paste" onto album pages.

3. **Pack Opening** (`PackOpener.tsx`): Purchase and open booster packs. Randomly distributes 5 stickers from the player pool. Triggers audio FX feedback.

4. **Trade Market** (`TradeMarket.tsx`): P2P marketplace where collectors post trade proposals or sell assets for SOL. Implements filtering and escrow deduction logic.

5. **Card Detail** (`CardDetail.tsx`): Modal dialog (600px × 700px) showing asset statistics, duplicate counts, and interaction pathways (Paste / Mint).

6. **Error Handling**: `RootErrorBoundary` class in `main.tsx`/`App.tsx` catches rendering errors and displays a fallback UI with "Clear Stored Data & Reload" action.

### State Management

- **Wallet state** flows from `SolflareWallet` component → `onWalletChange` callback → updates connected wallet address, balance, and network status
- **Album state** managed locally within each component (AlbumPage, PackOpener, TradeMarket)
- **Language** (`BS`/`EN`) toggles all UI text via `translations.ts` `UI_TRANSLATIONS` object

## Key Conventions

### 1. Dual-Language Localization (`BS` / `EN`)
All user-facing text is localized via `src/data/translations.ts`. The `Language` type is `"BS"` or `"EN"`. The `UI_TRANSLATIONS` object maps languages to text strings. Components receive `lang` as a prop and use the `t` function (`UI_TRANSLATIONS[lang]`) for all labels and messages.

**Pattern:**
```tsx
const t = UI_TRANSLATIONS[lang];
<div>{t.someKey}</div>
```

### 2. Solana Wallet with Sandbox Mode
The wallet component (`SolflareWallet.tsx`) supports two modes:
- **Sandbox mode**: Enables instant testing with mock balances ($5.0 SOL$) and no real wallet connection
- **Live mode**: Real Solflare wallet connection on Devnet or Mainnet

**Pattern:**
```tsx
const sandboxMode = true; // or false
// Wallet UI changes based on this flag
```

### 3. Player/Sticker Data Structure
Player data lives in `src/data/players.ts` with 29 players. Each player has:
- `id`: Number (1-29)
- `number`: Jersey number string
- `name`: Player name
- `role`: Position (ST, CM, CB, GK, or special classification)
- `club`: Club name
- `birthDate`: ISO date string
- `height`: Height string
- `biography`: Player biography
- `stats`: `PlayerStats` object (overall, pace, shooting, passing, dribbling, defending, physicality) — **null for special collections**
- `type`: `StickerType` (STANDARD or SPECIAL)
- `imageTheme`: Color scheme gradient class name
- `imageFile`: Optional filename in `src/components/players/`

**Pattern for accessing player data:**
```tsx
import { players } from '../data/players';
// Access: players[0].name, players[0].stats!.overall, etc.
```

### 4. Tailwind CSS Styling Conventions
- Prefix utility classes with component-specific prefixes where needed
- Use `font-sans`/`font-serif` for font family variants
- Color palette: `#002F6C` (primary dark blue), `#FFCD00` (gold/amber), `#14F195` (emerald green), `#9945FF` (purple)
- Custom keyframe animations defined in `src/index.css` (e.g., `spin-slow`, `bounce-slow`)

### 5. Error Boundary Pattern
Components are wrapped with `RootErrorBoundary` (in `main.tsx`). When an error occurs:
- UI shows error message with stack trace (hidden in production)
- "Clear Stored Data & Reload" button clears `localStorage` and refreshes the page
- Error state is tracked in component state, not thrown

### 6. Component Naming & Structure
- PascalCase for component filenames and exports (e.g., `AlbumPage.tsx`, `SolflareWallet.tsx`)
- Functional components with hooks (no class components outside `RootErrorBoundary`)
- Interface definitions in `src/types.ts` for shared types
- Data imports from `src/data/` directory

### 7. Environment Variables
- `VITE_SOLANA_NETWORK`: `"devnet"` or `"mainnet"` (defaults to devnet)
- `VITE_SOLANA_DEVNET_NETWORK`: Custom devnet URL override (used when `VITE_SOLANA_NETWORK === "mainnet"`)

## What to Avoid

- Don't add new React class components — use functional components with hooks instead
- Don't modify the error boundary pattern unless replacing the entire `RootErrorBoundary`
- Don't remove the dual-language localization — it's core to the app's design
- Don't change the Tailwind color palette without updating `src/index.css` globals
- Don't add player data without updating both `players.ts` and the corresponding player image in `src/components/players/`
- Don't forget to add polyfills when accessing Node.js globals in browser environment (see `polyfills.ts`)

---
*Generated for the Zmajevi BiH NFT Sticker Album project. This file should be updated as the codebase evolves.*

## High-Level Architecture

This is a **React + TypeScript** application styled with **Tailwind CSS** that simulates a football sticker album collection with Solana blockchain integration.

### Core Structure

```
src/
├── App.tsx           - Root component with error boundary + Solana wallet providers
├── main.tsx          - Application entry point with RootErrorBoundary
├── index.css         - Global Tailwind imports and custom animations
├── types.ts          - Shared TypeScript interfaces (PlayerStats, Sticker, TradeOffer, WalletState)
├── components/       - React UI components
│   ├── AlbumPage.tsx     - 29-sticker album grid with completion tracking
│   ├── HistoryPage.tsx   - National team qualification history & stats
│   ├── CardDetail.tsx    - Multi-state modal (600px × 700px) for asset stats
│   ├── TradeMarket.tsx   - P2P marketplace for sticker trades
│   ├── PackOpener.tsx    - Booster pack opening with pseudorandom distribution
│   └── SolflareWallet.tsx - Solflare wallet connection & balance display
├── data/             - Application data and constants
│   ├── players.ts        - Player/sticker data (29 players with stats)
│   ├── qualificationHistory.ts - Bosnia-Herzegovina World Cup qualification data
│   └── translations.ts   - BS / EN localization strings
└── polyfills.ts       - Node.js polyfills for browser environment (Buffer, process, globalThis)
```

### Key Flows

1. **Wallet Connection** (`main.tsx` → `SolflareWallet`): Users connect via Solflare wallet on Devnet or Mainnet. Sandbox mode enables testing without a real wallet ($5.0 SOL$ starter balance).

2. **Album Completion** (`AlbumPage.tsx`): 29 player stickers to collect. Duplicates go into the pouch. Completed stickers "paste" onto album pages.

3. **Pack Opening** (`PackOpener.tsx`): Purchase and open booster packs. Randomly distributes 5 stickers from the player pool. Triggers audio FX feedback.

4. **Trade Market** (`TradeMarket.tsx`): P2P marketplace where collectors post trade proposals or sell assets for SOL. Implements filtering and escrow deduction logic.

5. **Card Detail** (`CardDetail.tsx`): Modal dialog (600px × 700px) showing asset statistics, duplicate counts, and interaction pathways (Paste / Mint).

6. **Error Handling**: `RootErrorBoundary` class in `main.tsx`/`App.tsx` catches rendering errors and displays a fallback UI with "Clear Stored Data & Reload" action.

### State Management

- **Wallet state** flows from `SolflareWallet` component → `onWalletChange` callback → updates connected wallet address, balance, and network status
- **Album state** managed locally within each component (AlbumPage, PackOpener, TradeMarket)
- **Language** (`BS`/`EN`) toggles all UI text via `translations.ts` `UI_TRANSLATIONS` object

### Solana Integration

- **Devnet**: Default sandbox environment with $5.0 SOL$ starter balance for testing
- **Mainnet**: Production Solana network when `VITE_SOLANA_NETWORK=mainnet`
- **Wallet adapters**: `@solana/wallet-adapter-react` with Solflare as the default wallet
- **Programs**: Metaplex collection minting, pack creation, and trade escrow

## Key Conventions

### 1. Dual-Language Localization (`BS` / `EN`)
All user-facing text is localized via `src/data/translations.ts`. The `Language` type is `"BS"` or `"EN"`. The `UI_TRANSLATIONS` object maps languages to text strings. Components receive `lang` as a prop and use the `t` function (`UI_TRANSLATIONS[lang]`) for all labels and messages.

**Pattern:**
```tsx
const t = UI_TRANSLATIONS[lang];
<div>{t.someKey}</div>
```

### 2. Solana Wallet with Sandbox Mode
The wallet component (`SolflareWallet.tsx`) supports two modes:
- **Sandbox mode**: Enables instant testing with mock balances ($5.0 SOL$) and no real wallet connection
- **Live mode**: Real Solflare wallet connection on Devnet or Mainnet

**Pattern:**
```tsx
const sandboxMode = true; // or false
// Wallet UI changes based on this flag
```

### 3. Player/Sticker Data Structure
Player data lives in `src/data/players.ts` with 29 players. Each player has:
- `id`: Number (1-29)
- `number`: Jersey number string
- `name`: Player name
- `role`: Position (ST, CM, CB, GK, or special)
- `club`: Club name
- `birthDate`: ISO date string
- `height`: Height string
- `biography`: Player biography
- `stats`: `PlayerStats` object (overall, pace, shooting, passing, dribbling, defending, physicality) — **null for special collections**
- `type`: `StickerType` (STANDARD or SPECIAL)
- `imageTheme`: Color scheme gradient class name
- `imageFile`: Optional filename in `src/components/players/`

**Pattern for accessing player data:**
```tsx
import { players } from '../data/players';
// Access: players[0].name, players[0].stats!.overall, etc.
```

### 4. Tailwind CSS Styling Conventions
- Prefix utility classes with component-specific prefixes where needed
- Use `font-sans`/`font-serif` for font family variants
- Color palette: `#002F6C` (primary dark blue), `#FFCD00` (gold/amber), `#14F195` (emerald green), `#9945FF` (purple)
- Custom keyframe animations defined in `src/index.css` (e.g., `spin-slow`, `bounce-slow`)

### 5. Error Boundary Pattern
Components are wrapped with `RootErrorBoundary` (in `main.tsx`). When an error occurs:
- UI shows error message with stack trace (hidden in production)
- "Clear Stored Data & Reload" button clears `localStorage` and refreshes the page
- Error state is tracked in component state, not thrown

### 6. Component Naming & Structure
- PascalCase for component filenames and exports (e.g., `AlbumPage.tsx`, `SolflareWallet.tsx`)
- Functional components with hooks (no class components outside `RootErrorBoundary`)
- Interface definitions in `src/types.ts` for shared types
- Data imports from `src/data/` directory

### 7. Environment Variables
- `VITE_SOLANA_NETWORK`: `"devnet"` or `"mainnet"` (defaults to devnet)
- `VITE_SOLANA_DEVNET_NETWORK`: Custom devnet URL override
- `VITE_SOLANA_DEVNET_NETWORK` used when `VITE_SOLANA_NETWORK === "mainnet"`

## What to Avoid

- Don't add new React class components — use functional components with hooks instead
- Don't modify the error boundary pattern unless replacing the entire `RootErrorBoundary`
- Don't remove the dual-language localization — it's core to the app's design
- Don't change the Tailwind color palette without updating `src/index.css` globals
- Don't add player data without updating both `players.ts` and the corresponding player image in `src/components/players/`

---
*Generated for the Zmajevi BiH NFT Sticker Album project. This file should be updated as the codebase evolves.*