"use client";
import React from "react";

import { FaqSection } from "./components/faqs";
import { FeatureComparison } from "./components/feature-comparison";
import { PricingCard } from "./components/pricing-card";
import { PricingToggle } from "./components/pricing-toggle";

import { PLAN_DETAILS } from "@/lib/constants";
import { useAccount } from "@/context/AccountContext";

const pricingPlans = [PLAN_DETAILS.starter, PLAN_DETAILS.pro, PLAN_DETAILS.business];

export default function PricingPage() {
	const { subscriptions } = useAccount();
	const [isYearly, setIsYearly] = React.useState(false);

	return (
		<div className="min-h-screen px-4 py-16">
			<div className="mx-auto max-w-7xl">
				{/* Header */}
				<div className="mb-12 text-center">
					<h1 className="mb-4 text-4xl font-bold">PayMe-Zar Subscription Plans</h1>
					<p className="text-large text-default-500">
						Choose the perfect plan for your ZAR stablecoin payments. No hidden fees,
						cancel anytime.
					</p>
				</div>

				{/* Pricing Toggle */}
				<PricingToggle isYearly={isYearly} onChange={setIsYearly} />

				{/* Pricing Cards */}
				<div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
					{pricingPlans.map((plan) => {
						const isCurrent = subscriptions.some(
							(sub) => sub.plan.toLowerCase() === plan.name.toLowerCase(),
						);

						return (
							<PricingCard
								key={plan.name}
								isYearly={isYearly}
								plan={plan}
								isCurrent={isCurrent}
							/>
						);
					})}
				</div>

				{/* Feature Comparison */}
				<div className="mb-16 max-w-2xl mx-auto">
					<h2 className="mb-6 text-center text-2xl font-bold">Compare Features</h2>
					<FeatureComparison />
				</div>

				{/* FAQ Section */}
				<div className="mb-16 max-w-2xl mx-auto">
					<FaqSection />
				</div>
			</div>
		</div>
	);
}
