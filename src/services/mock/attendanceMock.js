import { getFromDb, saveToDb } from "./db";

export const attendanceMock = {
  getAttendanceByEmployee: async (employeeId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const records = getFromDb("hrms_attendance");
        resolve(records.filter(r => r.employeeId === employeeId).reverse());
      }, 300);
    });
  },

  getAllAttendance: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const records = getFromDb("hrms_attendance");
        const profiles = getFromDb("hrms_profiles");
        const fullRecords = records.map(r => ({
          ...r,
          employeeName: profiles[r.employeeId]?.name || "Unknown"
        })).reverse();
        resolve(fullRecords);
      }, 400);
    });
  },

  getTodayStatus: async (employeeId) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const records = getFromDb("hrms_attendance");
    const todayRecord = records.find(r => r.employeeId === employeeId && r.date === todayStr);
    return todayRecord || null;
  },

  checkIn: async (employeeId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const records = getFromDb("hrms_attendance");
        const todayStr = new Date().toISOString().split('T')[0];
        
        // Formatter for time e.g. "09:30 AM"
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const newRecord = {
          id: `att_${Date.now()}`,
          employeeId,
          date: todayStr,
          checkIn: timeStr,
          checkOut: "",
          status: "Present"
        };
        
        records.push(newRecord);
        saveToDb("hrms_attendance", records);
        resolve(newRecord);
      }, 400);
    });
  },

  checkOut: async (employeeId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const records = getFromDb("hrms_attendance");
        const todayStr = new Date().toISOString().split('T')[0];
        const recordIndex = records.findIndex(r => r.employeeId === employeeId && r.date === todayStr);
        
        if (recordIndex === -1) {
          reject(new Error("No check-in record found for today."));
          return;
        }

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        records[recordIndex].checkOut = timeStr;
        
        // Calculate status based on duration if needed (just leave as Present for simplicity)
        saveToDb("hrms_attendance", records);
        resolve(records[recordIndex]);
      }, 400);
    });
  }
};
