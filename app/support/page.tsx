"use client";
import { Card, CardBody, CardHeader, Button, Chip } from "@heroui/react";
import { Link } from "@heroui/link";
import { Mail, HelpCircle, FileText, ShieldCheck, ChevronRight, Users } from "lucide-react";

const supportLinks = [
	{
		title: "Contact Us",
		description: "Get in touch with our support team for personalized help.",
		href: "/support/contact",
		icon: <Mail className="text-primary" size={24} />,
	},
	{
		title: "FAQs",
		description: "Find answers to the most common questions.",
		href: "/support/faq",
		icon: <HelpCircle className="text-success" size={24} />,
	},
	{
		title: "Privacy Policy",
		description: "Learn how we protect your data and privacy.",
		href: "/support/privacy",
		icon: <ShieldCheck className="text-warning" size={24} />,
	},
	{
		title: "Terms & Conditions",
		description: "Read the terms that govern your use of PayMe-Zar.",
		href: "/support/terms",
		icon: <FileText className="text-secondary" size={24} />,
	},
	{
		title: "Community",
		description: "Join our Discord and connect with other users.",
		href: "https://discord.gg/9b6yyZKmH4",
		icon: <Users className="text-indigo-500" size={24} />,
		external: true,
	},
];
// Add About page link
supportLinks.push({
	title: "About",
	description: "Learn more about PayMe-Zar and our mission.",
	href: "/about",
	icon: <HelpCircle className="text-primary" size={24} />,
});

export default function SupportPage() {
	return (
		<div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4">
			<Card className="w-full max-w-3xl mb-10">
				<CardHeader className="flex flex-col items-center gap-2">
					<h1 className="text-3xl font-bold text-center">Support Center</h1>
					<p className="text-default-500 text-center max-w-xl">
						We&apos;re here to help! Find answers, get in touch, or learn more about
						PayMe-Zar.
					</p>
				</CardHeader>
			</Card>
			<div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
				{supportLinks.map((link) => (
					<Card
						key={link.title}
						className="flex flex-col justify-between hover:shadow-xl transition-shadow duration-200">
						<CardBody className="flex flex-row gap-4 items-center">
							<div className="flex flex-col items-center justify-center w-20 h-20">
								{link.icon}
							</div>
							<div className="flex-1">
								<div className="flex items-center gap-2">
									<span className="text-lg font-semibold">{link.title}</span>
									{link.external && (
										<Chip color="secondary" size="sm" variant="flat">
											External
										</Chip>
									)}
								</div>
								<p className="text-default-500 text-sm">{link.description}</p>
							</div>
							<Button
								as={Link}
								className="ml-2"
								color="primary"
								endContent={<ChevronRight size={18} />}
								href={link.href}
								rel={link.external ? "noopener noreferrer" : undefined}
								target={link.external ? "_blank" : undefined}
								variant="light">
								Open
							</Button>
						</CardBody>
					</Card>
				))}
			</div>
		</div>
	);
}
