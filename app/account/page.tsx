"use client";
import { Button } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import { Download, FileText } from "lucide-react";

import { UserProfileCard } from "@/components/user-profile-card";
import { RecentTransactions } from "@/components/recent-transactions";
import { AccountOverview } from "@/components/account/AccountOverview";
import { BalanceHistory } from "@/components/account/BalanceHistory";
import { BankAccounts } from "@/components/account/BankAccounts";
import { SubscriptionsList } from "@/components/account/SubscriptionsList";

export default function AccountPage() {
  const handleExportTransactions = () => {
    // Simulate export
    alert("Transactions exported!");
  };

  const handleDownloadStatement = () => {
    // Simulate download
    alert("Statement downloaded!");
  };

  return (
    <section className="flex flex-col items-center min-h-[70vh] py-8 gap-8 w-full">
      {/* User Profile */}
      {<UserProfileCard className="max-w-2xl w-full" />}

      {/* Account Management Tabs */}
      <Tabs className="max-w-2xl w-full" variant="solid">
        <Tab
          key="overview"
          className="w-full flex align-center justify-center max-w-2xl"
          title="Overview"
        >
          <AccountOverview />
        </Tab>
        <Tab
          key="analytics"
          className="w-full flex align-center justify-center max-w-2xl"
          title="Analytics"
        >
          <BalanceHistory />
        </Tab>

        <Tab
          key="bank"
          className="w-full flex align-center justify-center max-w-2xl"
          title="Bank Accounts"
        >
          <BankAccounts />
        </Tab>
        <Tab
          key="subscriptions"
          className="w-full flex align-center justify-center max-w-2xl"
          title="Subscriptions"
        >
          <SubscriptionsList />
        </Tab>
        <Tab
          key="transactions"
          className="w-full flex align-center justify-center max-w-2xl"
          title="Transactions"
        >
          <div className="flex flex-col gap-4 w-full">
            <div className="flex gap-2 justify-end">
              <Button
                color="primary"
                size="sm"
                startContent={<FileText size={16} />}
                variant="flat"
                onClick={handleExportTransactions}
              >
                Export Transactions
              </Button>
              <Button
                color="secondary"
                size="sm"
                startContent={<Download size={16} />}
                variant="flat"
                onClick={handleDownloadStatement}
              >
                Download Statement
              </Button>
            </div>
            <RecentTransactions className="max-w-2xl w-full" />
          </div>
        </Tab>
      </Tabs>
    </section>
  );
}
