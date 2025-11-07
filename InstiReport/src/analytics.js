

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


const _clone = (x) => JSON.parse(JSON.stringify(x));



// --- Student Achievement  ---
const achievementMock = {
  cse: [
    { period: "2023-S1", scholarships: 12, medals: 6, papers: 10 },
    { period: "2023-S2", scholarships: 14, medals: 7, papers: 11 },
    { period: "2024-S1", scholarships: 15, medals: 8, papers: 12 },
    { period: "2024-S2", scholarships: 17, medals: 9, papers: 14 },
    { period: "2025-S1", scholarships: 18, medals: 10, papers: 15 },
  ],
  ece: [
    { period: "2023-S1", scholarships: 9, medals: 4, papers: 7 },
    { period: "2023-S2", scholarships: 10, medals: 5, papers: 8 },
    { period: "2024-S1", scholarships: 11, medals: 6, papers: 9 },
    { period: "2024-S2", scholarships: 12, medals: 6, papers: 10 },
    { period: "2025-S1", scholarships: 13, medals: 7, papers: 11 },
  ],
  me: [
    { period: "2023-S1", scholarships: 7, medals: 3, papers: 5 },
    { period: "2023-S2", scholarships: 8, medals: 3, papers: 6 },
    { period: "2024-S1", scholarships: 9, medals: 4, papers: 7 },
    { period: "2024-S2", scholarships: 10, medals: 5, papers: 8 },
    { period: "2025-S1", scholarships: 11, medals: 5, papers: 9 },
  ],
  it: [
    { period: "2023-S1", scholarships: 11, medals: 5, papers: 8 },
    { period: "2023-S2", scholarships: 12, medals: 6, papers: 9 },
    { period: "2024-S1", scholarships: 13, medals: 6, papers: 10 },
    { period: "2024-S2", scholarships: 15, medals: 7, papers: 12 },
    { period: "2025-S1", scholarships: 16, medals: 8, papers: 13 },
  ],
  ai: [
    { period: "2023-S1", scholarships: 10, medals: 5, papers: 9 },
    { period: "2023-S2", scholarships: 11, medals: 6, papers: 10 },
    { period: "2024-S1", scholarships: 12, medals: 6, papers: 11 },
    { period: "2024-S2", scholarships: 14, medals: 7, papers: 13 },
    { period: "2025-S1", scholarships: 16, medals: 8, papers: 14 },
  ],
  iot: [
    { period: "2023-S1", scholarships: 8, medals: 3, papers: 5 },
    { period: "2023-S2", scholarships: 9, medals: 4, papers: 6 },
    { period: "2024-S1", scholarships: 10, medals: 4, papers: 7 },
    { period: "2024-S2", scholarships: 11, medals: 5, papers: 8 },
    { period: "2025-S1", scholarships: 12, medals: 5, papers: 9 },
  ],
  ccst: [
    { period: "2023-S1", scholarships: 7, medals: 3, papers: 6 },
    { period: "2023-S2", scholarships: 8, medals: 3, papers: 7 },
    { period: "2024-S1", scholarships: 9, medals: 4, papers: 8 },
    { period: "2024-S2", scholarships: 10, medals: 4, papers: 9 },
    { period: "2025-S1", scholarships: 11, medals: 5, papers: 10 },
  ],
  ee: [
    { period: "2023-S1", scholarships: 9, medals: 4, papers: 6 },
    { period: "2023-S2", scholarships: 10, medals: 4, papers: 7 },
    { period: "2024-S1", scholarships: 11, medals: 5, papers: 8 },
    { period: "2024-S2", scholarships: 12, medals: 6, papers: 9 },
    { period: "2025-S1", scholarships: 13, medals: 6, papers: 10 },
  ],
  civil: [
    { period: "2023-S1", scholarships: 6, medals: 2, papers: 4 },
    { period: "2023-S2", scholarships: 7, medals: 3, papers: 5 },
    { period: "2024-S1", scholarships: 8, medals: 3, papers: 6 },
    { period: "2024-S2", scholarships: 9, medals: 4, papers: 7 },
    { period: "2025-S1", scholarships: 10, medals: 4, papers: 8 },
  ],
  emc: [
    { period: "2023-S1", scholarships: 8, medals: 2, papers: 7 },
    { period: "2023-S2", scholarships: 9, medals: 3, papers: 8 },
    { period: "2024-S1", scholarships: 10, medals: 3, papers: 9 },
    { period: "2024-S2", scholarships: 11, medals: 4, papers: 10 },
    { period: "2025-S1", scholarships: 12, medals: 4, papers: 11 },
  ],
  che: [
    { period: "2023-S1", scholarships: 8, medals: 3, papers: 6 },
    { period: "2023-S2", scholarships: 9, medals: 3, papers: 7 },
    { period: "2024-S1", scholarships: 10, medals: 4, papers: 8 },
    { period: "2024-S2", scholarships: 12, medals: 5, papers: 9 },
    { period: "2025-S1", scholarships: 13, medals: 5, papers: 10 },
  ],
};

