"use client";
import { Card, CardBody, Chip } from "@heroui/react";
import { Avatar } from "@heroui/avatar";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { useUser } from "@clerk/nextjs";

import UnAuthorizedContent from "./UnAuthorizedContent";

export interface UserProfileCardProps {
  className?: string;
}

export function UserProfileCard({ className = "" }: UserProfileCardProps) {
  const { user } = useUser();

  if (!user) return <UnAuthorizedContent />;

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.primaryEmailAddress?.emailAddress;

  const hasLiskAccount = user.unsafeMetadata?.liskAccountCreated;
  const paymentId = user.unsafeMetadata?.paymentId as string;
  const paymentEnabled = user.unsafeMetadata?.paymentEnabled as boolean;

  return (
    <Card
      className={`w-full max-w-xl shadow-lg border border-default-200  ${className}`}
    >
      <CardBody className="flex flex-col sm:flex-row items-center gap-6 p-6">
        <div className="flex flex-col items-center sm:items-start gap-2">
          <Avatar
            className="ring-2 ring-primary-400 bg-background"
            size="lg"
            src={user.imageUrl || undefined}
          />
          <span className="text-xs text-default-400 font-medium">
            {user?.organizationMemberships[0]?.role || "User"}
          </span>
        </div>
        <div className="flex-1 min-w-0 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-default-500 font-medium">Name</span>
              <span className="font-semibold text-base truncate">
                {fullName}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-default-500 font-medium">
                Email
              </span>
              <span className="text-sm text-default-700 truncate">
                {user.primaryEmailAddress?.emailAddress || (
                  <span className="italic text-default-400">Not provided</span>
                )}
              </span>
            </div>
            <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
              <span className="text-xs text-default-500 font-medium">
                Payment Id
              </span>
              {hasLiskAccount ? (
                <Snippet
                  hideSymbol
                  className="text-xs truncate max-w-full"
                  variant="bordered"
                >
                  <span>
                    <Code color="primary">{paymentId || "-"}</Code>
                  </span>
                </Snippet>
              ) : (
                <div className="text-xs text-warning italic">
                  Blockchain account not set up yet
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-default-500 font-medium">
                Payment Status
              </span>
              <Chip
                color={
                  hasLiskAccount
                    ? paymentEnabled
                      ? "success"
                      : "warning"
                    : "default"
                }
                variant="flat"
              >
                {hasLiskAccount
                  ? paymentEnabled
                    ? "Active"
                    : "Inactive"
                  : "Pending Setup"}
              </Chip>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-default-500 font-medium">
                User ID
              </span>
              <span className="text-xs text-default-700">{user?.id}</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
