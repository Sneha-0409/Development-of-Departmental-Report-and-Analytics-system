import * as dotenv from "dotenv";
dotenv.config();

import { collection, writeBatch, doc } from "firebase/firestore";
import * as analyticsData from "../src/data/analytics.js";
import { db } from "../src/firebase.js";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function migrate() {
  console.log("Starting up Migration Scripts to Firebase...");

  // Helper arrays for iteration based on getDepartments
  const departments = analyticsData.getDepartments();
  const depts = departments.map(d => d.id);

  console.log("Migrating Departments...");
  const deptBatch = writeBatch(db);
  departments.forEach(dept => {
    const docRef = doc(collection(db, "departments"), dept.id);
    deptBatch.set(docRef, dept);
  });
  await deptBatch.commit();
  console.log("✅ Departments Migrated");

  console.log("Migrating Achievements...");
  for (const dept of depts) {
    const data = analyticsData.getAchievementData(dept);
    if (!data.length) continue;
    
    const batch = writeBatch(db);
    data.forEach(item => {
      const docRef = doc(collection(db, "achievements"));
      batch.set(docRef, { departmentId: dept, ...item });
    });
    await batch.commit();
  }
  console.log("✅ Achievements Migrated");

  console.log("Migrating Placements...");
  for (const dept of depts) {
    const data = analyticsData.getPlacementData(dept);
    if (!data.length) continue;
    
    const batch = writeBatch(db);
    data.forEach(item => {
      const docRef = doc(collection(db, "placements"));
      batch.set(docRef, { departmentId: dept, ...item });
    });
    await batch.commit();
  }
  console.log("✅ Placements Migrated");

  console.log("Migrating Activities...");
  for (const dept of depts) {
    const data = analyticsData.getActivitiesData(dept);
    if (!data.length) continue;
    
    const batch = writeBatch(db);
    data.forEach(item => {
      const docRef = doc(collection(db, "activities"));
      batch.set(docRef, { departmentId: dept, ...item });
    });
    await batch.commit();
  }
  console.log("✅ Activities Migrated");

  console.log("Migrating Faculty...");
  for (const dept of depts) {
    const data = analyticsData.getFacultyData(dept);
    if (!data.length) continue;
    
    const batch = writeBatch(db);
    data.forEach(item => {
      const docRef = doc(collection(db, "faculty"));
      batch.set(docRef, { departmentId: dept, ...item });
    });
    await batch.commit();
  }
  console.log("✅ Faculty Migrated");

  console.log("Migrating Engagement...");
  for (const dept of depts) {
    const data = analyticsData.getEngagementData(dept);
    if (!data) continue;
    
    const batch = writeBatch(db);
    const docRef = doc(collection(db, "engagement"));
    batch.set(docRef, { departmentId: dept, ...data });
    await batch.commit();
  }
  console.log("✅ Engagement Migrated");

  console.log("🎉 All Data Successfully Migrated to Firebase!");
}

migrate().catch(console.error);
