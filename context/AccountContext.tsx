"use client";
import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";

import { iTransaction, iBankAccount, iCharge, iSubscription, iUserTokenBalance } from "@/types";
import { useLiskTransactions } from "@/hooks/useLiskTransactions";
import { useLiskBank } from "@/hooks/useLiskBank";
import { useLiskCharges } from "@/hooks/useLiskCharges";
import useSubscriptions from "@/hooks/useSubscriptions";
import { useLiskBalances } from "@/hooks/useLiskBalances";
interface AccountContextProps {
	transactions: iTransaction[];
	transactionsLoading: boolean;
	transactionsError: string | undefined;
	refreshTransactions: (id: string) => Promise<iTransaction[]>;
	balances: iUserTokenBalance[];
	balancesLoading: boolean;
	refreshBalances: (id: string) => Promise<iUserTokenBalance[]>;
	balancesError: string | undefined;
	bankAccount: iBankAccount | undefined;
	bankLoading: boolean;
	refreshBankAccount: (id: string) => Promise<iBankAccount | undefined>;
	bankError: string | undefined;
	charges: iCharge[];
	chargeLoading: boolean;
	refreshCharges: (id: string) => Promise<iCharge[]>;
	chargesError: string | undefined;
	subscriptions: iSubscription[];
	subscriptionLoading: boolean;
	refreshSubscriptions: (id: string) => Promise<iSubscription[]>;
	subscriptionError: string | undefined;
}

const AccountContext = createContext<AccountContextProps>({
	transactions: [],
	transactionsLoading: false,
	transactionsError: undefined,
	refreshTransactions: async () => [],
	balances: [],
	balancesLoading: false,
	refreshBalances: async () => [],
	balancesError: undefined,
	bankAccount: undefined,
	bankLoading: false,
	refreshBankAccount: async () => undefined,
	bankError: undefined,
	charges: [],
	chargeLoading: false,
	refreshCharges: async () => [],
	chargesError: undefined,
	subscriptions: [],
	subscriptionLoading: false,
	refreshSubscriptions: async () => [],
	subscriptionError: undefined,
});

export function useAccount() {
	return useContext(AccountContext);
}

export function AccountProvider({ children }: { children: ReactNode }) {
	const { user } = useUser();
	const { transactions, fetchTransactions, transactionsError, transactionsLoading } =
		useLiskTransactions();

	const { balances, balancesLoading, balancesError, fetchBalances } = useLiskBalances();

	const { bankAccount, getBankAccount, bankError, bankLoading } = useLiskBank();

	const { charges, fetchCharges, chargeError, chargeLoading } = useLiskCharges();

	const { subscriptions, fetchSubscriptions, subscriptionError, subscriptionLoading } =
		useSubscriptions();

	useEffect(() => {
		if (!user) return;
		fetchTransactions(user?.id);
		fetchBalances(user?.id);
		getBankAccount(user?.id);
		fetchCharges(user?.id);
		fetchSubscriptions(user?.id);
	}, [fetchTransactions, fetchBalances, getBankAccount, fetchCharges, fetchSubscriptions]);

	return (
		<AccountContext.Provider
			value={{
				transactions,
				transactionsLoading,
				refreshTransactions: fetchTransactions,
				transactionsError,

				balances,
				balancesLoading,
				refreshBalances: fetchBalances,
				balancesError,

				bankAccount,
				bankLoading,
				refreshBankAccount: getBankAccount,
				bankError,
				charges,
				chargeLoading,
				refreshCharges: fetchCharges,
				chargesError: chargeError,
				subscriptions,
				subscriptionLoading,
				refreshSubscriptions: fetchSubscriptions,
				subscriptionError,
			}}>
			{children}
		</AccountContext.Provider>
	);
}
