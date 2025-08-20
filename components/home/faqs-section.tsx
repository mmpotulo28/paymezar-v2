"use client";
import { Accordion, AccordionItem } from "@heroui/react";
import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { faqs } from "@/lib/data";

export function FaqsSection() {
	return (
		<section className="w-full max-w-3xl mt-12">
			<h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
			<Accordion variant="bordered">
				{faqs.slice(0, 5).map((faq, idx) => (
					<AccordionItem key={idx} title={faq.question}>
						{faq.answer}
					</AccordionItem>
				))}
			</Accordion>
			<div className="flex justify-center mt-4">
				<Link
					className={buttonStyles({
						color: "secondary",
						radius: "full",
						variant: "flat",
						size: "md",
					})}
					href="/support/faq">
					More FAQs
				</Link>
			</div>
		</section>
	);
}
