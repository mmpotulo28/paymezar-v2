"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter, usePathname } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AccountProvider } from "@/context/AccountContext";
import { GlobalProvider } from "@/context/GlobalContext";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import { LiskOnboarding } from "@/components/onboarding/lisk-onboarding";

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

	return (
		<ClerkProvider>
			<HeroUIProvider navigate={router.push}>
				<NextThemesProvider {...themeProps}>
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
