// ======================================================
// Analytics Mock Data & Accessors (semester-wise, realistic)
// Works out of the box with AnalyticsPage.jsx (Recharts)
// ======================================================

// ---------- Departments ----------
export const getDepartments = () => [
  { id: "cse",   name: "Computer Science & Engineering" },
  { id: "ece",   name: "Electronics Engineering" },
  { id: "me",    name: "Mechanical Engineering" },
  { id: "it",    name: "Information Technology" },
  { id: "ai",    name: "Artificial Intelligence" },
  { id: "iot",   name: "Centre for Internet of Things" },
  { id: "ccst",  name: "Centre for Computer Science and Technology" },
  { id: "ee",    name: "Electrical Engineering" },
  { id: "civil", name: "Civil Engineering" },
  { id: "emc",   name: "Engineering Mathematics & Computing" },
  { id: "che",   name: "Chemical Engineering" },
];

// helper to clone simple arrays/objects when returning (avoid accidental mutation)
const _clone = (x) => JSON.parse(JSON.stringify(x));

// ---------- 1) Departmental Trend (per semester) ----------
/*
  Each entry format:
  { period: "YYYY-S{1|2}", passPct: %, publications: #, enroll: #, grads: #, feedback: 3.0-5.0 }
*/

const trendMock = {
  cse: [
    { period: "2023-S1", passPct: 82, publications: 18, enroll: 240, grads: 198, feedback: 4.1 },
    { period: "2023-S2", passPct: 85, publications: 22, enroll: 250, grads: 205, feedback: 4.2 },
    { period: "2024-S1", passPct: 86, publications: 19, enroll: 255, grads: 210, feedback: 4.25 },
    { period: "2024-S2", passPct: 89, publications: 24, enroll: 260, grads: 215, feedback: 4.3 },
    { period: "2025-S1", passPct: 91, publications: 28, enroll: 265, grads: 220, feedback: 4.35 },
  ],
  ece: [
    { period: "2023-S1", passPct: 78, publications: 12, enroll: 190, grads: 160, feedback: 3.9 },
    { period: "2023-S2", passPct: 80, publications: 15, enroll: 195, grads: 165, feedback: 4.0 },
    { period: "2024-S1", passPct: 81, publications: 14, enroll: 198, grads: 168, feedback: 4.05 },
    { period: "2024-S2", passPct: 83, publications: 16, enroll: 200, grads: 172, feedback: 4.1 },
    { period: "2025-S1", passPct: 84, publications: 18, enroll: 205, grads: 176, feedback: 4.12 },
  ],
  me: [
    { period: "2023-S1", passPct: 75, publications: 8, enroll: 160, grads: 130, feedback: 3.8 },
    { period: "2023-S2", passPct: 77, publications: 9, enroll: 162, grads: 132, feedback: 3.85 },
    { period: "2024-S1", passPct: 79, publications: 10, enroll: 165, grads: 135, feedback: 3.9 },
    { period: "2024-S2", passPct: 80, publications: 12, enroll: 168, grads: 138, feedback: 3.95 },
    { period: "2025-S1", passPct: 82, publications: 13, enroll: 170, grads: 140, feedback: 4.0 },
  ],
  it: [
    { period: "2023-S1", passPct: 81, publications: 10, enroll: 200, grads: 168, feedback: 4.0 },
    { period: "2023-S2", passPct: 83, publications: 12, enroll: 205, grads: 172, feedback: 4.05 },
    { period: "2024-S1", passPct: 85, publications: 14, enroll: 210, grads: 176, feedback: 4.1 },
    { period: "2024-S2", passPct: 87, publications: 16, enroll: 215, grads: 180, feedback: 4.2 },
    { period: "2025-S1", passPct: 89, publications: 18, enroll: 220, grads: 185, feedback: 4.25 },
  ],
  ai: [
    { period: "2023-S1", passPct: 79, publications: 15, enroll: 140, grads: 110, feedback: 4.05 },
    { period: "2023-S2", passPct: 81, publications: 18, enroll: 145, grads: 114, feedback: 4.12 },
    { period: "2024-S1", passPct: 83, publications: 20, enroll: 150, grads: 118, feedback: 4.2 },
    { period: "2024-S2", passPct: 85, publications: 24, enroll: 155, grads: 122, feedback: 4.28 },
    { period: "2025-S1", passPct: 88, publications: 27, enroll: 160, grads: 126, feedback: 4.35 },
  ],
  iot: [
    { period: "2023-S1", passPct: 77, publications: 9, enroll: 120, grads: 96, feedback: 3.95 },
    { period: "2023-S2", passPct: 79, publications: 11, enroll: 122, grads: 98, feedback: 4.0 },
    { period: "2024-S1", passPct: 81, publications: 12, enroll: 125, grads: 101, feedback: 4.05 },
    { period: "2024-S2", passPct: 83, publications: 14, enroll: 128, grads: 104, feedback: 4.12 },
    { period: "2025-S1", passPct: 85, publications: 16, enroll: 130, grads: 107, feedback: 4.2 },
  ],
  ccst: [
    { period: "2023-S1", passPct: 80, publications: 11, enroll: 115, grads: 92, feedback: 4.0 },
    { period: "2023-S2", passPct: 82, publications: 13, enroll: 118, grads: 95, feedback: 4.08 },
    { period: "2024-S1", passPct: 84, publications: 15, enroll: 120, grads: 98, feedback: 4.15 },
    { period: "2024-S2", passPct: 86, publications: 17, enroll: 123, grads: 102, feedback: 4.22 },
    { period: "2025-S1", passPct: 88, publications: 19, enroll: 126, grads: 105, feedback: 4.3 },
  ],
  ee: [
    { period: "2023-S1", passPct: 76, publications: 10, enroll: 170, grads: 138, feedback: 3.9 },
    { period: "2023-S2", passPct: 78, publications: 12, enroll: 172, grads: 140, feedback: 3.95 },
    { period: "2024-S1", passPct: 80, publications: 13, enroll: 175, grads: 143, feedback: 4.02 },
    { period: "2024-S2", passPct: 81, publications: 15, enroll: 178, grads: 146, feedback: 4.08 },
    { period: "2025-S1", passPct: 83, publications: 17, enroll: 180, grads: 149, feedback: 4.15 },
  ],
  civil: [
    { period: "2023-S1", passPct: 74, publications: 6, enroll: 150, grads: 118, feedback: 3.8 },
    { period: "2023-S2", passPct: 76, publications: 7, enroll: 152, grads: 120, feedback: 3.85 },
    { period: "2024-S1", passPct: 78, publications: 9, enroll: 155, grads: 124, feedback: 3.92 },
    { period: "2024-S2", passPct: 79, publications: 10, enroll: 158, grads: 126, feedback: 3.98 },
    { period: "2025-S1", passPct: 81, publications: 12, enroll: 160, grads: 129, feedback: 4.05 },
  ],
  emc: [
    { period: "2023-S1", passPct: 83, publications: 7, enroll: 90, grads: 75, feedback: 4.2 },
    { period: "2023-S2", passPct: 84, publications: 8, enroll: 92, grads: 77, feedback: 4.25 },
    { period: "2024-S1", passPct: 86, publications: 10, enroll: 95, grads: 80, feedback: 4.3 },
    { period: "2024-S2", passPct: 88, publications: 12, enroll: 97, grads: 82, feedback: 4.35 },
    { period: "2025-S1", passPct: 90, publications: 13, enroll: 100, grads: 85, feedback: 4.4 },
  ],
  che: [
    { period: "2023-S1", passPct: 79, publications: 9, enroll: 130, grads: 104, feedback: 3.98 },
    { period: "2023-S2", passPct: 80, publications: 10, enroll: 132, grads: 106, feedback: 4.02 },
    { period: "2024-S1", passPct: 82, publications: 12, enroll: 135, grads: 109, feedback: 4.08 },
    { period: "2024-S2", passPct: 83, publications: 13, enroll: 138, grads: 112, feedback: 4.12 },
    { period: "2025-S1", passPct: 85, publications: 15, enroll: 140, grads: 115, feedback: 4.2 },
  ],
};

