"use client";
import { motion } from "framer-motion";

export function AboutHero() {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl text-center flex flex-col items-center gap-4"
      initial={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-2">
        About PayMe-Zar
      </h1>
      <p className="text-lg md:text-xl text-default-700 font-medium mb-2">
        Empowering South Africa with instant, secure, and borderless ZAR
        stablecoin payments.
      </p>
      <p className="text-base text-default-500 max-w-xl mx-auto mb-4">
        Our mission is to make digital payments accessible for everyone. Whether
        you’re a freelancer, business, or everyday user, PayMe-Zar is designed
        for you.
      </p>
    </motion.div>
  );
}
