import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";

/**
 * POST /api/auth/link-lisk-id
 * Body: { apiKey: string, liskId: string }
 * Returns: { error, message, data, status }
 */
export async function POST(req: NextRequest) {
	try {
		const { apiKey, liskId } = await req.json();
		if (!apiKey || !liskId) {
			return NextResponse.json(
				{ error: true, message: "Missing apiKey or liskId", data: null, status: 400 },
				{ status: 400 },
			);
		}
		const { data, error } = await supabase
			.from("api_keys")
			.update({ lisk_id: liskId, updated_at: new Date().toISOString() })
			.eq("api_key", apiKey)
			.select()
			.single();

		if (error) {
			return NextResponse.json(
				{ error: true, message: error.message, data: null, status: 500 },
				{ status: 500 },
			);
		}
		return NextResponse.json(
			{ error: false, message: "Lisk ID linked successfully", data, status: 200 },
			{ status: 200 },
		);
	} catch (error: any) {
		return NextResponse.json(
			{
				error: true,
				message:
					error?.response?.data?.message || error?.message || "Internal server error",
				data: null,
				status: 500,
			},
			{ status: 500 },
		);
	}
}
