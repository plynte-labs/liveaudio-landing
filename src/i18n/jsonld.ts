/**
 * JSON-LD builders — return plain serializable objects (no <script> tags).
 * Callers embed them via `<script type="application/ld+json" set:html={...}>`.
 *
 * Product facts traceable to the product spec:
 *   - operatingSystem: "Windows, Linux" — NEVER Windows-only.
 *   - price 0 USD, softwareVersion 1.2.5, MIT license.
 *   - softwareRequirements: CPU works; CUDA needs driver >=525 + VRAM >=4 GiB.
 *   - canonical org / repo: github.com/plynte-labs/LiveAudio.
 */

import type { Locale } from "./routes";

const SITE_URL = "https://liveaudio.opencohost.com";
const REPO_URL = "https://github.com/plynte-labs/LiveAudio";
const MIT_LICENSE = "https://opensource.org/licenses/MIT";

/** Map our locale codes to BCP-47 `inLanguage` values. */
function inLanguage(lang: Locale): string {
  return lang === "es" ? "es" : "en";
}

export interface SoftwareApplicationInput {
  lang: Locale;
  /** Direct v1.2.5 asset URL (e.g. the Windows installer) when the page is the download endpoint. */
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
    operatingSystem: "Windows, Linux",
    softwareVersion: "1.2.5",
    inLanguage: inLanguage(lang),
    url: SITE_URL,
    license: MIT_LICENSE,
    softwareRequirements:
      "CPU works (no GPU required). NVIDIA CUDA is optional but recommended and needs driver >= 525 and VRAM >= 4 GiB.",
    offers: {
      "@type": "Offer",
      // The product spec hard gate specifies the string "0" (schema.org Offer.price
      // is a Text type); keep it as a string to match the verification gate.
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
 * `sameAs` points at the upstream GitHub repo (§11).
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
