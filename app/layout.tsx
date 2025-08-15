import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import Scripts from "./scripts";

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	icons: {
		icon: "/favicon.ico",
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "dark" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html suppressHydrationWarning lang="en">
			<head>
				<Scripts />
			</head>
			<body
				className={clsx(
					"min-h-screen text-foreground bg-background font-sans antialiased",
					fontSans.variable,
				)}>
				<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
					<div className="relative flex flex-col h-screen">
						<Navbar />
						<main className="purple-dark container mx-auto max-w-7xl pt-0 px-6 flex-grow">
							{children}
						</main>
						<footer className="w-full flex items-center justify-center py-3">
							<Link
								isExternal
								className="flex items-center gap-1 text-current"
								href="https://manelisi.mpotulo.com?utm_source=next-app-template"
								title="manelisi.mpotulo.com homepage">
								<span className="text-default-600">Developed by</span>
								<p className="text-primary">M.Mpotulo</p>
							</Link>
						</footer>
						<MobileBottomNav />
					</div>
				</Providers>

				<Analytics />

				{/* scripts */}
				<Script async src="//code.tidio.co/lezepkbgvcgjcmyblgikrziylqlazjid.js" />
			</body>
		</html>
	);
}
