"use client";
import { Navbar as HeroUINavbar, NavbarContent, NavbarBrand, NavbarItem } from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
	TwitterIcon,
	GithubIcon,
	DiscordIcon,
	HeartFilledIcon,
	SearchIcon,
	Logo,
} from "@/components/icons";

export const Navbar = () => {
	const { user } = useUser();
	const searchInput = (
		<Input
			aria-label="Search"
			classNames={{
				inputWrapper: "bg-default-100",
				input: "text-sm",
			}}
			endContent={
				<Kbd className="hidden lg:inline-block" keys={["command"]}>
					K
				</Kbd>
			}
			labelPlacement="outside"
			placeholder="Search..."
			startContent={
				<SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
			}
			type="search"
		/>
	);

	return (
		<HeroUINavbar maxWidth="xl" position="sticky">
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<NavbarBrand as="li" className="gap-3 max-w-fit">
					<NextLink className="flex justify-start items-center gap-1" href="/">
						<Logo />
						<p className="font-bold text-inherit">PayMe - ZAr</p>
					</NextLink>
				</NavbarBrand>
				<ul className="hidden lg:flex gap-4 justify-start ml-2">
					{siteConfig.navItems.map((item) => (
						<NavbarItem key={item.href}>
							<NextLink
								className={clsx(
									linkStyles({ color: "foreground" }),
									"data-[active=true]:text-primary data-[active=true]:font-medium",
								)}
								color="foreground"
								href={item.href}>
								{item.label}
							</NextLink>
						</NavbarItem>
					))}
				</ul>
			</NavbarContent>

			<NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
				<NavbarItem className="hidden sm:flex gap-2">
					<Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
						<TwitterIcon className="text-default-500" />
					</Link>
					<Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
						<DiscordIcon className="text-default-500" />
					</Link>
					<Link isExternal aria-label="Github" href={siteConfig.links.github}>
						<GithubIcon className="text-default-500" />
					</Link>
					<ThemeSwitch />
				</NavbarItem>
				<NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
				<NavbarItem className="hidden md:flex">
					<Button
						isExternal
						as={Link}
						className="text-sm font-normal text-default-600 bg-default-100 min-w-10 mx-4"
						href={siteConfig.links.sponsor}
						startContent={<HeartFilledIcon className="text-danger" />}
						variant="flat"
					/>
					{user ? <UserButton /> : <SignInButton />}
				</NavbarItem>
			</NavbarContent>

			<NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
				<Link isExternal aria-label="Github" href={siteConfig.links.github}>
					<GithubIcon className="text-default-500" />
				</Link>
				<Link isExternal aria-label="Sponsor" href={siteConfig.links.sponsor}>
					<HeartFilledIcon className="text-danger" />
				</Link>
				<ThemeSwitch />
				{user ? <UserButton /> : <SignInButton />}
			</NavbarContent>
		</HeroUINavbar>
	);
};
