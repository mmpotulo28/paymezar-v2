"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import { supabaseClient } from "@/lib/db";
import { iUser } from "@/types";
import { getLiskUserById, postApi } from "@/lib/helpers";

interface SessionContextProps {
	user: iUser | null;
	isAuthenticated: boolean;
	loading: boolean;
	login: (email: string, password: string) => Promise<{ error: string | null }>;
	logout: () => Promise<void>;
	setUser: (user: iUser | null) => void;
	refreshUser: () => Promise<void>;
}

const SessionContext = createContext<SessionContextProps>({
	user: null,
	isAuthenticated: false,
	loading: false,
	login: async () => ({ error: "Not implemented" }),
	logout: async () => {},
	setUser: () => {},
	refreshUser: async () => {},
});

export function useSession() {
	return useContext(SessionContext);
}

export function SessionManager({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<iUser | null>(null);
	const [loading, setLoading] = useState(true);

	// Load user from cookie on mount
	useEffect(() => {
		const cookieUser = Cookies.get("paymezar_user");
		if (cookieUser) {
			try {
				setUser(JSON.parse(cookieUser));
			} catch {
				setUser(null);
			}
		}
		setLoading(false);
	}, []);

	// Keep cookie in sync with user state
	useEffect(() => {
		if (user) {
			Cookies.set("paymezar_user", JSON.stringify(user), { expires: 7 });
		} else {
			Cookies.remove("paymezar_user");
		}
	}, [user]);

	const login = async (email: string, password: string) => {
		setLoading(true);
		try {
			const { data, error } = await supabaseClient.auth.signInWithPassword({
				email,
				password,
			});
			if (error || !data?.user) {
				return { error: error?.message || "Login failed" };
			}
			const userObj: iUser = {
				id: data.user.id,
				email: data.user.email || "",
				firstName: data.user.user_metadata?.firstName || "",
				lastName: data.user.user_metadata?.lastName || "",
				imageUrl: data.user.user_metadata?.imageUrl || null,
				enabledPay: data.user.user_metadata?.enabledPay ?? null,
				role: data.user.user_metadata?.role || "CUSTOMER",
				publicKey: data.user.user_metadata?.publicKey || null,
				paymentIdentifier: data.user.user_metadata?.paymentIdentifier || null,
				businessId: data.user.user_metadata?.businessId || null,
				createdAt: data.user.created_at,
				updatedAt: data.user.updated_at || data.user.created_at,
			};
			setUser(userObj);

			// 1. Get user's API key record from api_keys table
			const { data: apiKeyRow, error: apiKeyError } = await supabaseClient
				.from("api_keys")
				.select("*")
				.eq("user_id", data.user.id)
				.single();

			if (apiKeyRow && apiKeyRow.lisk_id && apiKeyRow.api_key) {
				// 2. Fetch Lisk user info
				const liskRes = await getLiskUserById({
					apiKey: apiKeyRow.api_key,
					liskId: apiKeyRow.lisk_id,
				});
				if (!liskRes.error && liskRes.data) {
					setUser(liskRes.data);
				} else {
					setUser(null);
				}
			} else {
				setUser(null);
			}

			return { error: null };
		} catch (err: any) {
			return { error: err.message || "Login failed" };
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		setLoading(true);
		try {
			await supabaseClient.auth.signOut();
			setUser(null);
			Cookies.remove("paymezar_user");
		} finally {
			setLoading(false);
		}
	};

	const refreshUser = async () => {
		setLoading(true);
		try {
			const { data } = await supabaseClient.auth.getUser();
			if (data?.user) {
				const userObj: iUser = {
					id: data.user.id,
					email: data.user.email || "",
					firstName: data.user.user_metadata?.firstName || "",
					lastName: data.user.user_metadata?.lastName || "",
					imageUrl: data.user.user_metadata?.imageUrl || null,
					enabledPay: data.user.user_metadata?.enabledPay ?? null,
					role: data.user.user_metadata?.role || "CUSTOMER",
					publicKey: data.user.user_metadata?.publicKey || null,
					paymentIdentifier: data.user.user_metadata?.paymentIdentifier || null,
					businessId: data.user.user_metadata?.businessId || null,
					createdAt: data.user.created_at,
					updatedAt: data.user.updated_at || data.user.created_at,
				};
				setUser(userObj);
			} else {
				setUser(null);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<SessionContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
				loading,
				login,
				logout,
				setUser,
				refreshUser,
			}}>
			{children}
		</SessionContext.Provider>
	);
}
