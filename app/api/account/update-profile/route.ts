import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

import { supabase } from "@/lib/db";

/**
 * PUT /api/account/update-profile
 * Body: { id, email, firstName, lastName, imageUrl }
 * Updates user profile in Supabase Auth and Lisk API.
 */
export async function PUT(req: NextRequest) {
	try {
		const { id, liskId, email, firstName, lastName, imageUrl, phone } = await req.json();
		const isMissingFields = !id || !liskId || !email || !firstName || !lastName;

		if (isMissingFields) {
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

		// 1. Update Supabase Auth user (email, metadata)
		const { error: metaError } = await supabase.auth.admin.updateUserById(id, {
			email,
			phone,
			user_metadata: {
				firstName,
				lastName,
				imageUrl,
			},
		});

		if (metaError) {
			console.error("Supabase user update error:", metaError);

			return NextResponse.json(
				{ error: true, message: metaError.message, data: null, status: 500 },
				{ status: 500 },
			);
		}

		// 2. Update Lisk API user
		const apiRes = await axios.put(
			`https://seal-app-qp9cc.ondigitalocean.app/api/v1/users/${encodeURIComponent(liskId)}`,
			{
				email,
				firstName,
				lastName,
				imageUrl,
			},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: process.env.NEXT_PUBLIC_LISK_API_KEY || "",
				},
			},
		);

		if (apiRes.status !== 200 && apiRes.status !== 201) {
			console.error("Lisk API update error:", apiRes.data);

			return NextResponse.json(
				{
					error: true,
					message: apiRes.data?.message || "Failed to update user in Lisk API",
					data: null,
					status: apiRes.status,
				},
				{ status: apiRes.status },
			);
		}

		return NextResponse.json(
			{
				error: false,
				message: "Profile updated successfully",
				user: { ...apiRes.data.user, supabaseId: id, phone },
				status: 200,
			},
			{ status: 200 },
		);
	} catch (err: any) {
		console.error("Error updating profile", err);

		return NextResponse.json(
			{
				error: true,
				message: err?.message || "Failed to update profile",
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
