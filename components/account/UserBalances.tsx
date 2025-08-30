"use client";
import { Alert, Button, Card, CardBody, CardHeader } from "@heroui/react";
import { TokenBalances } from "../TokenBalance";
import { useEffect } from "react";
import { useAccount } from "@/context/AccountContext";
import { useUser } from "@clerk/nextjs";
import { RefreshCcw } from "lucide-react";

const UserBalances: React.FC = () => {
	const { user } = useUser();
	const { fetchBalances, balances, balancesLoading, balancesError, balancesMessage } =
		useAccount();

	useEffect(() => {
		// Fetch user balances data here
		if (!user) return;
		fetchBalances(user.id);
	}, [fetchBalances, user]);

	const handleRefresh = async () => {
		await fetchBalances(user?.id || "", true);
	};

	return (
		<Card className="w-full">
			<CardHeader className="text-lg font-semibold flex items-center justify-between">
				<h2>User Balances</h2>
				<Button
					color="primary"
					isLoading={balancesLoading}
					size="sm"
					startContent={<RefreshCcw size={16} />}
					variant="flat"
					onPress={handleRefresh}>
					Refresh
				</Button>
			</CardHeader>
			<CardBody>
				{balancesMessage && (
					<Alert color="success" variant="bordered">
						{balancesMessage}
					</Alert>
				)}

				<TokenBalances
					float={balances}
					loadingFloat={balancesLoading}
					floatError={balancesError}
				/>
			</CardBody>
		</Card>
	);
};

export default UserBalances;
