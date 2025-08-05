"use client";
import { usePathname, useRouter } from "next/navigation";
import { Home, CreditCard, User, HelpCircle, MoreHorizontal, Settings, Info } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Listbox, ListboxItem } from "@heroui/react";

// Utility function for conditional classNames (since '@/lib/utils' is missing)
function cn(...args: (string | boolean | undefined | null)[]) {
	return args.filter(Boolean).join(" ");
}

const tabs = [
	{ label: "Home", href: "/", icon: <Home size={22} /> },
	{ label: "Pay", href: "/pay-now", icon: <CreditCard size={22} /> },
	{ label: "Account", href: "/account", icon: <User size={22} /> },
	{ label: "Support", href: "/support", icon: <HelpCircle size={22} /> },
];

const moreLinks = [
	{ label: "Settings", href: "/settings", icon: <Settings size={18} /> },
	{ label: "Pricing", href: "/pricing", icon: <CreditCard size={18} /> },
	{ label: "About", href: "/about", icon: <Info size={18} /> },
	// Add more links as needed
];

export function MobileBottomNav() {
	const pathname = usePathname();
	const router = useRouter();
	const [showMore, setShowMore] = useState(false);

	return (
		<nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-default-200 md:hidden">
			<div className="flex justify-between items-center h-16 px-2">
				{tabs.map((tab) => {
					const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
					return (
						<button
							key={tab.href}
							type="button"
							className={cn(
								"flex flex-col items-center flex-1 py-1 px-2 transition text-xs",
								isActive
									? "text-primary font-semibold"
									: "text-default-500 hover:text-primary",
							)}
							onClick={() => router.push(tab.href)}>
							{tab.icon}
							<span>{tab.label}</span>
						</button>
					);
				})}
				{/* More menu */}
				<div className="relative flex-1 flex flex-col items-center">
					<button
						type="button"
						className={cn(
							"flex flex-col items-center py-1 px-2 transition text-xs",
							showMore
								? "text-primary font-semibold"
								: "text-default-500 hover:text-primary",
						)}
						onClick={() => setShowMore((v) => !v)}>
						<MoreHorizontal size={22} />
						<span>More</span>
					</button>
					{showMore && (
						<div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-background border border-default-200 rounded-xl shadow-lg py-2 w-44 z-50">
							<Listbox
								aria-label="More"
								onAction={(key) => {
									setShowMore(false);
									const link = moreLinks.find((l) => l.href === key);
									if (link) router.push(link.href);
								}}
								selectionMode="none"
								className="w-full radius-0">
								{moreLinks.map((link) => (
									<ListboxItem
										key={link.href}
										startContent={link.icon}
										className="text-default-700">
										{link.label}
									</ListboxItem>
								))}
							</Listbox>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}
