"use client";
import { Tabs, Tab } from "@heroui/tabs";
import { Suspense } from "react";

import { UserProfileCard } from "@/components/user-profile-card";
import { RecentTransactions } from "@/components/recent-transactions";
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
      <Tabs
        destroyInactiveTabPanel
        className="w-full max-w-2xl"
        color="primary"
      >
        <Tab
          key="send"
          className="w-full flex flex-col items-center"
          title="Send Payment"
        >
          <SendPayment />
        </Tab>

        <Tab
          key="request"
          className="w-full flex flex-col items-center"
          title="Request Payment"
        >
          <RequestPayment />
        </Tab>

        <Tab
          key="withdraw-deposit"
          className="w-full flex align-center justify-center max-w-2xl"
          title="Withdraw / Deposit"
        >
          <WithdrawDeposit />
        </Tab>

        <Tab
          key="transactions"
          className="w-full flex align-center justify-center"
          title="Transactions"
        >
          <RecentTransactions />
        </Tab>
        <Tab
          key="charges"
          className="w-full flex align-center justify-center"
          title="Charges"
        >
          <ChargesList />
        </Tab>
      </Tabs>
    </section>
  );
}
