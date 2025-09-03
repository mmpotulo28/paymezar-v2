"use client";
import {
	Card,
	CardHeader,
	CardBody,
	Button,
	Chip,
	Spinner,
	Input,
	Select,
	SelectItem,
	Alert,
	Divider,
} from "@heroui/react";
import { useAccount } from "@/context/AccountContext";
import CouponCard from "./CouponCard";
import { useEffect, useState, useMemo, useCallback } from "react";
import { RefreshCcw, Filter, SortAsc, Search } from "lucide-react";
import Link from "next/link";

interface CouponsListProps {
	limit?: number;
	showAll?: boolean;
}

const SORT_OPTIONS = [
	{ label: "Expiry (Soonest)", value: "expiryAsc" },
	{ label: "Expiry (Latest)", value: "expiryDesc" },
	{ label: "Title (A-Z)", value: "titleAsc" },
	{ label: "Title (Z-A)", value: "titleDesc" },
	{ label: "Available (Most)", value: "availableDesc" },
	{ label: "Available (Least)", value: "availableAsc" },
];

const FILTER_OPTIONS = [
	{ label: "All", value: "all" },
	{ label: "Available Only", value: "available" },
	{ label: "Expired Only", value: "expired" },
];

export function CouponsList({ limit, showAll }: CouponsListProps) {
	const {
		coupons,
		couponsLoading,
		couponsError,
		claimCouponMessage,
		claimCouponError,
		deleteCouponMessage,
		deleteCouponError,
		fetchCoupons,
	} = useAccount();

	const [search, setSearch] = useState("");
	const [sort, setSort] = useState("expiryAsc");
	const [filter, setFilter] = useState("available");

	// fetch on mount
	useEffect(() => {
		fetchCoupons();
	}, [fetchCoupons]);

	const handleRefresh = useCallback(() => {
		fetchCoupons(true);
	}, [fetchCoupons]);

	const filteredCoupons = useMemo(() => {
		const searchLower = search.toLowerCase();
		return coupons
			.filter((coupon) => {
				const matchesSearch =
					searchLower === "" ||
					coupon.title?.toLowerCase().includes(searchLower) ||
					coupon.code?.toLowerCase().includes(searchLower) ||
					coupon.ref?.toLowerCase().includes(searchLower) ||
					coupon.description?.toLowerCase().includes(searchLower);

				let matchesFilter = true;
				if (filter === "available") {
					matchesFilter =
						coupon.availableCoupons > 0 && new Date(coupon.validUntil) > new Date();
				} else if (filter === "expired") {
					matchesFilter = new Date(coupon.validUntil) < new Date();
				}
				return matchesSearch && matchesFilter;
			})
			.sort((a, b) => {
				if (sort === "expiryAsc") {
					return new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime();
				}
				if (sort === "expiryDesc") {
					return new Date(b.validUntil).getTime() - new Date(a.validUntil).getTime();
				}
				if (sort === "titleAsc") {
					return a.title.localeCompare(b.title);
				}
				if (sort === "titleDesc") {
					return b.title.localeCompare(a.title);
				}
				if (sort === "availableDesc") {
					return b.availableCoupons - a.availableCoupons;
				}
				if (sort === "availableAsc") {
					return a.availableCoupons - b.availableCoupons;
				}
				return 0;
			});
	}, [coupons, search, sort, filter]);

	const displayedCoupons = showAll ? filteredCoupons : filteredCoupons.slice(0, limit ?? 4);

	return (
		<Card className="w-full max-w-7xl">
			<CardHeader className="flex items-center justify-between">
				<span className="text-xl font-bold">Your Coupons</span>
				<div className="flex gap-2">
					<Button
						color="primary"
						isLoading={couponsLoading}
						size="sm"
						variant="flat"
						startContent={<RefreshCcw size={16} />}
						onPress={handleRefresh}
						aria-label="Refresh coupons">
						Refresh
					</Button>
					{/* View All button, only show if not already showing all */}
					{!showAll && (
						<Button
							href="/account/coupons"
							color="secondary"
							variant="flat"
							size="sm"
							as={Link}
							aria-label="View all coupons">
							View All
						</Button>
					)}
				</div>
			</CardHeader>
			<CardBody>
				{/* Search, Sort, Filter Controls */}
				<div className="flex flex-col md:flex-row gap-2 mb-4">
					<Input
						placeholder="Search coupons..."
						startContent={<Search size={16} />}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="max-w-xs"
						size="lg"
						radius="sm"
						variant="bordered"
						color="secondary"
						aria-label="Search coupons"
					/>
					<Select
						label="Sort"
						size="sm"
						className="max-w-xs"
						selectedKeys={[sort]}
						onSelectionChange={(keys) => setSort(Array.from(keys)[0] as string)}
						startContent={<SortAsc size={16} />}
						aria-label="Sort coupons">
						{SORT_OPTIONS.map((opt) => (
							<SelectItem key={opt.value}>{opt.label}</SelectItem>
						))}
					</Select>
					<Select
						label="Filter"
						size="sm"
						className="max-w-xs"
						selectedKeys={[filter]}
						onSelectionChange={(keys) => setFilter(Array.from(keys)[0] as string)}
						startContent={<Filter size={16} />}
						aria-label="Filter coupons">
						{FILTER_OPTIONS.map((opt) => (
							<SelectItem key={opt.value}>{opt.label}</SelectItem>
						))}
					</Select>
				</div>
				<Alert
					title="Heads up!"
					description="Claiming coupons functionality is currently experiencing some issues, issues! if you have any concerns please use the chat bot on the right."
					variant="bordered"
					color="warning"
				/>

				<Divider className="my-4" />
				{couponsLoading && <Spinner label="Loading coupons..." />}
				{couponsError && (
					<Alert color="danger" variant="bordered" title="Error loading coupons">
						{couponsError}
					</Alert>
				)}
				{claimCouponError && (
					<Alert color="danger" variant="bordered" title="Error claiming coupon">
						{claimCouponError}
					</Alert>
				)}
				{deleteCouponError && (
					<Alert color="danger" variant="bordered" title="Error deleting coupon">
						{deleteCouponError}
					</Alert>
				)}
				{displayedCoupons.length === 0 && !couponsLoading && (
					<div className="text-default-400 text-center py-4">No coupons found.</div>
				)}
				<div className="grid lg:grid-cols-[repeat(auto-fit,_minmax(250,_1fr))] sm:grid-cols-1 gap-4">
					{displayedCoupons.map((coupon) => (
						<CouponCard key={coupon.id} coupon={coupon} />
					))}
					{claimCouponMessage && (
						<Chip color="success" variant="flat">
							{claimCouponMessage}
						</Chip>
					)}
					{deleteCouponMessage && (
						<Chip color="success" variant="flat">
							{deleteCouponMessage}
						</Chip>
					)}
				</div>
				{/* Show "View All" button if not showing all and there are more coupons */}
				{!showAll && filteredCoupons.length > (limit ?? 4) && (
					<div className="flex justify-center mt-4">
						<Button
							color="secondary"
							variant="flat"
							size="sm"
							as={Link}
							href="/account/coupons"
							aria-label="View all coupons">
							View All Coupons
						</Button>
					</div>
				)}
			</CardBody>
		</Card>
	);
}
