import { useAccount } from "@/context/AccountContext";
import { useUser } from "@clerk/nextjs";
import { Button } from "@heroui/button";
import { Card, Chip, Divider } from "@heroui/react";
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
		<Card key={coupon.id} className="p-4 bg-default-100 shadow rounded-xl max-w-xs">
			<div className="flex items-center gap-2 mb-2">
				<Ticket className="text-xl text-primary" />
				<span className="font-semibold">{coupon.title}</span>
				<Chip color="secondary" variant="flat" className="ml-2">
					{coupon.code}
				</Chip>
			</div>
			<div className="text-default-500 text-sm mb-2">{coupon.description}</div>
			<div className="flex gap-2 text-xs text-default-400 mb-2">
				<span>Ref: {coupon.ref}</span>
				<span>Valid Until: {new Date(coupon.validUntil).toLocaleDateString()}</span>
			</div>
			<div className="flex gap-2 items-center mb-2">
				<Chip color="primary" variant="flat">
					Max: {coupon.maxCoupons}
				</Chip>
				<Chip color="success" variant="flat">
					Available: {coupon.availableCoupons}
				</Chip>
			</div>
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
