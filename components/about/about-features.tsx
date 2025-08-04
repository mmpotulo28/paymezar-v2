"use client";
import { ShieldCheck, Zap, Globe, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const features = [
	{
		icon: <ShieldCheck size={36} className="text-success" />,
		title: "Secure & Trusted",
		desc: "Bank-grade security and blockchain technology keep your funds and data safe.",
	},
	{
		icon: <Zap size={36} className="text-warning" />,
		title: "Instant & Borderless",
		desc: "Send and receive ZAR stablecoins instantly, anywhere, anytime.",
	},
	{
		icon: <Globe size={36} className="text-primary" />,
		title: "Open for Everyone",
		desc: "No technical skills required. Designed for freelancers, businesses, and individuals.",
	},
	{
		icon: <MessageCircle size={36} className="text-secondary" />,
		title: "Community Driven",
		desc: "We listen to our users and build features you want. Join our community.",
	},
];

export function AboutFeatures() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 40 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6, ease: "easeOut" }}
			className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
			{features.map((f, i) => (
				<motion.div
					key={f.title}
					className="flex flex-col items-center gap-3 bg-white/80 rounded-xl shadow border border-default-100 p-6 hover:shadow-lg transition"
					whileHover={{ scale: 1.04 }}
					transition={{ type: "spring", stiffness: 300 }}>
					{f.icon}
					<h2 className="text-lg font-semibold">{f.title}</h2>
					<p className="text-default-600 text-center">{f.desc}</p>
				</motion.div>
			))}
		</motion.div>
	);
}
