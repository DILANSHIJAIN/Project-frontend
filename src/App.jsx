// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home"; // Ensure this is the correct path
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Service } from "./pages/Service";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Navbar } from "./components/Navbar";
import { AdminUsers } from "./pages/AdminUsers";
import { Footer } from "./components/Footer";  // 
import { Error } from "./pages/Error";
import { Logout } from "./pages/Logout";

// Import your new feature pages here (Ensure these files exist)
import { Chat } from "./pages/Chat";
import { Dashboard } from "./pages/Dashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserTickets } from "./pages/UserTickets";
import { AdminContact } from "./pages/AdminContact"; // Import AdminContact
import { AdminHome } from "./pages/AdminHome"; // Import AdminHome
import { AdminAbout } from "./pages/AdminAbout"; // Import AdminAbout
import { ServiceDetails } from "./pages/ServiceDetails";
import { ForgotPassword } from "./pages/ForgotPassword.jsx";
import { ResetPassword } from "./pages/ResetPassword.jsx";

const App = () => {
  return ( 
    <>
      <BrowserRouter>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Navbar />

          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<Service />} />
              <Route path="/services/:id" element={<ServiceDetails />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/admin" element={<AdminUsers />} />
              
              {/* New Feature Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/admin/contact" element={<AdminContact />} /> {/* Admin Contact Page Editor */}
              <Route path="/admin/home" element={<AdminHome />} /> {/* Admin Home Page Editor */}
              <Route path="/admin/about" element={<AdminAbout />} /> {/* Admin About Page Editor */}
              <Route path="/tickets" element={<UserTickets />} />
              
              <Route path="*" element={<Error />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;