"use client";
import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
	useCallback,
	use,
} from "react";
import Cookies from "js-cookie";
import { supabaseClient } from "@/lib/db";
import { iUser } from "@/types";
import { getLiskUserById } from "@/lib/helpers";
import { usePathname, useRouter } from "next/navigation";

interface SessionContextProps {
	user: iUser | null;
	isAuthenticated: boolean;
	loading: boolean;
	logout: () => Promise<void>;
	setUser: (user: iUser | null) => void;
	refreshUser: () => Promise<void>;
	setSession: (session: iUser | null) => Promise<void>;
	accessToken: string | null;
}

const SessionContext = createContext<SessionContextProps>({
	user: null,
	isAuthenticated: false,
	loading: false,
	logout: async () => {},
	setUser: () => {},
	refreshUser: async () => {},
	setSession: async () => {},
	accessToken: null,
});

export function useSession() {
	return useContext(SessionContext);
}

export function SessionManager({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<iUser | null>(null);
	const [loading, setLoading] = useState(true);
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [sessionExpiry, setSessionExpiry] = useState<number | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		console.log("setting isAuthenticated", { user, accessToken, sessionExpiry });
		setIsAuthenticated(!!user);
	}, [user, accessToken, sessionExpiry]);

	// Helper: Save session to cookie (JWT, expiry, user)
	const cacheSession = useCallback(
		(user: iUser | null, token: string | null, expiresAt: number | null) => {
			if (user) {
				Cookies.set("paymezar_user", JSON.stringify(user), {
					expires: 7,
					secure: true,
					sameSite: "Strict",
				});
			} else {
				Cookies.remove("paymezar_user");
			}

			// Only cache token/expiry if present, but not required for session
			if (token) {
				Cookies.set("paymezar_token", token, {
					expires: 7,
					secure: true,
					sameSite: "Strict",
				});
			} else {
				Cookies.remove("paymezar_token");
			}
			if (expiresAt) {
				Cookies.set("paymezar_expiry", String(expiresAt), {
					expires: 7,
					secure: true,
					sameSite: "Strict",
				});
			} else {
				Cookies.remove("paymezar_expiry");
			}
		},
		[],
	);

	// Load session from cookie on mount
	useEffect(() => {
		const cookieUser = Cookies.get("paymezar_user");
		const cookieToken = Cookies.get("paymezar_token");
		const cookieExpiry = Cookies.get("paymezar_expiry");
		let valid = false;
		if (cookieUser) {
			try {
				const parsedUser = JSON.parse(cookieUser);
				const expiry = Number(cookieExpiry);
				const now = Date.now() / 1000;

				if (expiry > now) {
					console.warn("Token expired", {
						user: parsedUser,
						token: cookieToken,
						expiry,
					});
				}

				setUser(parsedUser);
				setAccessToken(cookieToken || null);
				setSessionExpiry(expiry);
				valid = true;
			} catch {
				setUser(null);
				setAccessToken(null);
				setSessionExpiry(null);
			}
		}
		if (!valid) {
			setUser(null);
			setAccessToken(null);
			setSessionExpiry(null);
			cacheSession(null, null, null);
		}
		setLoading(false);
	}, [cacheSession]);

	// Keep cookie in sync with user state
	useEffect(() => {
		// Only cache if all are present and valid
		if (user && accessToken && sessionExpiry && sessionExpiry > Date.now() / 1000) {
			cacheSession(user, accessToken, sessionExpiry);
		}
	}, [user, accessToken, sessionExpiry, cacheSession]);

	// Set session after login/signup
	const setSession = useCallback(
		async (sessionUser: iUser | null) => {
			setLoading(true);
			if (!sessionUser) {
				console.log("Clearing session, no user provided");
				setUser(null);
				setAccessToken(null);
				setSessionExpiry(null);
				cacheSession(null, null, null);
				setLoading(false);
				return;
			}

			console.log("Setting session for user", sessionUser);
			// Get Supabase session (JWT)
			const { data, error } = await supabaseClient.auth.getSession();

			if (error) {
				console.error("Failed to get session", error);
				setUser(null);
				setAccessToken(null);
				setSessionExpiry(null);
				cacheSession(null, null, null);
				setLoading(false);
				return;
			}
			const jwt = data?.session?.access_token;
			const expiresAt = data?.session?.expires_at; // unix timestamp (seconds)
			setUser(sessionUser);
			cacheSession(sessionUser, jwt || null, expiresAt || null);
			setAccessToken(jwt || null);
			setSessionExpiry(expiresAt || null);
			cacheSession(sessionUser, jwt || null, expiresAt || null);
			setLoading(false);
		},
		[cacheSession],
	);

	// Refresh session if expired or about to expire (within 2 minutes)
	const refreshUser = useCallback(async () => {
		setLoading(true);
		try {
			const { data, error } = await supabaseClient.auth.getSession();
			if (error || !data.session) {
				setUser(null);
				setAccessToken(null);
				setSessionExpiry(null);
				cacheSession(null, null, null);
				setLoading(false);
				return;
			}
			const jwt = data.session.access_token;
			const expiresAt = data.session.expires_at;
			const now = Date.now() / 1000;
			if (typeof expiresAt === "number" && expiresAt - now < 120) {
				// If session is about to expire, refresh
				await supabaseClient.auth.refreshSession();
			}
			// Get user info from Supabase
			const { data: userData } = await supabaseClient.auth.getUser();
			if (userData?.user) {
				const userObj: iUser = {
					id: userData.user.id,
					email: userData.user.email || "",
					firstName: userData.user.user_metadata?.firstName || "",
					lastName: userData.user.user_metadata?.lastName || "",
					imageUrl: userData.user.user_metadata?.imageUrl || null,
					enabledPay: userData.user.user_metadata?.enabledPay ?? null,
					role: userData.user.user_metadata?.role || "CUSTOMER",
					publicKey: userData.user.user_metadata?.publicKey || null,
					paymentIdentifier: userData.user.user_metadata?.paymentIdentifier || null,
					businessId: userData.user.user_metadata?.businessId || null,
					createdAt: userData.user.created_at,
					updatedAt: userData.user.updated_at || userData.user.created_at,
				};
				setUser(userObj);
				setAccessToken(jwt);
				setSessionExpiry(expiresAt || null);
				cacheSession(userObj, jwt, expiresAt || null);
			} else {
				setUser(null);
				setAccessToken(null);
				setSessionExpiry(null);
				cacheSession(null, null, null);
			}
		} finally {
			setLoading(false);
		}
	}, [cacheSession]);

	// Secure logout
	const logout = useCallback(async () => {
		setLoading(true);
		try {
			await supabaseClient.auth.signOut();
			setUser(null);
			setAccessToken(null);
			setSessionExpiry(null);
			cacheSession(null, null, null);
		} finally {
			setLoading(false);
		}
	}, [cacheSession]);

	// Access control: redirect to login if not authenticated and not on home or auth pages
	useEffect(() => {
		const publicPaths = [
			"/",
			"/auth/sign-in",
			"/auth/sign-up",
			"/auth/forgot-password",
			"/auth/reset-password",
		];
		const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
		if (!isAuthenticated && !isPublic) {
			console.log(
				`You must be logged in to access this page. ${JSON.stringify({ pathname, isAuthenticated, user })}`,
			);
			router.replace("/auth/sign-in");
		}
	}, [isAuthenticated, pathname, router]);

	return (
		<SessionContext.Provider
			value={{
				user,
				isAuthenticated,
				loading,
				logout,
				setUser,
				refreshUser,
				setSession,
				accessToken,
			}}>
			{children}
		</SessionContext.Provider>
	);
}
