export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "PayMe-Zar | ZAR Stable Coin Crypto Payments",
	description:
		"PayMe-Zar is a ZAR stable coin crypto payment gateway that allows you to accept payments in South African Rand (ZAR) using cryptocurrencies.",
	navItems: [
		{
			label: "Home",
			href: "/",
		},
		{
			label: "Pay now",
			href: "/pay-now",
		},
		{
			label: "Account",
			href: "/account",
		},
		{
			label: "Pricing",
			href: "/pricing",
		},
		{
			label: "Support",
			href: "/support",
		},
		{
			label: "Settings",
			href: "/settings",
		},
	],
	navMenuItems: [
		{
			label: "Home",
			href: "/",
		},
		{
			label: "Pay now",
			href: "/pay-now",
		},
		{
			label: "Account",
			href: "/account",
		},
		{
			label: "Pricing",
			href: "/pricing",
		},
		{
			label: "Support",
			href: "/support",
		},
		{
			label: "About",
			href: "/about",
		},
		{
			label: "Settings",
			href: "/settings",
		},
		{
			label: "Logout",
			href: "/logout",
		},
	],
	links: {
		github: "https://github.com/mmpotulo28/paymezar-v2",
		twitter: "https://twitter.com/mmpotulo",
		docs: "https://paymezar.mpotulo.com/docs",
		discord: "https://discord.gg/9b6yyZKmH4",
		sponsor:
			"https://patreon.com/mmpotulo?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink",
	},
	metadata: {
		title: {
			default: "PayMe-Zar | ZAR Stable Coin Crypto Payments",
		},
		description:
			"PayMe-Zar is a ZAR stable coin crypto payment gateway that allows you to accept payments in South African Rand (ZAR) using cryptocurrencies.",
		icons: {
			icon: "/favicon.ico",
			apple: "/apple-icon.png",
			other: [
				{ url: "/icon0.svg", type: "image/svg+xml" },
				{ url: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
				{ url: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" },
			],
		},
	},
};
