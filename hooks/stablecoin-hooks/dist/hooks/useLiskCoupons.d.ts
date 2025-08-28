import { iCoupon, iCouponCreateRequest, iCouponUpdateRequest, iCouponResponse } from "../types";
export interface iUseLiskCoupons {
    coupons: iCoupon[];
    couponsLoading: boolean;
    couponsError: string | undefined;
    fetchCoupons: () => Promise<void>;
    createCoupon: (userId: string, coupon: iCouponCreateRequest) => Promise<iCouponResponse | undefined>;
    createCouponLoading: boolean;
    createCouponError: string | undefined;
    createCouponMessage: string | undefined;
    claimCoupon: (userId: string, couponId: string) => Promise<iCouponResponse | undefined>;
    claimCouponLoading: boolean;
    claimCouponError: string | undefined;
    claimCouponMessage: string | undefined;
    updateCoupon: (userId: string, couponId: string, coupon: iCouponUpdateRequest) => Promise<iCouponResponse | undefined>;
    updateCouponLoading: boolean;
    updateCouponError: string | undefined;
    updateCouponMessage: string | undefined;
    deleteCoupon: (userId: string, couponId: string) => Promise<void>;
    deleteCouponLoading: boolean;
    deleteCouponError: string | undefined;
    deleteCouponMessage: string | undefined;
}
export declare function useLiskCoupons({ apiKey }: {
    apiKey?: string;
}): iUseLiskCoupons;
