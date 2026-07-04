import { getFromDb, saveToDb } from "./db";

export const leaveMock = {
  getLeavesByEmployee: async (employeeId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const leaves = getFromDb("hrms_leaves");
        resolve(leaves.filter(l => l.employeeId === employeeId).reverse());
      }, 300);
    });
  },

  getAllLeaves: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const leaves = getFromDb("hrms_leaves");
        resolve(leaves.reverse());
      }, 400);
    });
  },

  applyLeave: async ({ employeeId, leaveType, startDate, endDate, remarks }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const leaves = getFromDb("hrms_leaves");
        const profiles = getFromDb("hrms_profiles");
        const name = profiles[employeeId]?.name || "Employee";

        const newLeave = {
          id: `leave_${Date.now()}`,
          employeeId,
          employeeName: name,
          leaveType,
          startDate,
          endDate,
          remarks,
          status: "Pending",
          adminComment: ""
        };

        leaves.push(newLeave);
        saveToDb("hrms_leaves", leaves);
        resolve(newLeave);
      }, 400);
    });
  },

  updateLeaveStatus: async (leaveId, status, adminComment = "") => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const leaves = getFromDb("hrms_leaves");
        const leaveIndex = leaves.findIndex(l => l.id === leaveId);

        if (leaveIndex === -1) {
          reject(new Error("Leave request not found."));
          return;
        }

        leaves[leaveIndex].status = status;
        leaves[leaveIndex].adminComment = adminComment;
        
        saveToDb("hrms_leaves", leaves);
        resolve(leaves[leaveIndex]);
      }, 400);
    });
  }
};
