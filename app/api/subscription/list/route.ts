import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/db";

export async function GET(req: NextRequest) {
	try {
		// const { userId, has } = await auth();
		// console.log("Authenticated request to fetch subscriptions", userId);
		// if (!userId) {
		// 	return NextResponse.json(
		// 		{ error: true, message: "Unauthorized", status: 401 },
		// 		{ status: 401 },
		// 	);
		// }
		// const canRead = has({ permission: "api:read" });
		// if (!canRead) {
		// 	return NextResponse.json(
		// 		{ error: true, message: "Forbidden", status: 403 },
		// 		{ status: 403 },
		// 	);
		// }

		// get id from query parameters
		const id = new URL(req.url).searchParams.get("id");

		if (!id) {
			console.error("Missing id in request");

			return NextResponse.json(
				{ error: true, message: "Missing id", data: null, status: 400 },
				{ status: 400 },
			);
		}
		const { data, error } = await supabase
			.from("subscriptions")
			.select("*")
			.eq("user_id", id)
			.order("created_at", { ascending: false });

		console.log("Fetched subscriptions for id:", id, data);

		if (error) {
			return NextResponse.json(
				{ error: true, message: error.message, data: null, status: 500 },
				{ status: 500 },
			);
		}

		return NextResponse.json(
			{
				error: false,
				message: "Fetched subscriptions",
				subscriptions: data,
				status: 200,
			},
			{ status: 200 },
		);
	} catch (err: any) {
		return NextResponse.json(
			{
				error: true,
				message: err?.message || "Internal server error",
				subscriptions: null,
				status: 500,
			},
			{ status: 500 },
		);
	}
}

export function POST() {
	return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
