import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
	return NextResponse.json(
		{ message: "Sign in is currently disabled. Please try again later." },
		{ status: 400 },
	);
}

export function GET() {
	return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
