import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const raw = process.env.STRIPE_SECRET_KEY;
    if (!raw) {
      throw new Error("Missing STRIPE_SECRET_KEY");
    }
    const key = raw.trim();
    if (!key) {
      throw new Error("Missing STRIPE_SECRET_KEY");
    }
    stripeInstance = new Stripe(key, {
      maxNetworkRetries: 4,
      timeout: 60_000,
    });
  }
  return stripeInstance;
}
