import { apiGet, apiPost } from "@/lib/api";

export async function getMyReferrals() {
    return apiGet(`/api/v1/referrals/me`);
}

export async function generateReferralCode() {
    return apiPost(`/api/v1/referral/generate`, {});
}
