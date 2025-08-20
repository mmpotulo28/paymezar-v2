import { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { iBankAccount, iBankAccountResponse } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;

export interface iUseLiskBank {
	bankAccount: iBankAccount | null;
	loading: boolean;
	error: string | null;
	upsertBankAccount: (data: {
		userId: string;
		accountHolder: string;
		accountNumber: string;
		branchCode: string;
		bankName: string;
	}) => Promise<iBankAccountResponse | undefined>;
	getBankAccount: (userId: string) => Promise<iBankAccount | undefined>;
	deleteBankAccount: (userId: string) => Promise<{ message: string } | undefined>;
	createTransaction: (data: {
		userId: string;
		transactionType: string;
		transactionMethod: string;
		transactionCurrency: string;
		transactionAmount: number;
		transactionNetwork?: string;
		transactionAddress?: string;
	}) => Promise<any>;
}

export function useLiskBank(): iUseLiskBank {
	const { user } = useUser();
	const [bankAccount, setBankAccount] = useState<iBankAccount | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const upsertBankAccount = async ({
		userId,
		accountHolder,
		accountNumber,
		branchCode,
		bankName,
	}: {
		userId: string;
		accountHolder: string;
		accountNumber: string;
		branchCode: string;
		bankName: string;
	}) => {
		setLoading(true);
		setError(null);
		try {
			const { data } = await axios.post<iBankAccountResponse>(
				`${API_BASE}/bank/${encodeURIComponent(userId)}`,
				{ accountHolder, accountNumber, branchCode, bankName },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: (user?.unsafeMetadata.apiToken as string) || "",
					},
				},
			);
			setBankAccount(data.bankAccount ?? null);
			return data;
		} catch (err: any) {
			setError(err?.response?.data?.message || "Failed to upsert bank account");
		} finally {
			setLoading(false);
		}

		return undefined;
	};

	const getBankAccount = async (userId: string) => {
		setLoading(true);
		setError(null);
		try {
			const { data } = await axios.get<iBankAccount>(
				`${API_BASE}/bank/${encodeURIComponent(userId)}`,
				{
					headers: {
						Authorization: (user?.unsafeMetadata.apiToken as string) || "",
					},
				},
			);
			setBankAccount(data);
			return data;
		} catch (err: any) {
			setError(
				err?.response?.data?.message ||
					(err?.response?.status === 404
						? "Bank account not found"
						: "Failed to fetch bank account"),
			);
		} finally {
			setLoading(false);
		}
	};

	const deleteBankAccount = async (userId: string) => {
		setLoading(true);
		setError(null);
		try {
			const { data } = await axios.delete<{ message: string }>(
				`${API_BASE}/bank/${encodeURIComponent(userId)}`,
				{
					headers: {
						Authorization: (user?.unsafeMetadata.apiToken as string) || "",
					},
				},
			);
			setBankAccount(null);
			return data;
		} catch (err: any) {
			setError(
				err?.response?.data?.message ||
					(err?.response?.status === 404
						? "Bank account not found"
						: "Failed to delete bank account"),
			);
		} finally {
			setLoading(false);
		}
	};

	const createTransaction = async ({
		userId,
		transactionType,
		transactionMethod,
		transactionCurrency,
		transactionAmount,
		transactionNetwork,
		transactionAddress,
	}: {
		userId: string;
		transactionType: string;
		transactionMethod: string;
		transactionCurrency: string;
		transactionAmount: number;
		transactionNetwork?: string;
		transactionAddress?: string;
	}) => {
		setLoading(true);
		setError(null);
		try {
			const { data } = await axios.post(
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
						Authorization: (user?.unsafeMetadata.apiToken as string) || "",
					},
				},
			);
			return data;
		} catch (err: any) {
			setError(err?.response?.data?.message || "Failed to create transaction");
		} finally {
			setLoading(false);
		}
	};

	return {
		bankAccount,
		loading,
		error,
		upsertBankAccount,
		getBankAccount,
		deleteBankAccount,
		createTransaction,
	};
}
