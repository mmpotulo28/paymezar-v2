"use client";
import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { Badge } from "@heroui/badge";
import { Tabs, Tab } from "@heroui/tabs";
import { Avatar } from "@heroui/avatar";

import { HeartFilledIcon, GithubIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { dummyUser } from "@/lib/dummy-user";
import { UserProfileCard } from "@/components/user-profile-card";
import { useSession } from "@/context/SessionManager";
import { useRouter } from "next/navigation";

export default function Home() {
	// Use dummyUser from lib
	const transactions = [
		{
			id: 1,
			to: "0x5678...efgh",
			amount: 500,
			status: "Completed",
			date: "2025-07-30",
			direction: "out",
		},
		{
			id: 2,
			to: "0x9999...zzzz",
			amount: 1200,
			status: "Pending",
			date: "2025-07-29",
			direction: "out",
		},
		{
			id: 3,
			from: "0xaaaa...bbbb",
			amount: 2000,
			status: "Completed",
			date: "2025-07-28",
			direction: "in",
		},
	];

	const { isAuthenticated, user } = useSession();
	const router = useRouter();

	return (
		<section className="flex flex-col items-center justify-center gap-8 py-10 w-full min-h-[80vh]">
			{/* Hero Section */}
			<div className="inline-block max-w-2xl text-center justify-center">
				<span className={title({ color: "violet" })}>PayMe-Zar&nbsp;</span>
				<span className={title()}>— ZAR Stablecoin Payments</span>
				<div className={subtitle({ class: "mt-4" })}>
					Send, receive, and manage South African Rand (ZAR) stablecoin payments on the
					Lisk blockchain. Fast, secure, and borderless.
				</div>
			</div>

			{/* Quick Actions */}
			<div className="flex flex-wrap gap-4 justify-center">
				<Link
					className={buttonStyles({
						color: "primary",
						radius: "full",
						variant: "shadow",
					})}
					href="/pay-now">
					Send Payment
				</Link>
				<Link
					className={buttonStyles({
						color: "secondary",
						radius: "full",
						variant: "flat",
					})}
					href="/account">
					My Account
				</Link>
				<Link
					className={buttonStyles({ variant: "bordered", radius: "full" })}
					href={siteConfig.links.github}
					isExternal>
					<GithubIcon size={20} />
					GitHub
				</Link>
			</div>

			{/* User summary preview or Login button */}

			<UserProfileCard user={user} className="max-w-2xl w-full" />

			{/* App Features */}
			<div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
				<Card className="bg-gradient-to-br from-violet-100 to-violet-50">
					<CardBody className="flex flex-col items-center text-center gap-2">
						<span className="text-xl font-bold">Peer-to-Peer</span>
						<span className="text-default-600 text-sm">
							Direct, instant ZAR transfers between users.
						</span>
					</CardBody>
				</Card>
				<Card className="bg-gradient-to-br from-green-100 to-green-50">
					<CardBody className="flex flex-col items-center text-center gap-2">
						<span className="text-xl font-bold">Secure & Transparent</span>
						<span className="text-default-600 text-sm">
							Blockchain-powered, always verifiable.
						</span>
					</CardBody>
				</Card>
				<Card className="bg-gradient-to-br from-yellow-100 to-yellow-50">
					<CardBody className="flex flex-col items-center text-center gap-2">
						<span className="text-xl font-bold">Low Fees</span>
						<span className="text-default-600 text-sm">
							Affordable payments for everyone.
						</span>
					</CardBody>
				</Card>
			</div>

			{/* Recent Transactions Preview */}
			<Card className="w-full max-w-2xl mt-4">
				<CardHeader className="text-lg font-bold">Recent Transactions</CardHeader>
				<CardBody>
					<div className="flex flex-col gap-3">
						{transactions.map((tx) => (
							<div
								key={tx.id}
								className="flex items-center justify-between p-3 rounded-lg border border-default-200 bg-default-50">
								<div className="flex items-center gap-3">
									<Badge color={tx.direction === "in" ? "success" : "primary"}>
										{tx.direction === "in" ? "Received" : "Sent"}
									</Badge>
									<span className="font-mono text-xs text-default-600">
										{tx.direction === "in" ? tx.from : tx.to}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="font-semibold">
										{tx.amount.toLocaleString("en-ZA", {
											style: "currency",
											currency: "ZAR",
										})}
									</span>
									<Badge
										color={tx.status === "Completed" ? "success" : "warning"}>
										{tx.status}
									</Badge>
									<span className="text-xs text-default-400">{tx.date}</span>
								</div>
							</div>
						))}
					</div>
				</CardBody>
			</Card>

			{/* Footer */}
			<div className="mt-8 text-xs text-default-500 flex items-center gap-1">
				<HeartFilledIcon size={16} className="text-danger" /> Powered by Lisk & HeroUI
			</div>
		</section>
	);
}
