"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { IUserTokenBalance } from "@/types/users";
import { useUser } from "@clerk/nextjs";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;

function setCache(key: string, value: any) {
	Cookies.set(key, JSON.stringify({ value, ts: Date.now() }), { expires: 1 / 1440 }); // 1 min
}

function getCache(key: string) {
	const raw = Cookies.get(key);
	if (!raw) return null;
	try {
		const { value, ts } = JSON.parse(raw);
		if (Date.now() - ts < 60000) return value; // valid for 1 min
	} catch {
		return null;
	}
	return null;
}

export function useLiskBusiness() {
	const { user } = useUser();
	const [float, setFloat] = useState<IUserTokenBalance[]>([]);
	const [loadingFloat, setLoadingFloat] = useState(false);
	const [floatError, setFloatError] = useState<string | null>(null);

	const [gasLoading, setGasLoading] = useState(false);
	const [gasSuccess, setGasSuccess] = useState<string | null>(null);
	const [gasError, setGasError] = useState<string | null>(null);

	const [mintForm, setMintForm] = useState({
		transactionAmount: "",
		transactionRecipient: "",
		transactionNotes: "",
	});
	const [mintLoading, setMintLoading] = useState(false);
	const [mintSuccess, setMintSuccess] = useState<string | null>(null);
	const [mintError, setMintError] = useState<string | null>(null);

	const [pendingTx, setPendingTx] = useState<any>({});
	const [pendingLoading, setPendingLoading] = useState(false);
	const [pendingError, setPendingError] = useState<string | null>(null);

	const [userGasLoading, setUserGasLoading] = useState(false);
	const [userGasSuccess, setUserGasSuccess] = useState<string | null>(null);
	const [userGasError, setUserGasError] = useState<string | null>(null);

	// Fetch float balances
	const fetchFloat = async () => {
		setLoadingFloat(true);
		setFloatError(null);
		const cacheKey = "float_balances";
		const cached = getCache(cacheKey);
		if (cached) {
			setFloat(cached);
			setLoadingFloat(false);
			return;
		}
		try {
			const { data } = await axios.get<{ tokens: IUserTokenBalance[] }>(`${API_BASE}/float`, {
				headers: { Authorization: (user?.unsafeMetadata.apiToken as string) || "" },
			});
			setFloat(data.tokens || []);
			setCache(cacheKey, data.tokens || []);
		} catch (err: any) {
			setFloatError("Failed to fetch token balances.");
		} finally {
			setLoadingFloat(false);
		}
	};

	// Enable gas
	const handleEnableGas = async () => {
		setGasLoading(true);
		setGasSuccess(null);
		setGasError(null);
		try {
			await axios.post(
				`${API_BASE}/enable-gas`,
				{},
				{ headers: { Authorization: (user?.unsafeMetadata.apiToken as string) || "" } },
			);
			setGasSuccess("Gas allocation successful.");
		} catch (err: any) {
			setGasError("Failed to enable gas.");
		} finally {
			setGasLoading(false);
		}
	};

	// Enable gas for a user
	const enableUserGas = async (userId: string) => {
		setUserGasLoading(true);
		setUserGasSuccess(null);
		setUserGasError(null);
		try {
			await axios.post(
				`${API_BASE}/activate-pay/${userId}`,
				{},
				{ headers: { Authorization: (user?.unsafeMetadata.apiToken as string) || "" } },
			);
			setUserGasSuccess("Gas payment activated successfully for user.");
		} catch (err: any) {
			setUserGasError("Failed to activate gas payment for user.");
		} finally {
			setUserGasLoading(false);
		}
	};

	// Mint stablecoins
	const handleMint = async (e: React.FormEvent) => {
		e.preventDefault();
		setMintLoading(true);
		setMintSuccess(null);
		setMintError(null);
		try {
			await axios.post(
				`${API_BASE}/mint`,
				{
					transactionAmount: Number(mintForm.transactionAmount),
					transactionRecipient: mintForm.transactionRecipient,
					transactionNotes: mintForm.transactionNotes,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: (user?.unsafeMetadata.apiToken as string) || "",
					},
				},
			);
			setMintSuccess("Mint operation successful.");
			setMintForm({ transactionAmount: "", transactionRecipient: "", transactionNotes: "" });
			fetchFloat();
		} catch (err: any) {
			setMintError("Failed to mint tokens.");
		} finally {
			setMintLoading(false);
		}
	};

	// Fetch paginated pending transactions
	const fetchPendingTx = async (page = 1, pageSize = 10) => {
		setPendingLoading(true);
		setPendingError(null);
		const cacheKey = `pending_tx`;
		const cached = getCache(cacheKey);
		if (cached) {
			setPendingTx(cached);
			setPendingLoading(false);
			return;
		}
		try {
			const { data } = await axios.get<{
				transactions: any[];
				total: number;
				page: number;
				pageSize: number;
				totalPages: number;
			}>(`${API_BASE}/transactions/pending?page=${page}&pageSize=${pageSize}`, {
				headers: { Authorization: (user?.unsafeMetadata.apiToken as string) || "" },
			});
			setPendingTx(data);
			setCache(cacheKey, data);
		} catch (err: any) {
			setPendingError("Failed to fetch pending transactions.");
		} finally {
			setPendingLoading(false);
		}
	};

	useEffect(() => {
		fetchFloat();
		fetchPendingTx(1, 10);
	}, []);

	return {
		float,
		loadingFloat,
		floatError,
		fetchFloat,

		gasLoading,
		gasSuccess,
		gasError,
		handleEnableGas,
		userGasLoading,
		userGasSuccess,
		userGasError,
		enableUserGas,

		mintForm,
		setMintForm,
		mintLoading,
		mintSuccess,
		mintError,
		handleMint,

		pendingTx,
		pendingLoading,
		pendingError,
		fetchPendingTx,
	};
}
