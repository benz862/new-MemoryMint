import type { HostingPlan } from "@/types/database";

export const HOSTING_PLANS: HostingPlan[] = ["tribute", "legacy", "heritage"];

export function isHostingPlan(value: string): value is HostingPlan {
  return HOSTING_PLANS.includes(value as HostingPlan);
}

export const PLAN_LABELS: Record<
  HostingPlan,
  { title: string; price: string; cadence: string }
> = {
  tribute: {
    title: "MemoryMint Tribute",
    price: "$79",
    cadence: "one-time",
  },
  legacy: {
    title: "MemoryMint Legacy",
    price: "$149",
    cadence: "/year",
  },
  heritage: {
    title: "MemoryMint Heritage",
    price: "$349",
    cadence: "one-time",
  },
};

export function getStripePriceId(plan: HostingPlan): string | undefined {
  switch (plan) {
    case "tribute":
      return process.env.STRIPE_PRICE_TRIBUTE;
    case "legacy":
      return process.env.STRIPE_PRICE_LEGACY;
    case "heritage":
      return process.env.STRIPE_PRICE_HERITAGE;
    default:
      return undefined;
  }
}

export function computeHostingExpires(
  plan: HostingPlan,
  from: Date
): Date | null {
  switch (plan) {
    case "tribute": {
      const d = new Date(from);
      d.setDate(d.getDate() + 30);
      return d;
    }
    case "heritage": {
      const d = new Date(from);
      d.setFullYear(d.getFullYear() + 10);
      return d;
    }
    case "legacy":
      return null;
    default:
      return null;
  }
}
