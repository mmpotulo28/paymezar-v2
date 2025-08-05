"use client";
import { Card, CardBody, Chip, Link } from "@heroui/react";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { iUser } from "@/types";
import { Lock } from "lucide-react";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

export interface UserProfileCardProps {
	user?: iUser | null;
	className?: string;
}

export function UserProfileCard({ user, className = "" }: UserProfileCardProps) {
	const router = useRouter();

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

	const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
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
						{(user.role && user.role.charAt(0) + user.role.slice(1).toLowerCase()) ||
							"User"}
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
								{user.email || (
									<span className="italic text-default-400">Not provided</span>
								)}
							</span>
						</div>
						<div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
							<span className="text-xs text-default-500 font-medium">Payment Id</span>
							<Snippet
								hideSymbol
								variant="bordered"
								className="text-xs truncate max-w-full">
								<span>
									<Code color="primary">{user.paymentIdentifier || "-"}</Code>
								</span>
							</Snippet>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-xs text-default-500 font-medium">
								Payment Enabled
							</span>
							<span className="text-xs text-default-700 truncate">
								{user.enabledPay ? (
									<span className="font-semibold">Enabled</span>
								) : (
									<span className="italic text-default-400">Not set</span>
								)}
							</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-xs text-default-500 font-medium">Status</span>
							<Chip color={user.enabledPay ? "primary" : "default"} variant="flat">
								{user.enabledPay ? "Active" : "Inactive"}
							</Chip>
						</div>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
