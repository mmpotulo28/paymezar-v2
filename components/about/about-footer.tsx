"use client";
import { HeartFilledIcon } from "@/components/icons";
import { Link } from "@heroui/link";

export function AboutFooter() {
	return (
		<div className="flex flex-col items-center gap-2 mt-8">
			<span className="text-default-500 text-sm">
				<HeartFilledIcon size={16} className="text-danger inline-block mr-1" />
				Built with love in South Africa by{" "}
				<Link href="https://manelisi.mpotulo.com" color="primary" isExternal>
					Manelisi Mpotulo
				</Link>
			</span>
			<span className="text-xs text-default-400">
				Questions?{" "}
				<Link href="/support/contact" color="primary">
					Contact us
				</Link>
			</span>
		</div>
	);
}