// --- Placement (two separate line charts: placed, avgPackage) ---
const placementMock = {
  cse: [
    { period: "2023-S1", placed: 190, avgPackage: 6.5 },
    { period: "2023-S2", placed: 205, avgPackage: 7.1 },
    { period: "2024-S1", placed: 215, avgPackage: 7.6 },
    { period: "2024-S2", placed: 230, avgPackage: 8.2 },
    { period: "2025-S1", placed: 245, avgPackage: 8.9 },
  ],
  ece: [
    { period: "2023-S1", placed: 150, avgPackage: 5.8 },
    { period: "2023-S2", placed: 160, avgPackage: 6.1 },
    { period: "2024-S1", placed: 170, avgPackage: 6.4 },
    { period: "2024-S2", placed: 178, avgPackage: 6.7 },
    { period: "2025-S1", placed: 185, avgPackage: 7.0 },
  ],
  me: [
    { period: "2023-S1", placed: 120, avgPackage: 5.2 },
    { period: "2023-S2", placed: 128, avgPackage: 5.4 },
    { period: "2024-S1", placed: 135, avgPackage: 5.7 },
    { period: "2024-S2", placed: 142, avgPackage: 6.0 },
    { period: "2025-S1", placed: 150, avgPackage: 6.3 },
  ],
  it: [
    { period: "2023-S1", placed: 165, avgPackage: 6.2 },
    { period: "2023-S2", placed: 175, avgPackage: 6.6 },
    { period: "2024-S1", placed: 185, avgPackage: 7.1 },
    { period: "2024-S2", placed: 195, avgPackage: 7.6 },
    { period: "2025-S1", placed: 205, avgPackage: 8.0 },
  ],
  ai: [
    { period: "2023-S1", placed: 130, avgPackage: 6.8 },
    { period: "2023-S2", placed: 140, avgPackage: 7.2 },
    { period: "2024-S1", placed: 150, avgPackage: 7.7 },
    { period: "2024-S2", placed: 160, avgPackage: 8.1 },
    { period: "2025-S1", placed: 172, avgPackage: 8.6 },
  ],
  iot: [
    { period: "2023-S1", placed: 100, avgPackage: 5.5 },
    { period: "2023-S2", placed: 108, avgPackage: 5.8 },
    { period: "2024-S1", placed: 116, avgPackage: 6.1 },
    { period: "2024-S2", placed: 123, avgPackage: 6.3 },
    { period: "2025-S1", placed: 130, avgPackage: 6.6 },
  ],
  ccst: [
    { period: "2023-S1", placed: 95, avgPackage: 5.7 },
    { period: "2023-S2", placed: 102, avgPackage: 6.0 },
    { period: "2024-S1", placed: 110, avgPackage: 6.3 },
    { period: "2024-S2", placed: 118, avgPackage: 6.6 },
    { period: "2025-S1", placed: 125, avgPackage: 6.9 },
  ],
  ee: [
    { period: "2023-S1", placed: 145, avgPackage: 5.9 },
    { period: "2023-S2", placed: 152, avgPackage: 6.2 },
    { period: "2024-S1", placed: 160, avgPackage: 6.5 },
    { period: "2024-S2", placed: 168, avgPackage: 6.8 },
    { period: "2025-S1", placed: 176, avgPackage: 7.1 },
  ],
  civil: [
    { period: "2023-S1", placed: 110, avgPackage: 4.8 },
    { period: "2023-S2", placed: 118, avgPackage: 5.1 },
    { period: "2024-S1", placed: 124, avgPackage: 5.4 },
    { period: "2024-S2", placed: 130, avgPackage: 5.7 },
    { period: "2025-S1", placed: 138, avgPackage: 6.0 },
  ],
  emc: [
    { period: "2023-S1", placed: 85, avgPackage: 5.3 },
    { period: "2023-S2", placed: 90, avgPackage: 5.5 },
    { period: "2024-S1", placed: 96, avgPackage: 5.8 },
    { period: "2024-S2", placed: 102, avgPackage: 6.1 },
    { period: "2025-S1", placed: 108, avgPackage: 6.4 },
  ],
  che: [
    { period: "2023-S1", placed: 120, avgPackage: 5.6 },
    { period: "2023-S2", placed: 128, avgPackage: 5.9 },
    { period: "2024-S1", placed: 136, avgPackage: 6.2 },
    { period: "2024-S2", placed: 144, avgPackage: 6.5 },
    { period: "2025-S1", placed: 152, avgPackage: 6.8 },
  ],
};

