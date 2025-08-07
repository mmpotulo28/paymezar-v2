import { Card, CardBody, CardHeader, Snippet } from "@heroui/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useSession } from "@/context/SessionManager";
import { RefreshCcw } from "lucide-react";
import { useAccount } from "@/context/AccountContext";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export function AccountOverview() {
	const { user } = useUser();
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
					<div className="w-full">
						<div className="text-xs text-default-500 font-medium mb-1">Payment Id</div>
						<Snippet size="sm" hideSymbol variant="flat" className="w-full">
							{(user?.publicMetadata?.paymentId as string) || "-"}
						</Snippet>
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
					<div className="w-full">
						<div className="text-xs text-default-500 font-medium mb-1">Email</div>
						<Snippet size="sm" hideSymbol variant="flat" className="w-full">
							{user?.primaryEmailAddress?.emailAddress || "-"}
						</Snippet>
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
