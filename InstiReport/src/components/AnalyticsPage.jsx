
import React, { useEffect, useState } from "react";
import styles from "./AnalyticsPage.module.css";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

import {
  getDepartments,
  getAchievementData, getPlacementData, getActivitiesData,
  getFacultyData, getBudgetData, getEngagementData
} from "../analytics";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

const AnalyticsPage = ({ navigate }) => {
  const [dept, setDept] = useState("cse");
  const [departments, setDepartments] = useState([]);

  
  const [achievement, setAchievement] = useState([]);
  const [placement, setPlacement] = useState([]);
  const [activities, setActivities] = useState([]);

  
  const [faculty, setFaculty] = useState([]);
  const [budget, setBudget] = useState(null);
  const [engagement, setEngagement] = useState(null);

  useEffect(() => {
    setDepartments(getDepartments());
  }, []);

  useEffect(() => {
    setAchievement(getAchievementData(dept));
    setPlacement(getPlacementData(dept));
    setActivities(getActivitiesData(dept));

    setFaculty(getFacultyData(dept));
    setBudget(getBudgetData(dept));
    setEngagement(getEngagementData(dept));
  }, [dept]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Analytics Dashboard</h1>
        <select value={dept} onChange={(e) => setDept(e.target.value)} className={styles.dropdown}>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      
      <div className={styles.section}>
        <h2> Performance & Outcomes Dashboard</h2>
        <div className={styles.cardGrid}>

          
          <div className={styles.card}>
            <h3>Student Achievement</h3>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={achievement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="scholarships" stackId="a" fill="#6366f1" name="Scholarships" />
                <Bar dataKey="medals" stackId="a" fill="#10b981" name="Medals" />
                <Bar dataKey="papers" stackId="a" fill="#f59e0b" name="Papers" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          
          <div className={styles.card}>
            <h3>Placement — Students Placed</h3>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={placement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="placed" stroke="#3b82f6" strokeWidth={2} name="Placed" />
              </LineChart>
            </ResponsiveContainer>
          </div>

       
          <div className={styles.card}>
            <h3>Placement — Avg Package (LPA)</h3>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={placement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(val, name) => [val, "LPA"]} />
                <Legend />
                <Line type="monotone" dataKey="avgPackage" stroke="#ef4444" strokeWidth={2} name="Avg Package" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          
          <div className={styles.card}>
            <h3>Department Activities</h3>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={activities}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="events" fill="#6366f1" name="Events" />
                <Bar dataKey="workshops" fill="#10b981" name="Workshops" />
                <Bar dataKey="MoUs" fill="#f59e0b" name="MoUs" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>


<div className={styles.section}>
  <h2>Faculty Publication & Workload</h2>
  <div className={styles.cardGrid}>

    <div className={styles.card}>
      <h3>Publications by Faculty</h3>
      <ResponsiveContainer width="100%" height={faculty.length * 30}>
        <BarChart
          data={faculty}
          layout="vertical"
          margin={{ left: 100, right: 30, top: 10, bottom: 10 }}
          barCategoryGap="15%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11 }}
            tickFormatter={(name) =>
              name.length > 18 ? name.substring(0, 18) + "…" : name
            }
            width={160}
          />
          <Tooltip formatter={(val, key, obj) => [val, obj.payload.name]} />
          <Legend />
          <Bar dataKey="pubs" fill="#6366f1" barSize={20} name="Publications" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    
    <div className={styles.card}>
      <h3>Grants & Students per Faculty</h3>
      <ResponsiveContainer width="100%" height={faculty.length * 30}>
        <BarChart
          data={faculty}
          layout="vertical"
          margin={{ left: 100, right: 30, top: 10, bottom: 10 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11 }}
            tickFormatter={(name) =>
              name.length > 18 ? name.substring(0, 18) + "…" : name
            }
            width={160}
          />
          <Tooltip formatter={(val, key, obj) => [val, obj.payload.name]} />
          <Legend />
          <Bar dataKey="grants" fill="#10b981" barSize={18} name="Grants" />
          <Bar dataKey="students" fill="#ef4444" barSize={18} name="Students" />
        </BarChart>
      </ResponsiveContainer>
    </div>

  </div>
</div>


    
      <div className={styles.section}>
        <h2> Budget vs Spend</h2>
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h3>Total Summary</h3>
            <p><b>Total Budget:</b> ₹{budget?.totalBudget}</p>
            <p><b>Spent:</b> ₹{budget?.totalSpend}</p>
            <p><b>Utilization:</b> {budget ? Math.round((budget.totalSpend / budget.totalBudget) * 100) : 0}%</p>
          </div>

          <div className={styles.card}>
            <h3>Budget vs Spend by Category</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={budget?.byCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="budget" fill="#6366f1" name="Budget" />
                <Bar dataKey="spend" fill="#f59e0b" name="Spend" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.card}>
            <h3>Spending Split</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={budget?.byCategory?.map(c => ({ name: c.category, value: c.spend }))}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {budget?.byCategory?.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

 
      <div className={styles.section}>
        <h2> Student Engagement & Activities</h2>

        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h3>Total Events</h3>
            <p className={styles.bigStat}>{engagement?.totals.events}</p>
          </div>
          <div className={styles.card}>
            <h3>Avg Attendance</h3>
            <p className={styles.bigStat}>{engagement?.totals.avgAttendance}</p>
          </div>
          <div className={styles.card}>
            <h3>Cost per Student</h3>
            <p className={styles.bigStat}>₹{engagement?.totals.costPerStudent}</p>
          </div>
        </div>

        <div className={styles.card} style={{ marginTop: "20px" }}>
          <h3>Inter-Department Participation</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={engagement?.interDept}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="event" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cse" fill="#6366f1" />
              <Bar dataKey="ece" fill="#10b981" />
              <Bar dataKey="me" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
