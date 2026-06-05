/**
 * Ticket Priority System (Frontend)
 * Standard P1-P4 priority levels with colors and descriptions
 */

export const PRIORITIES = {
  P1: {
    level: "P1",
    name: "Critical",
    description: "System down, security issue, major functionality broken",
    color: "#dc2626", // Red
    bgColor: "#fee2e2",
    badge: "Critical",
    responseTime: "1 hour"
  },
  P2: {
    level: "P2",
    name: "High",
    description: "Significant feature broken, workaround unavailable",
    color: "#f97316", // Orange
    bgColor: "#ffedd5",
    badge: "High",
    responseTime: "4 hours"
  },
  P3: {
    level: "P3",
    name: "Medium",
    description: "Normal operations affected, workaround available",
    color: "#eab308", // Yellow
    bgColor: "#fef08a",
    badge: "Medium",
    responseTime: "1 day"
  },
  P4: {
    level: "P4",
    name: "Low",
    description: "Minor issues, cosmetic problems, enhancement requests",
    color: "#22c55e", // Green
    bgColor: "#dcfce7",
    badge: "Low",
    responseTime: "5 days"
  }
};

export const PRIORITY_LEVELS = ["P1", "P2", "P3", "P4"];

export const getPriorityColor = (priority) => {
  return PRIORITIES[priority]?.color || "#8b5cf6"; // Default purple
};

export const getPriorityBgColor = (priority) => {
  return PRIORITIES[priority]?.bgColor || "#f3e8ff"; // Default light purple
};
