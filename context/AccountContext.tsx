"use client";
import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
	useCallback,
} from "react";
import { iTransaction, iBankAccount, iCharge } from "@/types";
import { useSession } from "./SessionManager";
import { postApi, getUserBalance, getBankAccounts } from "@/lib/helpers";

interface AccountContextProps {
	transactions: iTransaction[];
	loading: boolean;
	error: string | null;
	refreshTransactions: () => Promise<void>;
	balance: { tokens: { name: string; balance: string }[] } | null;
	loadingBalance: boolean;
	refreshBalance: () => Promise<void>;
	bankAccounts: iBankAccount[];
	loadingBankAccounts: boolean;
	refreshBankAccounts: () => Promise<void>;
	charges: iCharge[];
	loadingCharges: boolean;
	refreshCharges: () => Promise<void>;
}

const AccountContext = createContext<AccountContextProps>({
	transactions: [],
	loading: false,
	error: null,
	refreshTransactions: async () => {},
	balance: null,
	loadingBalance: false,
	refreshBalance: async () => {},
	bankAccounts: [],
	loadingBankAccounts: false,
	refreshBankAccounts: async () => {},
	charges: [],
	loadingCharges: false,
	refreshCharges: async () => {},
});

export function useAccount() {
	return useContext(AccountContext);
}

export function AccountProvider({ children }: { children: ReactNode }) {
	const { user } = useSession();
	const [transactions, setTransactions] = useState<iTransaction[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [balance, setBalance] = useState<{ tokens: { name: string; balance: string }[] } | null>(
		null,
	);
	const [loadingBalance, setLoadingBalance] = useState(false);

	const [bankAccounts, setBankAccounts] = useState<iBankAccount[]>([]);
	const [loadingBankAccounts, setLoadingBankAccounts] = useState(false);

	const [charges, setCharges] = useState<iCharge[]>([]);
	const [loadingCharges, setLoadingCharges] = useState(false);

	const fetchTransactions = useCallback(async () => {
		if (!user?.id) {
			setTransactions([]);
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const result = await postApi(
				`https://seal-app-qp9cc.ondigitalocean.app/api/v1/transactions/${encodeURIComponent(user.id)}`,
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
				setError(result.message || "Failed to fetch transactions.");
			}
		} catch (e: any) {
			setTransactions([]);
			setError(e.message || "Failed to fetch transactions.");
		}
		setLoading(false);
	}, [user?.id]);

	const fetchBalance = useCallback(async () => {
		if (!user?.id) {
			setBalance(null);
			return;
		}
		setLoadingBalance(true);
		try {
			const response = await getUserBalance({ userId: user.id });
			if (!response.error) {
				setBalance({ tokens: response.data?.tokens || [] });
			} else {
				setBalance(null);
			}
		} catch (e) {
			setBalance(null);
		}
		setLoadingBalance(false);
	}, [user?.id]);

	const fetchBankAccounts = useCallback(async () => {
		if (!user?.id) {
			setBankAccounts([]);
			return;
		}
		setLoadingBankAccounts(true);
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
				setBankAccounts([]);
			}
		} catch (e) {
			setBankAccounts([]);
		}
		setLoadingBankAccounts(false);
	}, [user?.id]);

	const fetchCharges = useCallback(async () => {
		if (!user?.id) {
			setCharges([]);
			return;
		}
		setLoadingCharges(true);
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
				setCharges(result.data);
			} else {
				setCharges([]);
			}
		} catch {
			setCharges([]);
		}
		setLoadingCharges(false);
	}, [user?.id]);

	useEffect(() => {
		fetchTransactions();
		fetchBalance();
		fetchBankAccounts();
		fetchCharges();
	}, [fetchTransactions, fetchBalance, fetchBankAccounts, fetchCharges]);

	return (
		<AccountContext.Provider
			value={{
				transactions,
				loading,
				error,
				refreshTransactions: fetchTransactions,
				balance,
				loadingBalance,
				refreshBalance: fetchBalance,
				bankAccounts,
				loadingBankAccounts,
				refreshBankAccounts: fetchBankAccounts,
				charges,
				loadingCharges,
				refreshCharges: fetchCharges,
			}}>
			{children}
		</AccountContext.Provider>
	);
}
