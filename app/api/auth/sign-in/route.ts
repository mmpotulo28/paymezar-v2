import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { getLiskUserById } from "@/lib/helpers";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { email, password } = body;

		if (!email || !password) {
			return NextResponse.json(
				{ error: true, message: "Missing email or password", data: null, status: 400 },
				{ status: 400 },
			);
		}

		// 1. Sign in with Supabase
		console.log("Signing in user", { email });
		const { data, error } = await supabase.auth.signInWithPassword({ email, password });
		if (error || !data?.user) {
			console.error("supabase Sign in failed", error);
			return NextResponse.json(
				{
					error: true,
					message: error?.message || "Invalid credentials",
					data: null,
					status: 401,
				},
				{ status: 401 },
			);
		}

		const userId = data.user.id;
		console.log("User signed in successfully", { userId });

		// 2. Get user's API key record from api_keys table
		console.log("Fetching API key for user", { userId });
		const { data: apiKeyRow, error: apiKeyError } = await supabase
			.from("api_keys")
			.select("*")
			.eq("user_id", userId)
			.single();

		if (!apiKeyRow || !apiKeyRow.lisk_id || !apiKeyRow.api_key) {
			console.error("API key or Lisk ID not found for user", { userId });
			return NextResponse.json(
				{
					error: true,
					message: "API key or Lisk ID not found for user",
					data: null,
					status: 404,
				},
				{ status: 404 },
			);
		}

		// 3. Fetch Lisk user info
		console.log("Fetching Lisk user by ID", { liskId: apiKeyRow.lisk_id });
		const liskRes = await getLiskUserById({
			apiKey: apiKeyRow.api_key,
			liskId: apiKeyRow.lisk_id,
		});

		if (liskRes.error || !liskRes.data) {
			console.error("Failed to fetch Lisk user", liskRes.message, {
				liskId: apiKeyRow.lisk_id,
				data: liskRes.data,
			});
			return NextResponse.json(
				{
					error: true,
					message: liskRes.message || "Failed to fetch Lisk user",
					data: null,
					status: 500,
				},
				{ status: 500 },
			);
		}

		console.log("Lisk user fetched successfully", { liskUser: liskRes.data });
		return NextResponse.json(
			{
				error: false,
				message: "Sign in successful",
				data: {
					user: liskRes.data,
					apiKey: apiKeyRow.api_key,
					liskId: apiKeyRow.lisk_id,
				},
				status: 200,
			},
			{ status: 200 },
		);
	} catch (error: any) {
		console.error("Error during sign-in", error);
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

export function GET() {
	return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
