"use client";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { iUser } from "@/types";
import { useOrganization, useUser } from "@clerk/nextjs";
import useCache from "./useCache";
// Use environment variables
const API_BASE = process.env.NEXT_PUBLIC_LISK_API_BASE as string;

interface useLiskUsersType {
	users: iUser[];
	loadingUsers: boolean;
	errorUsers: string | undefined;
	fetchUsers: () => Promise<iUser[]>;
}

export const useLiskUsers = (mode: "user" | "organization" = "user"): useLiskUsersType => {
	const [users, setUsers] = useState<iUser[]>([]);
	const [loadingUsers, setLoadingUsers] = useState(false);
	const [errorUsers, setErrorUsers] = useState<string | undefined>(undefined);

	const { user } = useUser();
	const { organization } = useOrganization();
	const { getCache, setCache } = useCache();
	const [apiKey, setApiKey] = useState<string | undefined>(undefined);

	useEffect(() => {
		// Fetch API key
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
	}, [apiKey]);

	return {
		users,
		loadingUsers,
		errorUsers,
		fetchUsers,
	};
};
