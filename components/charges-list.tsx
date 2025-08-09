"use client";
import {
  Card,
  CardHeader,
  CardBody,
  Chip,
  Button,
  Spinner,
  Snippet,
} from "@heroui/react";
import { RefreshCcw } from "lucide-react";

import { useAccount } from "@/context/AccountContext";

export function ChargesList({ className = "" }: { className?: string }) {
  const { charges, loadingCharges, refreshCharges } = useAccount();

  return (
    <Card className={`w-full max-w-2xl ${className}`}>
      <CardHeader className="flex items-center justify-between">
        <span className="text-xl font-bold">Your Charges</span>
        <Button
          color="primary"
          isLoading={loadingCharges}
          size="sm"
          startContent={<RefreshCcw size={16} />}
          variant="flat"
          onClick={refreshCharges}
        >
          Refresh
        </Button>
      </CardHeader>

      <CardBody>
        {loadingCharges && (
          <div className="text-default-400 text-center py-4">
            <Spinner label="Fetching charges..." size="sm" />
          </div>
        )}
        {!loadingCharges && charges.length === 0 && (
          <div className="text-default-400 text-center py-4">
            No charges found.
          </div>
        )}
        <div className="flex flex-col gap-3">
          {charges.map((charge) => (
            <div
              key={charge.id}
              className="flex lg:items-center items-start gap-2 lg:flex-row flex-col justify-between p-3 rounded-lg border border-default-200 bg-default-50"
            >
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs text-default-600">
                  <Snippet hideSymbol size="sm" variant="flat">
                    {charge.paymentId}
                  </Snippet>
                </span>
                <span className="text-xs text-default-500">
                  {charge.note || "-"}
                </span>
              </div>
              <span className="font-mono text-sm font-bold">
                {charge.amount} ZAR
              </span>
              <span className="text-xs text-default-500">
                {charge.createdAt.split("T")[0]}
              </span>
              <Chip
                color={
                  charge.status === "COMPLETED"
                    ? "success"
                    : charge.status === "PENDING"
                      ? "warning"
                      : "default"
                }
                variant="flat"
              >
                {charge.status}
              </Chip>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
