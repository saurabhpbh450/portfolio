const API_URL = import.meta.env.VITE_API_URL;

function url(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL.replace(/\/$/, "")}${normalized}`;
}

async function request(path, options = {}) {
  const response = await fetch(url(path), {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    let errorMessage = payload?.error || "Request failed";
    if (payload?.details && Array.isArray(payload.details)) {
      errorMessage += " (" + payload.details.map((d) => `${d.path || 'Field'}: ${d.message}`).join(", ") + ")";
    }
    throw new Error(errorMessage);
  }

  return payload;
}

export function apiGetPortfolio() {
  return request("/api/portfolio", { method: "GET" });
}

export function apiSignIn(input) {
  return request("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function apiSignUp(input) {
  return request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function apiSignOut() {
  return request("/api/auth/signout", { method: "POST" });
}

export function apiAuthMe() {
  return request("/api/auth/me", { method: "GET" });
}

export function apiGetAdminPortfolio() {
  return request("/api/admin/portfolio", { method: "GET" });
}

export function apiSaveAdminPortfolio(portfolio) {
  return request("/api/admin/portfolio", {
    method: "PUT",
    body: JSON.stringify(portfolio)
  });
}

export async function apiUploadProjectImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(url("/api/admin/upload/image"), {
    method: "POST",
    credentials: "include",
    body: formData
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error || "Upload failed");
  }

  return payload;
}

export { API_URL };
