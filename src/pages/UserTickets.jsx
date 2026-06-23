import { useEffect, useState } from "react";
import { useAuth } from "../store/auth"; 
import { toast } from "react-toastify";
import { PRIORITIES } from "../constants/priorities";

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_COLORS = {
  "Open": "#ef4444",
  "In-Progress": "#f97316",
  "Closed": "#10b981",
};

export const UserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authorizationToken } = useAuth();

  const getTickets = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/tickets/user`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tickets: ${response.status}`);
      }

      const data = await response.json();
      setTickets(data || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setError(error.message);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorizationToken) {
      getTickets();
    } else {
      setLoading(false);
    }
  }, [authorizationToken]);

  if (loading) return <h1 className="main-heading">Loading...</h1>;

  return (
    <section className="section-tickets">
      <div className="container tickets-layout-container">
        <h1 className="main-heading font-heading">My Support Tickets</h1>
        {error && <p style={{ color: "red", padding: "1rem", backgroundColor: "#ffe5e5", borderRadius: "0.5rem", marginBottom: "1rem" }}>{error}</p>}
        
        {tickets.length > 0 ? (
          <div className="table-responsive-wrapper">
            <table className="desktop-tickets-table">
              <thead>
                <tr style={{ background: "#334155" }}>
                  <th style={{ padding: "1.8rem", textAlign: "left", fontSize: "1.8rem" }}>Ticket #</th>
                  <th style={{ padding: "1.8rem", textAlign: "left", fontSize: "1.8rem" }}>Issue</th>
                  <th style={{ padding: "1.8rem", textAlign: "left", fontSize: "1.8rem" }}>Category</th>
                  <th style={{ padding: "1.8rem", textAlign: "left", fontSize: "1.8rem" }}>Priority</th>
                  <th style={{ padding: "1.8rem", textAlign: "left", fontSize: "1.8rem" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => {
                  const priority = PRIORITIES[ticket.priority] || PRIORITIES.P3;
                  return (
                    <tr key={ticket._id} className="table-data-row">
                      <td 
                        className="td-ticket-id"
                        style={{ cursor: "help" }} 
                        title={ticket.aiSummary ? `Summary: ${ticket.aiSummary}` : "Summary: Not Provided"}
                        data-label="Ticket #"
                      >
                        #{ticket._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="td-ticket-title" data-label="Issue">{ticket.title}</td>
                      <td className="td-ticket-category" data-label="Category">{ticket.aiCategory || ticket.category || "General"}</td>
                      <td className="td-ticket-priority" data-label="Priority">
                        <span style={{ 
                          padding: "0.5rem 0.75rem", 
                          borderRadius: "0.25rem",
                          fontWeight: "bold",
                          backgroundColor: priority.bgColor,
                          color: priority.color
                        }}>
                          {ticket.priority || "P3"}
                        </span>
                      </td>
                      <td className="td-ticket-status" data-label="Status">
                        <span className="badge" style={{ backgroundColor: STATUS_COLORS[ticket.status] || STATUS_COLORS.Open, padding: "0.7rem 1.2rem", borderRadius: "0.25rem" }}>
                          {ticket.status || "Open"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: "white", marginTop: "2rem", fontSize: "1.6rem" }}>No tickets found. Ask the AI assistant to open one!</p>
        )}
      </div>

      <style>{`
        .section-tickets {
          background: #0f172a;
          min-height: calc(100vh - 180px);
          padding: 12rem 0 6rem 0;
          color: white;
          display: flex;
          flex-direction: column;
        }

        .tickets-layout-container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 2rem;
          flex-grow: 1;
          width: 100%;
        }

        .font-heading {
          font-size: 3.5rem;
          margin-bottom: 3rem;
        }

        .table-responsive-wrapper {
          width: 100%;
        }

        .desktop-tickets-table {
          width: 100%;
          marginTop: 2rem;
          border-collapse: collapse;
          color: white;
        }

        .table-data-row {
          border-bottom: 1px solid #475569;
          transition: background 0.3s;
        }

        .table-data-row:hover {
          background: #1e293b;
        }

        .desktop-tickets-table td {
          padding: 2rem 1.8rem;
          font-size: 1.6rem;
        }

        .desktop-tickets-table td.td-ticket-id {
          font-size: 1.4rem;
          color: #94a3b8;
        }

        /* 📱 PHONE CRITICAL RESPONSIVENESS CAPABILITIES (100% WIDTH BREAKDOWN CARD STACK) */
        @media (max-width: 768px) {
          .section-tickets {
            padding: 8rem 0 4rem 0;
          }

          .tickets-layout-container {
            padding: 0 1rem;
          }

          .font-heading {
            font-size: 2.8rem;
            margin-bottom: 2rem;
          }

          /* Force table element blocks to stop acting like standard columns */
          .desktop-tickets-table, 
          .desktop-tickets-table thead, 
          .desktop-tickets-table tbody, 
          .desktop-tickets-table th, 
          .desktop-tickets-table td, 
          .desktop-tickets-table tr { 
            display: block; 
          }

          /* Hide the flat table header text completely */
          .desktop-tickets-table thead tr { 
            position: absolute;
            top: -9999px;
            left: -9999px;
          }

          .table-data-row {
            background: #1e293b;
            margin-bottom: 1.5rem;
            border-radius: 0.6rem;
            padding: 1rem;
            border: 1px solid #334155;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }

          .table-data-row:hover {
            background: #1e293b; /* Maintain unified color on phone focus touch */
          }

          .desktop-tickets-table td { 
            /* Make cells behave like custom pseudo inline-rows */
            border: none;
            position: relative;
            padding: 0.8rem 0.5rem 0.8rem 45% !important; 
            text-align: right;
            font-size: 1.4rem !important;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            width: 100%;
          }

          /* Inject custom header label strings dynamically into the phone screen cards */
          .desktop-tickets-table td:before { 
            position: absolute;
            top: 50%;
            left: 1rem;
            transform: translateY(-50%);
            width: 40%; 
            padding-right: 10px; 
            white-space: nowrap;
            text-align: left;
            font-weight: bold;
            color: #94a3b8;
            content: attr(data-label);
          }

          .td-ticket-priority, .td-ticket-status {
            padding-top: 1rem !important;
            padding-bottom: 1rem !important;
          }
        }
      `}</style>
    </section>
  );
};