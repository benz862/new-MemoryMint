#!/usr/bin/env node
/**
 * Prints Vercel-ready Stripe env lines.
 *
 * 1) Default: reads prices.csv (+ hardcoded product ids) — no API key needed.
 * 2) Optional: STRIPE_SECRET_KEY=... node scripts/print-vercel-stripe-env.mjs --verify
 *    compares CSV prices to Stripe API (catches drift).
 *
 * Usage:
 *   node scripts/print-vercel-stripe-env.mjs
 *   STRIPE_SECRET_KEY=sk_test_... node scripts/print-vercel-stripe-env.mjs --verify
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import Stripe from "stripe";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const PRODUCT_MAP = {
  STRIPE_PRODUCT_MEMORYMINT_TRIBUTE: "prod_UT646h44yq9bWn",
  STRIPE_PRODUCT_MEMORYMINT_LEGACY: "prod_UT64SlrReSpYvJ",
  STRIPE_PRODUCT_MEMORYMINT_HERITAGE: "prod_UT64La3ptAPp0V",
  STRIPE_PRODUCT_EXTRA_MEMORYMINT_CARD: "prod_UT645cLGTNDCZD",
  STRIPE_PRODUCT_TRIBUTE_TO_LEGACY_UPGRADE: "prod_UT64f5GAkEN00r",
  STRIPE_PRODUCT_TRIBUTE_TO_HERITAGE_UPGRADE: "prod_UT64clKub31vJH",
};

/** @returns {Map<string, { priceId: string, description: string, amount: string, interval: string }[]>} */
function parsePricesCsv() {
  const path = join(root, "prices.csv");
  const text = readFileSync(path, "utf8");
  const lines = text.trim().split(/\r?\n/);
  const header = lines[0].split(",");
  const priceIdx = header.indexOf("Price ID");
  const productIdx = header.indexOf("Product ID");
  const descIdx = header.indexOf("Description");
  const amountIdx = header.indexOf("Amount");
  const intervalIdx = header.indexOf("Interval");

  if (priceIdx < 0 || productIdx < 0) {
    throw new Error("prices.csv: missing Price ID or Product ID column");
  }

  /** @type {Map<string, { priceId: string, description: string, amount: string, interval: string }[]>} */
  const byProduct = new Map();

  for (let i = 1; i < lines.length; i++) {
    const row = parseCsvRow(lines[i]);
    const priceId = row[priceIdx]?.trim();
    const productId = row[productIdx]?.trim();
    if (!priceId?.startsWith("price_") || !productId?.startsWith("prod_")) continue;
    const description = (row[descIdx] ?? "").trim();
    const amount = (row[amountIdx] ?? "").trim();
    const interval = (row[intervalIdx] ?? "").trim();
    const list = byProduct.get(productId) ?? [];
    list.push({ priceId, description, amount, interval });
    byProduct.set(productId, list);
  }

  return byProduct;
}

/** Minimal CSV row parser (handles quoted fields). */
function parseCsvRow(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (c === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += c;
  }
  out.push(cur);
  return out;
}

function pickFromCsv(byProduct, productId, predicate) {
  const list = byProduct.get(productId) ?? [];
  const hit = list.find(predicate);
  return hit?.priceId ?? null;
}

function printBlockFromCsv() {
  const byProduct = parsePricesCsv();

  const tribute = pickFromCsv(
    byProduct,
    PRODUCT_MAP.STRIPE_PRODUCT_MEMORYMINT_TRIBUTE,
    (r) => r.description.includes("Tribute") && r.description.includes("One-time")
  );
  const legacy = pickFromCsv(
    byProduct,
    PRODUCT_MAP.STRIPE_PRODUCT_MEMORYMINT_LEGACY,
    (r) => r.description.includes("Legacy") && r.description.includes("Yearly")
  );
  const heritage = pickFromCsv(
    byProduct,
    PRODUCT_MAP.STRIPE_PRODUCT_MEMORYMINT_HERITAGE,
    (r) => r.description.includes("Heritage") && r.description.includes("One-time")
  );

  const extra = pickFromCsv(
    byProduct,
    PRODUCT_MAP.STRIPE_PRODUCT_EXTRA_MEMORYMINT_CARD,
    (r) => r.description.includes("Extra Card")
  );
  const toHeritage = pickFromCsv(
    byProduct,
    PRODUCT_MAP.STRIPE_PRODUCT_TRIBUTE_TO_HERITAGE_UPGRADE,
    (r) => r.description.includes("Heritage")
  );
  const toLegacyFirst = pickFromCsv(
    byProduct,
    PRODUCT_MAP.STRIPE_PRODUCT_TRIBUTE_TO_LEGACY_UPGRADE,
    (r) => r.description.includes("First Year")
  );
  const toLegacyRenewal = pickFromCsv(
    byProduct,
    PRODUCT_MAP.STRIPE_PRODUCT_TRIBUTE_TO_LEGACY_UPGRADE,
    (r) => r.description.includes("Renewal")
  );

  console.log(
    "# Paste into Vercel (Production + Preview). Source: prices.csv + products.csv\n"
  );

  console.log("# --- Checkout (app) ---");
  console.log(`STRIPE_PRICE_TRIBUTE=${tribute ?? ""}`);
  console.log(`STRIPE_PRICE_LEGACY=${legacy ?? ""}`);
  console.log(`STRIPE_PRICE_HERITAGE=${heritage ?? ""}`);
  console.log("");

  console.log("# --- Product IDs ---");
  for (const [k, v] of Object.entries(PRODUCT_MAP)) {
    console.log(`${k}=${v}`);
  }
  console.log("");

  console.log("# --- Optional upsells ---");
  console.log(`STRIPE_PRICE_EXTRA_CARD=${extra ?? ""}`);
  console.log(`STRIPE_PRICE_TRIBUTE_TO_HERITAGE=${toHeritage ?? ""}`);
  console.log(`STRIPE_PRICE_TRIBUTE_TO_LEGACY_FIRST_YEAR=${toLegacyFirst ?? ""}`);
  console.log(`STRIPE_PRICE_TRIBUTE_TO_LEGACY_RENEWAL=${toLegacyRenewal ?? ""}`);
}

async function verifyAgainstStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error("Set STRIPE_SECRET_KEY for --verify");
    process.exit(1);
  }
  const stripe = new Stripe(key);
  const byProduct = parsePricesCsv();

  for (const [envName, productId] of Object.entries(PRODUCT_MAP)) {
    const fromCsv = byProduct.get(productId)?.map((p) => p.priceId) ?? [];
    const fromApi = (
      await stripe.prices.list({ product: productId, active: true, limit: 30 })
    ).data.map((p) => p.id);
    const missing = fromCsv.filter((id) => !fromApi.includes(id));
    if (missing.length) {
      console.warn(
        `WARN ${envName} (${productId}): CSV price ids not all active in API:`,
        missing
      );
    }
  }
  console.log("# Verify complete (warnings only if CSV and Stripe differ).");
}

async function main() {
  const verify = process.argv.includes("--verify");

  if (verify) {
    printBlockFromCsv();
    console.log("");
    await verifyAgainstStripe();
    return;
  }

  printBlockFromCsv();
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
