"use client";
import { Card, CardBody, Chip, Link } from "@heroui/react";
import { Avatar } from "@heroui/avatar";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { Lock } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export interface UserProfileCardProps {
	className?: string;
}

export function UserProfileCard({ className = "" }: UserProfileCardProps) {
	const { user } = useUser();

	if (!user) {
		return (
			<Card className={`w-full max-w-xl shadow-lg border border-default-200 ${className}`}>
				<CardBody className="flex flex-col items-center justify-center gap-6 p-8">
					<div className="flex flex-col items-center gap-3">
						<Lock size={48} className="text-primary" />
						<span className="text-xl font-bold text-default-800 text-center">
							You need to be authenticated to access this content
						</span>
						<span className="text-default-500 text-center text-sm">
							Please sign in to view your profile and account details.
						</span>
						<Link showAnchorIcon color="primary" className="mt-2" href="/auth/sign-in">
							Sign In
						</Link>
					</div>
				</CardBody>
			</Card>
		);
	}

	const fullName =
		[user.firstName, user.lastName].filter(Boolean).join(" ") ||
		user.primaryEmailAddress?.emailAddress;

	const hasLiskAccount = user.publicMetadata?.liskAccountCreated;
	const paymentId = user.publicMetadata?.paymentId as string;
	const paymentEnabled = user.publicMetadata?.paymentEnabled as boolean;

	return (
		<Card className={`w-full max-w-xl shadow-lg border border-default-200  ${className}`}>
			<CardBody className="flex flex-col sm:flex-row items-center gap-6 p-6">
				<div className="flex flex-col items-center sm:items-start gap-2">
					<Avatar
						src={user.imageUrl || undefined}
						size="lg"
						className="ring-2 ring-primary-400 bg-background"
					/>
					<span className="text-xs text-default-400 font-medium">
						{user?.organizationMemberships[0]?.role || "User"}
					</span>
				</div>
				<div className="flex-1 min-w-0 w-full">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div className="flex flex-col gap-1">
							<span className="text-xs text-default-500 font-medium">Name</span>
							<span className="font-semibold text-base truncate">{fullName}</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-xs text-default-500 font-medium">Email</span>
							<span className="text-sm text-default-700 truncate">
								{user.primaryEmailAddress?.emailAddress || (
									<span className="italic text-default-400">Not provided</span>
								)}
							</span>
						</div>
						<div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
							<span className="text-xs text-default-500 font-medium">Payment Id</span>
							{hasLiskAccount ? (
								<Snippet
									hideSymbol
									variant="bordered"
									className="text-xs truncate max-w-full">
									<span>
										<Code color="primary">{paymentId || "-"}</Code>
									</span>
								</Snippet>
							) : (
								<div className="text-xs text-warning italic">
									Blockchain account not set up yet
								</div>
							)}
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-xs text-default-500 font-medium">
								Payment Status
							</span>
							<Chip
								color={
									hasLiskAccount
										? paymentEnabled
											? "success"
											: "warning"
										: "default"
								}
								variant="flat">
								{hasLiskAccount
									? paymentEnabled
										? "Active"
										: "Inactive"
									: "Pending Setup"}
							</Chip>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-xs text-default-500 font-medium">
								Account Type
							</span>
							<span className="text-xs text-default-700">
								{user?.organizationMemberships[0]?.role || "User"}
							</span>
						</div>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
