"use client";
import React from "react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { iPricingPlan } from "@/types";

interface PricingCardProps {
  plan: iPricingPlan;
  isYearly: boolean;
}

export function PricingCard({ plan, isYearly }: PricingCardProps) {
  const price = isYearly ? plan.price.yearly : plan.price.monthly;
  const currency = "ZAR";
  const router = useRouter();

  const planSlug = plan.name.toLowerCase();

  const handleClick = () => {
    router.push(`/pricing/${planSlug}`);
  };

  return (
    <div className="relative cursor-pointer" onClick={handleClick}>
      {plan.isPopular && (
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-3 px-4 py-1.5
                      text-xs font-medium bg-primary text-white rounded-full z-10"
        >
          Most Popular
        </div>
      )}
      <Card
        className={`w-full ${plan.isPopular ? "border-2 border-primary" : ""}`}
        shadow="md"
      >
        <CardHeader className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold">{plan.name}</h3>
          <p className="text-default-500 text-sm">{plan.description}</p>
          <div className="flex items-baseline mt-2">
            <span className="text-3xl font-bold">
              {currency === "ZAR" ? `R${price}` : `$${price}`}
            </span>
            <span className="text-small text-default-500">
              /{isYearly ? "month (annual)" : "month"}
            </span>
          </div>
        </CardHeader>
        <CardBody className="gap-6">
          <ul className="space-y-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckIcon className="text-success" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            className="w-full"
            color={plan.isPopular ? "primary" : "default"}
            type="button"
            variant={plan.isPopular ? "solid" : "bordered"}
            onClick={handleClick}
          >
            Get Started
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
