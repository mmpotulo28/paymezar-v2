import { NextRequest, NextResponse } from "next/server";
import { iUser } from "@/types";
import { createApiToken } from "@/lib/helpers";
import { supabase } from "@/lib/db";

const stablecoinSecretToken = process.env.SECRET_TOKEN!;

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { user }: { user: iUser } = body;

		const requiredFields = [user.firstName, user.lastName, user.email, user.password];
		if (requiredFields.some((field) => !field)) {
			return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
		}

		// 1. Create user in Supabase Auth
		const { data: authData, error: authError } = await supabase.auth.admin.createUser({
			email: user.email,
			password: user.password,
			email_confirm: true,
			user_metadata: {
				firstName: user.firstName,
				lastName: user.lastName,
			},
		});

		if (authError || !authData?.user) {
			return NextResponse.json(
				{ message: authError?.message || "Failed to create user" },
				{ status: 400 },
			);
		}

		const userId = authData.user.id;

		// 2. Create API key for the user using the stablecoin API
		let apiKey: string | null = null;
		let apiKeyRow: any = null;
		try {
			const results = await createApiToken(
				stablecoinSecretToken,
				`User ${user.email} API Key`,
			);
			apiKey = results.data?.token || null;

			// 3. Store API key in api_keys table
			const { data: apiKeyInsert, error: apiKeyInsertError } = await supabase
				.from("api_keys")
				.insert([
					{
						user_id: userId,
						api_key: apiKey,
						status: "active",
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString(),
					},
				])
				.select()
				.single();

			if (apiKeyInsertError) {
				// Cleanup: delete user if api_keys insert fails
				await supabase.auth.admin.deleteUser(userId);
				return NextResponse.json(
					{ message: apiKeyInsertError.message || "Failed to save API key" },
					{ status: 500 },
				);
			}
			apiKeyRow = apiKeyInsert;
		} catch (apiKeyError: any) {
			// Cleanup: delete user if API key creation fails
			await supabase.auth.admin.deleteUser(userId);
			return NextResponse.json(
				{ message: apiKeyError?.message || "Failed to create API key, user deleted" },
				{ status: 500 },
			);
		}

		return NextResponse.json(
			{
				message: "User created successfully",
				user: {
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					apiKey: apiKey || undefined,
					apiKeyRow: apiKeyRow || undefined,
				},
			},
			{ status: 201 },
		);
	} catch (error: any) {
		// No userId available here, so just return error
		return NextResponse.json(
			{ message: error?.message || "Internal server error" },
			{ status: 500 },
		);
	}
}

export function GET() {
	return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
