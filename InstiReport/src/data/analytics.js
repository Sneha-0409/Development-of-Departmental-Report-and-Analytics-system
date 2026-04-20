

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


import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../firebase.js";

const _clone = (x) => JSON.parse(JSON.stringify(x));

// ---------- Departments ----------

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
  "cse": [
    {
      "name": "Dr Rakesh Singh Jadon",
      "pubs": 75,
      "citations": 0,
      "patents": 0,
      "grants": 6,
      "students": 32,
      "service": "Professor"
    },
    {
      "name": "Mr Mahesh Parmar",
      "pubs": 72,
      "citations": 0,
      "patents": 0,
      "grants": 6,
      "students": 39,
      "service": "Professor"
    },
    {
      "name": "Dr Rajni Ranjan Singh Makwana",
      "pubs": 64,
      "citations": 0,
      "patents": 0,
      "grants": 5,
      "students": 36,
      "service": "Professor"
    },
    {
      "name": "Dr Rohit Agrawal",
      "pubs": 53,
      "citations": 0,
      "patents": 0,
      "grants": 4,
      "students": 26,
      "service": "Professor"
    },
    {
      "name": "Dr Praphula Jain",
      "pubs": 49,
      "citations": 0,
      "patents": 0,
      "grants": 4,
      "students": 31,
      "service": "Professor"
    },
    {
      "name": "Amit Kumar Manjhavar",
      "pubs": 40,
      "citations": 0,
      "patents": 0,
      "grants": 3,
      "students": 31,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Amit Kumar Manjhvar",
      "pubs": 36,
      "citations": 0,
      "patents": 0,
      "grants": 3,
      "students": 37,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Kirti Raj Bhatele",
      "pubs": 33,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 39,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Abhilash Sonker",
      "pubs": 31,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 27,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Kuldeep Narayan Tripathi",
      "pubs": 31,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 29,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Ranjeet Kumar Singh",
      "pubs": 30,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 38,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Anshu Chaturvedi",
      "pubs": 28,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 36,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Gagandeep Kaur",
      "pubs": 27,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 34,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Smita Parte",
      "pubs": 25,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 24,
      "service": "Asst. Professor"
    },
    {
      "name": "Ms Aashi Singh Bhadouria",
      "pubs": 20,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 22,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr DEVANSHU TIWARI",
      "pubs": 19,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 38,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr GANESH CHANDRA",
      "pubs": 15,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 27,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Nishant Jain",
      "pubs": 15,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 37,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Rahul Dubey",
      "pubs": 14,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 35,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Prabhakar Sharma",
      "pubs": 13,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 29,
      "service": "Asst. Professor"
    },
    {
      "name": "Ms Hemlata Arya",
      "pubs": 13,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 36,
      "service": "Asst. Professor"
    },
    {
      "name": "Ms Jaimala Jha",
      "pubs": 12,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 22,
      "service": "Asst. Professor"
    },
    {
      "name": "Mrs Khushboo Agarwal",
      "pubs": 11,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 30,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Devesh Kumar Lal",
      "pubs": 11,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 22,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Lav Upadhyay",
      "pubs": 9,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 26,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Anjula Mehto",
      "pubs": 8,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 36,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr SUCHITRA AGRAWAL",
      "pubs": 8,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 23,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Shradha Dubey",
      "pubs": 7,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 27,
      "service": "Asst. Professor"
    },
    {
      "name": "Prof Manisha Pathak",
      "pubs": 2,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 21,
      "service": "Asst. Professor"
    },
    {
      "name": "Ms Kratika Sharma",
      "pubs": 1,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 34,
      "service": "Asst. Professor"
    },
    {
      "name": "Mrs Poonam Sharma",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 20,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Manojeet Roy",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 21,
      "service": "Asst. Professor"
    },
    {
      "name": "Mrs Ruchi Jayaswal",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 34,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Sheo Kumar",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 29,
      "service": "Asst. Professor"
    },
    {
      "name": "Ms Sudipti Banerjee",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 22,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Shipra Shukla",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 25,
      "service": "Asst. Professor"
    },
    {
      "name": "Prof Vandana Jaiswal",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 37,
      "service": "Asst. Professor"
    }
  ],
  "it": [
    {
      "name": "Dr Nookala Venu",
      "pubs": 230,
      "citations": 0,
      "patents": 0,
      "grants": 19,
      "students": 30,
      "service": "Professor"
    },
    {
      "name": "Dr Manish Dixit",
      "pubs": 130,
      "citations": 0,
      "patents": 0,
      "grants": 10,
      "students": 38,
      "service": "Professor"
    },
    {
      "name": "Dr Aditya Dubey",
      "pubs": 55,
      "citations": 0,
      "patents": 0,
      "grants": 4,
      "students": 38,
      "service": "Professor"
    },
    {
      "name": "Dr Pawan Dubey",
      "pubs": 35,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 20,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Vibha Tiwari",
      "pubs": 32,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 37,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Saumil Maheshwari",
      "pubs": 32,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 30,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Rajendra Kumar Gupta",
      "pubs": 29,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 39,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Vikram Rajpoot",
      "pubs": 29,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 30,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Rajeev Kumar Singh",
      "pubs": 27,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 27,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Kritika Bansal",
      "pubs": 26,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 29,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Bhagat Singh Raghuwanshi",
      "pubs": 21,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 23,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Mir Shahnawaz Ahmad",
      "pubs": 19,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 20,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Priyanka Garg",
      "pubs": 17,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 36,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Ashish Soni",
      "pubs": 16,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 24,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Tej Singh",
      "pubs": 14,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 31,
      "service": "Asst. Professor"
    },
    {
      "name": "Mrs Shubha Mishra",
      "pubs": 14,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 24,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Neelam Arya",
      "pubs": 12,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 32,
      "service": "Asst. Professor"
    },
    {
      "name": "Ms Parul Saxena",
      "pubs": 10,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 26,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Akhilesh Tiwari",
      "pubs": 9,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 38,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Abhishek Dixit",
      "pubs": 9,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 28,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Vikas Sejwar",
      "pubs": 9,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 32,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Vikas Sejwar",
      "pubs": 6,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 33,
      "service": "Asst. Professor"
    },
    {
      "name": "Mrs Neha Bhardwaj",
      "pubs": 5,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 31,
      "service": "Asst. Professor"
    },
    {
      "name": "Prof Bulbul Agrawal",
      "pubs": 5,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 35,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Sanjiv Sharma",
      "pubs": 4,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 32,
      "service": "Asst. Professor"
    },
    {
      "name": "Prof Rati Bhan",
      "pubs": 4,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 36,
      "service": "Asst. Professor"
    },
    {
      "name": "Ms Pooja Agrawal",
      "pubs": 2,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 25,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Arun Kumar",
      "pubs": 2,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 38,
      "service": "Asst. Professor"
    },
    {
      "name": "Shubham Sharma",
      "pubs": 2,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 29,
      "service": "Asst. Professor"
    },
    {
      "name": "Prof Akanchha Tiwari",
      "pubs": 1,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 37,
      "service": "Asst. Professor"
    },
    {
      "name": "Prof Surbhi Gupta",
      "pubs": 1,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 30,
      "service": "Asst. Professor"
    },
    {
      "name": "Ms Sneha Garg",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 36,
      "service": "Asst. Professor"
    },
    {
      "name": "Prof Tanuja  Sharma",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 26,
      "service": "Asst. Professor"
    }
  ],
  "ai": [
    {
      "name": "Dr Vandana Vikas Thakare",
      "pubs": 220,
      "citations": 0,
      "patents": 0,
      "grants": 18,
      "students": 37,
      "service": "Professor"
    },
    {
      "name": "Dr Abhishek Bhatt",
      "pubs": 56,
      "citations": 0,
      "patents": 0,
      "grants": 4,
      "students": 27,
      "service": "Professor"
    },
    {
      "name": "Dr Jyoti Vimal",
      "pubs": 45,
      "citations": 0,
      "patents": 0,
      "grants": 3,
      "students": 27,
      "service": "Professor"
    },
    {
      "name": "Dr Hardev SIngh Pal",
      "pubs": 10,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 20,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr SATYAM OMAR",
      "pubs": 8,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 37,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Awadhesh Gupta",
      "pubs": 3,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 24,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Ramnaresh Sharma",
      "pubs": 2,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 37,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Mir Shahnawaz Ahmad",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 24,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Chayan Agrawal",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 25,
      "service": "Asst. Professor"
    },
    {
      "name": "Ms Arpita Singhal",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 37,
      "service": "Asst. Professor"
    },
    {
      "name": "Ms Shikha Jha",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 39,
      "service": "Asst. Professor"
    },
    {
      "name": "Ms Shweta Patel",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 36,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Madhav Singh",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 36,
      "service": "Asst. Professor"
    },
    {
      "name": "Ms Versha Sinha",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 22,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Ankit Kumar",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 21,
      "service": "Asst. Professor"
    },
    {
      "name": "Ms. Aditi Samadhiya",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 35,
      "service": "Asst. Professor"
    }
  ],
  "ee": [
    {
      "name": "Prof Laxmi Srivastava",
      "pubs": 277,
      "citations": 0,
      "patents": 0,
      "grants": 23,
      "students": 31,
      "service": "Professor"
    },
    {
      "name": "Prof Manjaree Pandit",
      "pubs": 167,
      "citations": 0,
      "patents": 0,
      "grants": 13,
      "students": 37,
      "service": "Professor"
    },
    {
      "name": "Dr Sulochana Wadhwani",
      "pubs": 117,
      "citations": 0,
      "patents": 0,
      "grants": 9,
      "students": 33,
      "service": "Professor"
    },
    {
      "name": "Dr Yashwant Sawle",
      "pubs": 94,
      "citations": 0,
      "patents": 0,
      "grants": 7,
      "students": 29,
      "service": "Professor"
    },
    {
      "name": "Dr Shishir Dixit",
      "pubs": 90,
      "citations": 0,
      "patents": 0,
      "grants": 7,
      "students": 36,
      "service": "Professor"
    },
    {
      "name": "Dr Shishir Dixit",
      "pubs": 88,
      "citations": 0,
      "patents": 0,
      "grants": 7,
      "students": 28,
      "service": "Professor"
    },
    {
      "name": "Dr Arun Kumar Wadhwani",
      "pubs": 78,
      "citations": 0,
      "patents": 0,
      "grants": 6,
      "students": 27,
      "service": "Professor"
    },
    {
      "name": "Mr Saurabh Kumar Rajput",
      "pubs": 45,
      "citations": 0,
      "patents": 0,
      "grants": 3,
      "students": 21,
      "service": "Professor"
    },
    {
      "name": "Mr Kuldeep Swarnkar",
      "pubs": 31,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 29,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Aftab Ahmed Ansari",
      "pubs": 30,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 32,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Kaushal Pratap Sengar",
      "pubs": 27,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 24,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Soumyajit Ghosh",
      "pubs": 25,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 36,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Vikram Saini",
      "pubs": 14,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 20,
      "service": "Asst. Professor"
    },
    {
      "name": "Mrs Poonam singh",
      "pubs": 13,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 28,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Himmat Singh",
      "pubs": 12,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 21,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Vishal Chaudhary",
      "pubs": 7,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 37,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Bhavna Rathore",
      "pubs": 6,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 20,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Ankit Tiwari",
      "pubs": 6,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 37,
      "service": "Asst. Professor"
    },
    {
      "name": "ANUJ LODHI",
      "pubs": 5,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 22,
      "service": "Asst. Professor"
    },
    {
      "name": "Prof Rakesh Narvey",
      "pubs": 4,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 37,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Nipun Gupta",
      "pubs": 1,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 31,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Manoj Kumar",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 38,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Sanjay Kulshreshtha",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 33,
      "service": "Asst. Professor"
    },
    {
      "name": "Ms Rinisha Bagaria",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 33,
      "service": "Asst. Professor"
    },
    {
      "name": "Ms Richa Sharma",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 22,
      "service": "Asst. Professor"
    }
  ],
  "me": [
    {
      "name": "Dr M K Gaur",
      "pubs": 145,
      "citations": 0,
      "patents": 0,
      "grants": 12,
      "students": 26,
      "service": "Professor"
    },
    {
      "name": "Dr Pratesh Jayaswal",
      "pubs": 113,
      "citations": 0,
      "patents": 0,
      "grants": 9,
      "students": 39,
      "service": "Professor"
    },
    {
      "name": "Dr Amit Aherwar",
      "pubs": 95,
      "citations": 0,
      "patents": 0,
      "grants": 7,
      "students": 34,
      "service": "Professor"
    },
    {
      "name": "Dr Chandra Shekhar Malvi",
      "pubs": 58,
      "citations": 0,
      "patents": 0,
      "grants": 4,
      "students": 38,
      "service": "Professor"
    },
    {
      "name": "Mr Vedansh Chaturvedi",
      "pubs": 50,
      "citations": 0,
      "patents": 0,
      "grants": 4,
      "students": 25,
      "service": "Professor"
    },
    {
      "name": "Prof Manish Kumar Sagar",
      "pubs": 33,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 23,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Vaibhav Shivhare",
      "pubs": 28,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 32,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Sharad Agrawal",
      "pubs": 23,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 31,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Nitin Upadhyay",
      "pubs": 21,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 21,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Surendra Kumar Chourasiya",
      "pubs": 16,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 35,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Gavendra Norkey",
      "pubs": 15,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 27,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Neeraj Mishra",
      "pubs": 10,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 31,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Utkarsh Srivastava",
      "pubs": 2,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 32,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Ravi Kant Ranjan",
      "pubs": 2,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 30,
      "service": "Asst. Professor"
    },
    {
      "name": "Prof Gyanesh Sharan",
      "pubs": 1,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 25,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Kaustubh Khot",
      "pubs": 1,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 26,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Vikash Agarwal",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 34,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Vinod Mahor",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 27,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Shubham Shrivastava",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 30,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Bhupendra Pandey",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 33,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Ajay Rajput",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 28,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Vaibhav Gupta",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 33,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Narendra Singh Sikarwar",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 31,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Krishan Kumar",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 37,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Subhas Chand Pal",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 36,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Rajendra Prasad Kori",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 34,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Ashish Agrawal",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 27,
      "service": "Asst. Professor"
    }
  ],
  "civil": [
    {
      "name": "Dr Jayvant Choudhary",
      "pubs": 69,
      "citations": 0,
      "patents": 0,
      "grants": 5,
      "students": 38,
      "service": "Professor"
    },
    {
      "name": "Dr Sarvesh Kumar Jain",
      "pubs": 55,
      "citations": 0,
      "patents": 0,
      "grants": 4,
      "students": 34,
      "service": "Professor"
    },
    {
      "name": "Prof Aditya Kumar Agarwal",
      "pubs": 31,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 24,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Ayyanaar S",
      "pubs": 27,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 32,
      "service": "Asst. Professor"
    },
    {
      "name": "Prof Gautam Bhadoriya",
      "pubs": 25,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 32,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Chayan Gupta",
      "pubs": 25,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 32,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Sanjay Tiwari",
      "pubs": 22,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 39,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Abhilash Shukla",
      "pubs": 20,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 36,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Reema Sharma",
      "pubs": 10,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 25,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Hemant Shrivastava",
      "pubs": 9,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 32,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Akash Gaur",
      "pubs": 1,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 22,
      "service": "Asst. Professor"
    },
    {
      "name": "Ms Ambika Priyadarshini  Mishra",
      "pubs": 1,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 34,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr A K Saxena",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 38,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Shivam Gupta",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 20,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Gyanendra Shakya",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 20,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr. Sachin Singh",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 32,
      "service": "Asst. Professor"
    }
  ],
  "ece": [
    {
      "name": "Dr Laxmi Shrivastava",
      "pubs": 112,
      "citations": 0,
      "patents": 0,
      "grants": 9,
      "students": 20,
      "service": "Professor"
    },
    {
      "name": "Dr Sandeep Sharma",
      "pubs": 103,
      "citations": 0,
      "patents": 0,
      "grants": 8,
      "students": 36,
      "service": "Professor"
    },
    {
      "name": "Dr Vijay Bhuria",
      "pubs": 74,
      "citations": 0,
      "patents": 0,
      "grants": 6,
      "students": 33,
      "service": "Professor"
    },
    {
      "name": "Dr Ravindra Pratap Narwaria",
      "pubs": 65,
      "citations": 0,
      "patents": 0,
      "grants": 5,
      "students": 33,
      "service": "Professor"
    },
    {
      "name": "Dr Vikas Mahor",
      "pubs": 54,
      "citations": 0,
      "patents": 0,
      "grants": 4,
      "students": 37,
      "service": "Professor"
    },
    {
      "name": "Dr Rahul Dubey",
      "pubs": 45,
      "citations": 0,
      "patents": 0,
      "grants": 3,
      "students": 21,
      "service": "Professor"
    },
    {
      "name": "Dr Karuna Markam",
      "pubs": 44,
      "citations": 0,
      "patents": 0,
      "grants": 3,
      "students": 32,
      "service": "Professor"
    },
    {
      "name": "Dr Varun Sharma",
      "pubs": 34,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 34,
      "service": "Asst. Professor"
    },
    {
      "name": "Prof Pooja Sahoo",
      "pubs": 27,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 29,
      "service": "Asst. Professor"
    },
    {
      "name": "Prof Madhav Singh",
      "pubs": 24,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 28,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Deep Kishore Parsediya",
      "pubs": 21,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 31,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Dablu kumar",
      "pubs": 17,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 30,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Hemant Choubey",
      "pubs": 16,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 37,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Kumar Gaurav",
      "pubs": 15,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 28,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Rahul Sagwal",
      "pubs": 13,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 37,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Shubhi Kansal",
      "pubs": 11,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 33,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Rakesh Naik",
      "pubs": 4,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 28,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Praveen Kumar",
      "pubs": 3,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 37,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Santosh Sharma",
      "pubs": 1,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 26,
      "service": "Asst. Professor"
    },
    {
      "name": "Prof Shambhu Kumar",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 33,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Saurabh Singh Raghuvanshi",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 35,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Abhilasha Sharma",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 23,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Arun Singh",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 29,
      "service": "Asst. Professor"
    },
    {
      "name": "Mr Pavitra Pathak",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 30,
      "service": "Asst. Professor"
    }
  ],
  "che": [
    {
      "name": "Dr Shourabh Singh Raghuwanshi",
      "pubs": 22,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 29,
      "service": "Asst. Professor"
    },
    {
      "name": "Ms Shivangi Sharma",
      "pubs": 16,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 32,
      "service": "Asst. Professor"
    },
    {
      "name": "Prof Anish P Jacob",
      "pubs": 8,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 21,
      "service": "Asst. Professor"
    },
    {
      "name": "Prof Swati Gupta",
      "pubs": 6,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 21,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Rakesh Kumar Dubey",
      "pubs": 4,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 20,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Pratap Singh",
      "pubs": 2,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 31,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Kulbhushan Samal",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 36,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Sachin Rameshrao Geed",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 23,
      "service": "Asst. Professor"
    },
    {
      "name": "Ms Sulochana Nagar",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 28,
      "service": "Asst. Professor"
    }
  ],
  "emc": [
    {
      "name": "Dr Jitendra Kumar",
      "pubs": 34,
      "citations": 0,
      "patents": 0,
      "grants": 2,
      "students": 32,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Santosh Kumar Bharadwaj",
      "pubs": 22,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 27,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Minakshi Poonia Dahiya",
      "pubs": 20,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 39,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Vijay Shankar  Sharma",
      "pubs": 17,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 38,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Kuldeep Kumar Tiwari",
      "pubs": 13,
      "citations": 0,
      "patents": 0,
      "grants": 1,
      "students": 34,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Divya Chaturvedi",
      "pubs": 9,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 28,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Nidhi Humnekar",
      "pubs": 6,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 32,
      "service": "Asst. Professor"
    },
    {
      "name": "Prof Angad Singh Ojha",
      "pubs": 3,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 29,
      "service": "Asst. Professor"
    },
    {
      "name": "Dr Barkha Tiwari",
      "pubs": 0,
      "citations": 0,
      "patents": 0,
      "grants": 0,
      "students": 23,
      "service": "Asst. Professor"
    }
  ]
};

