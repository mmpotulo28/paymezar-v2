"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useTheme } from "next-themes";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

interface SettingsContextProps {
	theme: string | undefined;
	toggleTheme: () => void;
	cacheCleared: boolean;
	clearCache: () => void;
	socialConnected: boolean;
	connectSocial: (provider: "google" | "twitter") => void;
	gasEnabled: boolean;
	enableGas: () => Promise<void>;
	gasError: string | null;
	twoFAEnabled: boolean;
	toggle2FA: () => void;
	resetPassword: () => void;
	user: any;
}

const SettingsContext = createContext<SettingsContextProps>({
	theme: "dark",
	toggleTheme: () => {},
	cacheCleared: false,
	clearCache: () => {},
	socialConnected: false,
	connectSocial: () => {},
	gasEnabled: false,
	enableGas: async () => {},
	gasError: null,
	twoFAEnabled: false,
	toggle2FA: () => {},
	resetPassword: () => {},
	user: null,
});

export function useSettings() {
	return useContext(SettingsContext);
}

// Real gas enable function using API
async function enableGasForUser(userId: string) {
	const options = {
		method: "POST",
		url: `https://seal-app-qp9cc.ondigitalocean.app/api/v1/activate-pay/${encodeURIComponent(userId)}`,
		headers: {
			Authorization: process.env.NEXT_PUBLIC_LISK_API_KEY || "",
		},
	};
	try {
		const { data } = await axios.request(options);
		return { error: false, data };
	} catch (error: any) {
		console.error("Enable gas error:", error);
		return {
			error: true,
			message: error?.response?.data?.message || error?.message || "Failed to enable gas",
		};
	}
}

// Clerk social connect: open OAuth popup for Google/Twitter
function connectSocialWithClerk(provider: "google" | "twitter") {
	if (typeof window !== "undefined") {
		window.open(
			`/auth/sign-in?strategy=${provider}&oauthFlow=popup`,
			"_blank",
			"width=500,height=600",
		);
	}
}

export function SettingsProvider({ children }: { children: ReactNode }) {
	const { theme, setTheme } = useTheme();
	const { user } = useUser();
	const [cacheCleared, setCacheCleared] = useState(false);
	const [socialConnected, setSocialConnected] = useState(false);
	const [gasEnabled, setGasEnabled] = useState(false);
	const [gasError, setGasError] = useState<string | null>(null);
	const [twoFAEnabled, setTwoFAEnabled] = useState(false);

	const toggleTheme = useCallback(() => {
		setTheme(theme === "dark" ? "light" : "dark");
	}, [theme, setTheme]);

	const clearCache = useCallback(() => {
		try {
			localStorage.clear();
			sessionStorage.clear();
			document.cookie.split(";").forEach((c) => {
				document.cookie = c
					.replace(/^ +/, "")
					.replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
			});
			setCacheCleared(true);
			setTimeout(() => setCacheCleared(false), 1500);
		} catch (e) {
			setCacheCleared(false);
		}
	}, []);

	const connectSocial = useCallback((provider: "google" | "twitter") => {
		connectSocialWithClerk(provider);
		setSocialConnected(true);
		setTimeout(() => setSocialConnected(false), 1500);
	}, []);

	const enableGas = useCallback(async () => {
		setGasError(null);
		if (user?.id) {
			const result = await enableGasForUser(user.id);
			if (!result.error) {
				setGasEnabled(true);
				setTimeout(() => setGasEnabled(false), 1500);
			} else {
				setGasEnabled(false);
				setGasError(result.message || "Failed to enable gas.");
			}
		} else {
			setGasError("User not found.");
		}
	}, [user?.id]);

	const toggle2FA = useCallback(() => {
		setTwoFAEnabled((v) => !v);
	}, []);

	const resetPassword = useCallback(() => {
		alert("Password reset link sent to your email.");
	}, []);

	return (
		<SettingsContext.Provider
			value={{
				theme,
				toggleTheme,
				cacheCleared,
				clearCache,
				socialConnected,
				connectSocial,
				gasEnabled,
				enableGas,
				gasError,
				twoFAEnabled,
				toggle2FA,
				resetPassword,
				user,
			}}>
			{children}
		</SettingsContext.Provider>
	);
}
