import { useState, useEffect, useRef } from "react";
import { useAuth } from "../store/auth"; 
import { toast } from "react-toastify";
import { CATEGORY_GROUPS } from "../constants/categories";

const API_URL = import.meta.env.VITE_API_URL;

export const Chat = () => {
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isSearching, setIsSearching] = useState(false); 
    const [suggestions, setSuggestions] = useState([]); 
    const [isListening, setIsListening] = useState(false); 
    const [selectedCategory, setSelectedCategory] = useState(null); 
    const [inputError, setInputError] = useState(false); 
    const [selectedImages, setSelectedImages] = useState([]); 
    const { user, authorizationToken, isLoading } = useAuth();
    const scrollRef = useRef(null);
    const recognitionRef = useRef(null);
    const [chatLog, setChatLog] = useState([]);
    const [expandedGroup, setExpandedGroup] = useState(null); 
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedback, setFeedback] = useState({ rating: 0, helpful: null, comment: "" });
    const [chatClosed, setChatClosed] = useState(false);

    const renderContentWithLinks = (text) => {
        if (!text) return "";
        const pattern = /(https?:\/\/[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b)/g;
        const parts = text.split(pattern);
        
        return parts.map((part, i) => {
            if (part.match(/^https?:\/\//)) {
                return (
                    <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: "var(--btn-color)", textDecoration: "underline", wordBreak: "break-all", fontWeight: "bold" }}>
                        {part}
                    </a>
                );
            } else if (part.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
                return (
                    <a key={i} href={`mailto:${part}`} style={{ color: "var(--btn-color)", textDecoration: "underline", wordBreak: "break-all", fontWeight: "bold" }}>
                        {part}
                    </a>
                );
            } else if (part.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)) {
                // ✅ FIXED: Deep multi-token verification stops file path strings from generating fake call buttons
                const isFilePath = part.toLowerCase().match(/\.(png|jpg|jpeg|gif|webp)$/) || 
                                   text.toLowerCase().includes("uploads/" + part.toLowerCase()) ||
                                   text.toLowerCase().includes("uploads/ " + part.toLowerCase());

                if (isFilePath) {
                    return part; // Safely outputs raw text layout pathing
                }

                const cleanPhone = part.replace(/[-.\s()]/g, "");
                return (
                    <a key={i} href={`tel:${cleanPhone}`} style={{ color: "var(--btn-color)", textDecoration: "underline", wordBreak: "break-all", fontWeight: "bold" }}>
                        📞 {part}
                    </a>
                );
            }
            return part;
        });
    };

    const commonPrompts = ["Internet is slow", "My SIM has no signal", "How to change address?", "What is my ticket status?", "Billing issue", "Password reset"];

    const handleInputChange = (e) => {
        const val = e.target.value; 
        setMessage(val);
        setInputError(false); 
        const searchTerm = val.trim().toLowerCase(); 
        if (searchTerm.length > 0) { 
            const matches = commonPrompts.filter(p => p.toLowerCase().includes(searchTerm)); 
            setSuggestions(matches);
        } else {
            setSuggestions([]);
        }
    };

    const startVoiceRecognition = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            return;
        }
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return toast.error("Voice recognition not supported in this browser.");
        
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition; 
        recognition.interimResults = true; 
        recognition.continuous = true; 
        recognition.lang = "en-US"; 
        const initialMessageContent = message; 

        recognition.onstart = () => { setIsListening(true); };
        recognition.onresult = (event) => {
            let currentTranscript = '';
            for (let i = 0; i < event.results.length; ++i) { currentTranscript += event.results[i][0].transcript; }
            setMessage(initialMessageContent + (initialMessageContent && currentTranscript ? " " : "") + currentTranscript);
        };
        recognition.onerror = () => { setIsListening(false); };
        recognition.onend = () => { setIsListening(false); };
        try { recognition.start(); } catch (err) { setIsListening(false); }
    };

    const handleCategorySelection = (cat) => {
        setSelectedCategory(cat);
        
        const coreTemplateBlocks = [
            "Target Platform Name",
            "Exact Platform URL Link (e.g., https://site.com)",
            "External Platform Support Email ID",
            "Your Contact Handle (Email/Phone)"
        ];

        const checklists = {
            "Technical": [...coreTemplateBlocks, "Device/System Name", "Operating System", "Error Message", "When did the issue start?"],
            "Billing": [...coreTemplateBlocks, "Transaction ID", "Amount", "Date & Time", "Payment Method"],
            "Login & Authentication": [...coreTemplateBlocks, "Application Name", "Username/Email", "Error Message"],
            "Account Management": [...coreTemplateBlocks, "Account ID/Username", "Type of Request"],
            "Infrastructure": [...coreTemplateBlocks, "Infrastructure Type", "Location/Locality", "Severity"],
            "Security": [...coreTemplateBlocks, "Security Issue Type", "Unauthorized Access?", "Time of Incident"],
            "Data & Database": [...coreTemplateBlocks, "Database Name", "Affected Table/System", "Error Message"],
            "Bug Report": [...coreTemplateBlocks, "Application Name", "Module/Page", "Steps to Reproduce"],
            "Service Request": [...coreTemplateBlocks, "Service Required", "Requested Date", "Business Justification"],
            "Performance Issues": [...coreTemplateBlocks, "Application/System Name", "Performance Problem"],
            "Complaint": [...coreTemplateBlocks, "Complaint Against", "Department/Service", "Detailed Description"],
            "Integration & API": [...coreTemplateBlocks, "API Name", "Endpoint", "HTTP Method", "Error Code"],
            "Printing": [...coreTemplateBlocks, "Printer Name", "Printer Location", "Error Message"],
            "Email & Collaboration": [...coreTemplateBlocks, "Application (Outlook/Gmail)", "Issue Type", "Error Message"],
            "Feature Request": [...coreTemplateBlocks, "Feature Title", "Feature Description", "Business Purpose"],
            "Vehicle Maintenance": [...coreTemplateBlocks, "Vehicle Number", "Vehicle Type", "Issue Type", "Location"],
            "Traffic & Logistics": [...coreTemplateBlocks, "Shipment ID", "Location/Affected Area", "Issue Type"],
            "Food": [...coreTemplateBlocks, "Order ID", "Food Item Name", "Restaurant Name", "Photos (Min 2 REQUIRED)"],
            "Others": [...coreTemplateBlocks, "Detailed Parameter Description Log"],
            "default": [...coreTemplateBlocks, "Locality/Location", "Issue Description", "Date & Time"]
        };

        const items = checklists[cat] || checklists["default"];
        const formattedResponse = `Category: ${cat} ✅\n\nTo help our automated engines alert the target platform support systems immediately, please fill out the mandatory template field structure below:\n\n${items.map(item => `• ${item}`).join("\n")}\n\nOur service desk engine will monitor active SLA timelines once submitted!`;

        setChatLog((prev) => [...prev, 
            { role: "user", content: `${cat} category selected.`, timestamp: new Date().toISOString() },
            { role: "bot", content: formattedResponse, isInteractiveActionPrompt: true, timestamp: new Date().toISOString() }
        ]);
    };

    const handleFeedbackSubmit = () => {
        toast.success("Thank you for your feedback.");
        setChatClosed(true);
        setShowFeedback(false);
    };

    useEffect(() => {
        if (!isLoading && user && chatLog.length === 0) {
            setChatLog([
                { 
                    role: "bot", 
                    content: `Hello ${user.username}! I am your AI assistant. Please select the category that best matches your problem:`,
                    isCategorySelection: true,
                    timestamp: new Date().toISOString()
                }
            ]);
        }
    }, [user, isLoading, chatLog]);

    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatLog, isTyping]);

    const handleSendMessage = async (e, forceTicket = false, manualQuery = null) => {
        if (e) e.preventDefault();
        let finalQuery = manualQuery || message;
        if (chatClosed || (!finalQuery.trim() && selectedImages.length === 0)) {
            setInputError(true);
            return;
        }

        if (selectedCategory) {
            const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
            const urlPattern = /https?:\/\/[^\s)]+/;

            const hasEmail = emailPattern.test(finalQuery);
            const hasUrl = urlPattern.test(finalQuery);

            if (!hasUrl) {
                finalQuery += `\n• Auto-Extracted Platform URL Link: https://placeholder-system-route.com`;
            }
            if (!hasEmail) {
                finalQuery += `\n• Auto-Extracted External Support Email ID: ${user?.email || "support-desk@fallback.com"}`;
            }
        }

        const infoKeywords = ["how to", "what is", "why", "when", "where", "meaning", "guide"];
        if (infoKeywords.some(kw => finalQuery.toLowerCase().includes(kw))) setIsSearching(true);

        const userQuery = finalQuery || (selectedImages.length > 1 ? "Images Uploaded" : "Image Uploaded");
        const imagesToUpload = [...selectedImages]; 
        
        setMessage("");
        setSelectedImages([]);
        setSuggestions([]);
        setIsTyping(true);

        try {
            const uploadResults = await Promise.all(
                imagesToUpload.map(async (image) => {
                    try {
                        const formData = new FormData();
                        formData.append("image", image);

                        const uploadRes = await fetch(`${API_URL}/api/upload`, {
                            method: "POST",
                            headers: { "Authorization": authorizationToken },
                            body: formData,
                        });

                        if (uploadRes.ok) {
                            const uploadData = await uploadRes.json();
                            let rawPath = uploadData.filePath || uploadData.path;
                            if (!rawPath && uploadData.url) {
                                return uploadData.url;
                            }
                            return rawPath.startsWith('uploads/') ? rawPath : `uploads/${rawPath}`;
                        }
                    } catch (err) {
                        console.error("Image upload failed:", err);
                    }
                    return null;
                })
            );

            const uploadedUrls = uploadResults.filter(url => url !== null);
            let queryWithImages = userQuery;
            if (uploadedUrls.length > 0) {
                queryWithImages += ` (Attached Images: ${uploadedUrls.join(", ")})`;
            }

            const formattedImages = uploadedUrls.map(url => {
                if (url.startsWith('http')) return url;
                
                let cleanUrl = url.replace(/\\/g, '/').replace('uploads/', '').replace('images/', '');
                if (cleanUrl.startsWith('/')) cleanUrl = cleanUrl.substring(1);
                
                cleanUrl = cleanUrl.replace(/\/\/+/g, '/');
                return `${API_URL}/uploads/${cleanUrl}`;
            });

            const userMessage = { 
                role: "user", 
                content: userQuery, 
                aiContent: queryWithImages, 
                images: formattedImages,
                timestamp: new Date().toISOString()
            };

            setChatLog((prev) => [...prev, userMessage]);

            const response = await fetch(`${API_URL}/api/tickets`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": authorizationToken },
                body: JSON.stringify({
                    query: queryWithImages,
                    name: user?.username || "Guest",
                    email: user?.email || "anonymous@example.com",
                    phone: user?.phone || "0000000000",
                    title: "New AI Support Request",
                    forceTicket: forceTicket,
                    category: selectedCategory,
                    chatHistory: chatLog.map(msg => ({ role: msg.role === "bot" ? "assistant" : "user", content: msg.aiContent || msg.content }))
                }),
            });

            const data = await response.json();
            setIsTyping(false);
            setIsSearching(false);

            if (response.ok) {
                if (data.ticketSaved) {
                    setSelectedCategory(null);
                    
                    const priorityTimes = { P1: "1 Hour", P2: "4 Hours", P3: "1 Day", P4: "5 Days" };
                    const waitTime = priorityTimes[data.ticket.priority] || "1 Day";
                    const targetDate = new Date();
                    if (data.ticket.priority === "P1") targetDate.setHours(targetDate.getHours() + 1);
                    else if (data.ticket.priority === "P2") targetDate.setHours(targetDate.getHours() + 4);
                    else if (data.ticket.priority === "P3") targetDate.setDate(targetDate.getDate() + 1);
                    else targetDate.setDate(targetDate.getDate() + 5);

                    const formattedDeadline = targetDate.toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });

                    setChatLog((prev) => [...prev, {
                        role: "bot",
                        content: `🎉 ${data.aiResult}\n\n⏱️ **Estimated Wait Time:** Your issue has been classified as **${data.ticket.priority}**. We typically resolve this tier within **${waitTime}**.\n📅 **Target Resolution Target:** ${formattedDeadline} approx.`,
                        isTicket: true,
                        ticketId: data.ticket._id,
                        category: data.ticket.category,
                        priority: data.ticket.priority,
                        timestamp: new Date().toISOString()
                    }]);
                    setTimeout(() => setShowFeedback(true), 1500);
                } else {
                    setChatLog((prev) => [...prev, { role: "bot", content: data.aiResult, isInteractiveActionPrompt: true, timestamp: new Date().toISOString() }]);
                }
            }
        } catch (error) {
            setIsTyping(false);
            setIsSearching(false);
        }
    };

    const handleCategoryChange = async (ticketId, newCategory) => {
        try {
            const response = await fetch(`${API_URL}/api/tickets/${ticketId}/category`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "Authorization": authorizationToken },
                body: JSON.stringify({ category: newCategory }),
            });
            if (response.ok) {
                toast.success(`Category adjusted to ${newCategory}`);
                setChatLog(prev => prev.map(msg => msg.ticketId === ticketId ? { ...msg, category: newCategory } : msg));
            }
        } catch (error) { toast.error("Failed to re-route category"); }
    };

    const removeSelectedImage = (indexToRemove) => {
        setSelectedImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    if (isLoading) return <h1 className="main-heading">Loading Assistant...</h1>;

    return (
        <section className="section-chat">
            <div className="container chat-layout-container">
                <h1 className="main-heading">AI Chat Assistant</h1>
                <div className="chat-window">
                    <div className="chat-messages">
                        {chatLog.map((chat, index) => (
                            <div key={index} className={`message-row ${chat.role === "user" ? "user-row" : "bot-row"}`}>
                                <div className={`message-bubble ${chat.role === "user" ? "user-bubble" : "bot-bubble"}`}>
                                    {chat.images && chat.images.map((imgUrl, idx) => (
                                        <img key={idx} src={imgUrl} alt="Attachment" style={{ maxWidth: "240px", width: "100%", height: "auto", borderRadius: "0.5rem", marginBottom: "0.8rem", display: "block", border: "1px solid #475569" }} />
                                    ))}
                                    <p style={{ margin: 0, fontSize: "1.6rem" }}>{renderContentWithLinks(chat.content)}</p>
                                    
                                    {chat.isCategorySelection && (
                                        <div className="category-selection-wrapper">
                                            {Object.entries(CATEGORY_GROUPS).map(([groupName, group]) => {
                                                const isExpanded = expandedGroup === groupName;
                                                return (
                                                    <div key={groupName} className="accordion-group">
                                                        <button type="button" className={`accordion-trigger ${isExpanded ? 'active' : ''}`} onClick={() => setExpandedGroup(isExpanded ? null : groupName)}>
                                                            <span>{group.icon} {groupName}</span>
                                                            <span style={{ marginLeft: "auto" }}>{isExpanded ? "▲" : "▼"}</span>
                                                        </button>
                                                        {isExpanded && (
                                                            <div className="accordion-content">
                                                                {group.items.map(cat => (
                                                                    <button key={cat} onClick={() => { handleCategorySelection(cat); setExpandedGroup(null); }} className="category-item-btn">📄 {cat}</button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                            <div style={{ borderTop: "1px dashed #4b5563", paddingTop: "1rem" }}>
                                                <button type="button" onClick={() => { handleCategorySelection("Others"); setExpandedGroup(null); }} className="category-others-btn">❓ Can't find your category? Choose Others</button>
                                            </div>
                                        </div>
                                    )}

                                    {chat.isInteractiveActionPrompt && (
                                        <div className="interactive-prompt-row">
                                            <button 
                                                onClick={(e) => {
                                                    setChatLog((prev) => [...prev, { role: "user", content: "Continue Troubleshooting Steps", timestamp: new Date().toISOString() }]);
                                                    toast.info("Continuing guidance procedures...");
                                                    handleSendMessage(e, false, "Provide me with the next troubleshooting steps to resolve this case configuration manually.");
                                                }}
                                                className="action-btn continue-btn"
                                            >
                                                🔍 Continue Troubleshooting Steps
                                            </button>
                                            <button 
                                                onClick={() => handleSendMessage(null, true, "Please force create a support ticket for my issue.")}
                                                className="action-btn ticket-btn"
                                            >
                                                🎫 Create Support Ticket
                                            </button>
                                        </div>
                                    )}

                                    {chat.isTicket && (
                                        <div style={{ marginTop: "1.5rem", borderTop: "1px solid #4b5563", paddingTop: "1rem" }}>
                                            <p style={{ fontSize: "1.2rem", color: "#94a3b8" }}>Change Ticket Category:</p>
                                            <select value={chat.category || ""} onChange={(e) => handleCategoryChange(chat.ticketId, e.target.value)} style={{ width: "100%", padding: "0.8rem", background: "#1e293b", color: "white", border: "1px solid #4b5563", borderRadius: "0.4rem", fontSize: "1.4rem" }}>
                                                {Object.entries(CATEGORY_GROUPS).map(([gName, g]) => (
                                                    <optgroup key={gName} label={gName}>
                                                        {g.items.map(c => <option key={c} value={c}>{c}</option>)}
                                                    </optgroup>
                                                ))}
                                                <option value="Others">Others</option>
                                            </select>
                                        </div>
                                    )}

                                    {showFeedback && index === chatLog.length - 1 && (
                                        <div className="feedback-container">
                                            <p style={{ fontSize: "1.6rem", fontWeight: "bold", marginBottom: "1rem" }}>How would you rate your experience?</p>
                                            <div style={{ display: "flex", gap: "0.5rem", fontSize: "2.5rem", marginBottom: "1.5rem" }}>
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <span key={star} onClick={() => setFeedback({ ...feedback, rating: star })} style={{ cursor: "pointer", color: star <= feedback.rating ? "#fbbf24" : "#4b5563" }}>★</span>
                                                ))}
                                            </div>
                                            <textarea 
                                                placeholder="Additional comments (optional)" 
                                                value={feedback.comment}
                                                onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                                                style={{ width: "100%", padding: "1rem", borderRadius: "0.5rem", background: "#0f172a", border: "1px solid #334155", color: "white", marginBottom: "1rem", fontSize: "1.4rem" }}
                                            />
                                            <button onClick={handleFeedbackSubmit} className="btn" style={{ width: "100%" }}>Submit Feedback</button>
                                        </div>
                                    )}

                                    {chatClosed && index === chatLog.length - 1 && (
                                        <p style={{ marginTop: "1rem", fontSize: "1.4rem", color: "#94a3b8", fontStyle: "italic" }}>Chat Closed.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isListening && (
                            <div className="message-row user-row">
                                <div className="listening-indicator">🎤 Listening...</div>
                            </div>
                        )}
                        {isSearching && (
                            <div className="message-row bot-row">
                                <div className="searching-indicator">🌐 Searching Google for answers...</div>
                            </div>
                        )}
                        {isTyping && (
                            <div className="message-row bot-row">
                                <div className="typing-indicator">AI is typing...</div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                    
                    <div className="chat-input-container">
                        {selectedImages.length > 0 && (
                            <div className="attachment-preview-bar">
                                {selectedImages.map((file, idx) => (
                                    <div key={idx} className="preview-thumbnail-wrapper">
                                        <img src={URL.createObjectURL(file)} alt="Preview thumbnail" className="thumbnail-img" />
                                        <button type="button" onClick={() => removeSelectedImage(idx)} className="remove-thumbnail-btn">×</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {suggestions.length > 0 && (
                            <div className="suggestions-box">
                                {suggestions.map((s, i) => (
                                    <div key={i} onClick={() => { setMessage(s); setSuggestions([]); }} className="suggestion-item">{s}</div>
                                ))}
                            </div>
                        )}
                        <form onSubmit={handleSendMessage} className="chat-input-form">
                            <div className="input-actions-wrapper">
                                <label className="action-icon-label">
                                    📷
                                    <input 
                                        type="file" 
                                        hidden 
                                        multiple 
                                        accept="image/*" 
                                        onClick={(e) => { e.target.value = null; }}
                                        onChange={(e) => {
                                            if (e.target.files.length > 0) {
                                                setSelectedImages(prev => [...prev, ...Array.from(e.target.files)]);
                                                toast.success(`Successfully added ${e.target.files.length} attachment(s) to template queue.`);
                                            }
                                        }} 
                                    />
                                </label>
                                
                                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                    <button 
                                        type="button" 
                                        onClick={startVoiceRecognition} 
                                        className="voice-toggle-btn"
                                        style={{ color: isListening ? "#cc0000" : "inherit" }}
                                    >
                                        {isListening ? "🛑" : "🎤"}
                                    </button>
                                    {isListening && <span className="pulse-ring"></span>}
                                </div>
                            </div>
                            
                            <input 
                                type="text" 
                                value={message} 
                                onChange={handleInputChange}
                                placeholder={chatClosed ? "Conversation ended." : "Ask about your tickets..."}
                                disabled={chatClosed}
                                className="main-chat-input"
                                style={{ opacity: chatClosed ? 0.6 : 1 }}
                            />
                            <button type="submit" className="btn submit-chat-btn" disabled={chatClosed}>Send</button>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                .section-chat {
                    padding: 12rem 0 6rem 0;
                    background: #0f172a;
                    min-height: 100vh;
                }

                .chat-layout-container {
                    padding: 0 2rem;
                }

                .chat-window {
                    background: #1e293b;
                    border-radius: 1rem;
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    height: 70vh;
                    min-height: 480px;
                }

                .chat-messages {
                    flex-grow: 1;
                    overflow-y: auto;
                    margin-bottom: 2rem;
                    padding-right: 0.5rem;
                }

                .message-row {
                    display: flex;
                    width: 100%;
                    margin-bottom: 1.5rem;
                }

                .user-row { justify-content: flex-end; }
                .bot-row { justify-content: flex-start; }

                .message-bubble {
                    padding: 1.2rem 1.6rem;
                    border-radius: 1rem;
                    max-width: 75%;
                    white-space: pre-wrap;
                    word-break: break-word;
                }

                .user-bubble {
                    background: var(--btn-color, #3b82f6);
                    color: white;
                    border-bottom-right-radius: 0.2rem;
                }

                .bot-bubble {
                    background: #334155;
                    color: white;
                    border-bottom-left-radius: 0.2rem;
                }

                .category-selection-wrapper {
                    margin-top: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    width: 100%;
                    width: 320px;
                    max-width: 100%;
                }

                .accordion-group {
                    background: #2d3748;
                    border-radius: 0.6rem;
                    overflow: hidden;
                    border: 1px solid #475569;
                }

                .accordion-trigger {
                    width: 100%;
                    padding: 1.2rem 1.5rem;
                    background: #1e293b;
                    color: white;
                    border: none;
                    text-align: left;
                    font-size: 1.5rem;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                }

                .accordion-trigger.active {
                    background: var(--btn-color, #3b82f6);
                    color: black;
                }

                .accordion-content {
                    padding: 0.8rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.6rem;
                    background: #1e293b;
                }

                .category-item-btn {
                    padding: 1rem;
                    font-size: 1.3rem;
                    border-radius: 0.4rem;
                    background: white;
                    border: none;
                    color: black;
                    text-align: left;
                    font-weight: 700;
                    cursor: pointer;
                }

                .category-others-btn {
                    width: 100%;
                    padding: 1.2rem 1.5rem;
                    background: var(--btn-color, #3b82f6);
                    color: black;
                    border: none;
                    border-radius: 0.6rem;
                    font-size: 1.5rem;
                    font-weight: bold;
                    cursor: pointer;
                }

                .interactive-prompt-row {
                    margin-top: 1.2rem;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.8rem;
                    padding: 0.5rem;
                }

                .action-btn {
                    padding: 0.8rem 1.4rem;
                    border: none;
                    border-radius: 0.4rem;
                    font-weight: bold;
                    font-size: 1.3rem;
                    cursor: pointer;
                }

                .continue-btn {
                    background: var(--btn-color, #3b82f6);
                    color: black;
                }

                .ticket-btn {
                    background: #475569;
                    color: white;
                }

                .feedback-container {
                    margin-top: 2rem;
                    padding: 1.5rem;
                    background: #1e293b;
                    border-radius: 1rem;
                    border: 2px solid var(--btn-color, #3b82f6);
                }

                .listening-indicator {
                    display: inline-block;
                    padding: 1rem;
                    border-radius: 1rem;
                    background: #cc0000;
                    color: white;
                    font-size: 1.4rem;
                    font-weight: bold;
                }

                .searching-indicator {
                    display: inline-block;
                    padding: 1rem;
                    border-radius: 1rem;
                    background: #1e293b;
                    color: #60a5fa;
                    font-size: 1.4rem;
                    border: 1px solid #60a5fa;
                }

                .typing-indicator {
                    display: inline-block;
                    padding: 1rem;
                    border-radius: 1rem;
                    background: #334155;
                    color: #94a3b8;
                    font-size: 1.4rem;
                }

                .chat-input-container {
                    position: relative;
                    background: #111827;
                    padding: 1.5rem;
                    border-radius: 0.5rem;
                    border: 1px solid #334155;
                    margin-top: 1rem;
                }

                .attachment-preview-bar {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1.5rem;
                    padding: 1rem;
                    background: #1e293b;
                    border-radius: 0.6rem;
                    margin-bottom: 1.5rem;
                    border: 2px dashed #3b82f6;
                }

                .preview-thumbnail-wrapper {
                    position: relative;
                    width: 70px;
                    height: 70px;
                    border-radius: 0.6rem;
                    overflow: visible;
                    border: 2px solid #64748b;
                    background: #0f172a;
                }

                .thumbnail-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 0.4rem;
                }

                .remove-thumbnail-btn {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #ef4444 !important;
                    color: white !important;
                    border: 2px solid #ffffff !important;
                    border-radius: 50% !important;
                    width: 22px !important;
                    height: 22px !important;
                    font-size: 1.4rem !important;
                    font-weight: bold !important;
                    cursor: pointer !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.5);
                    z-index: 5;
                }

                .remove-thumbnail-btn:hover {
                    background: #dc2626 !important;
                    transform: scale(1.1);
                }

                .suggestions-box {
                    position: absolute;
                    bottom: 100%;
                    left: 0;
                    width: 100%;
                    background: #334155;
                    border-radius: 0.5rem;
                    margin-bottom: 0.5rem;
                    padding: 0.5rem;
                    z-index: 10;
                    border: 1px solid #4b5563;
                    max-height: 160px;
                    overflow-y: auto;
                }

                .suggestion-item {
                    padding: 1rem;
                    cursor: pointer;
                    font-size: 1.4rem;
                    border-bottom: 1px solid #475569;
                    color: white;
                }

                .chat-input-form {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    width: 100%;
                }

                .input-actions-wrapper {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .action-icon-label {
                    cursor: pointer;
                    font-size: 2.4rem;
                    user-select: none;
                }

                .voice-toggle-btn {
                    background: none;
                    border: none;
                    font-size: 2.4rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 2;
                }

                .main-chat-input {
                    flex-grow: 1;
                    padding: 1.2rem;
                    border-radius: 0.5rem;
                    border: 1px solid #4b5563;
                    background: #1f2937;
                    color: white;
                    font-size: 1.6rem;
                    outline: none;
                    min-width: 50px;
                }

                .submit-chat-btn {
                    padding: 1.1rem 2rem;
                    font-size: 1.5rem;
                    font-weight: bold;
                }

                @media (max-width: 768px) {
                    .section-chat {
                        padding: 8rem 0 3rem 0;
                    }

                    .chat-layout-container {
                        padding: 0 1rem;
                    }

                    .chat-window {
                        padding: 1rem;
                        height: 78vh;
                    }

                    .message-bubble {
                        max-width: 90%;
                        font-size: 1.4rem;
                    }

                    .category-selection-wrapper {
                        width: 100%;
                    }

                    .chat-input-form {
                        gap: 0.6rem;
                    }

                    .main-chat-input {
                        font-size: 1.4rem;
                        padding: 1rem;
                    }

                    .submit-chat-btn {
                        padding: 1rem 1.4rem;
                        font-size: 1.4rem;
                    }
                }

                @media (max-width: 480px) {
                    .chat-input-form {
                        flex-wrap: wrap;
                    }

                    .input-actions-wrapper {
                        width: 100%;
                        justify-content: flex-start;
                        margin-bottom: 0.4rem;
                        padding-left: 0.5rem;
                        gap: 1.5rem;
                    }

                    .main-chat-input {
                        width: 65%;
                    }

                    .submit-chat-btn {
                        width: 25%;
                        flex-grow: 1;
                        text-align: center;
                    }
                    
                    .interactive-prompt-row .action-btn {
                        width: 100%;
                    }
                }
            `}</style>
        </section>
    );
};