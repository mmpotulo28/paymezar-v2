import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Tabs,
	Tab,
	Chip,
	Divider,
} from "@heroui/react";
import { PLAN_DETAILS } from "@/lib/constants";
import { CheckIcon, Star, Zap, Repeat } from "lucide-react";
import { useState, useEffect } from "react";
import { iSubscription } from "@/types";

interface ChangePlanModalProps {
	showModal: boolean;
	onClose: () => void;
	subscription: iSubscription | null;
	onConfirm: (newPlan: string, newPeriod: "monthly" | "yearly") => Promise<void>;
	isLoading?: boolean;
}

const PLAN_ICONS: Record<string, JSX.Element> = {
	business: <Star className="text-warning" size={20} />,
	pro: <Zap className="text-primary" size={20} />,
	starter: <Repeat className="text-success" size={20} />,
};

export function ChangePlanModal({
	showModal,
	onClose,
	subscription,
	onConfirm,
	isLoading,
}: ChangePlanModalProps) {
	const [selectedPlan, setSelectedPlan] = useState<string>(
		subscription?.plan.toLowerCase() || "pro",
	);
	const [selectedPeriod, setSelectedPeriod] = useState<"monthly" | "yearly">(
		subscription?.period?.toLowerCase() === "yearly" ? "yearly" : "monthly",
	);

	const originalPlan = subscription?.plan.toLowerCase() || "pro";
	const originalPeriod = subscription?.period?.toLowerCase() === "yearly" ? "yearly" : "monthly";

	useEffect(() => {
		if (!showModal) {
			setSelectedPlan(originalPlan);
			setSelectedPeriod(originalPeriod);
		}
	}, [showModal, originalPlan, originalPeriod]);

	const isSameSelection = selectedPlan === originalPlan && selectedPeriod === originalPeriod;

	const handleConfirm = async () => {
		if (!isSameSelection) {
			await onConfirm(selectedPlan, selectedPeriod);
		}
	};

	return (
		<Modal isOpen={showModal} size="lg" onClose={onClose}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader>
							<span className="text-lg font-bold">Change Subscription Plan</span>
						</ModalHeader>
						<ModalBody>
							<div className="mb-4">
								<Tabs
									selectedKey={selectedPeriod}
									onSelectionChange={(key) =>
										setSelectedPeriod(key as "monthly" | "yearly")
									}
									variant="underlined"
									className="mb-4">
									<Tab key="monthly" title="Monthly" />
									<Tab key="yearly" title="Yearly" />
								</Tabs>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									{Object.values(PLAN_DETAILS).map((plan) => {
										const planKey = plan.name.toLowerCase();
										const isCurrent =
											planKey === originalPlan &&
											selectedPeriod === originalPeriod;
										const isSelected = selectedPlan === planKey;
										const price = plan.price[selectedPeriod];
										const currentPrice =
											PLAN_DETAILS[originalPlan]?.price[selectedPeriod] ?? 0;
										const priceDiff =
											isSelected && !isCurrent ? price - currentPrice : null;

										return (
											<div
												key={plan.name}
												className={`border rounded-lg p-4 flex flex-col gap-2 cursor-pointer transition
													${isSelected ? "border-primary bg-primary-50 shadow-lg" : "border-default-200 bg-default-50"}
													${isCurrent ? "opacity-60 pointer-events-none" : "hover:border-primary hover:bg-primary-100"}
												`}
												onClick={() =>
													!isCurrent && setSelectedPlan(planKey)
												}>
												<div className="flex items-center gap-2 mb-2">
													{PLAN_ICONS[planKey]}
													<span className="font-bold text-lg capitalize">
														{plan.name}
													</span>
													{isSelected && (
														<CheckIcon
															className="text-success"
															size={16}
														/>
													)}
													{plan.isPopular && (
														<Chip
															color="warning"
															size="sm"
															variant="flat">
															Popular
														</Chip>
													)}
												</div>
												<span className="text-xs text-default-500 mb-1">
													{plan.description}
												</span>
												<span className="font-mono text-xl font-bold mb-1">
													R{price} / {selectedPeriod}
												</span>
												{priceDiff !== null && (
													<span
														className={`text-xs font-semibold ${
															priceDiff > 0
																? "text-danger"
																: priceDiff < 0
																	? "text-success"
																	: "text-default-500"
														}`}>
														{priceDiff > 0
															? `+R${priceDiff} more`
															: priceDiff < 0
																? `-R${Math.abs(priceDiff)} less`
																: "Same price"}
													</span>
												)}
												<Divider className="my-2" />
												<ul className="text-xs text-default-600 list-disc ml-4 mb-2">
													{plan.features.map((f, idx) => (
														<li key={idx}>{f}</li>
													))}
												</ul>
												{isCurrent && (
													<span className="text-xs text-default-400 mt-2">
														Current Plan
													</span>
												)}
											</div>
										);
									})}
								</div>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button
								color="primary"
								isLoading={isLoading}
								disabled={isLoading || isSameSelection}
								onPress={handleConfirm}>
								Confirm Change
							</Button>
							<Button color="secondary" variant="flat" onPress={onClose}>
								Cancel
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
