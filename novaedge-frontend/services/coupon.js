import { apiGet, apiPost, apiDelete } from "@/lib/api";

export async function validateCoupon(code, orderAmount) {
    return apiPost(`/api/v1/coupons/validate`, { code, orderAmount });
}

export async function getCoupons() {
    return apiGet(`/api/v1/admin/coupons`);
}

export async function createCoupon(data) {
    return apiPost(`/api/v1/admin/coupons`, data);
}

export async function deleteCoupon(id) {
    return apiDelete(`/api/v1/admin/coupons/${id}`);
}
