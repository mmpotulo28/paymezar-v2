import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { CheckIcon, MinusIcon } from "lucide-react";

interface Feature {
	name: string;
	free: boolean;
	pro: boolean;
	enterprise: boolean;
}

const features: Feature[] = [
	{ name: "Unlimited Projects", free: true, pro: true, enterprise: true },
	{ name: "API Access", free: false, pro: true, enterprise: true },
	{ name: "Team Collaboration", free: false, pro: true, enterprise: true },
	{ name: "Custom Domain", free: false, pro: true, enterprise: true },
	{ name: "Priority Support", free: false, pro: false, enterprise: true },
	{ name: "SLA", free: false, pro: false, enterprise: true },
];

export function FeatureComparison() {
	const renderCheck = (value: boolean) =>
		value ? (
			<CheckIcon className="text-success mx-auto" />
		) : (
			<MinusIcon className="text-default-300 mx-auto" />
		);

	return (
		<Table aria-label="Feature comparison" className="max-w-3xl mx-auto">
			<TableHeader>
				<TableColumn>Feature</TableColumn>
				<TableColumn>Free</TableColumn>
				<TableColumn>Pro</TableColumn>
				<TableColumn>Enterprise</TableColumn>
			</TableHeader>
			<TableBody>
				{features.map((feature) => (
					<TableRow key={feature.name}>
						<TableCell>{feature.name}</TableCell>
						<TableCell>{renderCheck(feature.free)}</TableCell>
						<TableCell>{renderCheck(feature.pro)}</TableCell>
						<TableCell>{renderCheck(feature.enterprise)}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
