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
import { InstallPrompt } from "@/components/pwa/InstallPrompt";

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	icons: {
		icon: "/favicon.ico",
		apple: "/apple-icon.png",
		other: [
			{
				url: "/web-app-manifest-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				url: "/web-app-manifest-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
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
				<meta name="apple-mobile-web-app-title" content="PayMeZar" />
				<link rel="icon" type="image/svg+xml" href="/icon0.svg" />
				<link rel="icon" type="image/png" sizes="96x96" href="/icon1.png" />
				<link
					rel="icon"
					type="image/png"
					sizes="192x192"
					href="/web-app-manifest-192x192.png"
				/>
				<link rel="icon" type="image/x-icon" href="/favicon.ico" />
				<link rel="apple-touch-icon" href="/apple-icon.png" />
				<link rel="manifest" href="/manifest.json" />
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
						<InstallPrompt />
					</div>
				</Providers>

				<Analytics />

				{/* scripts */}
				<Script async src="//code.tidio.co/lezepkbgvcgjcmyblgikrziylqlazjid.js" />
			</body>
		</html>
	);
}
