import { useCallback, useState } from "react";
import axios from "axios";
import { iApiToken, iApiTokenCreateResponse, iApiTokenRevokeResponse } from "@/types";
import { useCache } from "./useCache";

const API_BASE = process.env.NEXT_PUBLIC_LISK_API_BASE as string;

export interface iUseLiskApiTokens {
	tokens: iApiToken[];
	apiTokenLoading: boolean;
	apiTokenError: string | undefined;
	fetchTokens: () => Promise<void>;
	createToken: (description: string) => Promise<void>;
	createTokenLoading: boolean;
	createTokenError: string | undefined;
	createdToken: iApiTokenCreateResponse | undefined;
	updateToken: (id: string, description: string) => Promise<void>;
	updateTokenLoading: boolean;
	updateTokenError: string | undefined;
	revokeToken: (id: string) => Promise<void>;
	revokeTokenLoading: boolean;
	revokeTokenError: string | undefined;
	revokeTokenSuccess: string | undefined;
}

export function useLiskApiTokens({ apiKey }: { apiKey?: string }): iUseLiskApiTokens {
	const { getCache, setCache } = useCache();

	const [tokens, setTokens] = useState<iApiToken[]>([]);
	const [apiTokenLoading, setApiTokenLoading] = useState(false);
	const [apiTokenError, setApiTokenError] = useState<string | undefined>(undefined);

	const [createTokenLoading, setCreateTokenLoading] = useState(false);
	const [createTokenError, setCreateTokenError] = useState<string | undefined>(undefined);
	const [createdToken, setCreatedToken] = useState<iApiTokenCreateResponse | undefined>(
		undefined,
	);

	const [updateTokenLoading, setUpdateTokenLoading] = useState(false);
	const [updateTokenError, setUpdateTokenError] = useState<string | undefined>(undefined);

	const [revokeTokenLoading, setRevokeTokenLoading] = useState(false);
	const [revokeTokenError, setRevokeTokenError] = useState<string | undefined>(undefined);
	const [revokeTokenSuccess, setRevokeTokenSuccess] = useState<string | undefined>(undefined);

	const fetchTokens = useCallback(async () => {
		const cacheKey = "api_tokens";
		setApiTokenLoading(true);
		setApiTokenError(undefined);
		try {
			const cached = getCache(cacheKey);
			if (cached) {
				setTokens(cached);
				setApiTokenLoading(false);
				return;
			}

			const { data } = await axios.get<iApiToken[]>(`${API_BASE}/tokens`, {
				headers: {
					Authorization: apiKey,
				},
			});
			setTokens(data);
			setCache(cacheKey, data);
		} catch (err: any) {
			setApiTokenError("Failed to fetch tokens.");
			console.error("Error fetching tokens:", err);
		} finally {
			setApiTokenLoading(false);
		}
	}, [apiKey, getCache, setCache]);

	const createToken = useCallback(
		async (description: string) => {
			setCreateTokenLoading(true);
			setCreateTokenError(undefined);
			setCreatedToken(undefined);
			try {
				const { data } = await axios.post<iApiTokenCreateResponse>(
					`${API_BASE}/tokens`,
					{ description },
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: apiKey,
						},
					},
				);
				setCreatedToken(data);
				await fetchTokens();
			} catch (err: any) {
				setCreateTokenError("Failed to create token.");
				console.error("Error creating token:", err);
			} finally {
				setCreateTokenLoading(false);
			}
		},
		[apiKey, fetchTokens],
	);

	const updateToken = useCallback(
		async (id: string, description: string) => {
			setUpdateTokenLoading(true);
			setUpdateTokenError(undefined);
			try {
				await axios.patch<iApiToken>(
					`${API_BASE}/tokens/${id}`,
					{ description },
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: apiKey,
						},
					},
				);
				await fetchTokens();
			} catch (err: any) {
				setUpdateTokenError("Failed to update token.");
				console.error("Error updating token:", err);
			} finally {
				setUpdateTokenLoading(false);
			}
		},
		[apiKey, fetchTokens],
	);

	const revokeToken = useCallback(
		async (id: string) => {
			setRevokeTokenLoading(true);
			setRevokeTokenError(undefined);
			setRevokeTokenSuccess(undefined);
			try {
				const { data } = await axios.post<iApiTokenRevokeResponse>(
					`${API_BASE}/tokens/revoke`,
					{ id },
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: apiKey,
						},
					},
				);
				setRevokeTokenSuccess(data.message);
				await fetchTokens();
			} catch (err: any) {
				setRevokeTokenError("Failed to revoke token.");
				console.error("Error revoking token:", err);
			} finally {
				setRevokeTokenLoading(false);
			}
		},
		[apiKey, fetchTokens],
	);

	return {
		tokens,
		apiTokenLoading,
		apiTokenError,
		fetchTokens,

		createToken,
		createTokenLoading,
		createTokenError,
		createdToken,

		updateToken,
		updateTokenLoading,
		updateTokenError,

		revokeToken,
		revokeTokenLoading,
		revokeTokenError,
		revokeTokenSuccess,
	};
}
