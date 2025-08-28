"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
	iMintStableCoinsResponse,
	iPendingTx,
	iPendingTxResponse,
	iUserTokenBalance,
} from "../types"; // changed from "@/types/"
import { useCache } from "../hooks/useCache";
const API_BASE = process.env.NEXT_PUBLIC_LISK_API_BASE as string;

export interface iUseBusiness {
	float: iUserTokenBalance[];
	loadingFloat: boolean;
	floatError: string | undefined;
	fetchFloat: () => Promise<iUserTokenBalance[]>;

	gasLoading: boolean;
	gasSuccess: string | undefined;
	gasError: string | undefined;
	enableBusinessGas: () => Promise<void>;
	enableUserGas: (userId: string) => Promise<void>;

	mintForm: {
		transactionAmount: string;
		transactionRecipient: string;
		transactionNotes: string;
	};
	mintLoading: boolean;
	mintSuccess: string | undefined;
	mintError: string | undefined;
	setMintForm: React.Dispatch<
		React.SetStateAction<{
			transactionAmount: string;
			transactionRecipient: string;
			transactionNotes: string;
		}>
	>;
	mintStableCoins: () => Promise<iMintStableCoinsResponse | undefined>;

	pendingTx: iPendingTx[];
	pendingLoading: boolean;
	pendingError: string | undefined;
	fetchPendingTx: () => Promise<iPendingTxResponse>;

	userGasLoading: boolean;
	userGasSuccess: string | undefined;
	userGasError: string | undefined;
}

/**
 * Custom React hook for managing Lisk business operations, including:
 * - Fetching float (token) balances
 * - Enabling gas for business and users
 * - Minting stablecoins
 * - Fetching pending transactions
 * - Managing loading, success, and error states for each operation
 * - Caching results to optimize API calls
 *
 * @param apiKey - Optional API key for authentication with backend services.
 * @returns An object containing state variables, loading/error indicators, and functions for:
 *   - float: Array of user token balances
 *   - loadingFloat: Loading state for float balances
 *   - floatError: Error message for float balance fetch
 *   - fetchFloat: Function to fetch float balances
 *   - gasLoading, gasSuccess, gasError: States for enabling business gas
 *   - enableBusinessGas: Function to enable business gas
 *   - userGasLoading, userGasSuccess, userGasError: States for enabling user gas
 *   - enableUserGas: Function to enable gas for a specific user
 *   - mintForm: Form state for minting stablecoins
 *   - setMintForm: Setter for mintForm
 *   - mintLoading, mintSuccess, mintError: States for minting stablecoins
 *   - mintStableCoins: Function to mint stablecoins
 *   - pendingTx: Array of pending transactions
 *   - pendingLoading, pendingError: States for fetching pending transactions
 *   - fetchPendingTx: Function to fetch paginated pending transactions
 *
 * @remarks
 * This hook is intended for use in business-related components that interact with the Lisk stablecoin backend.
 * It handles API communication, caching, and state management for common business operations.
 */
