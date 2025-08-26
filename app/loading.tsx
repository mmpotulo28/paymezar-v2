"use client";
import { Spinner, Card, CardBody } from "@heroui/react";
import { Logo } from "@/components/icons";

export default function Loading() {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-background backdrop-blur-sm">
			<Card className="p-8 rounded-2xl shadow-none bg-background">
				<CardBody className="flex flex-col items-center gap-6">
					<Logo size={100} className="text-primary drop-shadow-lg" />
					<Spinner size="lg" color="primary" className="animate-spin" />
					<div className="text-lg font-semibold text-primary">
						Loading, please wait...
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
