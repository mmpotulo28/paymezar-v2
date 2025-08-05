// User type for a single user in the app
export interface iUser {
	id: string;
	supabaseId: string | null; // Supabase user ID
	firstName: string | null;
	lastName: string | null;
	email: string;
	phone?: string | null; // Optional phone number
	imageUrl: string | null;
	enabledPay: boolean | null;
	role: "ADMIN" | "MEMBER" | "CUSTOMER";
	publicKey: string | null;
	paymentIdentifier: string | null;
	businessId: string | null;
	createdAt: string;
	updatedAt: string;
	password?: string; // Optional for sign-up, not stored in DB
	apiKey?: string | null; // Optional, can be generated later
}
// Transaction type for a single transaction in the app
export interface iTransaction {
	id: string;
	userId: string;
	externalId: string | null;
	txType: string;
	method: string;
	currency: string;
	value: number;
	status: string;
	createdAt: string; // ISO date-time string
}
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

// Bank Account type for user bank accounts
export interface iBankAccount {
	id: string;
	userId: string;
	accountHolder: string;
	accountNumber: string;
	branchCode: string;
	bank: string;
	createdAt: string;
	updatedAt: string;
}

// Pricing plan type for subscriptions
export interface iPricingPlan {
	name: string;
	price: {
		monthly: number;
		yearly: number;
	};
	description: string;
	features: string[];
	isPopular?: boolean;
}

// Charge type for a single charge in the app
export interface iCharge {
	id: string;
	paymentId: string;
	amount: number;
	note: string | null;
	status: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
}
