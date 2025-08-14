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
import { heroui, lightLayout } from "@heroui/theme";
import { ToastProvider } from "@heroui/react";

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

	const { colors } = heroui().config.theme.extend;

	return (
		<ClerkProvider
			afterSignOutUrl={"/"}
			appearance={{
				variables: {
					colorPrimary: colors.primary[500],
					colorText: colors.background[500], // zinc-900
					colorBackground: colors.background[500], // white
					colorTextSecondary: colors.secondary[500], // zinc-500
					borderRadius: lightLayout.radius?.small,
					colorInputBackground: colors.background[500], // zinc-100
					colorInputText: colors.foreground[500], // zinc-900
					colorTextOnPrimaryBackground: colors.foreground[500], // white
					colorNeutral: colors.default[500], // zinc-400
				},

				layout: {
					termsPageUrl: "/support/terms",
					privacyPageUrl: "/support/privacy",
					helpPageUrl: "/support/help-centre",
					logoImageUrl: "/images/amsa-logo.png",
					logoPlacement: "none",
					shimmer: true,
				},
				captcha: {
					language: "en",
					theme: "dark",
					size: "normal",
				},
			}}
			signInFallbackRedirectUrl={"/account"}
			signInUrl="/auth/sign-in"
			signUpUrl="/auth/sign-up">
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
		</ClerkProvider>
	);
}
