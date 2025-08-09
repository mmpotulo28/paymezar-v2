import { iPricingPlan } from "@/types";

// Global constants for pricing plans

export const PLAN_DETAILS: Record<string, iPricingPlan> = {
  starter: {
    name: "Starter",
    description:
      "For individuals and casual users to send and receive ZAR stablecoin.",
    price: { monthly: 0, yearly: 0 },
    features: [
      "1 linked bank account",
      "Up to R5,000/month transfers",
      "Basic transaction history",
      "Community support",
      "Standard KYC",
      "QR code payment requests",
    ],
  },
  pro: {
    name: "Pro",
    description:
      "For active users and freelancers needing higher limits and more features.",
    price: { monthly: 10, yearly: 8 }, // 8 ZAR per month on annual plan
    features: [
      "Up to 3 linked bank accounts",
      "Up to R50,000/month transfers",
      "Priority support",
      "Advanced analytics",
      "Instant withdrawals",
      "QR code payment requests",
    ],
    isPopular: true,
  },
  business: {
    name: "Business",
    description:
      "For businesses and power users with advanced needs and unlimited usage.",
    price: { monthly: 20, yearly: 15 }, // 15 ZAR per month on annual plan
    features: [
      "Unlimited bank accounts",
      "Unlimited transfers",
      "Bulk payouts & payroll",
      "API access",
      "Dedicated account manager",
      "24/7 priority support",
    ],
  },
};
