"use client";
import { Link } from "@heroui/link";

import { HeartFilledIcon } from "@/components/icons";

export function AboutFooter() {
  return (
    <div className="flex flex-col items-center gap-2 mt-8">
      <span className="text-default-500 text-sm">
        <HeartFilledIcon className="text-danger inline-block mr-1" size={16} />
        Built with love in South Africa by{" "}
        <Link isExternal color="primary" href="https://manelisi.mpotulo.com">
          Manelisi Mpotulo
        </Link>
      </span>
      <span className="text-xs text-default-400">
        Questions?{" "}
        <Link color="primary" href="/support/contact">
          Contact us
        </Link>
      </span>
    </div>
  );
}
