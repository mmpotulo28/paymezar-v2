"use client";
import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
	useCallback,
} from "react";
import { useUser } from "@clerk/nextjs";

import { iTransaction, iBankAccount, iCharge, iSubscription } from "@/types";
import { postApi, getUserBalance, getBankAccounts } from "@/lib/helpers";
import { PLAN_DETAILS } from "@/lib/constants";
import { useLiskTransactions } from "@/hooks/useLiskTransactions";

const API_BASE = process.env.NEXT_PUBLIC_LISK_API_BASE || "";

interface AccountContextProps {
	transactions: iTransaction[];
	loadingTransactions: boolean;
	transactionsError: string | null;
	refreshTransactions: (id: string) => Promise<void>;
	balance: { tokens: { name: string; balance: string }[] } | null;
	loadingBalance: boolean;
	refreshBalance: (id: string) => Promise<void>;
	balanceError: string | null;
	bankAccounts: iBankAccount[];
	loadingBankAccounts: boolean;
	refreshBankAccounts: (id: string) => Promise<void>;
	bankAccountsError: string | null;
	charges: iCharge[];
	loadingCharges: boolean;
	refreshCharges: (id: string) => Promise<void>;
	chargesError: string | null;
	subscriptions: iSubscription[];
	loadingSubscriptions: boolean;
	refreshSubscriptions: (id: string) => Promise<void>;
	subscriptionError: string | null;
}

const AccountContext = createContext<AccountContextProps>({
	transactions: [],
	loadingTransactions: false,
	transactionsError: null,
	refreshTransactions: async () => {},
	balance: null,
	loadingBalance: false,
	refreshBalance: async () => {},
	balanceError: null,
	bankAccounts: [],
	loadingBankAccounts: false,
	refreshBankAccounts: async () => {},
	bankAccountsError: null,
	charges: [],
	loadingCharges: false,
	refreshCharges: async () => {},
	chargesError: null,
	subscriptions: [],
	loadingSubscriptions: false,
	refreshSubscriptions: async () => {},
	subscriptionError: null,
});

export function useAccount() {
	return useContext(AccountContext);
}

export function AccountProvider({ children }: { children: ReactNode }) {
	const { user } = useUser();
	const {
		balances: balance,
		balancesError: balanceError,
		balancesLoading: loadingBalance,
		fetchUserBalances: fetchBalance,

		transactions,
		fetchUserTransactions: fetchTransactions,
		transactionsError,
		transactionLoading: loadingTransactions,
	} = useLiskTransactions();

	const {} = useLiskBank();

	useEffect(() => {
		if (!user) return;
		fetchTransactions(user?.id);
		fetchBalance(user?.id);
		fetchBankAccounts(user?.id);
		fetchCharges(user?.id);
		fetchSubscriptions(user?.id);
	}, [fetchTransactions, fetchBalance, fetchBankAccounts, fetchCharges, fetchSubscriptions]);

	return (
		<AccountContext.Provider
			value={{
				transactions,
				loadingTransactions,
				refreshTransactions: fetchTransactions,
				transactionsError,
				balance,
				loadingBalance,
				refreshBalance: fetchBalance,
				balanceError,
				bankAccounts,
				loadingBankAccounts,
				refreshBankAccounts: fetchBankAccounts,
				bankAccountsError,
				charges,
				loadingCharges,
				refreshCharges: fetchCharges,
				chargesError,
				subscriptions,
				loadingSubscriptions,
				refreshSubscriptions: fetchSubscriptions,
				subscriptionError,
			}}>
			{children}
		</AccountContext.Provider>
	);
}
