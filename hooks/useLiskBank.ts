import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
	iBankAccount,
	iBankAccountResponse,
	iCreateTransactionParams,
	iCreateTransactionResponse,
	iUpsertBankAccountParams,
} from "@/types";
import useCache from "./useCache";
const API_BASE = process.env.NEXT_PUBLIC_LISK_API_BASE as string;

export interface iUseLiskBank {
	bankAccount: iBankAccount | undefined;
	bankLoading: boolean;
	bankError: string | undefined;
	bankMessage: string | undefined;
	upsertBankAccount: (data: {
		userId: string;
		accountHolder: string;
		accountNumber: string;
		branchCode: string;
		bankName: string;
	}) => Promise<iBankAccountResponse | undefined>;
	getBankAccount: (userId: string) => Promise<iBankAccount | undefined>;
	deleteBankAccount: (userId: string) => Promise<{ message: string } | undefined>;
	createTransaction: (
		data: iCreateTransactionParams,
	) => Promise<iCreateTransactionResponse | undefined>;
}

export function useLiskBank(mode: "user" | "organization" = "user"): iUseLiskBank {
	const [bankAccount, setBankAccount] = useState<iBankAccount | undefined>(undefined);
	const [bankLoading, setBankLoading] = useState(false);
	const [bankError, setBankError] = useState<string | undefined>(undefined);
	const [bankMessage, setBankMessage] = useState<string | undefined>(undefined);

	const { user } = useUser();
	const { organization } = useOrganization();
	const { getCache, setCache } = useCache();
	const [apiKey, setApiKey] = useState<string | undefined>(undefined);

	useEffect(() => {
		// Fetch API key from cookies
		const fetchApiKey = () => {
			const key = (
				mode === "user"
					? user?.unsafeMetadata.apiToken
					: organization?.publicMetadata.apiToken
			) as string;

			setApiKey(`Bearer ${key}`);
		};

		fetchApiKey();
	}, [user, organization, mode]);

	const upsertBankAccount = useCallback(
		async ({
			userId,
			accountHolder,
			accountNumber,
			branchCode,
			bankName,
		}: iUpsertBankAccountParams) => {
			setBankLoading(true);
			setBankError(undefined);
			try {
				if (!apiKey) throw new Error("API key is missing");
				const { data } = await axios.post<iBankAccountResponse>(
					`${API_BASE}/bank/${encodeURIComponent(userId)}`,
					{ accountHolder, accountNumber, branchCode, bankName },
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: apiKey,
						},
					},
				);
				setBankAccount(data.bankAccount ?? undefined);
				setBankMessage("Bank account created successfully");
				return data;
			} catch (err: any) {
				setBankError(err?.response?.data?.message || "Failed to upsert bank account");
			} finally {
				setBankLoading(false);
			}

			return undefined;
		},
		[],
	);

	const getBankAccount = useCallback(async (userId: string) => {
		setBankLoading(true);
		setBankError(undefined);
		const cacheKey = `bank_account_${userId}`;
		try {
			const cached = getCache(cacheKey);
			if (cached) {
				setBankAccount(cached);
				setBankLoading(false);
				return;
			}

			const { data } = await axios.get<iBankAccount>(
				`${API_BASE}/bank/${encodeURIComponent(userId)}`,
				{
					headers: {
						Authorization: apiKey,
					},
				},
			);
			setBankAccount(data);
			setCache(cacheKey, data);
			return data;
		} catch (err: any) {
			setBankError(
				err?.response?.data?.message ||
					(err?.response?.status === 404
						? "Bank account not found"
						: "Failed to fetch bank account"),
			);
		} finally {
			setBankLoading(false);
		}
	}, []);

	const deleteBankAccount = useCallback(
		async (userId: string): Promise<{ message: string } | undefined> => {
			setBankLoading(true);
			setBankError(undefined);
			try {
				const { data } = await axios.delete<{ message: string }>(
					`${API_BASE}/bank/${encodeURIComponent(userId)}`,
					{
						headers: {
							Authorization: apiKey,
						},
					},
				);
				setBankAccount(undefined);
				setBankMessage("Bank account deleted successfully");
				return data;
			} catch (err: any) {
				setBankError(
					err?.response?.data?.message ||
						(err?.response?.status === 404
							? "Bank account not found"
							: "Failed to delete bank account"),
				);
			} finally {
				setBankLoading(false);
			}
		},
		[],
	);

	const createTransaction = useCallback(
		async ({
			userId,
			transactionType,
			transactionMethod,
			transactionCurrency,
			transactionAmount,
			transactionNetwork,
			transactionAddress,
		}: iCreateTransactionParams): Promise<iCreateTransactionResponse | undefined> => {
			setBankLoading(true);
			setBankError(undefined);
			try {
				const { data } = await axios.post<iCreateTransactionResponse>(
					`${API_BASE}/create-transaction/${encodeURIComponent(userId)}`,
					{
						transactionType,
						transactionMethod,
						transactionCurrency,
						transactionAmount,
						transactionNetwork,
						transactionAddress,
					},
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: apiKey,
						},
					},
				);
				setBankMessage("Transaction created successfully");
				return data;
			} catch (err: any) {
				setBankError(err?.response?.data?.message || "Failed to create transaction");
			} finally {
				setBankLoading(false);
			}
		},
		[],
	);

	return {
		bankAccount,
		bankLoading,
		bankError,
		bankMessage,
		upsertBankAccount,
		getBankAccount,
		deleteBankAccount,
		createTransaction,
	};
}
