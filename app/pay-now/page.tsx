"use client";
import { Tabs, Tab } from "@heroui/tabs";
import { UserProfileCard } from "@/components/user-profile-card";
import { RecentTransactions } from "@/components/recent-transactions";
import { Suspense } from "react";
import RequestPayment from "@/components/payments/request-payment";
import SendPayment from "@/components/payments/send-payment";
import { WithdrawDeposit } from "@/components/account/WithdrawDeposit";
import { ChargesList } from "@/components/charges-list";

export default function PayNowPage() {
	return (
		<section className="flex flex-col items-center justify-start min-h-[70vh] py-8 gap-8 w-full h-full">
			<Suspense fallback={<div>Loading user profile...</div>}>
				<UserProfileCard className="max-w-2xl" />
			</Suspense>
			<Tabs color="primary" destroyInactiveTabPanel className="w-full max-w-2xl">
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
					key="withdraw-deposit"
					className="w-full flex align-center justify-center max-w-2xl"
					title="Withdraw / Deposit">
					<WithdrawDeposit />
				</Tab>

				<Tab
					key="transactions"
					title="Transactions"
					className="w-full flex align-center justify-center">
					<RecentTransactions />
				</Tab>
				<Tab
					key="charges"
					title="Charges"
					className="w-full flex align-center justify-center">
					<ChargesList />
				</Tab>
			</Tabs>
		</section>
	);
}
