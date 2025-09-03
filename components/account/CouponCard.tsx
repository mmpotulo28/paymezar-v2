import { useAccount } from "@/context/AccountContext";
import { useUser } from "@clerk/nextjs";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader, Chip, Divider, Snippet } from "@heroui/react";
import { iCoupon } from "@mmpotulo/stablecoin-hooks";
import { Ticket } from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "../modals/ConfirmModal";

export interface iCouponCardProps {
	coupon: iCoupon;
}

const CouponCard: React.FC<iCouponCardProps> = ({ coupon }) => {
	const { couponsLoading, claimCouponLoading, deleteCouponLoading, deleteCoupon, claimCoupon } =
		useAccount();

	const { user } = useUser();
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [deleteCouponId, setDeleteCouponId] = useState<string | null>(null);

	const handleDeleteCoupon = async () => {
		if (user && deleteCouponId) {
			await deleteCoupon(user.id, deleteCouponId);
			setIsDeleteOpen(false);
			setDeleteCouponId(null);
		}
	};

	return (
		<Card
			key={coupon.id}
			className="p-4 bg-default-100 shadow rounded-xl max-w-xs flex flex-col justify-between gap-2">
			<CardHeader className="flex items-start gap-2 flex-wrap justify-between p-0">
				<span className="font-semibold flex gap-2">
					<Ticket className="text-xl text-primary" />
					{coupon.title}
				</span>
				<Snippet className="bg-secondary-300 py-0" size="sm" hideSymbol title="Coupon Code">
					{coupon.code}
				</Snippet>
			</CardHeader>

			<CardBody className="p-0 flex flex-col justify-between">
				<div className="flex gap-2 text-xs text-default-400 flex-col">
					<div className="text-default-500 text-sm">{coupon.description}</div>
					<Snippet hideSymbol size="sm" className="overflow-auto w-full flex">
						{`Ref: ${coupon.ref}`}
					</Snippet>
					<span>Valid Until: {new Date(coupon.validUntil).toLocaleDateString()}</span>
				</div>

				<div className="flex gap-2 items-center">
					<Chip color="primary" variant="flat">
						Max: {coupon.maxCoupons}
					</Chip>
					<Chip color="success" variant="flat">
						Available: {coupon.availableCoupons}
					</Chip>
				</div>
			</CardBody>

			<CardFooter className="flex flex-col justify-start items-start	gap-2 p-0">
				<Divider className="my-2" />

				<div className="flex gap-2">
					<Button
						size="sm"
						color="primary"
						onPress={() => claimCoupon(user?.id || "", coupon.id)}
						isDisabled={
							couponsLoading || claimCouponLoading || coupon.availableCoupons < 1
						}>
						Claim
					</Button>
					<Button
						size="sm"
						color="danger"
						variant="bordered"
						onPress={() => {
							setIsDeleteOpen(true);
							setDeleteCouponId(coupon.id);
						}}
						isDisabled={couponsLoading || deleteCouponLoading}>
						Delete
					</Button>
				</div>
			</CardFooter>

			<ConfirmModal
				open={isDeleteOpen}
				onClose={() => setIsDeleteOpen(false)}
				onConfirm={handleDeleteCoupon}
				title="Delete Coupon"
				message="Are you sure you want to delete this coupon? This action cannot be undone."
				loading={deleteCouponLoading}
				confirmText="Delete"
				color="danger"
			/>
		</Card>
	);
};

export default CouponCard;
