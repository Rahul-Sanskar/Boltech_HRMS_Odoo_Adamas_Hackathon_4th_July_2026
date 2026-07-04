const DEFAULT_USERS = [
  {
    id: "EMP101",
    email: "employee@boltech.com",
    password: "password123",
    role: "Employee",
    name: "Shirish Gupta"
  },
  {
    id: "HR202",
    email: "admin@boltech.com",
    password: "password123",
    role: "Admin",
    name: "Rahul Sanskar"
  }
];

const DEFAULT_PROFILES = {
  "EMP101": {
    id: "EMP101",
    name: "Shirish Gupta",
    email: "employee@boltech.com",
    phone: "+91 9876543210",
    address: "123, Tech Park Lane, Bangalore, India",
    designation: "Frontend Software Engineer",
    department: "Engineering",
    joiningDate: "2024-01-15",
    profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    salaryStructure: {
      basic: 45000,
      hra: 18000,
      allowance: 12000,
      deductions: 5000
    },
    documents: [
      { name: "Offer_Letter.pdf", size: "1.2 MB", uploadDate: "2024-01-10" },
      { name: "Identity_Proof.pdf", size: "850 KB", uploadDate: "2024-01-12" }
    ]
  },
  "HR202": {
    id: "HR202",
    name: "Rahul Sanskar",
    email: "admin@boltech.com",
    phone: "+91 9988776655",
    address: "456, Admin Suite Road, Kolkata, India",
    designation: "Human Resource Lead",
    department: "Human Resources",
    joiningDate: "2022-06-01",
    profilePic: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    salaryStructure: {
      basic: 65000,
      hra: 25000,
      allowance: 15000,
      deductions: 7000
    },
    documents: [
      { name: "HR_Certification.pdf", size: "2.4 MB", uploadDate: "2022-05-20" }
    ]
  }
};

const DEFAULT_ATTENDANCE = [
  { id: "att_1", employeeId: "EMP101", date: "2026-07-01", checkIn: "09:05 AM", checkOut: "06:10 PM", status: "Present" },
  { id: "att_2", employeeId: "EMP101", date: "2026-07-02", checkIn: "08:55 AM", checkOut: "06:05 PM", status: "Present" },
  { id: "att_3", employeeId: "EMP101", date: "2026-07-03", checkIn: "09:15 AM", checkOut: "01:30 PM", status: "Half-day" }
];

const DEFAULT_LEAVES = [
  {
    id: "leave_1",
    employeeId: "EMP101",
    employeeName: "Shirish Gupta",
    leaveType: "Sick",
    startDate: "2026-06-10",
    endDate: "2026-06-11",
    remarks: "Severe flu and fever, resting as advised by doctor.",
    status: "Approved",
    adminComment: "Get well soon!"
  },
  {
    id: "leave_2",
    employeeId: "EMP101",
    employeeName: "Shirish Gupta",
    leaveType: "Paid",
    startDate: "2026-07-15",
    endDate: "2026-07-18",
    remarks: "Family vacation trip.",
    status: "Pending",
    adminComment: ""
  }
];

export const initDb = () => {
  if (!localStorage.getItem("hrms_users")) {
    localStorage.setItem("hrms_users", JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem("hrms_profiles")) {
    localStorage.setItem("hrms_profiles", JSON.stringify(DEFAULT_PROFILES));
  }
  if (!localStorage.getItem("hrms_attendance")) {
    localStorage.setItem("hrms_attendance", JSON.stringify(DEFAULT_ATTENDANCE));
  }
  if (!localStorage.getItem("hrms_leaves")) {
    localStorage.setItem("hrms_leaves", JSON.stringify(DEFAULT_LEAVES));
  }
};

export const getFromDb = (key) => {
  initDb();
  return JSON.parse(localStorage.getItem(key));
};

export const saveToDb = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
