import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();
		const file = formData.get("file") as File | null;
		const userId = formData.get("userId") as string | null;

		if (!file || !userId) {
			return NextResponse.json(
				{ error: true, message: "Missing file or userId", url: null },
				{ status: 400 },
			);
		}

		const fileExt = file.name.split(".").pop();
		const fileName = `${userId}-${Date.now()}.${fileExt}`;
		const arrayBuffer = await file.arrayBuffer();

		const { error: uploadError } = await supabase.storage
			.from("profile-images")
			.upload(fileName, arrayBuffer, {
				contentType: file.type,
				upsert: true,
			});

		if (uploadError) {
			console.error("Image upload error:", uploadError);
			return NextResponse.json(
				{ error: true, message: uploadError.message, url: null },
				{ status: 500 },
			);
		}

		const { data: urlData } = supabase.storage.from("profile-images").getPublicUrl(fileName);

		if (!urlData) {
			console.error("Error getting public URL:", urlData);
			return NextResponse.json(
				{ error: true, message: "Couldn't get public URL", url: null },
				{ status: 500 },
			);
		}

		return NextResponse.json(
			{ error: false, message: "Image uploaded", url: urlData.publicUrl },
			{ status: 200 },
		);
	} catch (err: any) {
		return NextResponse.json(
			{ error: true, message: err?.message || "Failed to upload image", url: null },
			{ status: 500 },
		);
	}
}

export function GET() {
	return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
