import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { PRIORITIES } from "../constants/priorities";
import { DashboardCharts } from "../components/DashboardCharts";

const API_URL = import.meta.env.VITE_API_URL;

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
        <div className="dashboard-header-row">
          <h1 className="main-heading" style={{ margin: 0 }}>📊 Dashboard</h1>
          <button 
            onClick={fetchAnalytics}
            className="btn-refresh-dashboard"
          >
            🔄 Refresh
          </button>
        </div>

        <div className="dashboard-grid">
          {/* Status Summary - Clear Breakdown */}
          <div className="status-breakdown-panel">
            <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "#60a5fa" }}>📋 Ticket Status Breakdown</h2>
            <div className="status-cards-row">
              <div className="status-pill-card pill-total">
                <p className="pill-title">📊 Total</p>
                <p className="pill-count count-total">{analytics.totalTickets}</p>
              </div>
              <div className="status-pill-card pill-resolved">
                <p className="pill-title">✅ Resolved</p>
                <p className="pill-count count-resolved">{analytics.statusDistribution.Closed}</p>
              </div>
              <div className="status-pill-card pill-progress">
                <p className="pill-title">⏳ Progress</p>
                <p className="pill-count count-progress">{analytics.statusDistribution['In-Progress']}</p>
              </div>
              <div className="status-pill-card pill-open">
                <p className="pill-title">🔴 Open</p>
                <p className="pill-count count-open">{analytics.statusDistribution.Open}</p>
              </div>
            </div>
          </div>

          {/* Performance Metrics Rows */}
          <div className="performance-metrics-grid">
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
          <div style={{ gridColumn: "1 / -1", marginTop: "2rem", width: "100%", overflowX: "auto" }}>
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

        .dashboard-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          gap: 1.5rem;
        }

        .btn-refresh-dashboard {
          padding: 0.8rem 1.5rem;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 1.4rem;
          font-weight: bold;
          transition: background 0.3s;
          white-space: nowrap;
        }

        .btn-refresh-dashboard:hover {
          background-color: #2563eb;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-top: 2rem;
        }

        .status-breakdown-panel {
          grid-column: 1 / -1;
          padding: 2rem;
          background-color: #1e293b;
          border-radius: 0.5rem;
          margin-bottom: 2rem;
        }

        .status-cards-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          width: 100%;
        }

        .status-pill-card {
          padding: 1.5rem;
          background-color: #0f172a;
          border-radius: 0.5rem;
          text-align: center;
        }

        .pill-total { border-left: 4px solid #3b82f6; }
        .pill-resolved { border-left: 4px solid #10b981; }
        .pill-progress { border-left: 4px solid #f97316; }
        .pill-open { border-left: 4px solid #ef4444; }

        .pill-title {
          font-size: 1.2rem;
          color: #94a3b8;
          margin: 0 0 0.5rem 0;
        }

        .pill-count {
          font-size: 2.5rem;
          font-weight: bold;
          margin: 0;
        }

        .count-total { color: #60a5fa; }
        .count-resolved { color: #10b981; }
        .count-progress { color: #f97316; }
        .count-open { color: #ef4444; }

        .performance-metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          grid-column: 1 / -1;
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

        /* 📱 MOBILE RESPONSIVENESS BREAKPOINTS (100% MATCH ON PHONES) */
        @media (max-width: 768px) {
          .section-dashboard {
            padding: 8rem 1rem 4rem 1rem;
          }

          .dashboard-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .btn-refresh-dashboard {
            width: 100%;
            text-align: center;
          }

          .status-cards-row {
            grid-template-columns: repeat(2, 1fr); /* 2x2 grid layout balance on medium devices */
            gap: 1rem;
          }
          
          .performance-metrics-grid {
            grid-template-columns: 1fr; /* Stacks column parameters sequentially vertically */
            gap: 1rem;
          }
        }

        @media (max-width: 480px) {
          .status-cards-row {
            grid-template-columns: 1fr; /* Fluid 100% stack layout block on narrow phone displays */
            gap: 0.8rem;
          }
          
          .status-breakdown-panel {
            padding: 1.2rem;
          }

          .pill-count {
            font-size: 2rem;
          }
        }
      `}</style>
    </section>
  );
};