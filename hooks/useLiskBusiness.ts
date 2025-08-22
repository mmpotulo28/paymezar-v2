"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
	iMintStableCoinsResponse,
	iPendingTx,
	iPendingTxResponse,
	iUserTokenBalance,
} from "@/types/";
import { useOrganization, useUser } from "@clerk/nextjs";
import useCache from "./useCache";
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

export function useLiskBusiness(mode: "user" | "organization" = "user"): iUseBusiness {
	const [float, setFloat] = useState<iUserTokenBalance[]>([]);
	const [loadingFloat, setLoadingFloat] = useState(false);
	const [floatError, setFloatError] = useState<string | undefined>(undefined);

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

	// Fetch float balances
	const fetchFloat = useCallback(async () => {
		setLoadingFloat(true);
		setFloatError(undefined);
		const cacheKey = "float_balances";

		try {
			const cached = getCache(cacheKey);
			if (cached) {
				setFloat(cached);
				setLoadingFloat(false);
				return cached;
			}

			const { data } = await axios.get<{ tokens: iUserTokenBalance[] }>(`${API_BASE}/float`, {
				headers: { Authorization: apiKey },
			});
			setFloat(data.tokens || []);
			setCache(cacheKey, data.tokens || []);
			return data.tokens || [];
		} catch (err: any) {
			setFloatError("Failed to fetch token balances.");
		} finally {
			setLoadingFloat(false);
		}

		return [];
	}, [apiKey]);

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
	}, [apiKey]);

	// Fetch paginated pending transactions
	const fetchPendingTx = useCallback(
		async (page = 1, pageSize = 10) => {
			setPendingLoading(true);
			setPendingError(undefined);
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
						headers: { Authorization: (user?.unsafeMetadata.apiToken as string) || "" },
					},
				);
				setPendingTx(data.transactions);
				setCache(cacheKey, data);
				return data;
			} catch (err: any) {
				setPendingError("Failed to fetch pending transactions.");
			} finally {
				setPendingLoading(false);
			}

			return [];
		},
		[apiKey],
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
