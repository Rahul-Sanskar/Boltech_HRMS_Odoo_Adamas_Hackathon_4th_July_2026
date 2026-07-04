import { apiFetch } from "../api";

export const attendanceMock = {
  getAttendanceByEmployee: async (employeeId) => {
    try {
      const data = await apiFetch(`/api/attendance/${employeeId}`, {
        method: "GET"
      });
      return data;
    } catch (error) {
      throw error;
    }
  },

  getAllAttendance: async () => {
    try {
      const data = await apiFetch("/api/attendance", {
        method: "GET"
      });
      return data;
    } catch (error) {
      throw error;
    }
  },

  getTodayStatus: async (employeeId) => {
    try {
      const data = await apiFetch(`/api/attendance/today-status/${employeeId}`, {
        method: "GET"
      });
      return data;
    } catch (error) {
      throw error;
    }
  },

  checkIn: async (employeeId) => {
    try {
      const data = await apiFetch("/api/attendance/check-in", {
        method: "POST"
      });
      return data;
    } catch (error) {
      throw error;
    }
  },

  checkOut: async (employeeId) => {
    try {
      const data = await apiFetch("/api/attendance/check-out", {
        method: "PUT"
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
};
