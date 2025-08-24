import { PLAN_DETAILS } from "@/lib/constants";
import { iSubscription } from "@/types";
import { useOrganization, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import { useCache } from "./useCache";
export interface iUseSubscriptions {
	subscriptions: iSubscription[];
	subscriptionLoading: boolean;
	subscriptionError: string | undefined;
	subscriptionMessage: string | undefined;
	fetchSubscriptions: (userId: string) => Promise<iSubscription[]>;
	activateSubscription: ({
		chargeId,
		userId,
	}: {
		chargeId: string;
		userId: string;
	}) => Promise<void>;
	createSubscription: ({
		userId,
		paymentId,
		plan,
		period,
		amount,
	}: {
		userId: string;
		paymentId: string;
		plan: string;
		period: "monthly" | "yearly";
		amount: number;
	}) => Promise<void>;
	cancelSubscription: (subscriptionId: string) => Promise<void>;
	changeSubscriptionPlan: ({
		subscriptionId,
		newPlan,
		newPeriod,
	}: {
		subscriptionId: string;
		newPlan: string;
		newPeriod: "monthly" | "yearly";
	}) => Promise<void>;
}

/**
 * Custom React hook to manage and fetch subscription data for either a user or an organization.
 *
 * @param mode - Determines whether to fetch subscriptions for a "user" or "organization". Defaults to "user".
 * @returns An object containing:
 * - `subscriptions`: The list of fetched subscriptions, each enriched with plan details.
 * - `subscriptionLoading`: Boolean indicating if the subscriptions are currently being loaded.
 * - `subscriptionError`: Error message if fetching subscriptions fails, otherwise `undefined`.
 * - `fetchSubscriptions`: Async function to fetch subscriptions for a given user ID.
 *
 * @remarks
 * - Utilizes caching to avoid redundant API calls.
 * - Handles API authentication using a bearer token from user or organization metadata.
 * - Automatically updates when user, organization, or mode changes.
 */
const useSubscriptions = (mode: "user" | "organization" = "user"): iUseSubscriptions => {
	const [subscriptions, setSubscriptions] = useState<iSubscription[]>([]);
	const [subscriptionLoading, setSubscriptionLoading] = useState<boolean>(false);
	const [subscriptionError, setSubscriptionError] = useState<string | undefined>(undefined);
	const [subscriptionMessage, setSubscriptionMessage] = useState<string | undefined>(undefined);

	const { user } = useUser();
	const { organization } = useOrganization();
	const { getCache, setCache } = useCache();
	const [apiKey, setApiKey] = useState<string | undefined>(
		`Bearer ${
			mode === "user"
				? (process.env.NEXT_PUBLIC_LISK_API_KEY as string)
				: (organization?.publicMetadata.apiToken as string)
		}`,
	);

	// reset all messages and errors after 3 seconds
	useEffect(() => {
		const timer = setTimeout(() => {
			setSubscriptionError(undefined);
			setSubscriptionMessage(undefined);
		}, 3000);

		return () => clearTimeout(timer);
	}, [subscriptionError, subscriptionMessage]);

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

	const fetchSubscriptions = useCallback(
		async (userId: string) => {
			if (!userId) {
				setSubscriptionError("User not found.");
				setSubscriptions([]);
				return [];
			}

			setSubscriptionLoading(true);
			setSubscriptionError(undefined);
			const cacheKey = `subscriptions_list_${userId}`;
			try {
				const cached = getCache(cacheKey);
				if (cached) {
					setSubscriptions(cached);
					setSubscriptionLoading(false);
					return cached;
				}

				const result = await axios.get(
					`/api/subscription/list?id=${encodeURIComponent(userId)}`,
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: apiKey,
						},
					},
				);

				if (result.status !== 200 && result.status !== 201) {
					throw new Error(result.statusText);
				}

				if (Array.isArray(result.data?.subscriptions)) {
					const updatedSubscriptions = result.data.subscriptions.map(
						(sub: iSubscription) => {
							const planDetails = PLAN_DETAILS[sub.plan.toLowerCase()] || {};
							return {
								...sub,
								planDetails,
							};
						},
					);

					setSubscriptionMessage("Subscriptions fetched successfully.");
					setSubscriptions(updatedSubscriptions);
					setCache(cacheKey, updatedSubscriptions);
					return updatedSubscriptions;
				} else if (Array.isArray(result.data)) {
					setSubscriptions(result.data);
				} else {
					setSubscriptionError("No subscriptions found.");
					setSubscriptions([]);
				}
			} catch (error: any) {
				console.error("Error fetching subscriptions:", error);
				setSubscriptions([]);
				setSubscriptionError(error.message || error || "Failed to fetch subscriptions.");
			} finally {
				setSubscriptionLoading(false);
			}

			return [];
		},
		[apiKey, getCache, setCache],
	);

	// activate subscription
	const activateSubscription = useCallback(
		async ({ chargeId, userId }: { chargeId: string; userId: string }) => {
			setSubscriptionLoading(true);
			setSubscriptionError(undefined);

			try {
				if (!chargeId || !userId) {
					setSubscriptionError("Missing required fields.");
					setSubscriptionLoading(false);
					return;
				}

				await fetchSubscriptions(userId);
				const relatedSub = subscriptions.find(
					(sub) => sub.charge_id === chargeId && sub.status === "pending",
				);

				if (relatedSub) {
					await axios.put(
						`/api/subscription/update-status`,
						{
							subscriptionId: relatedSub.id,
							status: "active",
						},
						{
							headers: {
								"Content-Type": "application/json",
								Authorization: apiKey,
							},
						},
					);
				}

				setSubscriptionMessage("Subscription activated successfully.");

				fetchSubscriptions(userId);
			} catch (error) {
				console.error("Error activating subscription:", error);
				setSubscriptionError(
					typeof error === "object" && error !== null && "message" in error
						? (error as { message?: string }).message ||
								"Failed to activate subscription."
						: String(error) || "Failed to activate subscription.",
				);
			} finally {
				setSubscriptionLoading(false);
			}
		},
		[apiKey, fetchSubscriptions, subscriptions],
	);

	// create subscription
	const createSubscription = useCallback(
		async ({
			userId,
			paymentId,
			plan,
			period,
			amount,
		}: {
			userId: string;
			paymentId: string;
			plan: string;
			period: "monthly" | "yearly";
			amount: number;
		}) => {
			setSubscriptionLoading(true);
			setSubscriptionError(undefined);

			try {
				if (!userId || !plan || !period || !amount || !paymentId) {
					throw new Error("Missing required fields");
				}

				// Calculate expires_at based on period
				const now = new Date();
				let expires_at: string;
				if (period === "monthly") {
					const nextMonth = new Date(now);
					nextMonth.setMonth(now.getMonth() + 1);
					expires_at = nextMonth.toISOString();
				} else {
					const nextYear = new Date(now);
					nextYear.setFullYear(now.getFullYear() + 1);
					expires_at = nextYear.toISOString();
				}

				const result = await axios.post(
					"/api/subscription/create",
					{
						userId,
						plan,
						period,
						amount,
						paymentId,
						expires_at,
					},
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: apiKey,
						},
					},
				);

				if (result.status !== 200 && result.status !== 201) {
					throw new Error(result.data?.message || "Failed to create subscription.");
				} else {
					setSubscriptionMessage("Subscription created successfully.");
					fetchSubscriptions(userId);
				}
			} catch (error) {
				console.error("Error creating subscription:", error);
				setSubscriptionError(
					typeof error === "object" && error !== null && "message" in error
						? (error as { message?: string }).message ||
								"Failed to create subscription."
						: String(error) || "Failed to create subscription.",
				);
			} finally {
				setSubscriptionLoading(false);
			}
		},
		[apiKey, fetchSubscriptions],
	);

	// cancel subscription
	const cancelSubscription = useCallback(
		async (subscriptionId: string) => {
			setSubscriptionLoading(true);
			setSubscriptionError(undefined);
			try {
				if (!subscriptionId) throw new Error("Missing subscriptionId");
				const result = await axios.put(
					"/api/subscription/cancel",
					{ subscriptionId },
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: apiKey,
						},
					},
				);
				if (result.status !== 200 && result.status !== 201) {
					throw new Error(result.data?.message || "Failed to cancel subscription.");
				}
				setSubscriptionMessage("Subscription canceled successfully.");
				// Refresh subscriptions
				if (user?.id) fetchSubscriptions(user.id);
			} catch (error) {
				console.error("Error canceling subscription:", error);
				setSubscriptionError(
					typeof error === "object" && error !== null && "message" in error
						? (error as { message?: string }).message ||
								"Failed to cancel subscription."
						: String(error) || "Failed to cancel subscription.",
				);
			} finally {
				setSubscriptionLoading(false);
			}
		},
		[apiKey, fetchSubscriptions, user?.id],
	);

	// change subscription plan
	const changeSubscriptionPlan = useCallback(
		async ({
			subscriptionId,
			newPlan,
			newPeriod,
		}: {
			subscriptionId: string;
			newPlan: string;
			newPeriod: "monthly" | "yearly";
		}) => {
			setSubscriptionLoading(true);
			setSubscriptionError(undefined);
			try {
				const currentSub = subscriptions.find((sub) => sub.id === subscriptionId);
				if (
					currentSub &&
					currentSub.plan.toLowerCase() === newPlan.toLowerCase() &&
					currentSub.period.toLowerCase() === newPeriod.toLowerCase()
				) {
					setSubscriptionMessage("No changes detected. Subscription plan not updated.");
					setSubscriptionLoading(false);
					return;
				}
				if (!subscriptionId || !newPlan || !newPeriod) throw new Error("Missing fields");
				const result = await axios.put(
					"/api/subscription/change-plan",
					{ subscriptionId, newPlan, newPeriod },
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: apiKey,
						},
					},
				);
				if (result.status !== 200 && result.status !== 201) {
					throw new Error(result.data?.message || "Failed to change plan.");
				}
				setSubscriptionMessage("Subscription plan changed successfully.");
				// Refresh subscriptions
				if (user?.id) fetchSubscriptions(user.id);
			} catch (error) {
				console.error("Error changing subscription plan:", error);
				setSubscriptionError(
					typeof error === "object" && error !== null && "message" in error
						? (error as { message?: string }).message ||
								"Failed to change subscription plan."
						: String(error) || "Failed to change subscription plan.",
				);
			} finally {
				setSubscriptionLoading(false);
			}
		},
		[apiKey, fetchSubscriptions, user?.id, subscriptions],
	);

	return {
		subscriptions,
		subscriptionLoading,
		subscriptionError,
		subscriptionMessage,
		fetchSubscriptions,
		activateSubscription,
		createSubscription,
		cancelSubscription,
		changeSubscriptionPlan,
	};
};

export default useSubscriptions;
