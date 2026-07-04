import { apiFetch } from "../api";

export const payrollMock = {
  getPayroll: async (employeeId) => {
    try {
      const data = await apiFetch(`/api/payroll/${employeeId}`, {
        method: "GET"
      });
      return data;
    } catch (error) {
      throw error;
    }
  },

  getAllPayrolls: async () => {
    try {
      const data = await apiFetch("/api/payroll", {
        method: "GET"
      });
      return data;
    } catch (error) {
      throw error;
    }
  },

  updateSalaryStructure: async (employeeId, salaryStructure) => {
    try {
      // In the database, salary fields are nested under the profile model.
      // We route salary edits to the profile updates endpoint.
      const data = await apiFetch(`/api/profile/${employeeId}`, {
        method: "PUT",
        body: {
          salary_basic: Number(salaryStructure.basic) || 0,
          salary_hra: Number(salaryStructure.hra) || 0,
          salary_allowance: Number(salaryStructure.allowance) || 0,
          salary_deductions: Number(salaryStructure.deductions) || 0
        }
      });
      return data.salaryStructure;
    } catch (error) {
      throw error;
    }
  }
};
