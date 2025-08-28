import { iCoupon, iCouponCreateRequest, iCouponUpdateRequest, iCouponResponse } from "../types";
export declare function useCoupons({ apiKey }: {
    apiKey?: string;
}): {
    coupons: iCoupon[];
    loading: boolean;
    error: string | undefined;
    fetchCoupons: () => Promise<void>;
    createCoupon: (userId: string, coupon: iCouponCreateRequest) => Promise<iCouponResponse | undefined>;
    claimCoupon: (userId: string, couponId: string) => Promise<iCouponResponse | undefined>;
    updateCoupon: (userId: string, couponId: string, coupon: iCouponUpdateRequest) => Promise<iCouponResponse | undefined>;
    deleteCoupon: (userId: string, couponId: string) => Promise<void>;
};
