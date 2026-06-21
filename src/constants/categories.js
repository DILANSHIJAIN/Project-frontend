/**
 * Grouped Category Scheme & Shared Visual Metadata Map (Frontend)
 */
export const CATEGORY_GROUPS = {
  "Account & Security": {
    icon: "🔐",
    items: ["Login & Authentication", "Account Management", "Security", "Data & Database"]
  },
  "IT & Infrastructure": {
    icon: "💻",
    items: ["Technical", "Network", "Infrastructure", "Performance Issues", "Printing", "Email & Collaboration", "Integration & API"]
  },
  "Operations & Logistics": {
    icon: "🚚",
    items: ["Vehicle Maintenance", "Traffic & Logistics"]
  },
  "Service, Billing & Food": {
    icon: "💳",
    items: ["Billing", "Service Request", "Food"]
  },
  "Feedback & General": {
    icon: "💬",
    items: ["General", "Bug Report", "Complaint", "Feature Request"]
  }
};

export const ALL_CATEGORIES = [...Object.values(CATEGORY_GROUPS).flatMap(group => group.items), "Others"];