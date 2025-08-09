"use client";
import { Button } from "@heroui/react";
import { Link } from "@heroui/link";
import { motion } from "framer-motion";

export function AboutCta() {
  return (
    <motion.div
      className="w-full max-w-2xl flex flex-col items-center gap-4 mt-8"
      initial={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-bold text-center">
        Ready to experience PayMe-Zar?
      </h2>
      <p className="text-default-600 text-center">
        Join thousands of users and businesses using PayMe-Zar for fast, secure,
        and affordable ZAR stablecoin payments.
      </p>
      <div className="flex gap-4 mt-2">
        <Button
          as={Link}
          color="primary"
          href="/pay-now"
          radius="full"
          size="lg"
          variant="solid"
        >
          Get Started
        </Button>
        <Button
          as={Link}
          color="secondary"
          href="/support/contact"
          radius="full"
          size="lg"
          variant="flat"
        >
          Contact Us
        </Button>
      </div>
    </motion.div>
  );
}
