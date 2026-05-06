import { NextResponse } from "next/server";

import { getSiteUrl } from "@/lib/site-url";
import { getStripe } from "@/lib/stripe";
import { getStripePriceId, isHostingPlan } from "@/lib/plans";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const planParam = searchParams.get("plan");

  if (!planParam || !isHostingPlan(planParam)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const priceId = getStripePriceId(planParam);
  if (!priceId) {
    return NextResponse.json(
      {
        error:
          "Stripe price ID not configured for this plan. Set STRIPE_PRICE_TRIBUTE, STRIPE_PRICE_LEGACY, or STRIPE_PRICE_HERITAGE.",
      },
      { status: 503 }
    );
  }

  const siteUrl = getSiteUrl();
  const stripe = getStripe();

  const mode =
    planParam === "legacy" ? ("subscription" as const) : ("payment" as const);

  const session = await stripe.checkout.sessions.create({
    mode,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/create-memorial?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/#pricing`,
    metadata: { plan: planParam },
    customer_creation:
      mode === "payment" ? "always" : ("if_required" as const),
    billing_address_collection: "auto",
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Could not start checkout" },
      { status: 500 }
    );
  }

  return NextResponse.redirect(session.url);
}
