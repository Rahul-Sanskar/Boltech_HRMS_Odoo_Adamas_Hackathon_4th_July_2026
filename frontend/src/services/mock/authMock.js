import { getFromDb, saveToDb } from "./db";

export const authMock = {
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getFromDb("hrms_users");
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        
        if (user) {
          localStorage.setItem("hrms_current_user", JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error("Invalid email or password. Please try again."));
        }
      }, 500);
    });
  },

  register: async ({ id, email, password, role, name }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getFromDb("hrms_users");
        
        if (users.some(u => u.id === id)) {
          reject(new Error(`Employee ID ${id} already exists.`));
          return;
        }
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          reject(new Error(`Email ${email} is already registered.`));
          return;
        }

        const newUser = { id, email, password, role, name };
        users.push(newUser);
        saveToDb("hrms_users", users);

        // Create an empty profile for the new user
        const profiles = getFromDb("hrms_profiles");
        profiles[id] = {
          id,
          name,
          email,
          phone: "",
          address: "",
          designation: role === "Admin" ? "HR Manager" : "Associate",
          department: role === "Admin" ? "HR" : "General",
          joiningDate: new Date().toISOString().split('T')[0],
          profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
          salaryStructure: {
            basic: role === "Admin" ? 60000 : 30000,
            hra: role === "Admin" ? 20000 : 10000,
            allowance: role === "Admin" ? 10000 : 5000,
            deductions: role === "Admin" ? 5000 : 2000
          },
          documents: []
        };
        saveToDb("hrms_profiles", profiles);

        resolve(newUser);
      }, 500);
    });
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("hrms_current_user");
    return userStr ? JSON.parse(userStr) : null;
  },

  logout: () => {
    localStorage.removeItem("hrms_current_user");
  }
};