// --- Department Activities (grouped bar) ---
const activitiesMock = {
  cse: [
    { period: "2023-S1", events: 10, workshops: 7, MoUs: 3 },
    { period: "2023-S2", events: 12, workshops: 8, MoUs: 3 },
    { period: "2024-S1", events: 14, workshops: 9, MoUs: 4 },
    { period: "2024-S2", events: 16, workshops: 10, MoUs: 5 },
    { period: "2025-S1", events: 18, workshops: 11, MoUs: 5 },
  ],
  ece: [
    { period: "2023-S1", events: 9, workshops: 6, MoUs: 2 },
    { period: "2023-S2", events: 10, workshops: 7, MoUs: 3 },
    { period: "2024-S1", events: 11, workshops: 7, MoUs: 3 },
    { period: "2024-S2", events: 12, workshops: 8, MoUs: 4 },
    { period: "2025-S1", events: 13, workshops: 9, MoUs: 4 },
  ],
  me: [
    { period: "2023-S1", events: 7, workshops: 5, MoUs: 2 },
    { period: "2023-S2", events: 8, workshops: 5, MoUs: 2 },
    { period: "2024-S1", events: 9, workshops: 6, MoUs: 3 },
    { period: "2024-S2", events: 10, workshops: 7, MoUs: 3 },
    { period: "2025-S1", events: 11, workshops: 7, MoUs: 4 },
  ],
  it: [
    { period: "2023-S1", events: 9, workshops: 6, MoUs: 2 },
    { period: "2023-S2", events: 10, workshops: 7, MoUs: 3 },
    { period: "2024-S1", events: 12, workshops: 8, MoUs: 3 },
    { period: "2024-S2", events: 13, workshops: 9, MoUs: 4 },
    { period: "2025-S1", events: 14, workshops: 10, MoUs: 5 },
  ],
  ai: [
    { period: "2023-S1", events: 10, workshops: 7, MoUs: 3 },
    { period: "2023-S2", events: 11, workshops: 7, MoUs: 3 },
    { period: "2024-S1", events: 12, workshops: 8, MoUs: 4 },
    { period: "2024-S2", events: 14, workshops: 9, MoUs: 4 },
    { period: "2025-S1", events: 15, workshops: 10, MoUs: 5 },
  ],
  iot: [
    { period: "2023-S1", events: 6, workshops: 4, MoUs: 2 },
    { period: "2023-S2", events: 7, workshops: 5, MoUs: 2 },
    { period: "2024-S1", events: 8, workshops: 5, MoUs: 3 },
    { period: "2024-S2", events: 9, workshops: 6, MoUs: 3 },
    { period: "2025-S1", events: 10, workshops: 7, MoUs: 4 },
  ],
  ccst: [
    { period: "2023-S1", events: 6, workshops: 4, MoUs: 2 },
    { period: "2023-S2", events: 7, workshops: 4, MoUs: 2 },
    { period: "2024-S1", events: 8, workshops: 5, MoUs: 3 },
    { period: "2024-S2", events: 9, workshops: 6, MoUs: 3 },
    { period: "2025-S1", events: 10, workshops: 6, MoUs: 4 },
  ],
  ee: [
    { period: "2023-S1", events: 8, workshops: 5, MoUs: 2 },
    { period: "2023-S2", events: 9, workshops: 6, MoUs: 3 },
    { period: "2024-S1", events: 10, workshops: 6, MoUs: 3 },
    { period: "2024-S2", events: 11, workshops: 7, MoUs: 4 },
    { period: "2025-S1", events: 12, workshops: 8, MoUs: 4 },
  ],
  civil: [
    { period: "2023-S1", events: 6, workshops: 4, MoUs: 2 },
    { period: "2023-S2", events: 7, workshops: 4, MoUs: 2 },
    { period: "2024-S1", events: 8, workshops: 5, MoUs: 2 },
    { period: "2024-S2", events: 9, workshops: 6, MoUs: 3 },
    { period: "2025-S1", events: 10, workshops: 6, MoUs: 3 },
  ],
  emc: [
    { period: "2023-S1", events: 5, workshops: 3, MoUs: 1 },
    { period: "2023-S2", events: 6, workshops: 3, MoUs: 2 },
    { period: "2024-S1", events: 7, workshops: 4, MoUs: 2 },
    { period: "2024-S2", events: 8, workshops: 5, MoUs: 3 },
    { period: "2025-S1", events: 9, workshops: 5, MoUs: 3 },
  ],
  che: [
    { period: "2023-S1", events: 7, workshops: 5, MoUs: 2 },
    { period: "2023-S2", events: 8, workshops: 5, MoUs: 2 },
    { period: "2024-S1", events: 9, workshops: 6, MoUs: 3 },
    { period: "2024-S2", events: 10, workshops: 7, MoUs: 3 },
    { period: "2025-S1", events: 11, workshops: 8, MoUs: 4 },
  ],
};


