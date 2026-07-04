import { apiFetch } from "../api";

export const profileMock = {
  getProfile: async (employeeId) => {
    try {
      const data = await apiFetch(`/api/profile/${employeeId}`, {
        method: "GET"
      });
      return data;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (employeeId, updatedData) => {
    try {
      const data = await apiFetch(`/api/profile/${employeeId}`, {
        method: "PUT",
        body: updatedData
      });
      
      // Update local storage context if the current user profile was edited
      const currentUserStr = localStorage.getItem("hrms_current_user");
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser.id === employeeId) {
          currentUser.profile = data;
          currentUser.name = data.name;
          localStorage.setItem("hrms_current_user", JSON.stringify(currentUser));
        }
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  getAllProfiles: async () => {
    try {
      const data = await apiFetch("/api/profile", {
        method: "GET"
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
};
