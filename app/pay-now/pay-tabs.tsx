"use client";
import { ChargesList } from "@/components/payments/charges-list";
import RequestPayment from "@/components/payments/request-payment";
import SendPayment from "@/components/payments/send-payment";
import { WithdrawDeposit } from "@/components/payments/withdraw-deposit";
import { RecentTransactions } from "@/components/recent-transactions";
import { Tabs, Tab } from "@heroui/react";

const PayTabs = () => {
	return (
		<Tabs
			destroyInactiveTabPanel
			className="w-full max-w-2xl"
			color="primary"
			variant="bordered">
			<Tab key="send" className="w-full flex flex-col items-center" title="Send Payment">
				<SendPayment />
			</Tab>

			<Tab
				key="request"
				className="w-full flex flex-col items-center"
				title="Request Payment">
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
				className="w-full flex align-center justify-center"
				title="Transactions">
				<RecentTransactions />
			</Tab>
			<Tab key="charges" className="w-full flex align-center justify-center" title="Charges">
				<ChargesList />
			</Tab>
		</Tabs>
	);
};

export default PayTabs;
