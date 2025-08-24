import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function PUT(req: NextRequest) {
	try {
		const { subscriptionId, newPlan, newPeriod } = await req.json();
		if (!subscriptionId || !newPlan || !newPeriod) {
			return NextResponse.json(
				{ error: true, message: "Missing fields", status: 400 },
				{ status: 400 },
			);
		}
		const { error } = await supabase
			.from("subscriptions")
			.update({
				plan: newPlan,
				period: newPeriod,
				updated_at: new Date().toISOString(),
			})
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

export function GET() {
	return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
