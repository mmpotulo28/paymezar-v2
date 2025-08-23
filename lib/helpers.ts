import { ChipProps } from "@heroui/react";

export const statusColorMap: Record<string, ChipProps["color"]> = {
	Completed: "success",
	Pending: "warning",
	Failed: "danger",
};

/**
 * Checks if user needs Lisk onboarding
 */
export function needsLiskOnboarding(user: any): boolean {
	if (!user) return false;

	return !user.unsafeMetadata?.liskAccountCreated && !user.unsafeMetadata?.liskOnboardingSkipped;
}
