"use client";
import { useState } from "react";
import { Accordion, AccordionItem, Card, CardHeader, CardBody, Pagination } from "@heroui/react";
import { faqs } from "@/lib/data";

const PAGE_SIZE = 10;

export default function FaqPage() {
	const [page, setPage] = useState(1);
	const totalPages = Math.ceil(faqs.length / PAGE_SIZE);
	const pagedFaqs = faqs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	return (
		<div className="min-h-[80vh] flex flex-col items-center py-12 px-0 w-full">
			<Card className="w-full max-w-4xl mb-10">
				<CardHeader className="flex flex-col items-center gap-2">
					<h1 className="text-3xl font-bold text-center">Frequently Asked Questions</h1>
					<p className="text-default-500 text-center max-w-xl">
						Find answers to common questions about PayMe-Zar, subscriptions, payments,
						and more.
					</p>
				</CardHeader>
				<CardBody>
					<Accordion variant="bordered">
						{pagedFaqs.map((faq, idx) => (
							<AccordionItem key={idx + (page - 1) * PAGE_SIZE} title={faq.question}>
								{faq.answer}
							</AccordionItem>
						))}
					</Accordion>
					{totalPages > 1 && (
						<div className="flex justify-center mt-8">
							<Pagination
								loop
								showControls
								page={page}
								total={totalPages}
								onChange={setPage}
								variant="bordered"
							/>
						</div>
					)}
				</CardBody>
			</Card>
		</div>
	);
}
