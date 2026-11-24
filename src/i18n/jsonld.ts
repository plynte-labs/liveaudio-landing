/**
 * JSON-LD builders — return plain serializable objects (no <script> tags).
 * Callers embed them via `<script type="application/ld+json" set:html={...}>`.
 *
 * Product facts traceable to the current LiveAudio release:
 *   - operatingSystem: "Windows 10, Windows 11, Linux (x86_64)"
 *   - price 0 USD, softwareVersion from src/config/release.ts, MIT license.
 *   - ASR: NVIDIA Parakeet-TDT 0.6B v3 (ONNX Runtime CPU/DirectML) + Whisper + optional CUDA (CTranslate2).
 *   - Zero data collection and zero data retention in the desktop application.
 *   - canonical org / repo: github.com/plynte-labs/LiveAudio.
 */

import type { Locale } from "./routes";
import { LIVEAUDIO_VERSION, REPO_URL } from "../config/release";

const SITE_URL = "https://liveaudio.opencohost.com";
const MIT_LICENSE = "https://opensource.org/licenses/MIT";

/** Map our locale codes to BCP-47 `inLanguage` values. */
function inLanguage(lang: Locale): string {
  return lang === "es" ? "es" : "en";
}

export interface SoftwareApplicationInput {
  lang: Locale;
  /** Direct installer URL (e.g. the Windows installer) when the page is the download endpoint. */
  downloadUrl?: string;
}

/**
 * schema.org SoftwareApplication for LiveAudio.
 * Pass `downloadUrl` on /download/ pages; omit elsewhere.
 */
export function softwareApplication({ lang, downloadUrl }: SoftwareApplicationInput) {
  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "LiveAudio",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Windows 10, Windows 11, Linux (x86_64)",
    softwareVersion: LIVEAUDIO_VERSION,
    inLanguage: inLanguage(lang),
    url: SITE_URL,
    license: MIT_LICENSE,
    description:
      "Free, open-source (MIT) native Rust desktop app for 100% local real-time OBS captions powered by NVIDIA Parakeet-TDT 0.6B v3 and Whisper on ONNX Runtime (CPU / DirectML) with optional CUDA, Windows WASAPI & Linux PipeWire/PulseAudio loopback, and zero desktop data collection or retention.",
    softwareRequirements:
      "Windows 10/11 x64 or Linux x86_64 (.AppImage / .deb). Runs locally on CPU (smooth on 4-thread laptops with Parakeet-TDT int8) or DirectX 12 (DirectML) GPU via ONNX Runtime. NVIDIA CUDA 12.8 acceleration is an optional, opt-in CTranslate2 download.",
    featureList: [
      "NVIDIA Parakeet-TDT 0.6B v3 (recommended for EN/ES) and Whisper on native Rust + ONNX Runtime",
      "100% local audio transcription with zero desktop data collection or retention",
      "System-audio loopback on Windows (WASAPI) and Linux (PipeWire/PulseAudio monitor capture with ALSA fallback)",
      "Built-in OBS Browser Source overlay with 7 live themes and anti-burst reconnection",
      "Session recording to .srt (DaVinci Resolve-ready), .vtt, and .jsonl",
      "Dual-consent MCP stdio server (liveaudio-cli mcp) and stream-safe Minisign signed in-app updater (Windows NSIS & Linux AppImage)",
    ],
    offers: {
      "@type": "Offer",
      // schema.org Offer.price is a Text type; keep string "0".
      price: "0",
      priceCurrency: "USD",
    },
  };

  if (downloadUrl) {
    node.downloadUrl = downloadUrl;
  }

  return node;
}

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * schema.org FAQPage. Returns `null` when there are no items so callers can
 * skip rendering an empty graph (empty-array guard).
 */
export function faqPage(items: FaqItem[]) {
  if (!items || items.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export interface HowToStep {
  name: string;
  text: string;
}

export interface HowToInput {
  name: string;
  steps: HowToStep[];
}

/**
 * schema.org HowTo (getting-started / obs-setup). Returns `null` when there are
 * no steps so callers can skip an empty graph.
 */
export function howTo({ name, steps }: HowToInput) {
  if (!steps || steps.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

/**
 * schema.org WebSite + Organization for the canonical domain.
 * `sameAs` points at the upstream GitHub repo.
 */
export function organizationWebSite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LiveAudio",
    url: SITE_URL,
    publisher: {
      "@type": "Organization",
      name: "Plynte",
      url: SITE_URL,
      sameAs: [REPO_URL],
    },
  };
}
