"use client";
import { ShieldCheck, Zap, Globe, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@heroui/react";

const features = [
  {
    icon: <ShieldCheck className="text-success" size={36} />,
    title: "Secure & Trusted",
    desc: "Bank-grade security and blockchain technology keep your funds and data safe.",
  },
  {
    icon: <Zap className="text-warning" size={36} />,
    title: "Instant & Borderless",
    desc: "Send and receive ZAR stablecoins instantly, anywhere, anytime.",
  },
  {
    icon: <Globe className="text-primary" size={36} />,
    title: "Open for Everyone",
    desc: "No technical skills required. Designed for freelancers, businesses, and individuals.",
  },
  {
    icon: <MessageCircle className="text-secondary" size={36} />,
    title: "Community Driven",
    desc: "We listen to our users and build features you want. Join our community.",
  },
];

export function AboutFeatures() {
  return (
    <motion.div
      className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8"
      initial={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          transition={{ type: "spring", stiffness: 300 }}
          whileHover={{ scale: 1.04 }}
        >
          <Card className="flex flex-col items-center gap-3 rounded-xl shadow border border-default-100 p-6 hover:shadow-lg transition">
            {f.icon}
            <h2 className="text-lg font-semibold">{f.title}</h2>
            <p className="text-default-600 text-center">{f.desc}</p>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
