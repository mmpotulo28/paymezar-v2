// User type for a single user in the app
export interface iUser {
	id: string;
	firstName: string | null;
	lastName: string | null;
	email: string;
	imageUrl: string | null;
	enabledPay: boolean | null;
	role: "ADMIN" | "MEMBER" | "CUSTOMER";
	publicKey: string | null;
	paymentIdentifier: string | null;
	businessId: string | null;
	createdAt: string;
	updatedAt: string;
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
