import { apiFetch } from "../api";

export const leaveMock = {
  getLeavesByEmployee: async (employeeId) => {
    try {
      const data = await apiFetch(`/api/leaves/${employeeId}`, {
        method: "GET"
      });
      return data;
    } catch (error) {
      throw error;
    }
  },

  getAllLeaves: async () => {
    try {
      const data = await apiFetch("/api/leaves", {
        method: "GET"
      });
      return data;
    } catch (error) {
      throw error;
    }
  },

  applyLeave: async ({ employeeId, leaveType, startDate, endDate, remarks }) => {
    try {
      const data = await apiFetch("/api/leaves/apply", {
        method: "POST",
        body: {
          leave_type: leaveType,
          start_date: startDate,
          end_date: endDate,
          remarks: remarks
        }
      });
      return data;
    } catch (error) {
      throw error;
    }
  },

  updateLeaveStatus: async (leaveId, status, adminComment = "") => {
    try {
      const data = await apiFetch(`/api/leaves/${leaveId}/status`, {
        method: "PUT",
        body: {
          status: status,
          admin_comment: adminComment
        }
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
};
