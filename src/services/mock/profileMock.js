import { getFromDb, saveToDb } from "./db";

export const profileMock = {
  getProfile: async (employeeId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const profiles = getFromDb("hrms_profiles");
        if (profiles[employeeId]) {
          resolve(profiles[employeeId]);
        } else {
          reject(new Error("Profile not found."));
        }
      }, 300);
    });
  },

  updateProfile: async (employeeId, updatedData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const profiles = getFromDb("hrms_profiles");
        if (!profiles[employeeId]) {
          reject(new Error("Profile not found."));
          return;
        }

        profiles[employeeId] = {
          ...profiles[employeeId],
          ...updatedData
        };

        saveToDb("hrms_profiles", profiles);
        resolve(profiles[employeeId]);
      }, 400);
    });
  },

  getAllProfiles: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const profiles = getFromDb("hrms_profiles");
        resolve(Object.values(profiles));
      }, 300);
    });
  }
};
