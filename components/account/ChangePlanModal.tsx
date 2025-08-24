import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Tabs,
	Tab,
} from "@heroui/react";
import { PLAN_DETAILS } from "@/lib/constants";
import { CheckIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { iSubscription } from "@/types";

interface ChangePlanModalProps {
	showModal: boolean;
	onClose: () => void;
	subscription: iSubscription | null;
	onConfirm: (newPlan: string, newPeriod: "monthly" | "yearly") => Promise<void>;
	isLoading?: boolean;
}

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

	// Track original plan/period for comparison
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
										const isCurrent =
											plan.name.toLowerCase() === originalPlan &&
											selectedPeriod === originalPeriod;
										return (
											<div
												key={plan.name}
												className={`border rounded-lg p-4 flex flex-col gap-2 cursor-pointer ${
													selectedPlan === plan.name.toLowerCase()
														? "border-primary bg-primary-50"
														: "border-default-200 bg-default-50"
												} ${
													isCurrent
														? "opacity-60 pointer-events-none"
														: ""
												}`}
												onClick={() =>
													!isCurrent &&
													setSelectedPlan(plan.name.toLowerCase())
												}>
												<div className="flex items-center gap-2">
													<span className="font-bold text-lg">
														{plan.name}
													</span>
													{selectedPlan === plan.name.toLowerCase() && (
														<CheckIcon
															className="text-success"
															size={16}
														/>
													)}
												</div>
												<span className="text-xs text-default-500">
													{plan.description}
												</span>
												<span className="font-mono text-xl font-bold">
													R{plan.price[selectedPeriod]} / {selectedPeriod}
												</span>
												<ul className="text-xs text-default-600 list-disc ml-4">
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
