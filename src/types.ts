export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

export interface UserSettings {
  currency: string;
  language: string;
  theme: "light" | "dark";
}

// ---------------- Trips Entities ----------------
export interface ItineraryItem {
  id: string;
  type: "flight" | "hotel" | "attraction" | "transport" | "other";
  time: string;
  title: string;
  location?: string;
  notes?: string;
  cost?: number;
  confirmationNumber?: string;
}

export interface PackingItem {
  id: string;
  name: string;
  packed: boolean;
  category: string; // "Clothing", "Electronics", "Documents", "Toiletries", "Other"
}

export interface TripExpense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  invitees: string[];
  coverImage: string;
  itinerary: ItineraryItem[];
  packingList: PackingItem[];
  estimatedBudget: number;
  expenses: TripExpense[];
  documents: DocumentVaultItem[];
  emergencyContacts: string[];
}

// ---------------- Daily Life Entities ----------------
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  category: "Personal" | "Work" | "Grocery" | "Life";
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface Bill {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  category: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  category: string;
}

export interface MedicineReminder {
  id: string;
  name: string;
  time: string; // e.g. "08:00 AM"
  dosage: string; // e.g. "1 pill"
  takenToday: boolean;
}

export interface WaterLog {
  goal: number; // e.g. 8 cups
  current: number; // logged today
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  frequency: string; // "Daily", "Weekly"
}

export interface DocumentVaultItem {
  id: string;
  name: string;
  category: "Ticket" | "Identity" | "Hotel" | "Insurance" | "Other";
  fileSize: string;
  uploadDate: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

// ---------------- Explore / Places Entities ----------------
export interface Place {
  id: string;
  name: string;
  category: "Restaurants" | "Hospitals" | "ATMs" | "Shopping" | "Fuel" | "Hotels" | "Events";
  rating: number;
  distance: number; // in km
  priceLevel: number; // 1 to 4 $ symbols
  openNow: boolean;
  address: string;
  image: string;
  description: string;
}
