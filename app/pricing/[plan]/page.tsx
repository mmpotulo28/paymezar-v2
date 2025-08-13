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
import {
	CheckCircle2,
	ShieldCheck,
	Lock,
	Info,
	Star,
	Zap,
	BadgeCheck,
	AlertCircle,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import { postApi } from "@/lib/helpers";
import { PLAN_DETAILS } from "@/lib/constants";
import UnAuthorizedContent from "@/components/UnAuthorizedContent";
import { useAccount } from "@/context/AccountContext";

export default function SubscriptionPage() {
	const { subscriptions } = useAccount();
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
	const [isCurrent, setIsCurrent] = useState<boolean>(true);

	useEffect(() => {
		if (!plan) {
			router.replace("/pricing");
		}
		const newAmount =
			period === "yearly" ? (plan.price.yearly || 0) * 12 : plan.price.monthly || 0;

		setAmount(newAmount);
	}, [plan, period, router]);

	useEffect(() => {
		if (user && subscriptions?.length > 0) {
			const isCurrent = subscriptions.some(
				(sub) => sub.plan.toLowerCase() === plan.name.toLowerCase(),
			);

			console.log("isCurrent:", isCurrent);
			setIsCurrent(!!isCurrent);
		} else {
			console.log("User is not subscribed");
			setIsCurrent(false);
		}
	}, [user, subscriptions, planKey]);

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
										startContent={<Star size={16} />}
										variant="solid">
										Most Popular
									</Chip>
								)}
								<span className="text-3xl font-bold">{plan.name}</span>
							</div>

							<Divider className="my-4" />
							<RadioGroup
								className="mb-2"
								label="Choose your billing period"
								orientation="horizontal"
								value={period}
								onValueChange={(val) => setPeriod(val as "monthly" | "yearly")}>
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
												<CheckCircle2 className="text-success" size={18} />
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
										className="mt-2"
										color="primary"
										description="The Starter plan is always free. Upgrade anytime for more features."
										title="Free Forever"
										variant="flat"
									/>
								)}
								{planKey === "pro" && (
									<Alert
										className="mt-2"
										color="success"
										description="Pro unlocks higher limits, instant withdrawals, and priority support."
										title="Best for Freelancers"
										variant="flat"
									/>
								)}
								{planKey === "business" && (
									<Alert
										className="mt-2"
										color="warning"
										description="Business plan is ideal for companies, payroll, and unlimited usage."
										title="Business Power"
										variant="flat"
									/>
								)}
							</div>
						</CardBody>
						<CardFooter className="flex flex-col gap-4 items-center">
							<Button
								className="w-full"
								color="primary"
								disabled={loading || isCurrent}
								endContent={
									!isCurrent && (
										<Chip color="success" radius="sm" size="sm" variant="solid">
											{amount} ZAR
										</Chip>
									)
								}
								isLoading={loading}
								size="lg"
								startContent={
									!isCurrent ? <Zap size={18} /> : <AlertCircle size={18} />
								}
								onPress={handleSubscribe}>
								{!!isCurrent ? (
									"Already subscribed"
								) : (
									<>
										{plan.price.monthly === 0 && plan.price.yearly === 0
											? "Activate Free Plan"
											: "Subscribe Now"}
									</>
								)}
							</Button>
							{error && (
								<Chip
									className="w-full justify-center mt-2"
									color="danger"
									variant="flat">
									{error}
								</Chip>
							)}
							{success && (
								<Chip
									className="w-full justify-center mt-2"
									color="success"
									variant="flat">
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
									<a className="text-primary underline" href="/support">
										Contact support
									</a>
								</div>
							</div>
						</CardFooter>
					</Card>
				)}
				{/* Right: Info/Assurance/Visuals */}
				<div className="flex flex-col gap-8 items-center justify-center w-full">
					<Card className="w-full shadow-lg border border-default-100 bg-background">
						<CardHeader className="flex flex-col items-center gap-2">
							<ShieldCheck className="text-primary" size={40} />
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
					<Card className="w-full shadow-lg border border-default-100 bg-background">
						<CardHeader className="flex flex-col items-center gap-2">
							<CheckCircle2 className="text-success" size={40} />
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
