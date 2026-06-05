import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { PRIORITIES } from "../constants/priorities";
import { DashboardCharts } from "../components/DashboardCharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const Dashboard = () => {
  const { authorizationToken } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/analytics/summary`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      setAnalytics(data);
      toast.success("Dashboard refreshed!");
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError(error.message);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorizationToken) {
      fetchAnalytics();
    }
  }, [authorizationToken]);

  if (loading) return <h1 className="main-heading">Loading Dashboard...</h1>;

  if (error) return <h1 className="main-heading">Error: {error}</h1>;

  if (!analytics) return <h1 className="main-heading">No analytics data available yet. Create some tickets first!</h1>;

  return (
    <section className="section-dashboard">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1 className="main-heading">📊 Dashboard</h1>
          <button 
            onClick={fetchAnalytics}
            style={{
              padding: "0.8rem 1.5rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontSize: "1.4rem",
              fontWeight: "bold",
              transition: "background 0.3s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#2563eb"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#3b82f6"}
          >
            🔄 Refresh
          </button>
        </div>

        <div className="dashboard-grid">
            {/* Status Summary - Clear Breakdown - ONLY ONE */}
            <div style={{ gridColumn: "1 / -1", padding: "2rem", backgroundColor: "#1e293b", borderRadius: "0.5rem", marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "#60a5fa" }}>📋 Ticket Status Breakdown</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", minWidth: "100%" }}>
                <div style={{ padding: "1.5rem", backgroundColor: "#0f172a", borderRadius: "0.5rem", borderLeft: "4px solid #3b82f6", textAlign: "center" }}>
                  <p style={{ fontSize: "1.2rem", color: "#94a3b8", margin: "0 0 0.5rem 0" }}>📊 Total</p>
                  <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#60a5fa", margin: 0 }}>{analytics.totalTickets}</p>
                </div>
                <div style={{ padding: "1.5rem", backgroundColor: "#0f172a", borderRadius: "0.5rem", borderLeft: "4px solid #10b981", textAlign: "center" }}>
                  <p style={{ fontSize: "1.2rem", color: "#94a3b8", margin: "0 0 0.5rem 0" }}>✅ Resolved</p>
                  <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#10b981", margin: 0 }}>{analytics.statusDistribution.Closed}</p>
                </div>
                <div style={{ padding: "1.5rem", backgroundColor: "#0f172a", borderRadius: "0.5rem", borderLeft: "4px solid #f97316", textAlign: "center" }}>
                  <p style={{ fontSize: "1.2rem", color: "#94a3b8", margin: "0 0 0.5rem 0" }}>⏳ Progress</p>
                  <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#f97316", margin: 0 }}>{analytics.statusDistribution['In-Progress']}</p>
                </div>
                <div style={{ padding: "1.5rem", backgroundColor: "#0f172a", borderRadius: "0.5rem", borderLeft: "4px solid #ef4444", textAlign: "center" }}>
                  <p style={{ fontSize: "1.2rem", color: "#94a3b8", margin: "0 0 0.5rem 0" }}>🔴 Open</p>
                  <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#ef4444", margin: 0 }}>{analytics.statusDistribution.Open}</p>
                </div>
              </div>
            </div>

            {/* Performance Metrics - TWO CARDS ONLY */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", gridColumn: "1 / -1" }}>
              <div className="metric-card">
                <h3>📈 Avg Resolution Time</h3>
                <p className="metric-value">{analytics.averageResolutionTime.toFixed(2)} hrs</p>
              </div>
              <div className="metric-card">
                <h3>✅ SLA Compliance Rate</h3>
                <p className="metric-value">{analytics.slaComplianceRate.toFixed(1)}%</p>
              </div>
            </div>

            {/* Visual Charts Component */}
            <div style={{ gridColumn: "1 / -1", marginTop: "2rem" }}>
              {analytics && <DashboardCharts data={analytics} />}
            </div>
          </div>
      </div>

      <style>{`
        .section-dashboard {
          padding: 12rem 2rem 6rem 2rem;
          background: #0f172a;
          min-height: 100vh;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-top: 2rem;
        }

        .metric-card {
          background: #1e293b;
          padding: 1.5rem;
          border-radius: 0.5rem;
          border-left: 4px solid #10b981;
          color: white;
        }

        .metric-card h3 {
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: bold;
          margin: 0;
        }

        .chart-container {
          background: #1e293b;
          padding: 1.5rem;
          border-radius: 0.5rem;
          color: white;
        }

        .chart-container h3 {
          margin-top: 0;
        }

        .priority-bars {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .priority-bar {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </section>
  );
};
