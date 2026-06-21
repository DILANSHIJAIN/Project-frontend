import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export const AdminDashboard = () => {
  const { authorizationToken, isAdmin, isLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");

  const deleteItem = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    let endpoint = "";
    if (type === "user") endpoint = `admin/users/delete/${id}`;
    else if (type === "contact") endpoint = `admin/contacts/delete/${id}`;
    else if (type === "ticket") endpoint = `tickets/${id}`;
    else if (type === "service") endpoint = `admin/services/delete/${id}`;

    try {
      const response = await fetch(`${API_URL}/api/${endpoint}`, {
        method: "DELETE",
        headers: { Authorization: authorizationToken },
      });
      if (response.ok) {
        toast.success(`${type} deleted successfully`);
        fetchData(); // Refresh data after deletion
      } else {
        const errData = await response.json();
        toast.error(errData.message || `Failed to delete ${type}`);
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Error deleting ${type}`);
    }
  };

  const toggleAdminRole = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({ 
          isAdmin: !currentStatus,
          role: !currentStatus ? ["user", "admin"] : ["user"]
        }),
      });
      if (response.ok) {
        toast.success("User role updated successfully");
        fetchData();
      } else {
        const errData = await response.json();
        toast.error(errData.message || "Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Error updating user role");
    }
  };

  const handleUserUpdate = async (user) => {
    const newName = window.prompt("Edit Username:", user.username);
    const newPhone = window.prompt("Edit Phone:", user.phone);
    if (!newName || !newPhone) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/users/update/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: authorizationToken },
        body: JSON.stringify({ username: newName, phone: newPhone }),
      });
      if (response.ok) {
        toast.success("User updated successfully");
        fetchData();
      } else {
        const contentType = response.headers.get("content-type");
        let errorMsg = "Update failed";
        if (contentType && contentType.includes("application/json")) {
          const errData = await response.json();
          errorMsg = errData.extraDetails || errData.message || errorMsg;
        } else {
          errorMsg = `Error ${response.status}: ${response.statusText}`;
        }
        toast.error(errorMsg);
      }
    } catch (error) {
      toast.error(`Update failed: ${error.message}`);
    }
  };

  const handleContactUpdate = async (contact) => {
    const newName = window.prompt("Edit Name:", contact.name);
    const newCategory = window.prompt("Edit Category:", contact.category);
    const newQuery = window.prompt("Edit Message:", contact.query);

    if (!newName || !newCategory || !newQuery) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/contacts/update/${contact._id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: authorizationToken 
        },
        body: JSON.stringify({ 
          name: newName,
          email: contact.email, 
          phone: contact.phone, 
          category: newCategory,
          query: newQuery
        }),
      });
      if (response.ok) {
        toast.success("Contact message updated successfully");
        fetchData();
      } else {
        const contentType = response.headers.get("content-type");
        let errorMsg = "Update failed";
        if (contentType && contentType.includes("application/json")) {
            const errData = await response.json();
            errorMsg = errData.extraDetails || errData.message || errorMsg;
        } else {
            errorMsg = `Error ${response.status}: ${response.statusText}`;
        }
        toast.error(errorMsg);
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleTicketUpdate = async (id, field, value) => {
    // Determine methods based on Express configuration mappings
    const isStatus = field === "status";
    const endpoint = isStatus ? `tickets/${id}/status` : `tickets/${id}/priority`;
    const httpMethod = isStatus ? "PATCH" : "PUT";
    
    try {
      const response = await fetch(`${API_URL}/api/${endpoint}`, {
        method: httpMethod,
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({ [field]: value }),
      });
      if (response.ok) {
        toast.success(`Ticket ${field} updated to ${value}`);
        fetchData(); 
      } else {
        const errData = await response.json();
        toast.error(errData.message || `Failed to update ticket ${field}`);
      }
    } catch (error) {
      console.error(`Error updating ticket ${field}:`, error);
      toast.error(`Error updating ticket ${field}`);
    }
  };

  const maskEmail = (email) => {
    if (!email || !email.includes("@")) return email;
    const [name, domain] = email.split("@");
    return `${name.substring(0, 2)}***@${domain}`;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === "users") {
        const response = await fetch(`${API_URL}/api/admin/users`, {
          headers: { Authorization: authorizationToken },
          cache: "no-store", 
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          setUsers([]);
        }
      } else if (activeTab === "tickets") {
        const response = await fetch(`${API_URL}/api/tickets`, {
          headers: { Authorization: authorizationToken },
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          setTickets(data);
        } else {
          setTickets([]);
        }
      } else if (activeTab === "contacts") {
        const response = await fetch(`${API_URL}/api/admin/contacts`, {
          method: "GET",
          headers: { Authorization: authorizationToken },
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          setContacts(data);
        } else {
          setContacts([]);
        }
      } else if (activeTab === "services") {
        const response = await fetch(`${API_URL}/api/admin/services`, {
          headers: { Authorization: authorizationToken },
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          setServicesList(data);
        } else {
          setServicesList([]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && isAdmin) {
      fetchData();
    }
  }, [activeTab, authorizationToken, isAdmin, isLoading]);

  if (isLoading) return <h1 className="main-heading">Verifying Admin Access...</h1>;

  if (!isAdmin) {
    return (
      <section style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        <h1>⛔ Access Denied</h1>
        <p>You do not have permission to access the admin dashboard.</p>
      </section>
    );
  }

  return (
    <section style={{ padding: "12rem 2rem 6rem 2rem", background: "#0f172a", minHeight: "100vh", color: "white" }}>
      <div className="container">
        <h1 className="main-heading">⚙️ Admin Dashboard</h1>
        
        {/* Quick Access Layout Links */}
        <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', margin: '2rem 0' }}>
            <div className="admin-card" style={{ padding: '20px', background: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
                <h2 style={{ fontSize: '1.8rem' }}>🏠 Home Page</h2>
                <p style={{ margin: '1rem 0', color: '#94a3b8' }}>Update hero text and titles for the landing page.</p>
                <NavLink to="/admin/home" className="btn">Edit Home</NavLink>
            </div>
            <div className="admin-card" style={{ padding: '20px', background: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
                <h2 style={{ fontSize: '1.8rem' }}>ℹ️ About Page</h2>
                <p style={{ margin: '1rem 0', color: '#94a3b8' }}>Update company mission and descriptions.</p>
                <NavLink to="/admin/about" className="btn">Edit About</NavLink>
            </div>
            <div className="admin-card" style={{ padding: '20px', background: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
                <h2 style={{ fontSize: '1.8rem' }}>📞 Contact Page</h2>
                <p style={{ margin: '1rem 0', color: '#94a3b8' }}>Update contact image and map embed URL.</p>
                <NavLink to="/admin/contact" className="btn">Edit Contact</NavLink>
            </div>
        </div>

        {/* Tabbed Board Navigation Menu */}
        <h2 style={{ borderTop: '1px solid #334155', paddingTop: '2rem' }}>Data Management Center</h2>

        <div style={{ marginBottom: "2rem", borderBottom: "2px solid #334155", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          <button onClick={() => setActiveTab("users")} style={{ padding: "1rem 2rem", backgroundColor: activeTab === "users" ? "#ef4444" : "transparent", color: "white", border: "none", borderRadius: "0.25rem", cursor: "pointer", fontSize: "1.4rem", fontWeight: "bold" }}>👥 Users ({users.length})</button>
          <button onClick={() => setActiveTab("tickets")} style={{ padding: "1rem 2rem", backgroundColor: activeTab === "tickets" ? "#10b981" : "transparent", color: "white", border: "none", borderRadius: "0.25rem", cursor: "pointer", fontSize: "1.4rem", fontWeight: "bold" }}>🎫 Tickets ({tickets.length})</button>
          <button onClick={() => setActiveTab("services")} style={{ padding: "1rem 2rem", backgroundColor: activeTab === "services" ? "#8b5cf6" : "transparent", color: "white", border: "none", borderRadius: "0.25rem", cursor: "pointer", fontSize: "1.4rem", fontWeight: "bold" }}>🛠️ Services ({servicesList.length})</button>
          <button onClick={() => setActiveTab("contacts")} style={{ padding: "1rem 2rem", backgroundColor: activeTab === "contacts" ? "#3b82f6" : "transparent", color: "white", border: "none", borderRadius: "0.25rem", cursor: "pointer", fontSize: "1.4rem", fontWeight: "bold" }}>📧 Contacts ({contacts.length})</button>
        </div>

        {loading ? (
          <p>Loading database entries...</p>
        ) : activeTab === "users" ? (
          <div>
            <h2>User Profile Matrix</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
              <thead>
                <tr style={{ background: "#334155" }}>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Username</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Email</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Phone</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Role</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: "1px solid #475569" }}>
                    <td style={{ padding: "1rem" }}>{u.username}</td>
                    <td style={{ padding: "1rem", cursor: "help" }} title={`Full Email: ${u.email || 'Not Provided'}`}>{maskEmail(u.email) || "Not Provided"}</td>
                    <td style={{ padding: "1rem" }}>{u.phone || "Not Provided"}</td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        onClick={() => toggleAdminRole(u._id, u.isAdmin)}
                        style={{ backgroundColor: u.isAdmin ? "#ef4444" : "#10b981", padding: "0.5rem 1rem", borderRadius: "0.25rem", color: "white", cursor: "pointer", fontWeight: "bold", fontSize: "1.2rem" }}
                      >
                        {u.isAdmin ? "Admin" : "User"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <button onClick={() => handleUserUpdate(u)} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", marginRight: "1rem", fontWeight: "bold" }}>✏️ Edit</button>
                      <button onClick={() => deleteItem("user", u._id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === "tickets" ? (
          <div>
            <h2>Global Live SLA Ticket Control Center</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
              <thead>
                <tr style={{ background: "#334155" }}>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Ticket #</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Issue Description</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Category</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>SLA Priority</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Live Status</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Created At</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => {
                  const statusColors = { "Open": "#ef4444", "In-Progress": "#f97316", "Closed": "#10b981" };
                  return (
                    <tr key={t._id} style={{ borderBottom: "1px solid #475569" }}>
                      <td style={{ padding: "1rem", fontSize: "1.2rem", color: "#94a3b8" }}>#{t._id.slice(-6).toUpperCase()}</td>
                      <td style={{ padding: "1rem" }}>
                        <div style={{ fontWeight: "bold", fontSize: "1.5rem" }}>{t.title}</div>
                        <div style={{ fontSize: "1.2rem", color: "#94a3b8" }}>By: {t.name} ({t.email})</div>
                        <div style={{ fontSize: "1.3rem", marginTop: "0.4rem", color: "#cbd5e1", fontStyle: "italic" }}>"{t.query}"</div>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{ background: "#475569", padding: "0.4rem 0.8rem", borderRadius: "0.4rem", fontSize: "1.2rem" }}>
                          {t.category || "Others"}
                        </span>
                      </td>
                      <td style={{ padding: "1rem" }}>
                         <select 
                            value={t.priority} 
                            onChange={(e) => handleTicketUpdate(t._id, "priority", e.target.value)}
                            style={{ background: "#1e293b", color: t.priority === 'P1' ? '#ef4444' : t.priority === 'P2' ? '#f97316' : '#fbbf24', border: "1px solid #4b5563", borderRadius: "0.25rem", padding: "0.5rem", fontWeight: "bold", cursor: "pointer" }}
                         >
                            <option value="P1">🔴 P1 (Critical)</option>
                            <option value="P2">🟠 P2 (High)</option>
                            <option value="P3">💛 P3 (Medium)</option>
                            <option value="P4">🟢 P4 (Low)</option>
                         </select>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <select 
                          value={t.status} 
                          onChange={(e) => handleTicketUpdate(t._id, "status", e.target.value)}
                          style={{ background: "#1e293b", color: statusColors[t.status] || "white", border: "1px solid #4b5563", borderRadius: "0.25rem", padding: "0.5rem", fontWeight: "bold", cursor: "pointer" }}
                        >
                          <option value="Open">🔴 Open</option>
                          <option value="In-Progress">🟠 In-Progress</option>
                          <option value="Closed">🟢 Closed</option>
                        </select>
                      </td>
                      <td style={{ padding: "1rem" }}>{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "N/A"}</td>
                      <td style={{ padding: "1rem" }}>
                        <button onClick={() => deleteItem("ticket", t._id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>🗑️ Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : activeTab === "services" ? (
          <div>
            <h2>Service Pricing & Rates Inventory Catalog</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginTop: "1.5rem" }}>
              {servicesList.map((s) => (
                <div key={s._id} style={{ background: "#1e293b", padding: "2rem", borderRadius: "0.8rem", border: "1px solid #334155" }}>
                  <h3 style={{ margin: 0, fontSize: "1.8rem", color: "white" }}>{s.service}</h3>
                  <p style={{ color: "#94a3b8", fontSize: "1.4rem", margin: "0.5rem 0" }}>Provider Branch: {s.provider}</p>
                  
                  {/* Inline Price Rate Form Field Input box updates automatically onBlur */}
                  <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ fontSize: "1.6rem", fontWeight: "bold", color: "var(--btn-color)" }}>Rate:</span>
                    <input 
                      type="text"
                      defaultValue={s.price}
                      onBlur={async (e) => {
                        const val = e.target.value;
                        if (val === s.price) return;
                        try {
                          const res = await fetch(`${API_URL}/api/admin/services/update/${s._id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json", Authorization: authorizationToken },
                            body: JSON.stringify({ price: val, description: s.description })
                          });
                          if (res.ok) toast.success(`Service pricing adjusted to ₹${val}!`);
                        } catch (err) { toast.error("Price change processing failed"); }
                      }}
                      style={{ width: "120px", padding: "0.5rem", borderRadius: "0.4rem", color: "black", fontWeight: "bold", fontSize: "1.5rem" }}
                    />
                  </div>
                  
                  <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                    <button onClick={() => deleteItem("service", s._id)} style={{ background: "#ef4444", border: "none", color: "white", padding: "0.6rem 1.2rem", borderRadius: "0.4rem", cursor: "pointer", fontWeight: "bold" }}>🗑️ Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2>Contact Feedback Submissions</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
              <thead>
                <tr style={{ background: "#334155" }}>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Name</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Email</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Category</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Message</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact._id} style={{ borderBottom: "1px solid #475569" }}>
                    <td style={{ padding: "1rem" }}>{contact.name}</td>
                    <td style={{ padding: "1rem" }}>{contact.email || "Not Provided"}</td>
                    <td style={{ padding: "1rem" }}>{contact.category || "General"}</td>
                    <td style={{ padding: "1rem" }}>{contact.query ? `${contact.query.substring(0, 50)}...` : "Not Provided"}</td>
                    <td style={{ padding: "1rem" }}>
                      <button onClick={() => handleContactUpdate(contact)} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", marginRight: "1rem", fontWeight: "bold" }}>✏️ Edit</button>
                      <button onClick={() => deleteItem("contact", contact._id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};