// ---------- 2) Faculty Research & Workload ----------
/*
  { name, pubs, grants, students, service }
*/
const facultyMock = {
  cse: [
    { name: "Dr. Ahuja", pubs: 12, grants: 2, students: 42, service: 3 },
    { name: "Dr. Bose",  pubs:  8, grants: 1, students: 38, service: 6 },
    { name: "Dr. Chen",  pubs: 15, grants: 3, students: 35, service: 2 },
    { name: "Dr. Dutta", pubs:  6, grants: 1, students: 40, service: 7 },
  ],
  ece: [
    { name: "Dr. Rao",  pubs: 9, grants: 1, students: 45, service: 5 },
    { name: "Dr. Iyer", pubs: 7, grants: 2, students: 41, service: 4 },
    { name: "Dr. Patel", pubs: 10, grants: 1, students: 39, service: 3 },
    { name: "Dr. Singh", pubs: 8, grants: 1, students: 42, service: 6 },
  ],
  me: [
    { name: "Dr. Khan", pubs: 6, grants: 1, students: 39, service: 5 },
    { name: "Dr. Gill", pubs: 5, grants: 1, students: 36, service: 6 },
    { name: "Dr. Rao",  pubs: 7, grants: 1, students: 34, service: 4 },
    { name: "Dr. Jain", pubs: 6, grants: 2, students: 37, service: 3 },
  ],
  it: [
    { name: "Dr. Roy",  pubs: 9, grants: 2, students: 40, service: 4 },
    { name: "Dr. Das",  pubs: 7, grants: 1, students: 38, service: 5 },
    { name: "Dr. Paul", pubs:10, grants: 2, students: 36, service: 3 },
    { name: "Dr. Sen",  pubs: 8, grants: 1, students: 39, service: 6 },
  ],
  ai: [
    { name: "Dr. Nair",  pubs: 14, grants: 3, students: 30, service: 2 },
    { name: "Dr. Verma", pubs: 12, grants: 2, students: 32, service: 3 },
    { name: "Dr. Garg",  pubs: 10, grants: 2, students: 34, service: 4 },
    { name: "Dr. Nath",  pubs: 11, grants: 3, students: 31, service: 3 },
  ],
  iot: [
    { name: "Dr. Rao",  pubs: 8, grants: 2, students: 28, service: 4 },
    { name: "Dr. Ghosh",pubs: 7, grants: 1, students: 27, service: 5 },
    { name: "Dr. Shah", pubs: 9, grants: 2, students: 26, service: 3 },
    { name: "Dr. Ajay", pubs: 8, grants: 1, students: 29, service: 4 },
  ],
  ccst: [
    { name: "Dr. Mishra", pubs: 9, grants: 1, students: 24, service: 4 },
    { name: "Dr. Kulkarni", pubs: 8, grants: 1, students: 23, service: 5 },
    { name: "Dr. Sen", pubs: 10, grants: 2, students: 22, service: 3 },
    { name: "Dr. Bhat", pubs: 11, grants: 2, students: 25, service: 2 },
  ],
  ee: [
    { name: "Dr. Menon", pubs: 8, grants: 1, students: 38, service: 4 },
    { name: "Dr. Gupta", pubs: 7, grants: 1, students: 36, service: 5 },
    { name: "Dr. Ali",   pubs: 9, grants: 2, students: 37, service: 3 },
    { name: "Dr. Roy",   pubs: 8, grants: 1, students: 35, service: 4 },
  ],
  civil: [
    { name: "Dr. Das",  pubs: 6, grants: 1, students: 33, service: 4 },
    { name: "Dr. Iqbal",pubs: 7, grants: 1, students: 34, service: 5 },
    { name: "Dr. Jain", pubs: 8, grants: 1, students: 32, service: 3 },
    { name: "Dr. Bose", pubs: 6, grants: 1, students: 31, service: 4 },
  ],
  emc: [
    { name: "Dr. Iyer", pubs: 7, grants: 1, students: 20, service: 2 },
    { name: "Dr. Rao",  pubs: 8, grants: 1, students: 22, service: 3 },
    { name: "Dr. Sen",  pubs: 9, grants: 2, students: 19, service: 2 },
    { name: "Dr. Paul", pubs:10, grants: 2, students: 21, service: 3 },
  ],
  che: [
    { name: "Dr. Gill", pubs: 9, grants: 2, students: 29, service: 3 },
    { name: "Dr. Shah", pubs: 8, grants: 1, students: 28, service: 4 },
    { name: "Dr. Khan", pubs: 7, grants: 1, students: 27, service: 4 },
    { name: "Dr. Roy",  pubs:10, grants: 2, students: 30, service: 2 },
  ],
};