export function useLiskBusiness({ apiKey }: { apiKey?: string }): iUseBusiness {
	const [float, setFloat] = useState<iUserTokenBalance[]>([]);
	const [loadingFloat, setLoadingFloat] = useState(false);
	const [floatError, setFloatError] = useState<string | undefined>(undefined);
	const { getCache, setCache } = useCache();

	const [gasLoading, setGasLoading] = useState(false);
	const [gasSuccess, setGasSuccess] = useState<string | undefined>(undefined);
	const [gasError, setGasError] = useState<string | undefined>(undefined);

	const [mintForm, setMintForm] = useState({
		transactionAmount: "",
		transactionRecipient: "",
		transactionNotes: "",
	});
	const [mintLoading, setMintLoading] = useState(false);
	const [mintSuccess, setMintSuccess] = useState<string | undefined>(undefined);
	const [mintError, setMintError] = useState<string | undefined>(undefined);

	const [pendingTx, setPendingTx] = useState<iPendingTx[]>([]);
	const [pendingLoading, setPendingLoading] = useState(false);
	const [pendingError, setPendingError] = useState<string | undefined>(undefined);

	const [userGasLoading, setUserGasLoading] = useState(false);
	const [userGasSuccess, setUserGasSuccess] = useState<string | undefined>(undefined);
	const [userGasError, setUserGasError] = useState<string | undefined>(undefined);

	// Fetch float balances
	const fetchFloat = useCallback(async () => {
		setLoadingFloat(true);
		setFloatError(undefined);
		if (apiKey) return;

		const cacheKey = "float_balances";
		const cached = getCache(cacheKey);
		if (cached) {
			setFloat(cached);
			setLoadingFloat(false);
			return cached;
		}

		try {
			const { data } = await axios.get<{ tokens: iUserTokenBalance[] }>(`${API_BASE}/float`, {
				headers: { Authorization: apiKey },
			});
			setFloat(data.tokens || []);
			setCache(cacheKey, data.tokens || []);
			return data.tokens || [];
		} catch (err: any) {
			setFloatError("Failed to fetch token balances.");
			console.error("Failed to fetch token balances:", err);
		} finally {
			setLoadingFloat(false);
		}

		return [];
	}, [apiKey, getCache, setCache]);

	// Enable gas
	const enableBusinessGas = useCallback(async () => {
		setGasLoading(true);
		setGasSuccess(undefined);
		setGasError(undefined);
		try {
			const { data } = await axios.post(
				`${API_BASE}/enable-gas`,
				{},
				{ headers: { Authorization: apiKey } },
			);
			setGasSuccess("Gas allocation successful.");
			return data;
		} catch (err: any) {
			setGasError("Failed to enable gas.");
			console.error("Failed to enable gas:", err);
		} finally {
			setGasLoading(false);
		}
	}, [apiKey]);

	// Enable gas for a user
	const enableUserGas = useCallback(
		async (userId: string) => {
			setUserGasLoading(true);
			setUserGasSuccess(undefined);
			setUserGasError(undefined);
			try {
				await axios.post(
					`${API_BASE}/activate-pay/${userId}`,
					{},
					{ headers: { Authorization: apiKey } },
				);
				setUserGasSuccess("Gas payment activated successfully for user.");
			} catch (err: any) {
				setUserGasError("Failed to activate gas payment for user.");
				console.error("Failed to activate gas payment for user:", err);
			} finally {
				setUserGasLoading(false);
			}
		},
		[apiKey],
	);

	// Mint stableCoins
	const mintStableCoins = useCallback(async () => {
		setMintLoading(true);
		setMintSuccess(undefined);
		setMintError(undefined);
		try {
			const { data } = await axios.post<iMintStableCoinsResponse>(
				`${API_BASE}/mint`,
				{
					transactionAmount: Number(mintForm.transactionAmount),
					transactionRecipient: mintForm.transactionRecipient,
					transactionNotes: mintForm.transactionNotes,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: apiKey,
					},
				},
			);
			setMintSuccess(data.message || "Mint operation successful.");
			setMintForm({ transactionAmount: "", transactionRecipient: "", transactionNotes: "" });
			fetchFloat();
			return data;
		} catch (err: any) {
			setMintError("Failed to mint tokens.");
			console.error(err);
		} finally {
			setMintLoading(false);
		}
	}, [
		apiKey,
		fetchFloat,
		mintForm.transactionAmount,
		mintForm.transactionNotes,
		mintForm.transactionRecipient,
	]);

	// Fetch paginated pending transactions
	const fetchPendingTx = useCallback(
		async (page = 1, pageSize = 10) => {
			setPendingLoading(true);
			setPendingError(undefined);
			if (apiKey) return;

			const cacheKey = `pending_tx`;
			const cached = getCache(cacheKey);
			if (cached) {
				setPendingTx(cached);
				setPendingLoading(false);
				return cached;
			}
			try {
				const { data } = await axios.get<iPendingTxResponse>(
					`${API_BASE}/transactions/pending?page=${page}&pageSize=${pageSize}`,
					{
						headers: { Authorization: apiKey },
					},
				);
				setPendingTx(data.transactions);
				setCache(cacheKey, data);
				return data;
			} catch (err: any) {
				setPendingError("Failed to fetch pending transactions.");
				console.error("Failed to fetch pending transactions:", err);
			} finally {
				setPendingLoading(false);
			}

			return [];
		},
		[apiKey, getCache, setCache],
	);

	useEffect(() => {
		fetchFloat();
		fetchPendingTx(1, 10);
	}, [fetchFloat, fetchPendingTx]);

	return {
		float,
		loadingFloat,
		floatError,
		fetchFloat,

		gasLoading,
		gasSuccess,
		gasError,
		enableBusinessGas,
		userGasLoading,
		userGasSuccess,
		userGasError,
		enableUserGas,

		mintForm,
		setMintForm,
		mintLoading,
		mintSuccess,
		mintError,
		mintStableCoins,

		pendingTx,
		pendingLoading,
		pendingError,
		fetchPendingTx,
	};
}
