// lib/api.js
export const apiBase = process.env.NEXT_PUBLIC_API_URL || "";

async function parseJson(res) {
  const text = await res.text().catch(() => "");
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

export async function apiGet(path) {
  const res = await fetch(`${apiBase}${path}`, { credentials: "include" });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.message || `GET ${path} failed`);
  return data;
}

export async function apiPost(path, body) {
  const res = await fetch(`${apiBase}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.message || `POST ${path} failed`);
  return data;
}

export async function apiPut(path, body) {
  const res = await fetch(`${apiBase}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.message || `PUT ${path} failed`);
  return data;
}

export async function apiDelete(path) {
  const res = await fetch(`${apiBase}${path}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.message || `DELETE ${path} failed`);
  return data;
}
