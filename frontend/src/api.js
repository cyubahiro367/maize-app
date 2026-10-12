const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const TIMEOUT_MS = 30000;

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function predictImage(file, lang) {
  const formData = new FormData();
  formData.append("file", file);

  let response;
  try {
    response = await fetchWithTimeout(`${API_URL}/predict?lang=${lang}`, {
      method: "POST",
      body: formData,
    });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("The request took too long to respond.");
    }
    throw new Error("Could not reach the diagnosis server.");
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function flagImage(payload) {
  const response = await fetchWithTimeout(`${API_URL}/flag`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Could not submit the flag right now.");
  }
  return response.json();
}
