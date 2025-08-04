import { Card, CardBody, CardHeader } from "@heroui/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useSession } from "@/context/SessionManager";
import { RefreshCcw } from "lucide-react";
import { useAccount } from "@/context/AccountContext";
import { useState } from "react";

export function AccountOverview() {
	const { user, refreshUser } = useSession();
	const { balance, loadingBalance, refreshBalance } = useAccount();
	const [refreshing, setRefreshing] = useState(false);

	const handleRefresh = async () => {
		setRefreshing(true);
		await refreshBalance();
		setRefreshing(false);
	};

	return (
		<Card className="w-full max-w-2xl shadow-lg border border-default-200">
			<CardHeader className="text-lg font-semibold flex items-center justify-between">
				<span>Account Overview</span>
				<Button
					size="sm"
					variant="flat"
					color="primary"
					isLoading={refreshing}
					onClick={handleRefresh}
					startContent={<RefreshCcw size={16} />}>
					Refresh
				</Button>
			</CardHeader>
			<CardBody className="flex flex-col gap-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					<div>
						<div className="text-xs text-default-500 font-medium mb-1">Payment Id</div>
						<Input
							value={user?.paymentIdentifier || "-"}
							readOnly
							size="sm"
							className="w-full"
						/>
					</div>
					<div>
						<div className="text-xs text-default-500 font-medium mb-1">Balance</div>
						<div className="text-sm font-mono text-primary font-bold">
							{loadingBalance ? (
								"Loading..."
							) : (
								<>
									{balance?.tokens?.map((token) => (
										<div key={token.name} className="flex justify-between">
											<span>{token.name}</span>
											<span>{token.balance}</span>
										</div>
									))}
								</>
							)}
						</div>
					</div>
					<div>
						<div className="text-xs text-default-500 font-medium mb-1">Email</div>
						<Input value={user?.email} readOnly size="sm" className="w-full" />
					</div>
					<div className="flex items-end">
						<Button
							color="primary"
							className="w-full"
							radius="full"
							href="/account/profile"
							as="a">
							Manage Profile
						</Button>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
