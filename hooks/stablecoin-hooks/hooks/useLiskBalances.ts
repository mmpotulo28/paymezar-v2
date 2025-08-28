import { useCallback, useState } from "react";
import axios from "axios";
import { iUserTokenBalance } from "../types"; // changed from "@/types"
import { useCache } from "../hooks/useCache";
const API_BASE = process.env.NEXT_PUBLIC_LISK_API_BASE as string;

export interface iUseLiskBalances {
	balances: iUserTokenBalance[];
	balancesLoading: boolean;
	balancesError: string | undefined;
	fetchBalances: (userId: string) => Promise<iUserTokenBalance[]>;
}

export function useLiskBalances({ apiKey }: { apiKey?: string }): iUseLiskBalances {
	const { getCache, setCache } = useCache();
	const [balances, setBalances] = useState<iUserTokenBalance[]>([]);
	const [balancesLoading, setBalancesLoading] = useState(false);
	const [balancesError, setBalancesError] = useState<string | undefined>(undefined);

	const fetchBalances = useCallback(
		async (userId: string) => {
			setBalancesLoading(true);
			setBalancesError(undefined);
			const cacheKey = `user_balances_${userId}`;
			try {
				const cached = getCache(cacheKey);
				if (cached) {
					setBalances(cached);
					setBalancesLoading(false);
					return cached;
				}

				const { data } = await axios.get<{ tokens: iUserTokenBalance[] }>(
					`${API_BASE}/${userId}/balance`,
					{
						headers: {
							Authorization: apiKey,
						},
					},
				);
				setBalances(data.tokens || []);
				if (data.tokens) setCache(cacheKey, data.tokens);
				return data.tokens || [];
			} catch (err: any) {
				if (err?.response?.status === 400) setBalancesError("Invalid user ID.");
				else if (err?.response?.status === 401) setBalancesError("Unauthorized.");
				else if (err?.response?.status === 404) setBalancesError("User not found.");
				else setBalancesError("Failed to fetch balances.");
			} finally {
				setBalancesLoading(false);
			}

			return [];
		},
		[apiKey, getCache, setCache],
	);

	return {
		balances,
		balancesLoading,
		balancesError,
		fetchBalances,
	};
}
