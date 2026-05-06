import type Stripe from "stripe";

import { getStripe } from "@/lib/stripe";
import type { HostingPlan } from "@/types/database";

import { isHostingPlan } from "./plans";

export type CheckoutContext =
  | {
      ok: true;
      sessionId: string;
      plan: HostingPlan;
      customerEmail: string;
      stripeSession: Stripe.Checkout.Session;
    }
  | { ok: false; reason: string };

export async function loadPaidCheckoutContext(
  sessionId: string | undefined
): Promise<CheckoutContext> {
  if (!sessionId?.trim()) {
    return { ok: false, reason: "missing_session" };
  }

  try {
    const stripe = getStripe();
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer"],
    });

    if (stripeSession.status !== "complete") {
      return { ok: false, reason: "not_complete" };
    }

    const rawPlan = stripeSession.metadata?.plan;
    if (!rawPlan || !isHostingPlan(rawPlan)) {
      return { ok: false, reason: "invalid_plan" };
    }

    const customerEmail =
      stripeSession.customer_details?.email ??
      stripeSession.customer_email ??
      "";

    return {
      ok: true,
      sessionId,
      plan: rawPlan,
      customerEmail,
      stripeSession,
    };
  } catch {
    return { ok: false, reason: "retrieve_failed" };
  }
}
