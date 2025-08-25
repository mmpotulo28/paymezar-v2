"use client";
import type { ThemeProviderProps } from "next-themes";
import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter, usePathname } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import { AccountProvider } from "@/context/AccountContext";
import { GlobalProvider } from "@/context/GlobalContext";
import { LiskOnboarding } from "@/components/onboarding/lisk-onboarding";
import { ToastProvider } from "@heroui/react";
import { AgentOptions } from "@newrelic/browser-agent/loaders/agent";
import { statsigConfig } from "@/lib/config/statsig";
import { useClientAsyncInit } from "@statsig/react-bindings/src/useClientAsyncInit";
import { StatsigProvider } from "@statsig/react-bindings";
import { clerkConfig } from "@/lib/config/clerk";

let BrowserAgent: typeof import("@newrelic/browser-agent/loaders/browser-agent").BrowserAgent;

if (typeof window !== "undefined") {
	import("@newrelic/browser-agent/loaders/browser-agent").then((mod) => {
		BrowserAgent = mod.BrowserAgent;

		// The agent loader code executes immediately on instantiation.
		const options: AgentOptions = {
			info: {
				applicationID: process.env.NEXT_PUBLIC_NEW_RELIC_APPLICATION_ID || "",
				beacon: "bam.nr-data.net",
				errorBeacon: "bam.nr-data.net",
				licenseKey: process.env.NEXT_PUBLIC_NEW_RELIC_LICENSE_KEY || "",
				sa: 1,
			},
			init: {
				ajax: {
					deny_list: ["bam.nr-data.net"],
				},
				distributed_tracing: {
					allowed_origins: [],
					cors_use_newrelic_header: false,
					cors_use_tracecontext_headers: false,
					enabled: true,
					exclude_newrelic_header: false,
				},
				privacy: {
					cookies_enabled: true,
				},
				session_replay: {
					autoStart: true,
					block_selector: "",
					collect_fonts: true,
					enabled: true,
					error_sampling_rate: 100,
					fix_stylesheets: true,
					inline_images: false,
					mask_all_inputs: true,
					mask_input_options: {},
					mask_text_selector: "*",
					preload: true,
					sampling_rate: 10,
				},
			},
			loader_config: {
				accountID: process.env.NEXT_PUBLIC_NEW_RELIC_ACCOUNT_ID,
				agentID: process.env.NEXT_PUBLIC_NEW_RELIC_BROWSER_AGENT_ID,
				applicationID: process.env.NEXT_PUBLIC_NEW_RELIC_APPLICATION_ID,
				licenseKey: process.env.NEXT_PUBLIC_NEW_RELIC_LICENSE_KEY,
				trustKey: process.env.NEXT_PUBLIC_NEW_RELIC_TRUST_KEY,
			},
		};
		new BrowserAgent(options);
	});
}

export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
	interface RouterConfig {
		routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
	}
}

function OnboardingCheck({ children }: { children: React.ReactNode }) {
	const { user, isLoaded } = useUser();
	const pathname = usePathname();

	// Don't show onboarding on auth pages
	const isAuthPage = pathname?.startsWith("/auth");

	// Check if user needs Lisk onboarding
	const needsLiskOnboarding =
		isLoaded &&
		user &&
		!isAuthPage &&
		!user.unsafeMetadata?.liskAccountCreated &&
		!user.unsafeMetadata?.liskOnboardingSkipped;

	// Debug logging
	if (isLoaded && user) {
		console.log("Onboarding check:", {
			userId: user.id,
			isAuthPage,
			liskAccountCreated: user.unsafeMetadata?.liskAccountCreated,
			liskOnboardingSkipped: user.unsafeMetadata?.liskOnboardingSkipped,
			needsLiskOnboarding,
		});
	}

	if (needsLiskOnboarding) {
		return (
			<>
				{children}
				<LiskOnboarding />
			</>
		);
	}

	return <>{children}</>;
}

export function Providers({ children, themeProps }: ProvidersProps) {
	const router = useRouter();

	const { client } = useClientAsyncInit(
		statsigConfig.clientKey,
		statsigConfig.user,
		statsigConfig.plugins,
	);

	return (
		<ClerkProvider
			afterSignOutUrl={"/"}
			appearance={clerkConfig.appearance}
			signInFallbackRedirectUrl={"/account"}
			signInUrl="/auth/sign-in"
			signUpUrl="/auth/sign-up">
			<StatsigProvider client={client} loadingComponent={<div>Loading...</div>}>
				<HeroUIProvider navigate={router.push}>
					<NextThemesProvider {...themeProps}>
						<ToastProvider
							toastProps={{ shouldShowTimeoutProgress: true, closeIcon: true }}
						/>
						<GlobalProvider>
							<AccountProvider>
								<OnboardingCheck>{children}</OnboardingCheck>
							</AccountProvider>
						</GlobalProvider>
					</NextThemesProvider>
				</HeroUIProvider>
			</StatsigProvider>
		</ClerkProvider>
	);
}
