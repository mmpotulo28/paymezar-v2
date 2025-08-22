import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { iUserTokenBalance } from "@/types";
import { useOrganization, useUser } from "@clerk/nextjs";
import useCache from "./useCache";
const API_BASE = process.env.NEXT_PUBLIC_LISK_API_BASE as string;

export interface iUseLiskBalances {
	balances: iUserTokenBalance[];
	balancesLoading: boolean;
	balancesError: string | undefined;
	fetchBalances: (userId: string) => Promise<iUserTokenBalance[]>;
}

export function useLiskBalances(mode: "user" | "organization" = "user"): iUseLiskBalances {
	const [balances, setBalances] = useState<iUserTokenBalance[]>([]);
	const [balancesLoading, setBalancesLoading] = useState(false);
	const [balancesError, setBalancesError] = useState<string | undefined>(undefined);

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
		[apiKey],
	);

	return {
		balances,
		balancesLoading,
		balancesError,
		fetchBalances,
	};
}
