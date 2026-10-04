const API = (location.port === "5500" || location.port === "5501" || location.port === "3000" || location.protocol === "file:")
  ? "http://localhost:5000/api"
  : "/api";

function getToken() {
  return localStorage.getItem("jwt");
}

function getUser() {
  try { return JSON.parse(localStorage.getItem("user")); }
  catch { return null; }
}

async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (getToken()) headers.Authorization = "Bearer " + getToken();

  const response = await fetch(API + path, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `API request failed (${response.status})`);
  }

  return data;
}

function saveAuth(data) {
  localStorage.setItem("jwt", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
}

function logout() {
  localStorage.clear();
  location.href = "/login.html";
}

function requireLogin() {
  if (!getToken()) {
    location.href = "/login.html";
    return false;
  }
  return true;
}
