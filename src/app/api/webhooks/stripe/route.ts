import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET not configured" },
      { status: 503 }
    );
  }

  const body = await request.text();
  const headerPayload = (await headers()).get("stripe-signature");
  if (!headerPayload) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, headerPayload, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      /* Fulfillment is verified live when the family submits the memorial form. */
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      /* Hook Legacy renewals / cancellations to hosting_expires_at when you scale. */
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
