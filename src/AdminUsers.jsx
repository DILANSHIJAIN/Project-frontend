import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const { authorizationToken } = useAuth();

  const maskEmail = (email) => {
    if (!email || !email.includes("@")) return email;
    const [name, domain] = email.split("@");
    return `${name.substring(0, 2)}***@${domain}`;
  };

  const getAllUsersData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        toast.error(data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while fetching users");
    }
  };

  const toggleAdminStatus = async (id, currentStatus) => {
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
        getAllUsersData(); // Refresh list
      } else {
        const contentType = response.headers.get("content-type");
        let errorMsg = "Failed to update user";
        if (contentType && contentType.includes("application/json")) {
          const errData = await response.json();
          errorMsg = errData.extraDetails || errData.message || errorMsg;
        } else {
          errorMsg = `Server error ${response.status}: ${response.statusText}`;
        }
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error(error);
      toast.error(`Error updating user status: ${error.message}`);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(`${API_URL}/api/admin/users/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: authorizationToken,
        },
      });
      if (response.ok) {
        toast.success("User deleted successfully");
        getAllUsersData(); // Refresh the user list
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    }
  };

  useEffect(() => {
    getAllUsersData();
  }, []);

  return (
    <>
      <section className="admin-users-section">
        <div className="container">
          <NavLink to="/admin-dashboard" style={{ color: "var(--btn-color)", fontSize: "1.6rem", marginBottom: "2rem", display: "inline-block" }}>
            ← Back to Dashboard
          </NavLink>
          <h1 className="main-heading">Admin Users Data</h1>
        </div>
        <div className="container admin-users">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((curUser, index) => {
                return (
                  <tr key={curUser._id || index}>
                    <td>{curUser.username}</td>
                    <td>{maskEmail(curUser.email)}</td>
                    <td>{curUser.phone}</td>
                    <td>
                      <button 
                        className="btn" 
                        style={{ background: curUser.isAdmin ? "orange" : "green" }}
                        onClick={() => toggleAdminStatus(curUser._id, curUser.isAdmin)}
                      >
                        {curUser.isAdmin ? "Remove Admin" : "Make Admin"}
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn"
                        style={{ background: "red" }}
                        onClick={() => deleteUser(curUser._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};