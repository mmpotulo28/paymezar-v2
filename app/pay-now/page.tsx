"use client";
import { Tabs, Tab } from "@heroui/tabs";
import { UserProfileCard } from "@/components/user-profile-card";
import { RecentTransactions } from "@/components/recent-transactions";
import { dummyTransactions } from "@/lib/dummy-transactions";
import { dummyUser } from "@/lib/dummy-user";
import { Suspense } from "react";
import RequestPayment from "@/components/payments/request-payment";
import SendPayment from "@/components/payments/send-payment";

export default function PayNowPage() {
	return (
		<section className="flex flex-col items-center justify-start min-h-[70vh] py-8 gap-8 w-full h-full">
			<Suspense fallback={<div>Loading user profile...</div>}>
				<UserProfileCard user={dummyUser} className="max-w-2xl" />
			</Suspense>
			<Tabs className="w-full max-w-2xl">
				<Tab key="send" title="Send Payment" className="w-full flex flex-col items-center">
					<SendPayment />
				</Tab>

				<Tab
					key="request"
					title="Request Payment"
					className="w-full flex flex-col items-center">
					<RequestPayment />
				</Tab>

				<Tab
					key="transactions"
					title="Recent Transactions"
					className="w-full flex align-center justify-center">
					<RecentTransactions transactions={dummyTransactions} />
				</Tab>
			</Tabs>
		</section>
	);
}
