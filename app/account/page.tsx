"use client";
import { Tabs, Tab } from "@heroui/tabs";

import { UserProfileCard } from "@/components/user-profile-card";
import { AccountOverview } from "@/components/account/AccountOverview";
import { BalanceHistory } from "@/components/account/BalanceHistory";
import { BankAccounts } from "@/components/account/BankAccounts";
import { SubscriptionsList } from "@/components/account/SubscriptionsList";
import { CouponsList } from "@/components/account/CouponsList";
import UserBalances from "@/components/account/UserBalances";

export default function AccountPage() {
	return (
		<section className="flex flex-col items-center min-h-[70vh] py-8 gap-8 w-full">
			{/* User Profile */}
			{<UserProfileCard className="max-w-2xl w-full" />}

			{/* Account Management Tabs */}
			<Tabs className="max-w-2xl w-full" variant="solid">
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
		</section>
	);
}
