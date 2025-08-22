import { PLAN_DETAILS } from "@/lib/constants";
import { iSubscription } from "@/types";
import { useOrganization, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import useCache from "./useCache";
export interface iUseSubscriptions {
	subscriptions: iSubscription[];
	subscriptionLoading: boolean;
	subscriptionError: string | undefined;
	fetchSubscriptions: (userId: string) => Promise<iSubscription[]>;
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

	const fetchSubscriptions = useCallback(async (userId: string) => {
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
				const updatedSubscriptions = result.data.subscriptions.map((sub: iSubscription) => {
					const planDetails = PLAN_DETAILS[sub.plan] || {};
					return {
						...sub,
						planDetails,
					};
				});
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
	}, []);

	return { subscriptions, subscriptionLoading, subscriptionError, fetchSubscriptions };
};

export default useSubscriptions;
