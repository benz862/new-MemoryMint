import { NextResponse } from "next/server";
import Stripe from "stripe";

import { getSiteUrl } from "@/lib/site-url";
import { getStripe } from "@/lib/stripe";
import { getStripePriceId, isHostingPlan } from "@/lib/plans";

function checkoutErrorResponse(e: unknown) {
  if (e instanceof Stripe.errors.StripeInvalidRequestError) {
    return NextResponse.json(
      {
        error: e.message,
        stripe_type: e.type,
        ...(e.code ? { stripe_code: e.code } : {}),
      },
      { status: 400 }
    );
  }
  if (e instanceof Stripe.errors.StripeConnectionError) {
    return NextResponse.json(
      {
        error: e.message,
        stripe_type: e.type,
        hint:
          "No HTTPS response from Stripe (after SDK retries). Check: STRIPE_SECRET_KEY in Vercel has no accidental spaces or newlines; unset HTTP_PROXY/HTTPS_PROXY unless you intend to proxy; see https://status.stripe.com/ ; retry in a minute.",
      },
      { status: 503 }
    );
  }
  if (e instanceof Stripe.errors.StripeAuthenticationError) {
    return NextResponse.json(
      {
        error: e.message,
        stripe_type: e.type,
        hint:
          "Invalid or revoked API key, or test/live mismatch. Re-copy STRIPE_SECRET_KEY from Stripe Dashboard → Developers → API keys.",
      },
      { status: 502 }
    );
  }
  if (e instanceof Stripe.errors.StripeError) {
    return NextResponse.json(
      {
        error: e.message,
        stripe_type: e.type,
        ...(e.code ? { stripe_code: e.code } : {}),
      },
      { status: 502 }
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
