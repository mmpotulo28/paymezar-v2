"use client";
import { Card, CardBody } from "@heroui/react";

export function HowItWorksSection() {
  return (
    <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
      <Card className="bg-secondary-100">
        <CardBody className="flex flex-col items-center text-center gap-2">
          <span className="text-xl font-bold">1. Create Your Account</span>
          <span className="text-default-600 text-sm">
            Sign up in seconds and get your unique PayMe-Zar payment ID.
          </span>
        </CardBody>
      </Card>
      <Card className="bg-success-100">
        <CardBody className="flex flex-col items-center text-center gap-2">
          <span className="text-xl font-bold">2. Send or Receive ZAR</span>
          <span className="text-default-600 text-sm">
            Pay anyone or get paid instantly using your payment ID or QR code.
          </span>
        </CardBody>
      </Card>
      <Card className="bg-warning-100">
        <CardBody className="flex flex-col items-center text-center gap-2">
          <span className="text-xl font-bold">3. Withdraw or Spend</span>
          <span className="text-default-600 text-sm">
            Withdraw to your bank or spend ZAR stablecoins anywhere, anytime.
          </span>
        </CardBody>
      </Card>
    </section>
  );
}