/* ======================================================
   2) Faculty Research & Workload 
====================================================== */
const facultyMock = {
  cse: [
    { name: "Dr. Manish Dixit", pubs: 18, grants: 2, students: 42, service: 4 },
    { name: "Dr. R. S. Jadon", pubs: 15, grants: 3, students: 38, service: 3 },
    { name: "Dr. R. K. Gupta", pubs: 14, grants: 2, students: 40, service: 4 },
    { name: "Dr. Anshu Chaturvedi", pubs: 12, grants: 1, students: 36, service: 3 },
    { name: "Khushboo Agarwal", pubs: 9, grants: 0, students: 30, service: 2 },
    { name: "Jaimala Jha", pubs: 11, grants: 1, students: 32, service: 3 },
    { name: "Mahesh Parmar", pubs: 8, grants: 1, students: 28, service: 2 },
    { name: "Dr. Parul Saxena", pubs: 16, grants: 2, students: 41, service: 4 },
    { name: "Amit Kumar Manjhvar", pubs: 10, grants: 1, students: 34, service: 3 },
    { name: "Dr. Ranjeet Kumar Singh", pubs: 17, grants: 3, students: 43, service: 4 },
    { name: "Dr. Smita Parte", pubs: 14, grants: 2, students: 37, service: 3 },
    { name: "Dr. Dheeraj Kumar Dixit", pubs: 13, grants: 2, students: 35, service: 5 },
    { name: "Dr. Praphula Jain", pubs: 15, grants: 1, students: 39, service: 3 },
    { name: "Dr. Rahul Dubey", pubs: 11, grants: 2, students: 33, service: 3 },
    { name: "Dr. Devesh Kumar Lal", pubs: 18, grants: 3, students: 44, service: 4 },
    { name: "Dr. Gagandeep Kaur", pubs: 13, grants: 1, students: 37, service: 3 },
    { name: "Dr. Rohit Agrawal", pubs: 15, grants: 2, students: 40, service: 4 },
    { name: "Dr. Kuldeep Narayan Tripathi", pubs: 10, grants: 1, students: 32, service: 2 },
    { name: "Dr. Nishant Jain", pubs: 12, grants: 2, students: 35, service: 3 },
    { name: "Vivek Sharma", pubs: 9, grants: 1, students: 31, service: 3 },
    { name: "Dr. Kirti Raj Bhatele", pubs: 11, grants: 2, students: 34, service: 3 },
    { name: "Dr. Ashish Tomar", pubs: 14, grants: 1, students: 38, service: 4 },
    { name: "Dr. Saurabh Agarwal", pubs: 16, grants: 2, students: 41, service: 3 },
    { name: "Dr. Manojeet Roy", pubs: 12, grants: 1, students: 36, service: 3 },
    { name: "Jigyasa Mishra", pubs: 8, grants: 1, students: 30, service: 2 },
    { name: "Manisha Pathak", pubs: 9, grants: 1, students: 29, service: 3 },
    { name: "Mona Pandey Sharma", pubs: 7, grants: 0, students: 27, service: 2 },
  ],
  ece: [
    { name: "Dr. P. K. Singhal", pubs: 14, grants: 2, students: 48, service: 4 },
    { name: "Dr. Vandana Vikas Thakare", pubs: 12, grants: 2, students: 45, service: 4 },
    { name: "Dr. Karuna Markam", pubs: 10, grants: 1, students: 43, service: 3 },
    { name: "Prof. Pooja Sahoo", pubs: 9, grants: 1, students: 41, service: 3 },
    { name: "Dr. Nidhi Saxena", pubs: 11, grants: 1, students: 44, service: 3 },
    { name: "Prof. D. K. Parsediya", pubs: 8, grants: 0, students: 40, service: 2 },
    { name: "Dr. Rahul Dubey", pubs: 12, grants: 1, students: 45, service: 3 },
    { name: "Dr. Khushboo Punia", pubs: 10, grants: 1, students: 42, service: 3 },
    { name: "Dr. Deepak Batham", pubs: 11, grants: 1, students: 44, service: 3 },
    { name: "Dr. Varun Sharma", pubs: 9, grants: 1, students: 41, service: 3 },
    { name: "Dr. Shubhi Kansal", pubs: 8, grants: 0, students: 39, service: 2 },
    { name: "Dr. Himanshu Singh", pubs: 10, grants: 1, students: 43, service: 3 },
    { name: "Dr. Yogesh Kumar", pubs: 11, grants: 1, students: 44, service: 3 },
  ],
  me: [
    { name: "Dr. Pratesh Jayaswal", pubs: 13, grants: 2, students: 50, service: 5 },
    { name: "Dr. Chandra Shekhar Malvi", pubs: 11, grants: 1, students: 47, service: 4 },
    { name: "Dr. Manoj Kumar Gaur", pubs: 12, grants: 2, students: 49, service: 4 },
    { name: "Dr. Manish Kumar Sagar", pubs: 10, grants: 1, students: 44, service: 3 },
    { name: "Rajendra Prasad Kori", pubs: 7, grants: 0, students: 40, service: 3 },
    { name: "Vedansh Chaturvedi", pubs: 9, grants: 1, students: 42, service: 4 },
    { name: "Dr. Jyoti Vimal", pubs: 12, grants: 2, students: 48, service: 4 },
    { name: "Sharad Agarwal", pubs: 8, grants: 1, students: 39, service: 3 },
    { name: "Vaibhav Shivhare", pubs: 7, grants: 0, students: 38, service: 2 },
    { name: "Dr. Amit Aherwar", pubs: 14, grants: 3, students: 52, service: 5 },
    { name: "Bhupendra Kumar Pandey", pubs: 9, grants: 1, students: 45, service: 4 },
    { name: "Dr. Nitin Upadhyay", pubs: 10, grants: 1, students: 47, service: 4 },
    { name: "Dr. Surendra Kumar Chourasiya", pubs: 11, grants: 2, students: 50, service: 5 },
    { name: "Dr. Gavendra Norkey", pubs: 8, grants: 1, students: 41, service: 3 },
  ],
  it: [
    { name: "Dr. Akhilesh Tiwari", pubs: 13, grants: 2, students: 38, service: 4 },
    { name: "Dr. Sanjiv Sharma", pubs: 11, grants: 1, students: 35, service: 3 },
    { name: "Dr. Punit Kumar Johari", pubs: 12, grants: 2, students: 37, service: 4 },
    { name: "Dr. Abhilash Sonker", pubs: 10, grants: 1, students: 33, service: 3 },
    { name: "Vikas Sejwar", pubs: 8, grants: 0, students: 30, service: 2 },
    { name: "Rajeev Kumar Singh", pubs: 10, grants: 1, students: 32, service: 3 },
    { name: "Neha Bhardwaj", pubs: 9, grants: 1, students: 31, service: 2 },
    { name: "Dr. Vikram Rajpoot", pubs: 11, grants: 2, students: 34, service: 3 },
    { name: "Surbhi Gupta", pubs: 8, grants: 1, students: 29, service: 2 },
    { name: "Shubham Sharma", pubs: 7, grants: 0, students: 28, service: 2 },
    { name: "Ms. Kumud Dixit", pubs: 9, grants: 1, students: 30, service: 3 },
  ],
  ai: [
    { name: "Dr. Rajni Ranjan Singh Makwana", pubs: 18, grants: 3, students: 38, service: 4 },
    { name: "Dr. Mir Shahnawaz Ahmad", pubs: 17, grants: 2, students: 37, service: 4 },
    { name: "Dr. Arun Kumar", pubs: 15, grants: 2, students: 36, service: 3 },
    { name: "Dr. Pawan Dubey", pubs: 14, grants: 1, students: 35, service: 3 },
    { name: "Dr. Tej Singh", pubs: 19, grants: 3, students: 40, service: 5 },
    { name: "Dr. Bhagat Singh Raghuwanshi", pubs: 13, grants: 1, students: 33, service: 3 },
    { name: "Dr. Sunil Kumar Shukla", pubs: 16, grants: 2, students: 39, service: 4 },
    { name: "Dr. Vibha Tiwari", pubs: 12, grants: 1, students: 32, service: 3 },
    { name: "Dr. Shubha Mishra", pubs: 13, grants: 1, students: 34, service: 3 },
    { name: "Dr. Abhishek Bhatt", pubs: 10, grants: 1, students: 31, service: 2 },
    { name: "Dr. Shipra Shukla", pubs: 12, grants: 1, students: 33, service: 3 },
    { name: "Dr. Hardev Singh Pal", pubs: 14, grants: 2, students: 37, service: 4 },
    { name: "Dr. Shweta Chauhan", pubs: 9, grants: 0, students: 29, service: 2 },
    { name: "Dr. Rahul Kumar", pubs: 15, grants: 2, students: 38, service: 3 },
    { name: "Dr. Sumit Dhariwal", pubs: 11, grants: 1, students: 33, service: 3 },
    { name: "Dr. Neelam Arya", pubs: 13, grants: 1, students: 34, service: 3 },
    { name: "Dr. Nandkishor Joshi", pubs: 12, grants: 1, students: 35, service: 3 },
    { name: "Dr. Neelam Sharma", pubs: 14, grants: 2, students: 37, service: 4 },
    { name: "Dr. Mausam Chouksey", pubs: 10, grants: 1, students: 31, service: 2 },
    { name: "Dr. Anurag Singh Tomar", pubs: 12, grants: 1, students: 34, service: 3 },
    { name: "Dr. Satyam Omar", pubs: 9, grants: 0, students: 30, service: 2 },
    { name: "Dr. Neeraj Mishra", pubs: 13, grants: 2, students: 35, service: 3 },
    { name: "Dr. Prerna Mishra", pubs: 12, grants: 1, students: 34, service: 3 },
    { name: "Prof. Ramnaresh Sharma", pubs: 11, grants: 1, students: 33, service: 3 },
    { name: "Prof. Archana Acharya", pubs: 10, grants: 1, students: 32, service: 3 },
    { name: "Prof. Geetika Hazra", pubs: 12, grants: 1, students: 34, service: 3 },
    { name: "Prof. Pooja Tripathi", pubs: 9, grants: 0, students: 30, service: 2 },
  ],
  iot: [
    { name: "Dr. Praveen Bansal", pubs: 15, grants: 3, students: 42, service: 4 },
    { name: "Dr. Saurabh Kumar Rajput", pubs: 13, grants: 2, students: 39, service: 3 },
    { name: "Dr. Bhavna Rathore", pubs: 12, grants: 2, students: 37, service: 3 },
    { name: "Dr. Kaushal Pratap Sengar", pubs: 11, grants: 2, students: 36, service: 3 },
    { name: "Dr. Murli Manohar", pubs: 10, grants: 1, students: 35, service: 3 },
    { name: "Dr. Soumyajit Ghosh", pubs: 14, grants: 2, students: 41, service: 4 },
    { name: "Dr. Aftab Ahmed Ansari", pubs: 12, grants: 1, students: 38, service: 3 },
    { name: "Dr. Dhananjay Bisen", pubs: 11, grants: 1, students: 37, service: 3 },
    { name: "Dr. Aditya Dubey", pubs: 13, grants: 2, students: 39, service: 3 },
    { name: "Dr. Nookala Venu", pubs: 9, grants: 1, students: 33, service: 2 },
    { name: "Dr. Priyanka Garg", pubs: 10, grants: 1, students: 35, service: 3 },
    { name: "Dr. Namita Arya", pubs: 11, grants: 2, students: 36, service: 3 },
    { name: "Dr. Abhishek Narwaria", pubs: 12, grants: 2, students: 38, service: 4 },
    { name: "Dr. Rupam Srivastava", pubs: 10, grants: 1, students: 34, service: 3 },
    { name: "Prof. Vinay Gupta", pubs: 9, grants: 1, students: 32, service: 3 },
    { name: "Prof. Anuj Lodhi", pubs: 8, grants: 1, students: 31, service: 2 },
    { name: "Prof. Rinki Pakshwar", pubs: 9, grants: 1, students: 30, service: 2 },
    { name: "Prof. Rashmi Shrivastava", pubs: 8, grants: 1, students: 30, service: 2 },
  ],
  ccst: [
    { name: "Dr. Akhilesh Tiwari", pubs: 14, grants: 2, students: 36, service: 4 },
    { name: "Dr. Saumil Maheshwari", pubs: 12, grants: 1, students: 34, service: 3 },
    { name: "Dr. Abhishek Dixit", pubs: 15, grants: 2, students: 37, service: 4 },
    { name: "Dr. Devanshu Tiwari", pubs: 13, grants: 1, students: 35, service: 3 },
    { name: "Dr. Gulshan Soni", pubs: 16, grants: 2, students: 38, service: 4 },
    { name: "Dr. Tejaswita Mishra", pubs: 11, grants: 1, students: 32, service: 3 },
    { name: "Dr. Shradha Dubey", pubs: 12, grants: 1, students: 33, service: 3 },
    { name: "Dr. Suchitra Agrawal", pubs: 10, grants: 1, students: 31, service: 2 },
    { name: "Mr. Mithun Sahay Shrivastava", pubs: 8, grants: 0, students: 29, service: 2 },
    { name: "Utkarsh Sharma", pubs: 9, grants: 1, students: 30, service: 2 },
    { name: "Prof. Aditi Samadhiya", pubs: 10, grants: 1, students: 31, service: 3 },
  ],
  ee: [
    { name: "Dr. Manjaree Pandit", pubs: 15, grants: 3, students: 52, service: 5 },
    { name: "Dr. A. K. Wadhwani", pubs: 13, grants: 2, students: 48, service: 4 },
    { name: "Dr. Sulochana Wadhwani", pubs: 12, grants: 2, students: 45, service: 4 },
    { name: "Dr. Shishir Dixit", pubs: 11, grants: 1, students: 44, service: 3 },
    { name: "Ashis Patra", pubs: 8, grants: 0, students: 38, service: 3 },
    { name: "Dr. Himmat Singh", pubs: 14, grants: 2, students: 50, service: 5 },
    { name: "Dr. Vijay Bhuria", pubs: 10, grants: 1, students: 46, service: 3 },
    { name: "Rakesh Narvey", pubs: 7, grants: 0, students: 40, service: 3 },
    { name: "Kuldeep Kumar Swarnkar", pubs: 9, grants: 1, students: 41, service: 3 },
    { name: "Dr. Vishal Chaudhary", pubs: 12, grants: 2, students: 49, service: 4 },
    { name: "Dr. Ankit Tiwari", pubs: 10, grants: 1, students: 42, service: 3 },
    { name: "Dr. Nikhil Paliwal", pubs: 11, grants: 2, students: 44, service: 3 },
    { name: "Dr. Vikram", pubs: 9, grants: 1, students: 41, service: 3 },
    { name: "Dr. Yashwant Sawle", pubs: 13, grants: 3, students: 51, service: 4 },
    { name: "Dr. Geetam Shukla", pubs: 11, grants: 2, students: 46, service: 4 },
    { name: "Prof. Manoj Kumar", pubs: 10, grants: 1, students: 45, service: 4 },
    { name: "Dr. R. Jenkin Suji", pubs: 9, grants: 1, students: 43, service: 3 },
    { name: "Prof. Hariom Sharma", pubs: 8, grants: 0, students: 38, service: 2 },
    { name: "Dr. Rimjhim Agrawal", pubs: 10, grants: 1, students: 44, service: 3 },
    { name: "Er. Shubham Sharma", pubs: 7, grants: 0, students: 39, service: 2 },
  ],
  civil: [
    { name: "Dr. Sanjay Tiwari", pubs: 12, grants: 1, students: 56, service: 5 },
    { name: "Dr. Sarvesh Kumar Jain", pubs: 11, grants: 1, students: 54, service: 4 },
    { name: "Dr. Manoj Kumar Trivedi", pubs: 10, grants: 1, students: 52, service: 4 },
    { name: "Prof. Anil Kumar Dwivedi", pubs: 9, grants: 0, students: 50, service: 3 },
    { name: "Prof. Anil Kumar Saxena", pubs: 8, grants: 0, students: 49, service: 3 },
    { name: "Prof. Gautam Bhadoriya", pubs: 7, grants: 0, students: 47, service: 3 },
    { name: "Prof. Aditya Kumar Agarwal", pubs: 9, grants: 1, students: 48, service: 4 },
    { name: "Dr. Hemant Shrivastava", pubs: 10, grants: 1, students: 53, service: 4 },
    { name: "Dr. Prachi Singh", pubs: 8, grants: 1, students: 45, service: 3 },
    { name: "Dr. Abhilash Shukla", pubs: 7, grants: 0, students: 44, service: 3 },
    { name: "Dr. Mohit Kumar", pubs: 9, grants: 1, students: 47, service: 3 },
    { name: "Dr. Rohit Ralli", pubs: 6, grants: 0, students: 42, service: 2 },
    { name: "Dr. Raghvendra Sahu", pubs: 11, grants: 1, students: 50, service: 4 },
    { name: "Dr. Mali Shivashankar", pubs: 10, grants: 1, students: 52, service: 5 },
    { name: "Dr. Reema Bera Sharma", pubs: 8, grants: 0, students: 45, service: 3 },
  ],
  emc: [
    { name: "Dr. D. K. Jain", pubs: 18, grants: 2, students: 28, service: 3 },
    { name: "Dr. Vikas Shinde", pubs: 15, grants: 1, students: 26, service: 3 },
    { name: "Prabhakar Sharma", pubs: 12, grants: 0, students: 25, service: 2 },
    { name: "Dr. J. K. Muthele", pubs: 16, grants: 2, students: 30, service: 3 },
    { name: "Dr. Atul Kumar Ray", pubs: 14, grants: 1, students: 27, service: 2 },
    { name: "Dr. Minakshi Dahiya", pubs: 15, grants: 1, students: 29, service: 3 },
    { name: "Dr. Divya Chaturvedi", pubs: 13, grants: 1, students: 30, service: 3 },
    { name: "Dr. Barkha Tiwari", pubs: 12, grants: 0, students: 26, service: 2 },
    { name: "Dr. Vijay Shankar Sharma", pubs: 17, grants: 2, students: 31, service: 3 },
    { name: "Dr. Anand Pawar", pubs: 14, grants: 1, students: 28, service: 3 },
    { name: "Dr. Nidhi Humnekar", pubs: 13, grants: 1, students: 27, service: 3 },
    { name: "Dr. Kuldeep Kumar Tiwari", pubs: 16, grants: 1, students: 29, service: 3 },
    { name: "Dr. Dilip Kumar Mishra", pubs: 15, grants: 1, students: 30, service: 4 },
    { name: "Dr. S. K. Bhardwaj", pubs: 12, grants: 0, students: 25, service: 2 },
  ],
  che: [
    { name: "Prof. Swati Gupta", pubs: 10, grants: 1, students: 48, service: 4 },
    { name: "Prof. Anish P. Jacob", pubs: 9, grants: 1, students: 46, service: 3 },
    { name: "Dr. Shourabh Singh Raghuwanshi", pubs: 11, grants: 1, students: 47, service: 3 },
    { name: "Shivangi Sharma", pubs: 7, grants: 0, students: 42, service: 2 },
  ],
};

/* ======================================================
   3) Budget vs Spend 
====================================================== */
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

// ---------- 4) Engagement & Activities  ----------
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

export const getAchievementData = (dept) => _clone(achievementMock[dept] || []);
export const getPlacementData = (dept) => _clone(placementMock[dept] || []);
export const getActivitiesData = (dept) => _clone(activitiesMock[dept] || []);
export const getFacultyData = (dept) => _clone(facultyMock[dept] || []);
export const getBudgetData = (dept) => _clone(budgetMock[dept] || null);
export const getEngagementData = (dept) => _clone(engagementMock[dept] || null);
