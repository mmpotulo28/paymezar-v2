import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";
// import { auth } from "@clerk/nextjs/server";

export async function PUT(req: NextRequest) {
	try {
		// const { userId } = await auth();
		// if (!userId) {
		// 	return NextResponse.json(
		// 		{ error: true, message: "Unauthorized", status: 401 },
		// 		{ status: 401 },
		// 	);
		// }

		const { subscriptionId, newPlan, newPeriod } = await req.json();
		if (!subscriptionId || !newPlan || !newPeriod) {
			return NextResponse.json(
				{ error: true, message: "Missing fields", status: 400 },
				{ status: 400 },
			);
		}

		// If changing to free plan, set status to active and do not create a charge
		const updateData: Record<string, any> = {
			plan: newPlan,
			period: newPeriod,
			updated_at: new Date().toISOString(),
		};
		if (newPlan.toLowerCase() === "starter") {
			updateData.status = "active";
		}

		const { error } = await supabase
			.from("subscriptions")
			.update(updateData)
			.eq("id", subscriptionId);

		if (error) {
			return NextResponse.json(
				{ error: true, message: error.message, status: 500 },
				{ status: 500 },
			);
		}
		return NextResponse.json(
			{ error: false, message: "Subscription plan changed", status: 200 },
			{ status: 200 },
		);
	} catch (err: any) {
		return NextResponse.json(
			{ error: true, message: err?.message || "Internal server error", status: 500 },
			{ status: 500 },
		);
	}
}
