
import React, { useEffect, useState } from "react";
import styles from "./AnalyticsPage.module.css";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

import {
  getDepartments,
  getAchievementData, getPlacementData, getActivitiesData,
  getFacultyData, getEngagementData
} from "../../data/analytics";

const AnalyticsPage = ({ navigate }) => {
  const [dept, setDept] = useState("cse");
  const [departments, setDepartments] = useState([]);

  const [achievement, setAchievement] = useState([]);
  const [placement, setPlacement] = useState([]);
  const [activities, setActivities] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [engagement, setEngagement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDepartments(getDepartments());
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [ach, plmnt, actvs, fac, eng] = await Promise.all([
          getAchievementData(dept),
          getPlacementData(dept),
          getActivitiesData(dept),
          getFacultyData(dept),
          getEngagementData(dept)
        ]);

        setAchievement(ach || []);
        setPlacement(plmnt || []);
        setActivities(actvs || []);
        setFaculty(fac || []);
        setEngagement(eng);
      } catch (err) {
        console.error("Failed to load analytics data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [dept]);

  if (loading) {
    return (
      <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className={styles.loader}>Loading Analytics...</div>
      </div>
    );
  }

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
                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--text)' }} formatter={(val) => [val, "LPA"]} />
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
            <ResponsiveContainer width="100%" height={Math.max(150, faculty.length * 35)}>
              <BarChart
                data={faculty}
                layout="vertical"
                margin={{ left: 100, right: 30, top: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--text-muted)" />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="var(--text-muted)"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(name) => name.length > 18 ? name.substring(0, 18) + "…" : name}
                  width={160}
                />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                <Legend iconType="circle" />
                <Bar dataKey="pubs" fill="#6366f1" barSize={20} name="Publications" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.card}>
            <h3>Grants & Students per Faculty</h3>
            <ResponsiveContainer width="100%" height={Math.max(150, faculty.length * 35)}>
              <BarChart
                data={faculty}
                layout="vertical"
                margin={{ left: 100, right: 30, top: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--text-muted)" />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="var(--text-muted)"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(name) => name.length > 18 ? name.substring(0, 18) + "…" : name}
                  width={160}
                />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                <Legend iconType="circle" />
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
            <p className={styles.bigStat}>{engagement?.totals?.events || 0}</p>
          </div>
          <div className={styles.card}>
            <h3>Avg Attendance</h3>
            <p className={styles.bigStat}>{engagement?.totals?.avgAttendance || 0}%</p>
          </div>
          <div className={styles.card}>
            <h3>Cost per Student</h3>
            <p className={styles.bigStat}>₹{engagement?.totals?.costPerStudent || 0}</p>
          </div>
        </div>

        <div className={styles.card} style={{ marginTop: "20px" }}>
          <h3>Inter-Department Participation</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={engagement?.interDept || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="event" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--text)' }} />
              <Legend iconType="circle" />
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
              try {
                const { saveEmailToDatabase } = await import("../../firebase");
                const res = await saveEmailToDatabase(val);
                if (res) alert("Subscribed successfully!");
                else alert("Failed to subscribe.");
              } catch (err) {
                alert("Subscription error.");
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
