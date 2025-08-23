import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { iTransaction } from "@/types";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useCache } from "./useCache";
const API_BASE = process.env.NEXT_PUBLIC_LISK_API_BASE as string;

export interface iUseLiskTransactions {
	transactions: iTransaction[];
	transactionsLoading: boolean;
	transactionsError: string | undefined;
	fetchTransactions: (userId: string) => Promise<iTransaction[]>;

	transaction: iTransaction | undefined;
	transactionLoading: boolean;
	transactionError: string | undefined;
	fetchSingleTransaction: (
		userId: string,
		transactionId: string,
	) => Promise<iTransaction | undefined>;
}

export function useLiskTransactions(mode: "user" | "organization" = "user"): iUseLiskTransactions {
	const [transactions, setTransactions] = useState<iTransaction[]>([]);
	const [transactionsLoading, setTransactionsLoading] = useState(false);
	const [transactionsError, setTransactionsError] = useState<string | undefined>(undefined);

	const [transaction, setTransaction] = useState<iTransaction | undefined>(undefined);
	const [transactionLoading, setTransactionLoading] = useState(false);
	const [transactionError, setTransactionError] = useState<string | undefined>(undefined);

	const { user } = useUser();
	const { organization } = useOrganization();
	const { getCache, setCache } = useCache();
	const [apiKey, setApiKey] = useState<string | undefined>(undefined);

	useEffect(() => {
		// Fetch API key
		const fetchApiKey = () => {
			const key = (
				mode === "user"
					? process.env.NEXT_PUBLIC_LISK_API_KEY
					: organization?.publicMetadata.apiToken
			) as string;

			console.log(`fetching api key for user: ${user?.id} in mode: ${mode}`);
			setApiKey(`Bearer ${key}`);
		};

		fetchApiKey();
	}, [user, organization, mode]);

	const fetchTransactions = useCallback(
		async (userId: string) => {
			setTransactionsLoading(true);
			setTransactionsError(undefined);
			const cacheKey = `user_transactions_${userId}`;
			try {
				const cached = getCache<iTransaction[]>(cacheKey);
				if (cached) {
					setTransactions(cached);
					setTransactionsLoading(false);
					return [...cached];
				}

				const { data } = await axios.get<{ transactions: iTransaction[] }>(
					`${API_BASE}/${userId}/transactions`,
					{ headers: { Authorization: apiKey } },
				);
				setTransactions(data.transactions || []);
				if (data.transactions) setCache(cacheKey, data.transactions);
				return data.transactions || [];
			} catch (err: any) {
				if (err?.response?.status === 400) setTransactionsError("Invalid user ID.");
				else if (err?.response?.status === 401) setTransactionsError("Unauthorized.");
				else setTransactionsError("Failed to fetch transactions.");
				console.error(err);
			} finally {
				setTransactionsLoading(false);
			}

			return [];
		},
		[apiKey, getCache, setCache],
	);

	const fetchSingleTransaction = useCallback(
		async (userId: string, transactionId: string) => {
			setTransactionLoading(true);
			setTransactionError(undefined);
			const cacheKey = `transaction_${userId}_${transactionId}`;
			try {
				const { data } = await axios.get<iTransaction | undefined>(
					`${API_BASE}/${userId}/transactions/${transactionId}`,
					{ headers: { Authorization: apiKey } },
				);
				setTransaction(data);
				if (data) setCache(cacheKey, data);
				return data;
			} catch (err: any) {
				if (err?.response?.status === 400) setTransactionError("Invalid parameters.");
				else if (err?.response?.status === 401) setTransactionError("Unauthorized.");
				else if (err?.response?.status === 404)
					setTransactionError("Transaction not found.");
				else setTransactionError("Failed to fetch transaction.");
				console.error(err);
			} finally {
				setTransactionLoading(false);
			}
		},
		[apiKey, setCache],
	);

	return {
		transactions,
		transactionsLoading,
		transactionsError,
		fetchTransactions,

		transaction,
		transactionLoading,
		transactionError,
		fetchSingleTransaction,
	};
}
