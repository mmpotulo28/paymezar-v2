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
