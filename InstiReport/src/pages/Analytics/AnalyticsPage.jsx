
import React, { useEffect, useState } from "react";
import styles from "./AnalyticsPage.module.css";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

import {
  getDepartments,
  getAchievementData, getPlacementData, getActivitiesData,
  getFacultyData, getEngagementData
} from "../../data/analytics";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

const AnalyticsPage = ({ navigate }) => {
  const [dept, setDept] = useState("cse");
  const [departments, setDepartments] = useState([]);


  const [achievement, setAchievement] = useState([]);
  const [placement, setPlacement] = useState([]);
  const [activities, setActivities] = useState([]);


  const [faculty, setFaculty] = useState([]);

  const [engagement, setEngagement] = useState(null);

  useEffect(() => {
    setDepartments(getDepartments());
  }, []);

  useEffect(() => {
    async function loadData() {
      const ach = await getAchievementData(dept);
      setAchievement(ach);

      const plmnt = await getPlacementData(dept);
      setPlacement(plmnt);

      const actvs = await getActivitiesData(dept);
      setActivities(actvs);

      const fac = await getFacultyData(dept);
      setFaculty(fac);

      const eng = await getEngagementData(dept);
      setEngagement(eng);
    }
    loadData();
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
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="period" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
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
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="period" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                <Line type="monotone" dataKey="placed" stroke="#3b82f6" strokeWidth={2} name="Placed" />
              </LineChart>
            </ResponsiveContainer>
          </div>


          <div className={styles.card}>
            <h3>Placement — Avg Package (LPA)</h3>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={placement}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="period" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--text)' }} formatter={(val, name) => [val, "LPA"]} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                <Line type="monotone" dataKey="avgPackage" stroke="#ef4444" strokeWidth={2} name="Avg Package" />
              </LineChart>
            </ResponsiveContainer>
          </div>


          <div className={styles.card}>
            <h3>Department Activities</h3>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={activities}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="period" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
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
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="var(--text-muted)"
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  tickFormatter={(name) =>
                    name.length > 18 ? name.substring(0, 18) + "…" : name
                  }
                  width={160}
                />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--text)' }} formatter={(val, key, obj) => [val, obj.payload.name]} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
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
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="var(--text-muted)"
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  tickFormatter={(name) =>
                    name.length > 18 ? name.substring(0, 18) + "…" : name
                  }
                  width={160}
                />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--text)' }} formatter={(val, key, obj) => [val, obj.payload.name]} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="grants" fill="#10b981" barSize={18} name="Grants" />
                <Bar dataKey="students" fill="#ef4444" barSize={18} name="Students" />
              </BarChart>
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
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="event" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
              <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--text)' }} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="cse" fill="#6366f1" />
              <Bar dataKey="ece" fill="#10b981" />
              <Bar dataKey="me" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.section} style={{ marginTop: "40px" }}>
        <h2>Subscribe to Analytics Newsletter</h2>
        <div className={styles.card} style={{ textAlign: "center", padding: "30px" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: "15px" }}>Get monthly department performance reports directly to your inbox.</p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const input = e.target.elements.email;
              const val = input.value;
              if (!val) return;
              input.value = "";
              const { saveEmailToDatabase } = await import("../../firebase");
              const res = await saveEmailToDatabase(val);
              if (res) {
                alert("Subscribed successfully!");
              } else {
                alert("Failed to subscribe. Please check your config.");
              }
            }}
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            <input type="email" name="email" placeholder="Enter your email address" required style={{ padding: "10px 15px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", width: "300px" }} />
            <button type="submit" style={{ padding: "10px 20px", borderRadius: "8px", background: "#6366f1", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}>Subscribe</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
