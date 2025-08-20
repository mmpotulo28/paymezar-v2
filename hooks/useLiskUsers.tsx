"use client";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { iUser } from "@/types";
import { useUser } from "@clerk/nextjs";

// Use environment variables
const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;

interface useLiskUsersType {
	users: iUser[];
	loadingUsers: boolean;
	errorUsers: string | null;
	fetchUsers: () => Promise<void>;
}

export const useLiskUsers = (): useLiskUsersType => {
	const { user } = useUser();
	const [users, setUsers] = useState<iUser[]>([]);
	const [loadingUsers, setLoadingUsers] = useState(false);
	const [errorUsers, setErrorUsers] = useState<string | null>(null);

	const fetchUsers = async () => {
		setLoadingUsers(true);
		setErrorUsers(null);
		const cacheKey = "users_list";
		const cached = getCache(cacheKey);
		if (cached) {
			setUsers(cached);
			setLoadingUsers(false);
			return;
		}
		try {
			const { data } = await axios.get<{ users: iUser[] }>(`${API_BASE}/users`, {
				headers: { Authorization: (user?.unsafeMetadata.apiToken as string) || "" },
			});
			setUsers(data.users || []);
			setCache(cacheKey, data.users || []);
		} catch (err: any) {
			setErrorUsers(err?.response?.data?.message || "Failed to fetch users");
		} finally {
			setLoadingUsers(false);
		}
	};

	return {
		users,
		loadingUsers,
		errorUsers,
		fetchUsers,
	};
};

function setCache(key: string, value: any) {
	Cookies.set(key, JSON.stringify({ value, ts: Date.now() }), { expires: 1 / 1440 });
}
function getCache(key: string) {
	const raw = Cookies.get(key);
	if (!raw) return null;
	try {
		const { value, ts } = JSON.parse(raw);
		if (Date.now() - ts < 60000) return value;
	} catch {
		return null;
	}
	return null;
}
