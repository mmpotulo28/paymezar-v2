"use client";
import { Button } from "@heroui/react";
import { Link } from "@heroui/link";
import { motion } from "framer-motion";

export function AboutCta() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 40 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6, ease: "easeOut" }}
			className="w-full max-w-2xl flex flex-col items-center gap-4 mt-8">
			<h2 className="text-xl font-bold text-center">Ready to experience PayMe-Zar?</h2>
			<p className="text-default-600 text-center">
				Join thousands of users and businesses using PayMe-Zar for fast, secure, and
				affordable ZAR stablecoin payments.
			</p>
			<div className="flex gap-4 mt-2">
				<Button
					as={Link}
					href="/pay-now"
					color="primary"
					variant="solid"
					radius="full"
					size="lg">
					Get Started
				</Button>
				<Button
					as={Link}
					href="/support/contact"
					color="secondary"
					variant="flat"
					radius="full"
					size="lg">
					Contact Us
				</Button>
			</div>
		</motion.div>
	);
}
