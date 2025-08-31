import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";
// import { auth } from "@clerk/nextjs/server";

export async function PUT(req: NextRequest) {
	try {
		// const { userId, has } = await auth();
		// if (!userId) {
		// 	return NextResponse.json(
		// 		{ error: true, message: "Unauthorized", status: 401 },
		// 		{ status: 401 },
		// 	);
		// }
		// const canUpdate = has({ permission: "api:write" });
		// if (!canUpdate) {
		// 	return NextResponse.json(
		// 		{ error: true, message: "Forbidden", status: 403 },
		// 		{ status: 403 },
		// 	);
		// }
		const { subscriptionId, status } = await req.json();

		if (!subscriptionId || !status) {
			return NextResponse.json(
				{
					error: true,
					message: "Missing subscriptionId or status",
					data: null,
					status: 400,
				},
				{ status: 400 },
			);
		}

		const { error } = await supabase
			.from("subscriptions")
			.update({ status, updated_at: new Date().toISOString() })
			.eq("id", subscriptionId);

		if (error) {
			return NextResponse.json(
				{ error: true, message: error.message, data: null, status: 500 },
				{ status: 500 },
			);
		}

		return NextResponse.json(
			{ error: false, message: "Subscription status updated", data: null, status: 200 },
			{ status: 200 },
		);
	} catch (err: any) {
		return NextResponse.json(
			{
				error: true,
				message: err?.message || "Internal server error",
				data: null,
				status: 500,
			},
			{ status: 500 },
		);
	}
}

export function GET() {
	return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
