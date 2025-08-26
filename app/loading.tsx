"use client";
import { Spinner, Card, CardBody } from "@heroui/react";

export default function Loading() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-background">
			<Card className="p-8 shadow-lg">
				<CardBody className="flex flex-col items-center gap-4">
					<Spinner size="lg" color="primary" />
					<div className="text-lg font-medium text-default-700">
						Loading, please wait...
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