/* ======================================================
   3) Budget vs Spend 
====================================================== */


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

export const getAchievementData = async (dept) => {
  try {
    if (db) {
      const q = query(collection(db, "achievements"), where("departmentId", "==", dept));
      const snaps = await getDocs(q);
      if (!snaps.empty) {
        return snaps.docs.map(d => d.data()).sort((a,b) => a.period.localeCompare(b.period));
      }
    }
  } catch(e) { console.warn("Firebase fetch failed, falling back to mock", e); }
  return _clone(achievementMock[dept] || []);
};

export const getPlacementData = async (dept) => {
  try {
    if (db) {
      const q = query(collection(db, "placements"), where("departmentId", "==", dept));
      const snaps = await getDocs(q);
      if (!snaps.empty) {
        return snaps.docs.map(d => d.data()).sort((a,b) => a.period.localeCompare(b.period));
      }
    }
  } catch(e) { console.warn("Firebase fetch failed, falling back to mock", e); }
  return _clone(placementMock[dept] || []);
};

export const getActivitiesData = async (dept) => {
  try {
    if (db) {
      const q = query(collection(db, "activities"), where("departmentId", "==", dept));
      const snaps = await getDocs(q);
      if (!snaps.empty) {
        return snaps.docs.map(d => d.data()).sort((a,b) => a.period.localeCompare(b.period));
      }
    }
  } catch(e) { console.warn("Firebase fetch failed, falling back to mock", e); }
  return _clone(activitiesMock[dept] || []);
};

export const getFacultyData = async (dept) => {
  try {
    if (db) {
      const q = query(collection(db, "faculty"), where("departmentId", "==", dept));
      const snaps = await getDocs(q);
      if (!snaps.empty) {
        return snaps.docs.map(d => d.data()).sort((a, b) => b.pubs - a.pubs); // sorting by pubs desc
      }
    }
  } catch(e) { console.warn("Firebase fetch failed, falling back to mock", e); }
  return _clone(facultyMock[dept] || []);
};

export const getEngagementData = async (dept) => {
  try {
    if (db) {
      const q = query(collection(db, "engagement"), where("departmentId", "==", dept), limit(1));
      const snaps = await getDocs(q);
      if (!snaps.empty) {
        return snaps.docs[0].data();
      }
    }
  } catch(e) { console.warn("Firebase fetch failed, falling back to mock", e); }
  return _clone(engagementMock[dept] || null);
};
