import { useState, useEffect, useRef } from "react";
import { useAuth } from "../store/auth"; 
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Full list of categories from your project specs
const CATEGORIES = [
    "General", "Technical", "Billing", "Login & Authentication", 
    "Account Management", "Infrastructure", "Security", "Data & Database", 
    "Bug Report", "Service Request", "Performance Issues", "Complaint", 
    "Integration & API", "Printing", "Email & Collaboration", 
    "Feature Request", "Vehicle Maintenance", "Traffic & Logistics"
];

export const Chat = () => {
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const { user, authorizationToken, isLoading } = useAuth();
    const scrollRef = useRef(null);
    const [chatLog, setChatLog] = useState([]);

    // Set initial greeting once user data is available
    useEffect(() => {
        if (!isLoading && user && chatLog.length === 0) {
            setChatLog([
                { role: "bot", content: `Hello ${user.username}! I am your AI assistant. How can I help you with your tickets today?` }
            ]);
        }
    }, [user, isLoading, chatLog]);

    // Auto-scroll to the bottom whenever messages change
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatLog, isTyping]);

    const handleSendMessage = async (e) => { // This function initiates the ticket creation process
        e.preventDefault();
        if (!message.trim()) return;

        const userQuery = message;
        setChatLog((prev) => [...prev, { role: "user", content: userQuery }]);
        setMessage("");
        setIsTyping(true);

        try {
            const response = await fetch(`${API_URL}/api/tickets`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authorizationToken, // Send the token to the backend
                },
                body: JSON.stringify({
                    query: userQuery,
                    name: user?.username || "Guest",
                    email: user?.email || "anonymous@example.com",
                    phone: user?.phone || "0000000000",
                    title: "New AI Support Request"
                }),
            });

            const data = await response.json();
            setIsTyping(false);

            if (response.ok) {
                if (data.ticketSaved) {
                    setChatLog((prev) => [...prev, {
                        role: "bot",
                        content: `✅ **Ticket Created!** I've categorized this as **${data.ticket.category}**.`,
                        isTicket: true,
                        ticketId: data.ticket._id,
                        category: data.ticket.category
                    }]);
                } else {
                    setChatLog((prev) => [...prev, { role: "bot", content: data.aiResult }]);
                }
            } else {
                setChatLog((prev) => [...prev, { role: "bot", content: data.message || "Sorry, I couldn't process that ticket right now." }]);
            }
        } catch (error) {
            setIsTyping(false);
            console.error("Error creating ticket:", error);
            setChatLog((prev) => [...prev, { role: "bot", content: "An error occurred while connecting to the server." }]);
        }
    };

    const handleCategoryChange = async (ticketId, newCategory) => {
        try {
            const response = await fetch(`${API_URL}/api/tickets/${ticketId}/category`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authorizationToken,
                },
                body: JSON.stringify({ category: newCategory }),
            });

            if (response.ok) {
                toast.success(`Category updated to ${newCategory}`);
                // Update local chat log to show the change
                setChatLog(prev => prev.map(msg => 
                    msg.ticketId === ticketId ? { ...msg, category: newCategory } : msg
                ));
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to update category");
        }
    };

    if (isLoading) return <h1 className="main-heading">Loading Assistant...</h1>;

    return (
        <section className="section-chat" style={{ padding: "12rem 0 6rem 0", background: "#0f172a", minHeight: "100vh" }}>
            <div className="container">
                <h1 className="main-heading">AI Chat Assistant</h1>
                <div className="chat-window" style={{ 
                    background: "#1e293b", 
                    borderRadius: "1rem", 
                    padding: "2rem", 
                    marginTop: "2rem",
                    minHeight: "400px",
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <div className="chat-messages" style={{ flexGrow: 1, overflowY: "auto", marginBottom: "2rem", paddingRight: "1rem" }}>
                        {chatLog.map((chat, index) => (
                            <div key={index} style={{ 
                                marginBottom: "1rem", 
                                textAlign: chat.role === "user" ? "right" : "left" 
                            }}>
                                <div style={{ 
                                    display: "inline-block", 
                                    padding: "1rem", 
                                    borderRadius: "1rem", 
                                    background: chat.role === "user" ? "var(--btn-color)" : "#334155",
                                    maxWidth: "70%"
                                }}>
                                    <p style={{ margin: 0, fontSize: "1.6rem" }}>{chat.content}</p>
                                    
                                    {/* Category Correction Option */}
                                    {chat.isTicket && (
                                        <div style={{ marginTop: "1.5rem", borderTop: "1px solid #4b5563", paddingTop: "1rem" }}>
                                            <p style={{ fontSize: "1.2rem", color: "#94a3b8", marginBottom: "0.5rem" }}>Wrong category? Select the right one:</p>
                                            <select 
                                                value={chat.category}
                                                onChange={(e) => handleCategoryChange(chat.ticketId, e.target.value)}
                                                style={{ 
                                                    width: "100%", 
                                                    padding: "0.5rem", 
                                                    background: "#1e293b", 
                                                    color: "white", 
                                                    border: "1px solid #4b5563",
                                                    borderRadius: "0.4rem",
                                                    fontSize: "1.3rem"
                                                }}
                                            >
                                                {CATEGORIES.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{ textAlign: "left", marginBottom: "1rem" }}>
                                <div style={{ display: "inline-block", padding: "1rem", borderRadius: "1rem", background: "#334155", color: "#94a3b8", fontSize: "1.4rem" }}>
                                    AI is typing...
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                    <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "1rem" }}>
                        <input 
                            type="text" 
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Ask about your tickets..."
                            style={{ flexGrow: 1, padding: "1rem", borderRadius: "0.5rem", border: "none" }}
                        />
                        <button type="submit" className="btn">Send</button>
                    </form>
                </div>
            </div>
        </section>
    );
};