// ---------- 3) Budget vs Spend ----------
/*
  { totalBudget, totalSpend, byCategory: [{ category, budget, spend }] }
  Budgets: ~16–24 lakhs; categories reflect typical college spends
*/
const budgetMock = {
  cse: {
    totalBudget: 2400000, totalSpend: 2050000,
    byCategory: [
      { category: "Lab Equipment",   budget: 900000, spend: 820000 },
      { category: "Software",        budget: 500000, spend: 460000 },
      { category: "Travel Grants",   budget: 300000, spend: 260000 },
      { category: "Events",          budget: 300000, spend: 240000 },
      { category: "Maintenance",     budget: 400000, spend: 270000 },
    ],
  },
  ece: {
    totalBudget: 1800000, totalSpend: 1400000,
    byCategory: [
      { category: "Lab Equipment",   budget: 700000, spend: 580000 },
      { category: "Software",        budget: 300000, spend: 240000 },
      { category: "Travel Grants",   budget: 250000, spend: 180000 },
      { category: "Events",          budget: 250000, spend: 200000 },
      { category: "Maintenance",     budget: 300000, spend: 200000 },
    ],
  },
  me: {
    totalBudget: 1600000, totalSpend: 1200000,
    byCategory: [
      { category: "Lab Equipment",   budget: 600000, spend: 480000 },
      { category: "Software",        budget: 200000, spend: 160000 },
      { category: "Travel Grants",   budget: 200000, spend: 150000 },
      { category: "Events",          budget: 300000, spend: 200000 },
      { category: "Maintenance",     budget: 300000, spend: 210000 },
    ],
  },
  it: {
    totalBudget: 2000000, totalSpend: 1650000,
    byCategory: [
      { category: "Lab Equipment",   budget: 700000, spend: 620000 },
      { category: "Software",        budget: 450000, spend: 380000 },
      { category: "Travel Grants",   budget: 250000, spend: 210000 },
      { category: "Events",          budget: 250000, spend: 210000 },
      { category: "Maintenance",     budget: 350000, spend: 230000 },
    ],
  },
  ai: {
    totalBudget: 2200000, totalSpend: 1820000,
    byCategory: [
      { category: "Lab Equipment",   budget: 800000, spend: 700000 },
      { category: "Software",        budget: 600000, spend: 520000 },
      { category: "Travel Grants",   budget: 250000, spend: 200000 },
      { category: "Events",          budget: 250000, spend: 210000 },
      { category: "Maintenance",     budget: 300000, spend: 190000 },
    ],
  },
  iot: {
    totalBudget: 1700000, totalSpend: 1350000,
    byCategory: [
      { category: "Lab Equipment",   budget: 600000, spend: 520000 },
      { category: "Software",        budget: 350000, spend: 300000 },
      { category: "Travel Grants",   budget: 200000, spend: 160000 },
      { category: "Events",          budget: 250000, spend: 200000 },
      { category: "Maintenance",     budget: 300000, spend: 170000 },
    ],
  },
  ccst: {
    totalBudget: 1650000, totalSpend: 1320000,
    byCategory: [
      { category: "Lab Equipment",   budget: 550000, spend: 480000 },
      { category: "Software",        budget: 350000, spend: 300000 },
      { category: "Travel Grants",   budget: 200000, spend: 160000 },
      { category: "Events",          budget: 250000, spend: 200000 },
      { category: "Maintenance",     budget: 300000, spend: 180000 },
    ],
  },
  ee: {
    totalBudget: 1750000, totalSpend: 1400000,
    byCategory: [
      { category: "Lab Equipment",   budget: 600000, spend: 500000 },
      { category: "Software",        budget: 300000, spend: 240000 },
      { category: "Travel Grants",   budget: 250000, spend: 200000 },
      { category: "Events",          budget: 300000, spend: 250000 },
      { category: "Maintenance",     budget: 300000, spend: 210000 },
    ],
  },
  civil: {
    totalBudget: 1600000, totalSpend: 1240000,
    byCategory: [
      { category: "Lab Equipment",   budget: 500000, spend: 420000 },
      { category: "Software",        budget: 250000, spend: 200000 },
      { category: "Travel Grants",   budget: 200000, spend: 150000 },
      { category: "Events",          budget: 300000, spend: 230000 },
      { category: "Maintenance",     budget: 350000, spend: 240000 },
    ],
  },
  emc: {
    totalBudget: 1400000, totalSpend: 1100000,
    byCategory: [
      { category: "Lab Equipment",   budget: 400000, spend: 350000 },
      { category: "Software",        budget: 300000, spend: 260000 },
      { category: "Travel Grants",   budget: 200000, spend: 160000 },
      { category: "Events",          budget: 250000, spend: 190000 },
      { category: "Maintenance",     budget: 250000, spend: 200000 },
    ],
  },
  che: {
    totalBudget: 1650000, totalSpend: 1300000,
    byCategory: [
      { category: "Lab Equipment",   budget: 550000, spend: 470000 },
      { category: "Software",        budget: 250000, spend: 210000 },
      { category: "Travel Grants",   budget: 200000, spend: 160000 },
      { category: "Events",          budget: 300000, spend: 230000 },
      { category: "Maintenance",     budget: 350000, spend: 260000 },
    ],
  },
};

