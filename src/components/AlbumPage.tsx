import React, { useState } from "react";
import { BookOpen, Star, ChevronLeft, ChevronRight } from "../icons";
import { Sticker, StickerType, UserSticker } from "../types";
import { STICKERS } from "../data/players";
import logoImage from "./zmajevi logo.webp";
import albumCoverImg from "./Album405.webp";
import rewardGoldenCrestImg from "./RewardGoldenCrest.webp";
import { Language, UI_TRANSLATIONS, PLAYER_TRANSLATIONS } from "../data/translations";

// Import all uploaded player photos in WebP format
import dzekoImg from "./players/edin-dzeko.webp";
import demirovicImg from "./players/ermedin-Demirovic.webp";
import dedicImg from "./players/amar-dedic.webp";
import tahirovicImg from "./players/benjamin-tahirovic.webp";
import burnicImg from "./players/denis-burnic.webp";
import memicImg from "./players/amer-memic.webp";
import hadziahmetovicImg from "./players/amir-hadziahmetovic.webp";
import alajbegovicImg from "./players/kenan-alajbegovic.webp";
import bazdarImg from "./players/samed-bazdar.webp";
import radeljicImg from "./players/stjepan-radeljic.webp";
import gigovicImg from "./players/gigovic.webp";
import muharemovicImg from "./players/muharemovic.webp";
import basicImg from "./players/ivan-basic.webp";
import mujakicImg from "./players/mujakic.webp";

import vasiljImg from "./players/nikola-vasilj.webp";
import kolasinacImg from "./players/sead-kolasinac.webp";
import katicImg from "./players/nikola-katic.webp";
import hadzikadunicImg from "./players/hadzikadunic.webp";
import zlomislicImg from "./players/zlomislic.webp";
import bajraktarevicImg from "./players/esmir-bajraktarevic.webp";
import tabakovicImg from "./players/haris.tabakovicpng.webp";
import malicImg from "./players/malic.webp";
import sunjicImg from "./players/sunjic.webp";
import husejinbasicImg from "./players/husejinbasic.webp";
import mahmicImg from "./players/mahmic.webp";
import lukicImg from "./players/lukic.webp";

const PRIMARY_IPFS_CID = "bafybeiagaakoykbdpfi2u6qvm7uaijzirgrvat5xvuowwn63ceq5mvjmru";
const BACKUP_IPFS_CID = "bafybeias3nraryezim72augovtpuful6iuriemqux5qrnyw5gl3buh5aua";
const PLAYER_FALLBACK_IPFS_CID = "bafybeigu6pd4t72n7dskbn5wpk5pphf2566xixx5fugw3xhc3cyt44tumy";
const PRIMARY_IPFS_BASE = `https://black-known-amphibian-995.mypinata.cloud/ipfs/${PRIMARY_IPFS_CID}/components`;
const BACKUP_IPFS_BASE = `https://${PRIMARY_IPFS_CID}.ipfs.dweb.link/components`;
const PLAYER_FALLBACK_IPFS_BASE = `https://gateway.pinata.cloud/ipfs/${PLAYER_FALLBACK_IPFS_CID}/components`;


const playerImageMap: Record<string, string> = {
  "edin-dzeko.webp": dzekoImg,
  "ermedin-Demirovic.webp": demirovicImg,
  "amar-dedic.webp": dedicImg,
  "benjamin-tahirovic.webp": tahirovicImg,
  "denis-burnic.webp": burnicImg,
  "amer-memic.webp": memicImg,
  "amir-hadziahmetovic.webp": hadziahmetovicImg,
  "kenan-alajbegovic.webp": alajbegovicImg,
  "samed-bazdar.webp": bazdarImg,
  "stjepan-radeljic.webp": radeljicImg,
  "gigovic.webp": gigovicImg,
  "Gigovic.webp": gigovicImg,
  "muharemovic.webp": muharemovicImg,
  "Muharemovic.webp": muharemovicImg,
  "ivan-basic.webp": basicImg,


  "mujakic.webp": mujakicImg,
  "nikola-vasilj.webp": vasiljImg,
  "sead-kolasinac.webp": kolasinacImg,
  "nikola-katic.webp": katicImg,
  "hadzikadunic.webp": hadzikadunicImg,
  "zlomislic.webp": zlomislicImg,
  "esmir-bajraktarevic.webp": bajraktarevicImg,
  "haris.tabakovicpng.webp": tabakovicImg,
  "malic.webp": malicImg,
  "sunjic.webp": sunjicImg,
  "husejinbasic.webp": husejinbasicImg,
  "mahmic.webp": mahmicImg,
  "lukic.webp": lukicImg,
};

