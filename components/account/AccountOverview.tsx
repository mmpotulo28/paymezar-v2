import { Alert, Card, CardBody, CardHeader, Snippet } from "@heroui/react";
import { Button } from "@heroui/button";
import { RefreshCcw } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import Link from "next/link";

import { useAccount } from "@/context/AccountContext";

export function AccountOverview() {
	const { user } = useUser();
	const { balances, balancesLoading, balancesError, refreshBalances } = useAccount();
	const [refreshing, setRefreshing] = useState(false);

	const handleRefresh = async () => {
		setRefreshing(true);
		await refreshBalances(user?.id || "");
		setRefreshing(false);
	};

	return (
		<Card className="w-full max-w-2xl shadow-lg border border-default-200">
			<CardHeader className="text-lg font-semibold flex items-center justify-between">
				<span>Account Overview</span>
				<Button
					color="primary"
					isLoading={refreshing}
					size="sm"
					startContent={<RefreshCcw size={16} />}
					variant="flat"
					onPress={handleRefresh}>
					Refresh
				</Button>
			</CardHeader>
			<CardBody className="flex flex-col gap-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					<div className="w-full">
						<div className="text-xs text-default-500 font-medium mb-1">Payment Id</div>
						<Snippet hideSymbol className="w-full" size="sm" variant="flat">
							{(user?.unsafeMetadata?.paymentId as string) || "-"}
						</Snippet>
					</div>
					<div>
						<div className="text-xs text-default-500 font-medium mb-1">Balance</div>
						<div className="text-sm font-mono text-primary font-bold">
							{balancesLoading ? (
								"Loading..."
							) : (
								<>
									{balances?.map((token) => (
										<div key={token.name} className="flex justify-between">
											<span>{token.name}</span>
											<span>{token.balance}</span>
										</div>
									))}
								</>
							)}
						</div>

						{balancesError && (
							<Alert className="py-1" color="danger" variant="bordered">
								{balancesError}
							</Alert>
						)}
					</div>
					<div className="w-full">
						<div className="text-xs text-default-500 font-medium mb-1">Email</div>
						<Snippet hideSymbol className="w-full" size="sm" variant="flat">
							{user?.primaryEmailAddress?.emailAddress || "-"}
						</Snippet>
					</div>
					<div className="w-full">
						<div className="text-xs text-default-500 font-medium mb-1">User ID</div>
						<Snippet hideSymbol className="w-full" size="sm" variant="flat">
							{user?.id || "-"}
						</Snippet>
					</div>
					<div className="flex items-end">
						<Button
							as={Link}
							className="w-full"
							color="secondary"
							href="/account/profile"
							radius="sm">
							Manage Profile
						</Button>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
