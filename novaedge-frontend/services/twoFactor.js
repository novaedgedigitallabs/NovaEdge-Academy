import { apiGet, apiPost } from "@/lib/api";

export async function enroll2FA() {
    return apiPost("/api/v1/auth/2fa/enroll");
}

export async function verify2FA(code) {
    return apiPost("/api/v1/auth/2fa/verify", { code });
}

export async function login2FA(tempToken, code, isBackupCode = false) {
    return apiPost("/api/v1/auth/2fa/login", { tempToken, code, isBackupCode });
}

export async function disable2FA(password, code) {
    return apiPost("/api/v1/auth/2fa/disable", { password, code });
}

export async function get2FAStatus() {
    return apiGet("/api/v1/auth/2fa/status");
}
