AI-Powered Helpdesk & Ticketing System - Client UI

This is the client-side user interface for the AI-Powered Helpdesk System. It provides an intuitive, responsive interface for customers to submit tickets, an AI chatbot for immediate triage, and comprehensive dashboards for support agents and administrators.

Looking for the backend API repo? [Click here to view the Backend Repository](https://github.com/DILANSHIJAIN/Project-frontend).

---

## 🖥️ Frontend Features

* **Ticket Dashboard:** A clean UI for support agents to view, filter, update, and manage incoming customer service queries.
* **Chat Interface:** Real-time conversational interface providing automated initial assistance and issue triage powered by open-source LLMs.
* **Admin Panel:** Administrative controls over system configurations, active tickets, and team privileges.
* **Analytics Dashboard:** Metrics visualization showing resolution tracking, active queue loads, and system-wide performance.

---

## 🛠️ Tech Stack

* **Framework:** React
* **Styling:** [e.g., Tailwind CSS / Bootstrap]
* **State Management / HTTP Client:** [ Context API, Axios]

---

## ⚙️ Getting Started

### Prerequisites
* Node.js (v18+ recommended)
* Running backend instance (see backend repository configuration)

### Installation & Setup

1. **Clone the frontend repository:**
   ```bash
   git clone [https://github.com/DILANSHIJAIN/Project-frontend.git](https://github.com/DILANSHIJAIN/Project-frontend.git)
   cd Project-frontend
Configure Environment Variables (Optional):
If you use a environment configuration file to point to your backend API gateway, create a .env file in the frontend root:

Code snippet
REACT_APP_API_URL=http://localhost:5000
Install Dependencies:

Bash
npm install
Start Development Server:

Bash
npm start
The application will open automatically on http://localhost:3000.

🎓 Learning Outcomes Achieved
Dashboard Development: Formulated complex UI components mapping backend states, status arrays, and dynamic metrics summaries.

State Management & API Consumption: Mastered lifecycle hooks and promise resolutions to elegantly sync state between the client views and asynchronous server routes.

Role-Based Views: Structured UI routers to conditionally hide or render navigation panels depending on the user's logged-in authentication tier (Admin/Agent/Customer).
