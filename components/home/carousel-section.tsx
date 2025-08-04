"use client";
import { useState } from "react";
import { Card, CardBody } from "@heroui/react";
import { ChevronRight, ChevronLeft } from "lucide-react";

const carouselItems = [
	{
		title: "Fast Onboarding",
		description: "Sign up and start sending ZAR stablecoins in under 2 minutes.",
		icon: "🚀",
	},
	{
		title: "No Hidden Fees",
		description: "Transparent pricing. What you see is what you pay.",
		icon: "💸",
	},
	{
		title: "Bank-Grade Security",
		description: "Your data and funds are protected with industry-leading security.",
		icon: "🔒",
	},
	{
		title: "Works Everywhere",
		description: "Pay and get paid on any device, anywhere in South Africa.",
		icon: "🌍",
	},
];

export function CarouselSection() {
	const [carouselIndex, setCarouselIndex] = useState(0);

	const handlePrev = () => setCarouselIndex((i) => (i === 0 ? carouselItems.length - 1 : i - 1));
	const handleNext = () => setCarouselIndex((i) => (i === carouselItems.length - 1 ? 0 : i + 1));

	return (
		<section className="w-full max-w-2xl flex flex-col items-center gap-4">
			<div className="relative w-full flex items-center justify-center">
				<button
					className="absolute left-0 z-10 bg-white/80 rounded-full p-2 shadow hover:bg-primary-100 transition"
					onClick={handlePrev}
					aria-label="Previous">
					<ChevronLeft size={24} />
				</button>
				<Card className="w-full mx-12 transition-all duration-300">
					<CardBody className="flex flex-col items-center gap-2 py-8">
						<span className="text-4xl">{carouselItems[carouselIndex].icon}</span>
						<span className="text-xl font-bold">
							{carouselItems[carouselIndex].title}
						</span>
						<span className="text-default-600 text-base">
							{carouselItems[carouselIndex].description}
						</span>
					</CardBody>
				</Card>
				<button
					className="absolute right-0 z-10 bg-white/80 rounded-full p-2 shadow hover:bg-primary-100 transition"
					onClick={handleNext}
					aria-label="Next">
					<ChevronRight size={24} />
				</button>
			</div>
			<div className="flex gap-2 mt-2">
				{carouselItems.map((_, idx) => (
					<span
						key={idx}
						className={`w-2 h-2 rounded-full ${carouselIndex === idx ? "bg-primary" : "bg-default-300"}`}
					/>
				))}
			</div>
		</section>
	);
}
