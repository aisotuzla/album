import React, { useState, useEffect } from "react";
import { BookOpen, Sparkles, Coins, ShoppingBag, ArrowLeftRight, Volume2, VolumeX, Award, HelpCircle, BadgeCheck, CheckCircle2, Star, Trophy, WalletCards, History } from "./icons";
import { Sticker, UserSticker, TradeOffer, WalletState, StickerType } from "./types";
import { STICKERS } from "./data/players";
import logoImage from "./components/zmajevi logo.webp";
import { UI_TRANSLATIONS, Language } from "./data/translations";
// Import custom sub-components
import SolflareWallet from "./components/SolflareWallet";
import AlbumPage from "./components/AlbumPage";
import PackOpener from "./components/PackOpener";
import TradeMarket from "./components/TradeMarket";
import CardDetail from "./components/CardDetail";

import HistoryPage from "./components/HistoryPage";

const stickerImages = import.meta.glob("./components/players/*.webp", { eager: true, query: "?url", import: "default" }) as Record<string, string>;

export default function App() {
  // --- STATE SYSTEM ---
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("zmajevi_lang_pref");
    return (saved as Language) || "BS";
  });

  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("zmajevi_lang_pref", newLang);
  };

  const [activeTab, setActiveTab] = useState<"album" | "wallet" | "pouch" | "packs" | "trades" | "history">("album");
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    publicKey: null,
    balance: 0,
  });

  const [collection, setCollection] = useState<UserSticker[]>([]);
  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [sandboxMode, setSandboxMode] = useState(false);
  const [mintedStickers, setMintedStickers] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("bosnia_wc26_minted_stickers");
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  const handleRegisterMint = (id: number) => {
    setMintedStickers(prev => {
      const updated = prev.includes(id) ? prev : [...prev, id];
      localStorage.setItem("bosnia_wc26_minted_stickers", JSON.stringify(updated));
      return updated;
    });
  };

  // --- INITIAL SEEDING ---
  useEffect(() => {
    // Load collection from localStorage
    const savedCollection = localStorage.getItem("bosnia_ sticker_collection_wc26");
    if (savedCollection) {
      setCollection((JSON.parse(savedCollection) as UserSticker[]).filter(record => STICKERS.some(sticker => sticker.id === record.stickerId)));
    } else {
      const initialSeed: UserSticker[] = [
        { stickerId: 9, count: 1, pasted: true }, // Edin Dzeko (pasted)
        { stickerId: 10, count: 1, pasted: true }, // Ermedin Demirovic (pasted)
        { stickerId: 14, count: 2, pasted: false }, // Hadzikadunic (2 unpasted duplicates)
      ];
      setCollection(initialSeed);
      localStorage.setItem("bosnia_ sticker_collection_wc26", JSON.stringify(initialSeed));
    }

    // Seed interactive trade offers to make the P2P center fully alive out of the box!
    const savedOffers = localStorage.getItem("bosnia_sticker_trades_wc26");
    if (savedOffers) {
      const validTradeOffers = (JSON.parse(savedOffers) as TradeOffer[]).filter(offer => (offer.offeredStickerId === -1 || STICKERS.some(sticker => sticker.id === offer.offeredStickerId)) && (offer.requestedStickerId === -1 || STICKERS.some(sticker => sticker.id === offer.requestedStickerId)));
      setTradeOffers(validTradeOffers);
      localStorage.setItem("bosnia_sticker_trades_wc26", JSON.stringify(validTradeOffers));
    } else {
      const liveOffers: TradeOffer[] = [
        {
          id: "tx-trd-hadziahmetovic-demirovic",
          ownerAddress: "SolfP2Pm88SarajevoXyZ",
          ownerName: "SarajevoCollector_99",
          offeredStickerId: 12, // Amir Hadziahmetovic
          requestedStickerId: 10, // Demirovic
          status: "OPEN",
          createdAt: Date.now() - 3600000,
        },

        {
          id: "tx-trd-bajraktarevic-tabakovic",
          ownerAddress: "SolfDiasporaBosnjak",
          ownerName: "BHFanatic_Tuzla",
          offeredStickerId: 11, // Esmir Bajraktarevic
          requestedStickerId: 21, // Haris Tabakovic
          status: "OPEN",
          createdAt: Date.now() - 200000,
        },
        {
          id: "tx-trd-dedic-kolasinac",
          ownerAddress: "SolfSalzburgFanatic",
          ownerName: "Amar_D_Zmaj",
          offeredStickerId: 5, // Amar Dedic
          requestedStickerId: 3, // Kolasinac
          status: "OPEN",
          createdAt: Date.now() - 50000,
        }
      ];
      setTradeOffers(liveOffers);
      localStorage.setItem("bosnia_sticker_trades_wc26", JSON.stringify(liveOffers));
    }
  }, []);

  // Save collection changes
  const saveCollection = (newColl: UserSticker[]) => {
    setCollection(newColl);
    localStorage.setItem("bosnia_ sticker_collection_wc26", JSON.stringify(newColl));
  };

  // --- AUDIO SYNTHESIZER ENGINE (Immersive Arena Sounds & Effects) ---

  // --- STICKER INTERACTIONS ---
  const handleAddStickers = (ids: number[]) => {
    const updated = [...collection];
    ids.forEach(id => {
      const existing = updated.find(r => r.stickerId === id);
      if (existing) {
        existing.count += 1;
      } else {
        updated.push({ stickerId: id, count: 1, pasted: false });
      }
    });
    saveCollection(updated);
  };

  const handlePasteStickerInAlbum = (id: number) => {
    const updated = [...collection];
    const target = updated.find(r => r.stickerId === id);
    if (target && target.count > 0 && !target.pasted) {
      target.pasted = true;
      target.count -= 1; // deduct sticker from pouch when pasting


      saveCollection(updated);
      setSelectedSticker(null); // Close detail view upon mounting success

      // Flash a little custom feedback
      alert(`Success! Mounted ${STICKERS.find(s => s.id === id)?.name} onto page slot successfully.`);
    }
  };

  const handleTradeCompleted = (offeredId: number, requestedId: number, solPrice?: number) => {
    const updated = [...collection];

    // Deduct offered or requested card
    if (offeredId !== -1) {
      const offeredRecord = updated.find(r => r.stickerId === offeredId);
      if (offeredRecord) {
        offeredRecord.count = Math.max(0, offeredRecord.count - 1);
      }
    }

    // Add received card
    if (requestedId !== -1) {
      const requestedRecord = updated.find(r => r.stickerId === requestedId);
      if (requestedRecord) {
        requestedRecord.count += 1;
      } else {
        updated.push({ stickerId: requestedId, count: 1, pasted: false });
      }
    }

    // If we received SOL for listing ourselves
    if (solPrice && offeredId === -1) {
      setWallet(prev => ({
        ...prev,
        balance: Number((prev.balance + solPrice).toFixed(2)),
      }));
    }

    saveCollection(updated);
  };

  const handleSelfTradePosted = (offer: TradeOffer) => {
    const updatedOffers = [offer, ...tradeOffers];
    setTradeOffers(updatedOffers);
    localStorage.setItem("bosnia_sticker_trades_wc26", JSON.stringify(updatedOffers));
  };

  const handleRemoveTradeOffer = (id: string) => {
    const targetOffer = tradeOffers.find(o => o.id === id);
    if (targetOffer && targetOffer.ownerAddress === wallet.publicKey) {
      // Re-add offered sticker back to user pouch since they cancelled
      const updated = [...collection];
      const record = updated.find(r => r.stickerId === targetOffer.offeredStickerId);
      if (record) {
        record.count += 1;
      } else {
        updated.push({ stickerId: targetOffer.offeredStickerId, count: 1, pasted: false });
      }
      saveCollection(updated);
    }

    const filtered = tradeOffers.filter(o => o.id !== id);
    setTradeOffers(filtered);
    localStorage.setItem("bosnia_sticker_trades_wc26", JSON.stringify(filtered));
  };

  // Helper selectors
  const pastedCount = collection.filter(c => c.pasted).length;
  const pouchList = collection.filter(c => c.count > 0 && !c.pasted);

  return (
    <div className="min-h-screen album-container text-[#1a1a1a] selection:bg-[#FFCD00] selection:text-[#002F6C] pb-28 font-sans">

      {/* Immersive Stadium Top Ambient Ribbon */}
      <div className="bg-gradient-to-r from-[#002F6C] via-[#FFCD00] to-[#002F6C] h-1.5 w-full shadow-md shrink-0" />

      {/* Main Navbar */}
      <header className="mx-auto flex w-full max-w-[450px] flex-row items-center justify-between gap-2 border-b border-[#002F6C]/20 px-3 py-2.5 mb-2">

        {/* Logo / Mascot brand */}
        <div className="flex min-w-0 flex-1 items-center gap-2 text-left">
          <img src={logoImage} alt="Zmajevi BIH Logo" className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16" referrerPolicy="no-referrer" />
          <div className="min-w-0">
            <h1 className="truncate font-sans text-[10px] font-black uppercase leading-tight tracking-tight text-[#002F6C] sm:text-xs">
              {UI_TRANSLATIONS[lang].title}
            </h1>
            <p className="hidden truncate text-[9px] italic text-gray-600 min-[440px]:block">
              {UI_TRANSLATIONS[lang].subtitle}
            </p>
          </div>
        </div>

        {/* Dynamic Sound Synthesizer & Solflare stats */}
        <div className="flex shrink-0 items-center justify-end gap-1.5 select-none">

          {/* Language Switcher Pill */}
          <div className="flex bg-white/80 border border-gray-300 rounded-lg p-0.5 shadow-sm shrink-0">
            <button
              id="lang-switch-bs"
              onClick={() => handleLangChange("BS")}
              className={`px-2 py-1.2 rounded-md text-xs font-sans font-black transition-all cursor-pointer ${lang === "BS"
                ? "bg-[#002F6C] text-white shadow"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
                }`}
            >
              BS
            </button>
            <button
              id="lang-switch-en"
              onClick={() => handleLangChange("EN")}
              className={`px-2 py-1.2 rounded-md text-xs font-sans font-black transition-all cursor-pointer ${lang === "EN"
                ? "bg-[#002F6C] text-white shadow"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
                }`}
            >
              EN
            </button>
          </div>


          {wallet.connected ? (
            <div className="bg-white border border-gray-300 px-4 py-1 rounded-lg text-left hidden sm:block shadow-sm shrink-0">
              <span className="text-[9px] font-sans font-bold text-gray-400 block uppercase leading-none">{UI_TRANSLATIONS[lang].connectedAddress}:</span>
              <span className="text-xs font-mono text-[#002F6C] font-black">
                {wallet.publicKey?.substring(0, 6)}...{wallet.publicKey?.substring(wallet.publicKey.length - 6)}
              </span>
            </div>
          ) : (
            <div className="text-right hidden sm:block shrink-0">
              <span className="text-xs font-sans font-bold tracking-widest text-[#002F6C]/60 uppercase">{UI_TRANSLATIONS[lang].walletOffline}</span>
            </div>
          )}

        </div>
      </header>

      <main className="mx-auto w-full max-w-[450px] px-3 py-2">
        {activeTab === "album" && <div className="space-y-4">
          <AlbumPage collection={collection} onViewSticker={setSelectedSticker} pastedCount={pastedCount} lang={lang}  />
          <section className="rounded-2xl border border-transparent bg-transparent p-2 text-left shadow-none">
            <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3"><div><h2 className="text-sm font-black uppercase tracking-wide text-[#002F6C]">{UI_TRANSLATIONS[lang].pouchTitle}</h2><p className="text-xs text-gray-500">{lang === "BS" ? "Nezalijepljene slicice spremne za album" : "Unpasted stickers ready for your album"}</p></div><span className="rounded-full bg-[#002F6C] px-2.5 py-1 text-xs font-bold text-white">{pouchList.reduce((sum, item) => sum + item.count, 0)}</span></div>
            {pouchList.length ? <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">{pouchList.map((item) => { const sticker = STICKERS.find((s) => s.id === item.stickerId); if (!sticker) return null; const fullName = sticker.imageFile; const smallName = fullName?.replace(/\.webp$/i, "-small.webp"); const smallImage = smallName ? stickerImages[`./components/players/${smallName}`] : undefined; const fullImage = fullName ? stickerImages[`./components/players/${fullName}`] : undefined; return <button key={sticker.id} onClick={() => setSelectedSticker(sticker)} className="relative flex min-w-0 flex-col items-center rounded-xl border border-gray-200 bg-[#fdfcf7] p-2 text-center shadow-sm transition hover:border-[#002F6C] hover:shadow-md"><span className="absolute left-2 top-2 z-10 rounded bg-white/90 px-1.5 py-0.5 font-mono text-[9px] font-bold text-gray-500">{sticker.number}</span>{(smallImage || fullImage) && <img src={smallImage ?? fullImage} alt={sticker.name} className="h-24 w-full rounded-lg object-contain sm:h-32" loading="lazy"/>}<span className="mt-2 w-full truncate text-[11px] font-extrabold text-[#002F6C]">{sticker.name}</span>{item.count > 1 && <span className="absolute -right-1 -top-1 rounded-full border-2 border-white bg-[#FFCD00] px-1.5 py-0.5 text-[10px] font-black text-[#002F6C]">×{item.count}</span>}</button>; })}</div> : <p className="py-8 text-center text-sm italic text-gray-500">{UI_TRANSLATIONS[lang].pouchEmpty}</p>}
          </section>
        </div>}
        {activeTab === "wallet" && <div className="mx-auto max-w-xl pt-6"><SolflareWallet wallet={wallet} onWalletChange={setWallet} lang={lang} sandboxMode={sandboxMode} onToggleSandbox={() => { if (sandboxMode) { setSandboxMode(false); setWallet({ connected: false, publicKey: null, balance: 0 }); } else { setSandboxMode(true); setWallet({ connected: true, publicKey: "SANDBOX...WALLET", balance: 10.0 }); } }} /></div>}
        {activeTab === "pouch" && <section className="mx-auto max-w-3xl rounded-2xl bg-white p-5"><h2 className="mb-4 text-lg font-black uppercase text-[#002F6C]">{UI_TRANSLATIONS[lang].pouchTitle}</h2><p>{lang === "BS" ? "Za pregled i lijepljenje slicica otvorite album." : "Open the album to view and place stickers."}</p><button onClick={() => setActiveTab("album")} className="mt-4 rounded-lg bg-[#002F6C] px-4 py-2 font-bold text-white">{UI_TRANSLATIONS[lang].tabAlbum}</button></section>}
        {activeTab === "packs" && <PackOpener wallet={wallet} onWalletChange={setWallet} onAddStickers={handleAddStickers} onViewSticker={setSelectedSticker} lang={lang} sandboxMode={sandboxMode} />}
        {activeTab === "trades" && <TradeMarket wallet={wallet} onWalletChange={setWallet} collection={collection} onTradeCompleted={handleTradeCompleted} onSelfTradePosted={handleSelfTradePosted} tradeOffers={tradeOffers} onRemoveTradeOffer={handleRemoveTradeOffer} lang={lang} sandboxMode={sandboxMode} />}
        {activeTab === "history" && <HistoryPage lang={lang} />}
      </main>
      <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-white/20 bg-[#071b3a]/95 px-1 pb-[env(safe-area-inset-bottom)] pt-1.5 text-white shadow-[0_-8px_30px_rgba(0,0,0,0.25)] backdrop-blur-lg"><div className="mx-auto grid max-w-[450px] grid-cols-5 gap-1">{([{ id: "album", label: "Album", icon: BookOpen }, { id: "wallet", label: lang === "BS" ? "Novčanik" : "Wallet", icon: WalletCards }, { id: "packs", label: lang === "BS" ? "Paketi" : "Packs", icon: ShoppingBag }, { id: "history", label: lang === "BS" ? "Historija" : "History", icon: History }, { id: "trades", label: lang === "BS" ? "Tržište" : "Market", icon: ArrowLeftRight }] as const).map(({ id, label, icon: Icon }) => <button key={id} aria-current={activeTab === id ? "page" : undefined} onClick={() => setActiveTab(id)} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[9px] font-extrabold uppercase tracking-wide transition ${activeTab === id ? "bg-[#FFCD00] text-[#002F6C]" : "text-white/75 hover:bg-white/10 hover:text-white"}`}><Icon className="h-5 w-5"/><span>{label}</span></button>)}</div></nav>
      {/* ================= 600px x 700px DETAILED STICKER MODAL ================= */}
      {selectedSticker && (
        <CardDetail
          sticker={selectedSticker}
          userSticker={collection.find(c => c.stickerId === selectedSticker.id)}
          onClose={() => setSelectedSticker(null)}
          onPaste={handlePasteStickerInAlbum}
          walletConnected={wallet.connected}
          lang={lang}
          mintedStickers={mintedStickers}
          onMintSticker={handleRegisterMint}
          sandboxMode={sandboxMode}
        />
      )}

      {/* ================= IN-APP WELCOME INSTRUCTIONS ONBOARDING ================= */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-sm">
          <div className="bg-[#fffef8] border-2 border-[#00f0ff] rounded-3xl p-6 md:p-8 max-w-lg w-full text-center space-y-6 shadow-[0_0_25px_rgba(0,240,255,0.7)] text-gray-800">
            <img src={logoImage} alt="Zmajevi Logo" className="mx-auto h-24 w-24 object-contain" referrerPolicy="no-referrer" />

            <div className="space-y-2">
              <span className="text-[10px] font-sans font-bold text-gray-400 tracking-[0.3em] uppercase block">
                {UI_TRANSLATIONS[lang].welcomeTitle}
              </span>
              <h2 className="text-3xl font-sans font-black tracking-tight text-[#002F6C] uppercase leading-none">
                {UI_TRANSLATIONS[lang].welcomeHeader}
              </h2>
              <div className="h-0.5 w-1/3 bg-[#FFCD00] mx-auto" />
            </div>

            <div className="text-gray-750 text-sm leading-relaxed space-y-3 font-serif">
              <p>
                {UI_TRANSLATIONS[lang].welcomeText1}<strong>5.0 Simulated SOL</strong>{UI_TRANSLATIONS[lang].welcomeText2}<strong>4 starting stickers</strong>{UI_TRANSLATIONS[lang].welcomeText3}
              </p>
              <ul className="text-left bg-white border border-gray-300 p-4 rounded-xl space-y-2 text-xs font-sans list-none">
                <li className="flex items-center space-x-2 text-gray-800">
                  <BadgeCheck className="h-4.5 w-4.5 text-[#002F6C] shrink-0" />
                  <span>{UI_TRANSLATIONS[lang].starterKit1}</span>
                </li>
                <li className="flex items-center space-x-2 text-gray-800">
                  <BadgeCheck className="h-4.5 w-4.5 text-[#002F6C] shrink-0" />
                  <span>{UI_TRANSLATIONS[lang].starterKit2}</span>
                </li>
                <li className="flex items-center space-x-2 text-gray-800">
                  <BadgeCheck className="h-4.5 w-4.5 text-[#002F6C] shrink-0" />
                  <span>{UI_TRANSLATIONS[lang].starterKit3}</span>
                </li>
              </ul>
            </div>

            <button
              id="btn-confirm-welcome-onboard"
              onClick={() => {
                setShowWelcome(false);
              }}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black tracking-wide text-sm transition shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer font-sans"
            >
              {UI_TRANSLATIONS[lang].starterKitButton}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
