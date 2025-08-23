import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

import { supabase } from "@/lib/db";

const PLAN_PRICES: Record<string, { monthly: number; yearly: number }> = {
	starter: { monthly: 0, yearly: 0 },
	pro: { monthly: 10, yearly: 8 },
	business: { monthly: 20, yearly: 15 },
};

export async function POST(req: NextRequest) {
	try {
		const { userId, plan, period, amount, paymentId } = await req.json();
		// get apiKey from authorization
		const apiKey = req.headers.get("Authorization")?.replace("Bearer ", "");

		const isMissingFields = !userId || !plan || !period || !amount || !paymentId || !apiKey;
		if (isMissingFields) {
			console.log("Missing required fields:", {
				userId,
				plan,
				period,
				amount,
				paymentId,
				apiKey,
			});
			return NextResponse.json(
				{
					error: true,
					message: "Missing required fields",
					data: null,
					status: 400,
				},
				{ status: 400 },
			);
		}

		// 1. Create the subscription in Supabase
		console.log("Creating subscription:", { userId, plan, period, amount, paymentId });
		const { data: subscription, error: subError } = await supabase
			.from("subscriptions")
			.insert([
				{
					charge_id: userId,
					user_id: userId,
					payment_id: paymentId,
					plan,
					status: "pending", // <-- changed from "active" to "pending"
					started_at: new Date().toISOString(),
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
					period,
				},
			])
			.select()
			.single();

		if (subError) {
			console.error("Error creating subscription:", subError);
			return NextResponse.json(
				{ error: true, message: subError.message, data: null, status: 500 },
				{ status: 500 },
			);
		}

		// 2. Create a charge for the subscription (except for free/starter)
		let charge = null;
		console.log("Subscription created, now creating charge if needed:", subscription, apiKey);

		if (plan !== "starter") {
			const chargeAmount =
				typeof amount === "number"
					? amount
					: period === "yearly"
						? (PLAN_PRICES[plan]?.yearly || 0) * 12
						: PLAN_PRICES[plan]?.monthly || 0;

			try {
				const chargeRes = await axios.post(
					`https://seal-app-qp9cc.ondigitalocean.app/api/v1/charge/${encodeURIComponent(userId)}/create`,
					{
						paymentId,
						amount: chargeAmount,
						note: `Subscription charge for ${plan} (${period})`,
					},
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${apiKey}`,
						},
					},
				);

				if (chargeRes.data.error || !chargeRes.data.charge) {
					console.error("Error creating charge:", chargeRes.data.message);
					throw new Error(chargeRes.data.message);
				}

				charge = chargeRes.data.charge;
				console.log("Charge created successfully:", charge.charge);
			} catch (chargeError: any) {
				// Optionally: rollback subscription if charge fails
				console.error("Charge creation failed, rolling back:", chargeError);
				await supabase.from("subscriptions").delete().eq("id", subscription.id);

				return NextResponse.json(
					{
						error: true,
						message:
							chargeError?.response?.data?.message ||
							chargeError?.message ||
							"Failed to create charge",
						data: null,
						status: 500,
					},
					{ status: 500 },
				);
			}

			// 3. Link charge to subscription (add charge_id to subscription)
			console.log("Linking charge to subscription:", {
				subscriptionId: subscription.id,
				chargeId: charge.id,
			});
			await supabase
				.from("subscriptions")
				.update({ charge_id: charge.id, updated_at: new Date().toISOString() })
				.eq("id", subscription.id);
		}

		// 4. Return subscription info and charge info
		return NextResponse.json(
			{
				error: false,
				message: "Subscription created",
				data: {
					subscription: { ...subscription, charge },
				},
				status: 201,
			},
			{ status: 201 },
		);
	} catch (error: any) {
		console.log("Error creating subscription:", error);
		return NextResponse.json(
			{
				error: true,
				message: error?.message || "Internal server error",
				data: null,
				status: error?.status || 500,
			},
			{ status: error?.status || 500 },
		);
	}
}
