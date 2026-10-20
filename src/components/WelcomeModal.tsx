import React from "react";
import { Language } from "../types";
import { UI_TRANSLATIONS } from "../data/translations";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  sandboxMode: boolean;
  onSandboxToggle: (enabled: boolean) => void;
}

export default function WelcomeModal({
  isOpen,
  onClose,
  lang,
  sandboxMode,
  onSandboxToggle,
}: WelcomeModalProps) {
  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-lg bg-card rounded-3xl border border-gold/30 p-6 md:p-8 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
      >
        {/* Logo */}
        <div className="w-24 h-24 mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-navy/20 rounded-full blur-xl animate-pulse"></div>
          <img
            src="/src/components/zmajevi logo.webp"
            alt="Zmajevi BiH Logo"
            className="relative w-full h-full object-contain rounded-full border-4 border-gold/30"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Title */}
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-gold/10 border border-gold/30 rounded-full text-xs font-sans font-bold text-gold uppercase tracking-wider mb-3">
            {t.welcomeBadge || "Welcome Collectors"}
          </span>
          <h2 id="welcome-title" className="font-sans font-black text-3xl md:text-4xl text-primary uppercase tracking-tight leading-none mb-3">
            {t.welcomeHeader || "Zmajevi BiH NFT Album"}
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-navy via-gold to-navy mx-auto"></div>
        </div>

        {/* Description */}
        <div className="text-secondary text-base leading-relaxed font-serif mb-6 space-y-3">
          <p>
            {t.welcomeText1 || "Collect the complete squad of Bosnia & Herzegovina's World Cup 2026 heroes."}
          </p>
          <p>
            <strong>{t.welcomeText2 || "Open booster packs"}</strong> {t.welcomeText3 || "to discover players, legends, and special foil cards."}
          </p>
        </div>

        {/* Starter Kit */}
        <div className="bg-tertiary/50 border border-border-subtle rounded-2xl p-5 mb-6 text-left">
          <h3 className="font-sans font-bold text-sm text-gold uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            {t.starterKit || "Your Starter Kit"}
          </h3>
          <ul className="space-y-3">
            {[
              { icon: "🎴", text: t.starterKit1 || "4 legendary stickers pre-pasted in your album" },
              { icon: "💰", text: sandboxMode ? t.starterKit2Sandbox || "10.0 simulated SOL for testing" : t.starterKit2 || "Connect wallet to start collecting" },
              { icon: "📦", text: t.starterKit3 || "Open packs, complete the album, earn rewards" },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-secondary">
                <span className="text-xl shrink-0">{item.icon}</span>
                <span className="font-serif leading-relaxed">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sandbox Toggle */}
        <label className="flex items-center justify-center gap-3 p-3 bg-navy/30 border border-navy/30 rounded-xl cursor-pointer mb-6 transition-fast hover:bg-navy/50">
          <input
            type="checkbox"
            checked={sandboxMode}
            onChange={(e) => onSandboxToggle(e.target.checked)}
            className="w-5 h-5 accent-gold rounded border-border-default bg-tertiary focus:ring-2 focus:ring-gold"
          />
          <span className="font-sans font-medium text-sm text-primary">
            {sandboxMode 
              ? (t.disableSandbox || "Disable Sandbox Mode") 
              : (t.enableSandbox || "Enable Sandbox Mode (Free 10 SOL for testing)")}
          </span>
        </label>

        {/* Enter Button */}
        <button
          onClick={onClose}
          className="btn btn-gold btn-full btn-lg py-4 text-base font-black tracking-wider"
        >
          {t.enterAlbum || "Enter the Album"}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>

        {/* Footer */}
        <p className="text-xs text-muted mt-6 font-serif">
          {t.footerText || "Zmajevi BiH NFT Sticker Album · World Cup 2026 Collection"}
        </p>
      </div>
    </div>
  );
}