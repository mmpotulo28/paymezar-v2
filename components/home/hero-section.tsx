"use client";
import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
	return (
		<section className="w-full max-w-3xl text-center flex flex-col items-center gap-4">
			<h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-2">PayMe-Zar</h1>
			<p className="text-lg md:text-xl text-default-700 font-medium mb-2">
				Instant ZAR stablecoin payments for everyone.
			</p>
			<p className="text-base text-default-500 max-w-xl mx-auto mb-4">
				Send, receive, and manage South African Rand (ZAR) stablecoins with ease. No banks,
				no borders, no hassle.
			</p>
			<div className="flex flex-wrap gap-4 justify-center mt-2">
				<Link
					className={buttonStyles({
						color: "primary",
						radius: "full",
						size: "lg",
						variant: "shadow",
					})}
					href="/pay-now">
					Get Started <ArrowRight size={18} />
				</Link>
				<Link
					className={buttonStyles({
						color: "secondary",
						radius: "full",
						size: "lg",
						variant: "flat",
					})}
					href="/pricing">
					View Pricing
				</Link>
				<Link
					className={buttonStyles({
						variant: "bordered",
						radius: "full",
						size: "lg",
					})}
					href="/support">
					Support
				</Link>
			</div>
		</section>
	);
}
