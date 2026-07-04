const API_BASE_URL = "http://localhost:8000";

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("hrms_token");
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    let errorDetail = "An error occurred";
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorDetail;
    } catch (_) {
      // Fallback if response is not JSON
    }
    
    if (response.status === 401) {
      // Clear expired or invalid tokens
      localStorage.removeItem("hrms_token");
      localStorage.removeItem("hrms_current_user");
      // Redirect to login if in browser
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    
    throw new Error(errorDetail);
  }

  // Handle empty responses (like 204 No Content)
  if (response.status === 204) {
    return null;
  }

  return await response.json();
};
