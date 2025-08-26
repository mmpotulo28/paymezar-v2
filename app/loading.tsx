"use client";
import { Spinner, Card, CardBody } from "@heroui/react";

export default function Loading() {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
			<Card className="p-8 rounded-2xl shadow-xl bg-background/90 border border-default-200">
				<CardBody className="flex flex-col items-center gap-4">
					<Spinner size="lg" color="primary" className="animate-spin" />
					<div className="text-lg font-semibold text-primary">
						Loading, please wait...
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
