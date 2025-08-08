"use client";
import { useState, useEffect } from "react";
import {
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	Chip,
	Radio,
	RadioGroup,
	Divider,
	Alert,
} from "@heroui/react";
import { Button } from "@heroui/button";
import { CheckCircle2, ShieldCheck, Lock, Info, Star, Zap, BadgeCheck } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { postApi } from "@/lib/helpers";
import { PLAN_DETAILS } from "@/lib/constants";
import { useUser } from "@clerk/nextjs";
import UnAuthorizedContent from "@/components/UnAuthorizedContent";

export default function SubscriptionPage() {
	const { user } = useUser();
	const router = useRouter();
	const params = useParams();
	const planKey = String(params.plan || "").toLowerCase();
	const plan = PLAN_DETAILS[planKey];

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
	const [amount, setAmount] = useState<number>(0);

	useEffect(() => {
		if (!plan) {
			router.replace("/pricing");
		}
		const newAmount =
			period === "yearly" ? (plan.price.yearly || 0) * 12 : plan.price.monthly || 0;
		setAmount(newAmount);
	}, [plan, period, router]);

	const handleSubscribe = async () => {
		if (!user?.id || !user?.unsafeMetadata?.paymentId) {
			setError("You must be logged in to subscribe.");
			return;
		}
		setLoading(true);
		setError(null);
		setSuccess(null);
		try {
			const result = await postApi("/api/subscription/create", {
				id: user.id,
				plan: planKey,
				period,
				amount,
			});
			if (!result.error) {
				setSuccess("Subscription created successfully!");
			} else {
				setError(result.message || "Failed to create subscription.");
			}
		} catch (e: any) {
			console.error("Subscription error:", e);
			setError(e.message || "Failed to create subscription.");
		}
		setLoading(false);
	};

	if (!plan) return null;

	const displayPrice =
		period === "yearly"
			? `R${plan.price.yearly} / month (billed yearly)`
			: `R${plan.price.monthly} / month`;

	return (
		<div className="min-h-[80vh] py-8 flex items-center justify-center ">
			<div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
				{!user && <UnAuthorizedContent />}
				{user && (
					<Card className="w-full shadow-2xl border border-default-200">
						<CardHeader className="flex flex-col items-center gap-2">
							<div className="flex items-center gap-2">
								{plan.isPopular && (
									<Chip
										color="primary"
										variant="solid"
										startContent={<Star size={16} />}>
										Most Popular
									</Chip>
								)}
								<span className="text-3xl font-bold">{plan.name}</span>
							</div>

							<Divider className="my-4" />
							<RadioGroup
								label="Choose your billing period"
								orientation="horizontal"
								value={period}
								onValueChange={(val) => setPeriod(val as "monthly" | "yearly")}
								className="mb-2">
								<Radio value="monthly">Monthly</Radio>
								<Radio value="yearly">
									Yearly <span className="text-success">(-20%)</span>
								</Radio>
							</RadioGroup>
							<span className="text-2xl font-semibold text-primary">
								{displayPrice}
							</span>
						</CardHeader>
						<CardBody>
							<div className="flex flex-col gap-4">
								<div className="flex flex-col gap-2">
									<span className="font-semibold text-default-700 mb-1">
										What you get:
									</span>
									<ul className="list-none flex flex-col gap-2">
										{plan.features.map((f, idx) => (
											<li
												key={`${f}-${idx}`}
												className="flex items-center gap-2">
												<CheckCircle2 size={18} className="text-success" />
												<span className="text-sm">{f}</span>
											</li>
										))}
									</ul>
								</div>
								<Divider className="my-2" />
								<div className="flex flex-col gap-2">
									<div className="flex items-center gap-2 text-success">
										<ShieldCheck size={18} />
										<span className="text-xs">
											Your payments and data are protected with bank-grade
											security.
										</span>
									</div>
									<div className="flex items-center gap-2 text-primary">
										<BadgeCheck size={18} />
										<span className="text-xs">
											Cancel or change your subscription at any time.
										</span>
									</div>
									<div className="flex items-center gap-2 text-warning">
										<Info size={18} />
										<span className="text-xs">
											7-day money-back guarantee. No hidden fees.
										</span>
									</div>
								</div>
								{planKey === "starter" && (
									<Alert
										color="primary"
										variant="flat"
										title="Free Forever"
										description="The Starter plan is always free. Upgrade anytime for more features."
										className="mt-2"
									/>
								)}
								{planKey === "pro" && (
									<Alert
										color="success"
										variant="flat"
										title="Best for Freelancers"
										description="Pro unlocks higher limits, instant withdrawals, and priority support."
										className="mt-2"
									/>
								)}
								{planKey === "business" && (
									<Alert
										color="warning"
										variant="flat"
										title="Business Power"
										description="Business plan is ideal for companies, payroll, and unlimited usage."
										className="mt-2"
									/>
								)}
							</div>
						</CardBody>
						<CardFooter className="flex flex-col gap-4 items-center">
							<Button
								color="primary"
								className="w-full"
								isLoading={loading}
								onPress={handleSubscribe}
								disabled={loading}
								size="lg"
								endContent={
									<Chip size="sm" radius="sm" color="success" variant="solid">
										{amount} ZAR
									</Chip>
								}
								startContent={<Zap size={18} />}>
								{plan.price.monthly === 0 && plan.price.yearly === 0
									? "Activate Free Plan"
									: "Subscribe Now"}
							</Button>
							{error && (
								<Chip
									color="danger"
									variant="flat"
									className="w-full justify-center mt-2">
									{error}
								</Chip>
							)}
							{success && (
								<Chip
									color="success"
									variant="flat"
									className="w-full justify-center mt-2">
									{success}
								</Chip>
							)}
							<Divider />
							<div className="flex flex-col items-center gap-1">
								<div className="flex items-center gap-2 text-xs text-default-500">
									<Lock size={14} /> Secure checkout. Your information is always
									private.
								</div>
								<div className="text-xs text-default-400">
									Need help?{" "}
									<a href="/support" className="text-primary underline">
										Contact support
									</a>
								</div>
							</div>
						</CardFooter>
					</Card>
				)}
				{/* Right: Info/Assurance/Visuals */}
				<div className="flex flex-col gap-8 items-center justify-center w-full">
					<Card className="w-full shadow-lg border border-default-100 bg-gradient-to-br from-primary-100 to-background">
						<CardHeader className="flex flex-col items-center gap-2">
							<ShieldCheck size={40} className="text-primary" />
							<span className="text-lg font-bold text-primary">
								Why choose PayMe-Zar?
							</span>
						</CardHeader>
						<CardBody className="flex flex-col gap-3 items-center">
							<div className="flex items-center gap-2 text-success">
								<CheckCircle2 size={18} />
								<span className="text-sm">Trusted by thousands of users</span>
							</div>
							<div className="flex items-center gap-2 text-primary">
								<Star size={18} />
								<span className="text-sm">No hidden fees, no surprises</span>
							</div>
							<div className="flex items-center gap-2 text-warning">
								<Info size={18} />
								<span className="text-sm">Cancel or upgrade anytime</span>
							</div>
							<div className="flex items-center gap-2 text-success">
								<BadgeCheck size={18} />
								<span className="text-sm">Bank-grade security & privacy</span>
							</div>
						</CardBody>
					</Card>
					<Card className="w-full shadow-lg border border-default-100 bg-gradient-to-tl from-secondary-100 to-background">
						<CardHeader className="flex flex-col items-center gap-2">
							<CheckCircle2 size={40} className="text-success" />
							<span className="text-lg font-bold text-success">How it works</span>
						</CardHeader>
						<CardBody className="flex flex-col gap-2 text-center">
							<span className="text-sm">
								1. Choose your plan and billing period.
								<br />
								2. Complete secure checkout.
								<br />
								3. Enjoy instant ZAR stablecoin payments and features.
							</span>
						</CardBody>
					</Card>
				</div>
			</div>
		</div>
	);
}
