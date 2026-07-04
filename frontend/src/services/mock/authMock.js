import { apiFetch } from "../api";

export const authMock = {
  login: async (email, password) => {
    try {
      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email, password }
      });
      
      const { access_token } = response;
      localStorage.setItem("hrms_token", access_token);
      
      // Get current user details using token
      const user = await apiFetch("/api/auth/me", {
        method: "GET"
      });
      
      localStorage.setItem("hrms_current_user", JSON.stringify(user));
      return user;
    } catch (error) {
      throw error;
    }
  },

  register: async ({ id, email, password, role, name }) => {
    try {
      const user = await apiFetch("/api/auth/register", {
        method: "POST",
        body: { id, name, email, password, role }
      });
      return user;
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("hrms_current_user");
    return userStr ? JSON.parse(userStr) : null;
  },

  logout: () => {
    localStorage.removeItem("hrms_token");
    localStorage.removeItem("hrms_current_user");
  }
};
