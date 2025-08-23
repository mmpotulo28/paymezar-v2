"use client";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { iUser } from "@/types";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useCache } from "./useCache";
// Use environment variables
const API_BASE = process.env.NEXT_PUBLIC_LISK_API_BASE as string;

export interface iUseLiskUsers {
	users: iUser[];
	loadingUsers: boolean;
	errorUsers: string | undefined;
	fetchUsers: () => Promise<iUser[]>;
	getUser: ({ id }: { id: string }) => Promise<iUser | null>;
	createUser: (data: any) => Promise<iUser | null>;
	singleUser: iUser | null;
}

export const useLiskUsers = (mode: "user" | "organization" = "user"): iUseLiskUsers => {
	const [users, setUsers] = useState<iUser[]>([]);
	const [loadingUsers, setLoadingUsers] = useState(false);
	const [errorUsers, setErrorUsers] = useState<string | undefined>(undefined);
	const [singleUser, setSingleUser] = useState<iUser | null>(null);

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

	const fetchUsers = useCallback(async () => {
		setLoadingUsers(true);
		setErrorUsers(undefined);
		const cacheKey = "users_list";

		try {
			const cached = getCache(cacheKey);
			if (cached) {
				setUsers(cached);
				setLoadingUsers(false);
				return cached;
			}

			const { data } = await axios.get<{ users: iUser[] }>(`${API_BASE}/users`, {
				headers: { Authorization: apiKey },
			});
			setUsers(data.users || []);
			setCache(cacheKey, data.users || []);
			return data.users || [];
		} catch (err: any) {
			setErrorUsers(err?.response?.data?.message || "Failed to fetch users");
		} finally {
			setLoadingUsers(false);
		}

		return [];
	}, [apiKey, getCache, setCache]);

	const getUser = useCallback(
		async ({ id }: { id: string }) => {
			setLoadingUsers(true);
			setErrorUsers(undefined);

			try {
				// try getting user on existing users first
				const existing = users.find((u) => u.id === id);
				if (existing) {
					setSingleUser(existing);
					return existing;
				}

				// try getting user in cache
				const cached = getCache(`single_user`);
				if (cached) {
					setSingleUser(cached);
					return cached;
				}

				const { data } = await axios.get<{ user: iUser }>(`${API_BASE}/users/${id}`, {
					headers: { Authorization: apiKey },
				});
				return data.user;
			} catch (err: any) {
				setErrorUsers(err?.response?.data?.message || "Failed to fetch user");
			} finally {
				setLoadingUsers(false);
			}

			return null;
		},
		[apiKey, getCache, users],
	);

	const createUser = useCallback(
		async (data: iUser) => {
			setLoadingUsers(true);
			setErrorUsers(undefined);

			try {
				const { data: response } = await axios.post(`${API_BASE}/users`, data, {
					headers: { Authorization: apiKey },
				});
				setSingleUser(response);
				await fetchUsers();
				return response;
			} catch (err: any) {
				setErrorUsers(err?.response?.data?.message || "Failed to create user");
			} finally {
				setLoadingUsers(false);
			}

			return null;
		},
		[apiKey, fetchUsers],
	);

	return {
		users,
		loadingUsers,
		errorUsers,
		fetchUsers,
		createUser,
		getUser,
		singleUser,
	};
};
