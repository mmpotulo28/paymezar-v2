"use client";
import { motion } from "framer-motion";
import { Avatar } from "@heroui/avatar";
import { Link } from "@heroui/link";
import { Card } from "@heroui/react";

import { GithubIcon } from "@/components/icons";

const team = [
  {
    name: "Manelisi Mpotulo",
    role: "Founder & Lead Developer",
    img: "https://avatars.githubusercontent.com/u/10184949?v=4",
    github: "https://github.com/mmpotulo28",
    desc: "Building the future of payments in Africa. Passionate about blockchain, fintech, and open source.",
  },
  // Add more team members here if needed
];

export function AboutTeam() {
  return (
    <motion.div
      className="w-full max-w-3xl flex flex-col items-center gap-8"
      initial={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-center mb-2">Meet the Team</h2>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        {team.map((member) => (
          <motion.div
            key={member.name}
            transition={{ type: "spring", stiffness: 300 }}
            whileHover={{ scale: 1.04 }}
          >
            <Card className="flex flex-col items-center gap-2 rounded-xl shadow border border-default-100 p-6">
              <Avatar
                className="ring-2 ring-primary-400 mb-2"
                size="lg"
                src={member.img}
              />
              <span className="font-semibold text-default-800">
                {member.name}
              </span>
              <span className="text-xs text-default-500 mb-1">
                {member.role}
              </span>
              <p className="text-default-600 text-center text-sm">
                {member.desc}
              </p>
              <Link
                isExternal
                className="flex items-center gap-1 mt-2"
                color="primary"
                href={member.github}
              >
                <GithubIcon size={18} /> GitHub
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
