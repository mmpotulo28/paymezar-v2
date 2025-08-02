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
	logout: () => Promise<void>;
	setUser: (user: iUser | null) => void;
	refreshUser: () => Promise<void>;
	setSession: (session: iUser | null) => void;
}

const SessionContext = createContext<SessionContextProps>({
	user: null,
	isAuthenticated: false,
	loading: false,
	logout: async () => {},
	setUser: () => {},
	refreshUser: async () => {},
	setSession: () => {},
});

export function useSession() {
	return useContext(SessionContext);
}

export function SessionManager({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<iUser | null>(null);
	const [loading, setLoading] = useState(true);

	const cacheSession = async (user: iUser | null) => {
		if (user) {
			console.log("Caching session user", user);
			Cookies.set("paymezar_user", JSON.stringify(user), { expires: 7 });
		} else {
			console.warn("Clearing cached session user");
			Cookies.remove("paymezar_user");
		}
	};

	// Load user from cookie on mount
	useEffect(() => {
		const cookieUser = Cookies.get("paymezar_user");
		if (cookieUser) {
			try {
				const parsed = JSON.parse(cookieUser);
				setUser(parsed);
			} catch {
				setUser(null);
			}
		}
		setLoading(false);
	}, []);

	// Keep cookie in sync with user state
	useEffect(() => {
		if (user) {
			console.log("Updating session cookie with user", user);
			cacheSession(user);
		} else {
			Cookies.remove("paymezar_user");
		}
	}, [user]);

	const setSession = async (session: iUser | null) => {
		console.log("Setting session", session);
		setUser(session);
		if (session) {
			cacheSession(session);
		} else {
			Cookies.remove("paymezar_user");
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
				logout,
				setUser,
				refreshUser,
				setSession,
			}}>
			{children}
		</SessionContext.Provider>
	);
}
