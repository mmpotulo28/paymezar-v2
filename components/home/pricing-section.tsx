"use client";
import { PricingCard } from "@/app/pricing/components/pricing-card";
import { PLAN_DETAILS } from "@/lib/constants";
import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

export function PricingSection() {
	const pricingPlans = [PLAN_DETAILS.starter, PLAN_DETAILS.pro, PLAN_DETAILS.business];
	return (
		<section className="w-full max-w-5xl mt-12">
			<h2 className="text-2xl font-bold text-center mb-6">Choose Your Plan</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{pricingPlans.map((plan) => (
					<PricingCard key={plan.name} plan={plan} isYearly={false} />
				))}
			</div>
			<div className="flex justify-center mt-4">
				<Link
					href="/pricing"
					className={buttonStyles({
						color: "primary",
						radius: "full",
						variant: "flat",
						size: "md",
					})}>
					See All Features
				</Link>
			</div>
		</section>
	);
}
