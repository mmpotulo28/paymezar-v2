import { Card, CardBody } from "@heroui/react";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";

export interface UserProfileCardProps {
	name: string;
	email?: string;
	address: string;
	balance: number;
	avatar: string;
	className?: string;
}

export function UserProfileCard({
	name,
	email,
	address,
	balance,
	avatar,
	className = "",
}: UserProfileCardProps) {
	return (
		<Card
			className={`w-full max-w-xl shadow-lg border border-default-200 bg-gradient-to-br from-white to-gray-50 ${className}`}>
			<CardBody className="flex flex-col sm:flex-row items-center gap-6 p-6">
				<div className="flex flex-col items-center sm:items-start gap-2">
					<Avatar src={avatar} size="lg" className="ring-2 ring-primary-400" />
					<span className="text-xs text-default-400 font-medium">User</span>
				</div>
				<div className="flex-1 min-w-0 w-full">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div className="flex flex-col gap-1">
							<span className="text-xs text-default-500 font-medium">Name</span>
							<span className="font-semibold text-base truncate">{name}</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-xs text-default-500 font-medium">Email</span>
							<span className="text-sm text-default-700 truncate">
								{email || (
									<span className="italic text-default-400">Not provided</span>
								)}
							</span>
						</div>
						<div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
							<span className="text-xs text-default-500 font-medium">Address</span>
							<Snippet
								hideSymbol
								variant="bordered"
								className="text-xs truncate max-w-full">
								<span>
									<Code color="primary">{address}</Code>
								</span>
							</Snippet>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-xs text-default-500 font-medium">Balance</span>
							<span className="text-xl font-bold flex items-center gap-2">
								{balance.toLocaleString("en-ZA", {
									style: "currency",
									currency: "ZAR",
								})}
								<Badge color="success">ZAR</Badge>
							</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-xs text-default-500 font-medium">Status</span>
							<Badge color="primary" variant="flat">
								Active
							</Badge>
						</div>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
