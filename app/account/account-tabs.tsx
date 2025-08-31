"use client";
import { AccountOverview } from "@/components/account/AccountOverview";
import { BalanceHistory } from "@/components/account/BalanceHistory";
import { BankAccounts } from "@/components/account/BankAccounts";
import { CouponsList } from "@/components/account/CouponsList";
import { SubscriptionsList } from "@/components/account/SubscriptionsList";
import UserBalances from "@/components/account/UserBalances";
import { Tabs, Tab } from "@heroui/react";

const AccountTabs = () => {
	return (
		<Tabs className="max-w-2xl w-full" variant="bordered" color="primary">
			<Tab
				key="overview"
				className="w-full flex align-center justify-center max-w-2xl"
				title="Overview">
				<AccountOverview />
			</Tab>
			<Tab
				key="balance"
				className="w-full flex align-center justify-center max-w-2xl"
				title="Balance">
				<UserBalances />
			</Tab>

			<Tab
				key="analytics"
				className="w-full flex align-center justify-center max-w-2xl"
				title="Analytics">
				<BalanceHistory />
			</Tab>

			<Tab
				key="bank"
				className="w-full flex align-center justify-center max-w-2xl"
				title="Bank Accounts">
				<BankAccounts />
			</Tab>
			<Tab
				key="subscriptions"
				className="w-full flex align-center justify-center max-w-2xl"
				title="Subscriptions">
				<SubscriptionsList />
			</Tab>

			<Tab
				key="coupons"
				className="w-full flex align-center justify-center max-w-2xl"
				title="Coupons">
				<CouponsList limit={4} />
			</Tab>
		</Tabs>
	);
};

export default AccountTabs;
