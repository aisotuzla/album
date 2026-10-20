import React from "react";
import "@phosphor-icons/webcomponents/PhBookOpen";
import "@phosphor-icons/webcomponents/PhSparkle";
import "@phosphor-icons/webcomponents/PhCoins";
import "@phosphor-icons/webcomponents/PhShoppingBag";
import "@phosphor-icons/webcomponents/PhArrowsLeftRight";
import "@phosphor-icons/webcomponents/PhSpeakerHigh";
import "@phosphor-icons/webcomponents/PhSpeakerSlash";
import "@phosphor-icons/webcomponents/PhMedal";
import "@phosphor-icons/webcomponents/PhQuestion";
import "@phosphor-icons/webcomponents/PhSealCheck";
import "@phosphor-icons/webcomponents/PhCheckCircle";
import "@phosphor-icons/webcomponents/PhStar";
import "@phosphor-icons/webcomponents/PhTrophy";
import "@phosphor-icons/webcomponents/PhWallet";
import "@phosphor-icons/webcomponents/PhClockCounterClockwise";
import "@phosphor-icons/webcomponents/PhCaretLeft";
import "@phosphor-icons/webcomponents/PhCaretRight";
import "@phosphor-icons/webcomponents/PhX";
import "@phosphor-icons/webcomponents/PhLightning";
import "@phosphor-icons/webcomponents/PhHeartbeat";
import "@phosphor-icons/webcomponents/PhCalendar";
import "@phosphor-icons/webcomponents/PhShield";
import "@phosphor-icons/webcomponents/PhMapPin";
import "@phosphor-icons/webcomponents/PhCheck";
import "@phosphor-icons/webcomponents/PhWarningCircle";
import "@phosphor-icons/webcomponents/PhArrowSquareOut";
import "@phosphor-icons/webcomponents/PhCircleNotch";
import "@phosphor-icons/webcomponents/PhPlus";
import "@phosphor-icons/webcomponents/PhTrash";
import "@phosphor-icons/webcomponents/PhUser";
import "@phosphor-icons/webcomponents/PhTag";

type IconProps = React.HTMLAttributes<HTMLElement> & {
  size?: string | number;
  fill?: string;
  strokeWidth?: string | number;
};

const icon = (tag: string) => ({ className, size = 24, fill, strokeWidth: _strokeWidth, ...attributes }: IconProps) =>
  React.createElement(tag, {
    ...attributes,
    className,
    size: String(size),
    weight: fill ? "fill" : "regular",
  });

export const BookOpen = icon("ph-book-open");
export const Sparkles = icon("ph-sparkle");
export const Coins = icon("ph-coins");
export const ShoppingBag = icon("ph-shopping-bag");
export const ArrowLeftRight = icon("ph-arrows-left-right");
export const Volume2 = icon("ph-speaker-high");
export const VolumeX = icon("ph-speaker-slash");
export const Award = icon("ph-medal");
export const HelpCircle = icon("ph-question");
export const BadgeCheck = icon("ph-seal-check");
export const CheckCircle2 = icon("ph-check-circle");
export const Star = icon("ph-star");
export const Trophy = icon("ph-trophy");
export const WalletCards = icon("ph-wallet");
export const History = icon("ph-clock-counter-clockwise");
export const ChevronLeft = icon("ph-caret-left");
export const ChevronRight = icon("ph-caret-right");
export const X = icon("ph-x");
export const Zap = icon("ph-lightning");
export const Activity = icon("ph-heartbeat");
export const Calendar = icon("ph-calendar");
export const Shield = icon("ph-shield");
export const MapPin = icon("ph-map-pin");
export const Wallet = icon("ph-wallet");
export const Check = icon("ph-check");
export const AlertCircle = icon("ph-warning-circle");
export const ExternalLink = icon("ph-arrow-square-out");
export const Loader2 = icon("ph-circle-notch");
export const Plus = icon("ph-plus");
export const Trash2 = icon("ph-trash");
export const User = icon("ph-user");
export const Tag = icon("ph-tag");
