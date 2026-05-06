import { NextResponse } from "next/server";
import Stripe from "stripe";

import { getSiteUrl } from "@/lib/site-url";
import { getStripe } from "@/lib/stripe";
import { getStripePriceId, isHostingPlan } from "@/lib/plans";

function checkoutErrorResponse(e: unknown) {
  if (e instanceof Stripe.errors.StripeError) {
    const status =
      e instanceof Stripe.errors.StripeInvalidRequestError ? 400 : 502;
    return NextResponse.json(
      {
        error: e.message,
        stripe_type: e.type,
        ...(e.code ? { stripe_code: e.code } : {}),
      },
      { status }
    );
  }
  const message =
    e instanceof Error ? e.message : "Could not start checkout with Stripe.";
  return NextResponse.json({ error: message }, { status: 502 });
}

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

  // Stripe: customer_creation is only valid for payment and setup modes, not subscription.
  const sessionParams =
    mode === "payment"
      ? ({
          mode,
          line_items: [{ price: priceId, quantity: 1 }],
          success_url: `${siteUrl}/create-memorial?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${siteUrl}/#pricing`,
          metadata: { plan: planParam },
          customer_creation: "always" as const,
          billing_address_collection: "auto" as const,
        } satisfies Parameters<typeof stripe.checkout.sessions.create>[0])
      : ({
          mode,
          line_items: [{ price: priceId, quantity: 1 }],
          success_url: `${siteUrl}/create-memorial?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${siteUrl}/#pricing`,
          metadata: { plan: planParam },
          billing_address_collection: "auto" as const,
        } satisfies Parameters<typeof stripe.checkout.sessions.create>[0]);

  let session;
  try {
    session = await stripe.checkout.sessions.create(sessionParams);
  } catch (e) {
    return checkoutErrorResponse(e);
  }

  if (!session.url) {
    return NextResponse.json(
      { error: "Could not start checkout" },
      { status: 500 }
    );
  }

  return NextResponse.redirect(session.url);
}