const getPlayerImageSources = (sticker: Sticker): string[] => {
  if (!sticker.imageFile) return [];
  const folder = "players";
  const local = playerImageMap[sticker.imageFile] ?? null;
  return [
    local,
    `${PRIMARY_IPFS_BASE}/${folder}/${sticker.imageFile}`,
    `${BACKUP_IPFS_BASE}/${folder}/${sticker.imageFile}`,
    `${PLAYER_FALLBACK_IPFS_BASE}/${folder}/${sticker.imageFile}`,
  ].filter((source): source is string => source !== null);
};

interface AlbumPageProps {
  collection: UserSticker[];
  onViewSticker: (sticker: Sticker) => void;
  pastedCount: number;
  lang: Language;
}

export default function AlbumPage({ collection, onViewSticker, pastedCount, lang }: AlbumPageProps) {
  // - Page 0: Album Cover
  // - Page 1: Starters Part I (Slots 1-6)
  // - Page 2: Starters Part II (Slots 7-11)
  // - Page 3: Substitutions Part I (Slots 12-17)
  // - Page 4: Substitutions Part II (Slots 18-23)
  // - Page 4: Remaining players (slots 18-25)

  const [currentPage, setCurrentPage] = useState(0);

  const t = UI_TRANSLATIONS[lang];
  const getPageStickers = (pageNum: number): Sticker[] => {
    switch (pageNum) {
      case 1: return STICKERS.slice(0, 6);
      case 2: return STICKERS.slice(6, 11);
      case 3: return STICKERS.slice(11, 17);
      case 4: return STICKERS.slice(17, 25);
      default: return [];
    }
  };

  const handleNextPage = () => {
    if (currentPage < 4) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const totalPossible = STICKERS.length;
  const progressPercent = Math.round((pastedCount / totalPossible) * 100);

  // Removing setIsAlbumOpen that throws an error
  return (
    <div className="w-full flex flex-col items-center space-y-4 sm:space-y-6">

      {/* Album collection status tracker board */}
      <div className="w-full bg-white border border-gray-300 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-5 shadow-sm text-gray-800">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-[#002F6C]/10 rounded-xl text-[#002F6C]">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="text-left font-sans">
            <h3 className="font-bold text-[16px] text-[#002F6C] uppercase tracking-tight">{t.progressionTitle}</h3>
            <p className="text-xs italic text-gray-500">
              {t.pastedCountLabel}: <span className="text-[#002F6C] font-bold">{pastedCount}</span> {t.ofLabel} {totalPossible} {t.spotsLabel}
            </p>
          </div>
        </div>

        {/* Dynamic gauge bar */}
        <div className="flex-1 max-w-md w-full font-sans">
          <div className="flex justify-between items-center mb-1 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
            <span>{t.progressLabel}</span>
            <span className="text-[#002F6C] font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-[#002F6C] rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Book Outer Binder */}
      <div className="relative w-full min-h-0 rounded-lg bg-[#fffef8] border-l-8 md:border-l-[12px] border-[#002F6C] border-t border-b border-r border-[#d1cfc5] overflow-hidden p-2 sm:p-4 md:p-8 text-gray-800 flex flex-col justify-between">

        {/* ================= COVER PAGE ================= */}
        {currentPage === 0 && (
          <div className="relative w-full flex justify-center items-center overflow-hidden aspect-[3/4.2] sm:aspect-[4/5] md:aspect-[3/4.2]">
            {/* Background image - 100% render */}
            <img
              src={albumCoverImg}
              alt="Bosnia WC2026 Football Album Cover"
              className="absolute inset-0 w-full h-full object-fill drop-shadow-2xl"
            />

            {/* Slide animation container */}
            <div
              className={`absolute inset-0 transition-transform duration-700 ease-in-out translate-y-0`}
            >
              {/* Button at bottom */}
              <div className="absolute bottom-10 left-0 right-0 flex justify-center">
                <button
                  id="album-flip-open-btn"
                  onClick={() => {
                    handleNextPage();
                  }}
                  className="py-3 px-8 rounded-lg bg-[#002F6C] hover:bg-[#0c3f82] text-white font-sans font-bold uppercase text-xs tracking-wider transition shadow-sm flex items-center space-x-2 cursor-pointer"
                >
                  <span>{t.flipOpenButton}</span>
                  <ChevronRight className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}
        {/* ================= INDIVIDUAL STANDARD PAGES ================= */}
        {currentPage > 0 && (
          <div className="w-full flex-1 flex flex-col justify-between z-20">

            {/* Page header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-300 pb-3 mb-5 px-1 font-sans gap-2">
              <div className="text-left animate-fade-in">
                <span className="text-[10px] tracking-widest text-[#002F6C] font-bold uppercase">
                  {t.wcEdition}
                </span>
                <h2 className="text-[16px] font-black text-[#002F6C] uppercase leading-none">
                  {`${lang === "BS" ? "Sastav BiH — Stranica" : "Bosnian Squad — Page"} ${currentPage}`}
                </h2>
              </div>
              <div className="text-right">
                <span className="p-1 px-2.5 bg-[#002F6C]/10 border border-[#002F6C]/20 rounded-lg text-xs font-black text-[#002F6C]">
                  {t.slotRange}: {getPageStickers(currentPage)[0]?.number} - {getPageStickers(currentPage)[getPageStickers(currentPage).length - 1]?.number}
                </span>
              </div>
            </div>

            {/* Sticker layout helper and grid */}
            {(() => {
              const renderStickerSlot = (st: Sticker) => {
                const userRecord = collection.find(c => c.stickerId === st.id);
                const isPasted = userRecord?.pasted;
                const balanceCount = userRecord?.count || 0;
                const displayRole = PLAYER_TRANSLATIONS[st.id]?.role[lang] || st.role;

                return (
                  <div
                    key={st.id}
                    onClick={() => onViewSticker(st)}
                    className="relative rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    {!isPasted ? (
                      /* Empty Dotted slot where sticker goes */
                      <div className="relative w-full aspect-[3/4.2] border-2 border-dashed border-gray-300 hover:border-[#002F6C] bg-white/45 flex flex-col justify-between p-3.5 text-center transition rounded-xl overflow-hidden">
                        {/* Background crest with lowest opacity possible over card space so it does not look too white */}
                        <img
                          src={rewardGoldenCrestImg}
                          alt="Reward Golden Crest"
                          className="absolute inset-0 m-auto w-3/4 h-3/4 object-contain opacity-[0.07] pointer-events-none select-none z-0"
                        />
                        <div className="relative z-10 flex justify-between items-start font-sans">
                          <span className="text-[10px] text-gray-500 font-extrabold bg-[#f4f2e9] border border-gray-300 px-1.5 py-0.5 rounded shadow-sm flex-shrink-0">
                            {st.number}
                          </span>
                          {balanceCount > 0 && (
                            <span className="text-[8px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200 animate-pulse font-bold">
                              {balanceCount} {lang === "BS" ? "u kesici" : "in pouch"}
                            </span>
                          )}
                        </div>

                        <div className="relative z-10 my-auto py-2">
                          <div className="h-6 w-6 text-gray-400 mx-auto mb-1 flex items-center justify-center text-lg">👤</div>
                          <h4 className="font-sans font-black text-xs text-gray-700 truncate tracking-tight uppercase">
                            {st.name}
                          </h4>
                          <span className="text-[8px] sm:text-[9px] text-gray-500 italic block mt-0.5">{displayRole} • {st.club}</span>
                        </div>

                        <div className="relative z-10 text-[8px] font-sans text-gray-400 font-bold uppercase tracking-wider text-center">
                          {st.type === StickerType.SPECIAL ? (lang === "BS" ? "★ Specijalno" : "★ Special") : (lang === "BS" ? "Standardno" : "Standard")}
                        </div>
                      </div>
                    ) : (
                      /* Real pasted sticker card */
                      (() => {
                        const imageSources = getPlayerImageSources(st);
                        return (
                          <div
                            className={`w-full border-2 border-[#00f0ff] rounded-xl shadow-sm flex flex-col text-left transition-shadow overflow-hidden ${imageSources.length === 0 ? "bg-gradient-to-b from-[#124285] to-[#002F6C] aspect-[3/4.2] justify-end" : "bg-white"}`}
                          >
                            {imageSources.length > 0 && (
                              <div className="relative w-full bg-white flex flex-col justify-end">
                                <img
                                  src={imageSources[0]}
                                  data-source-index="0"
                                  alt={st.name}
                                  className="w-full h-auto object-contain block"
                                  onError={(e) => {
                                    const image = e.currentTarget;
                                    const currentIndex = Number(image.dataset.sourceIndex ?? "0");
                                    const nextSource = imageSources[currentIndex + 1];
                                    if (nextSource) {
                                      image.dataset.sourceIndex = String(currentIndex + 1);
                                      image.src = nextSource;
                                    }
                                  }}
                                />
                              </div>
                            )}
                            {imageSources.length === 0 && (
                              <div className="flex-1 flex flex-col items-center justify-center p-4 text-center z-10 relative">
                                {st.type === StickerType.SPECIAL ? (
                                  <Star className="h-8 w-8 text-[#FFCD00] drop-shadow-[0_0_6px_rgba(255,255,255,0.8)] animate-pulse" />
                                ) : (
                                  <span className="text-xl">⚽</span>
                                )}
                              </div>
                            )}
                            <div className="p-2 bg-[#002F6C]/95 border-t border-[#00f0ff]/50 text-center shadow-md relative z-20 font-sans shrink-0">
                              <h4 className="font-sans font-black text-[10px] sm:text-[10.5px] text-[#FFCD00] truncate leading-tight">{st.name}</h4>
                              <p className="text-[8px] sm:text-[8.5px] text-white/95 font-bold block mt-0.5 uppercase tracking-wide truncate">{displayRole} • {st.club}</p>
                            </div>
                          </div>
                        );
                      })()
                    )}
                  </div>
                );
              };

              return (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 flex-1 items-start px-1 animate-fade-in">
                  {getPageStickers(currentPage).map((st) => renderStickerSlot(st))}
                </div>
              );
            })()}

            {/* Pagination Controls inside the footer binder */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-300 px-1 text-xs font-sans font-black text-gray-500">
              <button
                onClick={handlePrevPage}
                className="flex items-center space-x-1 py-1.5 px-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-[#002F6C] shadow-sm transition cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4 text-[#002F6C]" />
                <span className="hidden sm:inline">{currentPage === 1 ? t.backCover : t.prevPage}</span>
                <span className="sm:hidden">{lang === "BS" ? "Nazad" : "Back"}</span>
              </button>

              <span className="text-gray-400 uppercase tracking-widest text-[9px] sm:text-[10px]">
                {`${lang === "BS" ? "Stranica" : "Page"} ${currentPage} / 4`}
              </span>

              <button
                disabled={currentPage === 4}
                onClick={handleNextPage}
                className="flex items-center space-x-1 py-1.5 px-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-[#002F6C] shadow-sm transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">{t.nextPage}</span>
                <span className="sm:hidden">{lang === "BS" ? "Dalje" : "Next"}</span>
                <ChevronRight className="h-4 w-4 text-[#002F6C]" />
              </button>
            </div>

          </div>
        )}

      </div>


    </div>
  );
}
