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

interface AccountContextProps {
	transactions: iTransaction[];
	loadingTransactions: boolean;
	transactionsError: string | null;
	refreshTransactions: () => Promise<void>;
	balance: { tokens: { name: string; balance: string }[] } | null;
	loadingBalance: boolean;
	refreshBalance: () => Promise<void>;
	balanceError: string | null;
	bankAccounts: iBankAccount[];
	loadingBankAccounts: boolean;
	refreshBankAccounts: () => Promise<void>;
	bankAccountsError: string | null;
	charges: iCharge[];
	loadingCharges: boolean;
	refreshCharges: () => Promise<void>;
	chargesError: string | null;
	subscriptions: iSubscription[];
	loadingSubscriptions: boolean;
	refreshSubscriptions: () => Promise<void>;
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
	const [transactions, setTransactions] = useState<iTransaction[]>([]);
	const [loadingTransactions, setLoadingTransactions] = useState(false);
	const [transactionsError, setTransactionsError] = useState<string | null>(null);

	const [balance, setBalance] = useState<{
		tokens: { name: string; balance: string }[];
	} | null>(null);
	const [loadingBalance, setLoadingBalance] = useState(false);
	const [balanceError, setBalanceError] = useState<string | null>(null);

	const [bankAccounts, setBankAccounts] = useState<iBankAccount[]>([]);
	const [loadingBankAccounts, setLoadingBankAccounts] = useState(false);
	const [bankAccountsError, setBankAccountsError] = useState<string | null>(null);

	const [charges, setCharges] = useState<iCharge[]>([]);
	const [loadingCharges, setLoadingCharges] = useState(false);
	const [chargesError, setChargesError] = useState<string | null>(null);

	const [subscriptions, setSubscriptions] = useState<iSubscription[]>([]);
	const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);
	const [subscriptionError, setSubscriptionError] = useState<string | null>(null);

	const fetchTransactions = useCallback(async () => {
		if (!user?.id) {
			setTransactions([]);

			return;
		}
		setLoadingTransactions(true);
		setTransactionsError(null);
		try {
			const result = await postApi(
				`https://seal-app-qp9cc.ondigitalocean.app/api/v1/${encodeURIComponent(user.id)}/transactions`,
				{},
				{
					Authorization: process.env.NEXT_PUBLIC_LISK_API_KEY || "",
				},
				"GET",
			);

			if (!result.error && Array.isArray(result.data)) {
				setTransactions(result.data);
			} else if (!result.error && Array.isArray(result.data?.transactions)) {
				setTransactions(result.data.transactions);
			} else {
				setTransactions([]);
				setTransactionsError(result.message || "Failed to fetch transactions.");
			}
		} catch (e: any) {
			setTransactions([]);
			setTransactionsError(e.message || "Failed to fetch transactions.");
		}
		setLoadingTransactions(false);
	}, [user?.id]);

	const fetchBalance = useCallback(async () => {
		if (!user?.id) {
			setBalanceError("User not found.");
			setBalance(null);

			return;
		}
		setLoadingBalance(true);
		setBalanceError(null);
		try {
			const response = await getUserBalance({ userId: user.id });

			if (!response.error) {
				setBalance({ tokens: response.data?.tokens || [] });
			} else {
				setBalanceError(response.message || "Failed to fetch balance.");
				setBalance(null);
			}
		} catch (e) {
			setBalanceError("Failed to fetch balance.");
			console.error("Error fetching balance:", e);
			setBalance(null);
		}
		setLoadingBalance(false);
	}, [user?.id]);

	const fetchBankAccounts = useCallback(async () => {
		if (!user?.id) {
			setBankAccountsError("User not found.");
			setBankAccounts([]);

			return;
		}
		setLoadingBankAccounts(true);
		setBankAccountsError(null);
		try {
			const result = await getBankAccounts({ userId: user.id });

			if (!result.error && result.data) {
				const arr = Array.isArray(result.data)
					? result.data
					: result.data.bankAccount
						? [result.data.bankAccount]
						: result.data.id
							? [result.data]
							: [];

				setBankAccounts(arr);
			} else {
				setBankAccountsError(result.message || "Failed to fetch bank accounts.");
				setBankAccounts([]);
			}
		} catch (e) {
			setBankAccounts([]);
		}
		setLoadingBankAccounts(false);
	}, [user?.id]);

	const fetchCharges = useCallback(async () => {
		if (!user?.id) {
			setChargesError("User not found.");
			setCharges([]);

			return;
		}
		setLoadingCharges(true);
		setChargesError(null);
		try {
			const result = await postApi(
				`https://seal-app-qp9cc.ondigitalocean.app/api/v1/charge/${encodeURIComponent(user.id)}`,
				{},
				{
					Authorization: process.env.NEXT_PUBLIC_LISK_API_KEY || "",
				},
				"GET",
			);

			if (!result.error && Array.isArray(result.data?.charges)) {
				setCharges(result.data.charges);
			} else if (!result.error && Array.isArray(result.data)) {
				setChargesError(result.message || "Failed to fetch charges.");
				setCharges(result.data);
			} else {
				setCharges([]);
			}
		} catch {
			setCharges([]);
		}
		setLoadingCharges(false);
	}, [user?.id]);

	const fetchSubscriptions = useCallback(async () => {
		if (!user?.id) {
			setSubscriptionError("User not found.");
			setSubscriptions([]);

			return;
		}
		setLoadingSubscriptions(true);
		setSubscriptionError(null);
		try {
			const result = await postApi(
				`/api/subscription/list?id=${encodeURIComponent(user.id)}`,
				{},
				{ "Content-Type": "application/json" },
				"GET",
			);

			if (result.error) {
				throw new Error(result.message);
			}
			if (Array.isArray(result.data?.subscriptions)) {
				const updatedSubscriptions = result.data.subscriptions.map((sub: iSubscription) => {
					const planDetails = PLAN_DETAILS[sub.plan] || {};
					return {
						...sub,
						planDetails,
					};
				});
				setSubscriptions(updatedSubscriptions);
			} else if (Array.isArray(result.data)) {
				setSubscriptions(result.data);
			} else {
				setSubscriptionError("No subscriptions found.");
				setSubscriptions([]);
			}
		} catch (error: any) {
			console.error("Error fetching subscriptions:", error);
			setSubscriptions([]);
			setSubscriptionError(error.message || error || "Failed to fetch subscriptions.");
		}
		setLoadingSubscriptions(false);
	}, [user?.id]);

	useEffect(() => {
		fetchTransactions();
		fetchBalance();
		fetchBankAccounts();
		fetchCharges();
		fetchSubscriptions();
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
