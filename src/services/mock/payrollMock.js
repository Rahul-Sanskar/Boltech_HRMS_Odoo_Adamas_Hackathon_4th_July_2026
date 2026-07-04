import { getFromDb, saveToDb } from "./db";

export const payrollMock = {
  getPayroll: async (employeeId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const profiles = getFromDb("hrms_profiles");
        const profile = profiles[employeeId];
        
        if (!profile) {
          reject(new Error("Profile not found."));
          return;
        }

        const struct = profile.salaryStructure;
        const gross = struct.basic + struct.hra + struct.allowance;
        const net = gross - struct.deductions;

        resolve({
          employeeId,
          employeeName: profile.name,
          designation: profile.designation,
          department: profile.department,
          salaryStructure: struct,
          calculations: {
            gross,
            deductions: struct.deductions,
            net
          }
        });
      }, 300);
    });
  },

  getAllPayrolls: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const profiles = getFromDb("hrms_profiles");
        const payrollList = Object.keys(profiles).map(id => {
          const profile = profiles[id];
          const struct = profile.salaryStructure;
          const gross = struct.basic + struct.hra + struct.allowance;
          const net = gross - struct.deductions;
          return {
            employeeId: id,
            employeeName: profile.name,
            designation: profile.designation,
            department: profile.department,
            salaryStructure: struct,
            calculations: {
              gross,
              deductions: struct.deductions,
              net
            }
          };
        });
        resolve(payrollList);
      }, 400);
    });
  },

  updateSalaryStructure: async (employeeId, salaryStructure) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const profiles = getFromDb("hrms_profiles");
        
        if (!profiles[employeeId]) {
          reject(new Error("Employee profile not found."));
          return;
        }

        profiles[employeeId].salaryStructure = {
          basic: Number(salaryStructure.basic) || 0,
          hra: Number(salaryStructure.hra) || 0,
          allowance: Number(salaryStructure.allowance) || 0,
          deductions: Number(salaryStructure.deductions) || 0
        };

        saveToDb("hrms_profiles", profiles);
        resolve(profiles[employeeId].salaryStructure);
      }, 400);
    });
  }
};
