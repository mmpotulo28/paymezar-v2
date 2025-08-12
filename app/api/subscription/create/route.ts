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
		const { id, plan, period, amount } = await req.json();

		if (!id || !plan || !period) {
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
		const { data: subscription, error: subError } = await supabase
			.from("subscriptions")
			.insert([
				{
					charge_id: id,
					user_id: id,
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
			return NextResponse.json(
				{ error: true, message: subError.message, data: null, status: 500 },
				{ status: 500 },
			);
		}

		// 2. Create a charge for the subscription (except for free/starter)
		let charge = null;

		if (plan !== "starter") {
			const chargeAmount =
				typeof amount === "number"
					? amount
					: period === "yearly"
						? (PLAN_PRICES[plan]?.yearly || 0) * 12
						: PLAN_PRICES[plan]?.monthly || 0;
			const paymentId = `sub-${subscription.id}`;

			try {
				const chargeRes = await axios.post(
					`https://seal-app-qp9cc.ondigitalocean.app/api/v1/charge/${encodeURIComponent(id)}/create`,
					{
						paymentId,
						amount: chargeAmount,
						note: `Subscription charge for ${plan} (${period})`,
					},
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: process.env.NEXT_PUBLIC_LISK_API_KEY || "",
						},
					},
				);

				charge = chargeRes.data;
			} catch (chargeError: any) {
				// Optionally: rollback subscription if charge fails
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
		return NextResponse.json(
			{
				error: true,
				message: error?.message || "Internal server error",
				data: null,
				status: 500,
			},
			{ status: 500 },
		);
	}
}