// ---------- 4) Engagement & Activities ----------
/*
  { totals: { events, avgAttendance, costPerStudent }, interDept: [{ event, cse, ece, me, ...}] }
  NOTE: For interDept participation we show CSE/ECE/ME columns for consistency in charts.
*/
const engagementMock = {
  cse: {
    totals: { events: 22, avgAttendance: 86, costPerStudent: 1450 },
    interDept: [
      { event: "AI Workshop",        cse: 80, ece: 25, me: 10 },
      { event: "Cybersecurity Talk", cse: 70, ece: 20, me: 5  },
      { event: "Hackathon",          cse: 120, ece: 40, me: 20 },
    ],
  },
  ece: {
    totals: { events: 18, avgAttendance: 78, costPerStudent: 1320 },
    interDept: [
      { event: "VLSI Bootcamp", cse: 18, ece: 95, me: 8 },
      { event: "Robotics Demo", cse: 25, ece: 70, me: 20 },
      { event: "Signal Workshop", cse: 20, ece: 80, me: 10 },
    ],
  },
  me: {
    totals: { events: 15, avgAttendance: 72, costPerStudent: 1180 },
    interDept: [
      { event: "CAD Marathon",  cse: 10, ece: 12, me: 65 },
      { event: "Thermo Seminar",cse: 8,  ece: 10, me: 55 },
      { event: "Manufacturing Day", cse: 12, ece: 15, me: 70 },
    ],
  },
  it: {
    totals: { events: 16, avgAttendance: 80, costPerStudent: 1250 },
    interDept: [
      { event: "DevOps Bootcamp",  cse: 40, ece: 10, me: 8 },
      { event: "Web Hack Day",     cse: 50, ece: 12, me: 10 },
    ],
  },
  ai: {
    totals: { events: 20, avgAttendance: 82, costPerStudent: 1380 },
    interDept: [
      { event: "ML Summit",     cse: 60, ece: 18, me: 12 },
      { event: "DL Workshop",   cse: 55, ece: 16, me: 10 },
      { event: "AI Ethics Talk",cse: 40, ece: 14, me: 8  },
    ],
  },
  iot: {
    totals: { events: 12, avgAttendance: 75, costPerStudent: 1120 },
    interDept: [
      { event: "Arduino Day",   cse: 20, ece: 25, me: 15 },
      { event: "Sensor Expo",   cse: 18, ece: 20, me: 12 },
    ],
  },
  ccst: {
    totals: { events: 11, avgAttendance: 70, costPerStudent: 1050 },
    interDept: [
      { event: "Comp Vision 101", cse: 22, ece: 12, me: 6 },
      { event: "DB Systems Talk", cse: 24, ece: 10, me: 5 },
    ],
  },
  ee: {
    totals: { events: 13, avgAttendance: 76, costPerStudent: 1200 },
    interDept: [
      { event: "Power Systems Day", cse: 18, ece: 16, me: 20 },
      { event: "Smart Grid Forum",  cse: 15, ece: 14, me: 18 },
    ],
  },
  civil: {
    totals: { events: 10, avgAttendance: 68, costPerStudent: 980 },
    interDept: [
      { event: "Concrete Expo",   cse: 10, ece: 8,  me: 15 },
      { event: "GIS Workshop",    cse: 12, ece: 9,  me: 14 },
    ],
  },
  emc: {
    totals: { events: 9, avgAttendance: 65, costPerStudent: 900 },
    interDept: [
      { event: "Applied Stats Day", cse: 14, ece: 10, me: 6 },
      { event: "Math Modelling",    cse: 16, ece: 12, me: 8 },
    ],
  },
  che: {
    totals: { events: 12, avgAttendance: 72, costPerStudent: 1100 },
    interDept: [
      { event: "Process Design",     cse: 10, ece: 8,  me: 12 },
      { event: "Polymers Workshop",  cse: 12, ece: 9,  me: 14 },
    ],
  },
};

// ======================================================
// Exports for AnalyticsPage.jsx
// ======================================================

export const getTrendData = (dept) => _clone(trendMock[dept] || []);
export const getFacultyData = (dept) => _clone(facultyMock[dept] || []);
export const getBudgetData = (dept) => _clone(budgetMock[dept] || null);
export const getEngagementData = (dept) => _clone(engagementMock[dept] || null);
