import { useState } from "react";
import axios from "axios";
import { iUserTokenBalance, iTransaction } from "@/types";
import { useUser } from "@clerk/nextjs";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;

export interface ILiskTransactions {
	balances: iUserTokenBalance[];
	balancesLoading: boolean;
	balancesError: string | null;
	fetchUserBalances: (userId: string) => Promise<void>;

	transactions: iTransaction[];
	transactionsLoading: boolean;
	transactionsError: string | null;
	fetchUserTransactions: (userId: string) => Promise<void>;

	transaction: iTransaction | null;
	transactionLoading: boolean;
	transactionError: string | null;
	fetchSingleTransaction: (userId: string, transactionId: string) => Promise<void>;
}

export function useLiskTransactions(): ILiskTransactions {
	const { user } = useUser();
	const [balances, setBalances] = useState<iUserTokenBalance[]>([]);
	const [balancesLoading, setBalancesLoading] = useState(false);
	const [balancesError, setBalancesError] = useState<string | null>(null);

	const [transactions, setTransactions] = useState<iTransaction[]>([]);
	const [transactionsLoading, setTransactionsLoading] = useState(false);
	const [transactionsError, setTransactionsError] = useState<string | null>(null);

	const [transaction, setTransaction] = useState<iTransaction | null>(null);
	const [transactionLoading, setTransactionLoading] = useState(false);
	const [transactionError, setTransactionError] = useState<string | null>(null);

	const fetchUserBalances = async (userId: string) => {
		setBalancesLoading(true);
		setBalancesError(null);
		try {
			const { data } = await axios.get<{ tokens: iUserTokenBalance[] }>(
				`${API_BASE}/${userId}/balance`,
				{ headers: { Authorization: (user?.unsafeMetadata.apiToken as string) || "" } },
			);
			setBalances(data.tokens || []);
		} catch (err: any) {
			if (err?.response?.status === 400) setBalancesError("Invalid user ID.");
			else if (err?.response?.status === 401) setBalancesError("Unauthorized.");
			else if (err?.response?.status === 404) setBalancesError("User not found.");
			else setBalancesError("Failed to fetch balances.");
		} finally {
			setBalancesLoading(false);
		}
	};

	const fetchUserTransactions = async (userId: string) => {
		setTransactionsLoading(true);
		setTransactionsError(null);
		try {
			const { data } = await axios.get<{ transactions: iTransaction[] }>(
				`${API_BASE}/${userId}/transactions`,
				{ headers: { Authorization: (user?.unsafeMetadata.apiToken as string) || "" } },
			);
			setTransactions(data.transactions || []);
		} catch (err: any) {
			if (err?.response?.status === 400) setTransactionsError("Invalid user ID.");
			else if (err?.response?.status === 401) setTransactionsError("Unauthorized.");
			else setTransactionsError("Failed to fetch transactions.");
		} finally {
			setTransactionsLoading(false);
		}
	};

	const fetchSingleTransaction = async (userId: string, transactionId: string) => {
		setTransactionLoading(true);
		setTransactionError(null);
		try {
			const { data } = await axios.get<iTransaction>(
				`${API_BASE}/${userId}/transactions/${transactionId}`,
				{ headers: { Authorization: (user?.unsafeMetadata.apiToken as string) || "" } },
			);
			setTransaction(data);
		} catch (err: any) {
			if (err?.response?.status === 400) setTransactionError("Invalid parameters.");
			else if (err?.response?.status === 401) setTransactionError("Unauthorized.");
			else if (err?.response?.status === 404) setTransactionError("Transaction not found.");
			else setTransactionError("Failed to fetch transaction.");
		} finally {
			setTransactionLoading(false);
		}
	};

	return {
		balances,
		balancesLoading,
		balancesError,
		fetchUserBalances,

		transactions,
		transactionsLoading,
		transactionsError,
		fetchUserTransactions,

		transaction,
		transactionLoading,
		transactionError,
		fetchSingleTransaction,
	};
}
