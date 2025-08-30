import React from "react";
import { Card, CardHeader, CardBody, Chip, Spinner, Image, Alert } from "@heroui/react";
import { iUserTokenBalance } from "@mmpotulo/stablecoin-hooks";
import { Coins, Wallet } from "lucide-react";

export interface TokenBalanceProps {
	float: iUserTokenBalance[];
	loadingFloat: boolean;
	floatError: string | undefined;
}

export function TokenBalances({ float, loadingFloat, floatError }: TokenBalanceProps) {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center gap-2">
					<Wallet className="text-xl" />
					<span className="font-semibold">Token Balances</span>
				</div>
			</CardHeader>
			<CardBody>
				{loadingFloat && (
					<div className="flex items-center gap-2 justify-center py-8">
						<Spinner label="Loading balances..." />
					</div>
				)}

				{floatError && (
					<Alert
						title="Error"
						description={floatError}
						variant="bordered"
						color="danger"
					/>
				)}

				{!loadingFloat && float.length === 0 && (
					<div className="flex flex-col items-center justify-center py-8">
						<Image
							src="https://illustrations.popsy.co/gray/empty-wallet.svg"
							alt="No tokens"
							width={80}
							height={80}
							className="mb-4"
						/>
						<div className="text-default-500 font-medium">No tokens found.</div>
					</div>
				)}

				{!loadingFloat && float.length > 0 && (
					<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
						{float.map((token) => (
							<Card
								key={token.name}
								className="flex flex-col items-center justify-center p-6 bg-default-100 shadow-md rounded-xl ">
								<div className="flex items-center gap-2 mb-2">
									<Coins className="text-2xl text-primary" />
									<span className="font-semibold text-lg text-nowrap">
										{token.name}
									</span>
								</div>
								<div className="flex flex-col items-center mt-2">
									<span className="text-default-400 text-xs mb-1">Balance</span>
									<Chip
										color="primary"
										variant="flat"
										className="text-xl px-4 py-2 font-bold">
										{token.balance}
									</Chip>
								</div>
							</Card>
						))}
					</div>
				)}
			</CardBody>
		</Card>
	);
}
