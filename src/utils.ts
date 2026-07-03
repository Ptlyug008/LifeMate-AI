import { 
  UserProfile, 
  UserSettings, 
  Trip, 
  Task, 
  Note, 
  Bill, 
  Expense, 
  MedicineReminder, 
  Habit, 
  Place,
  DocumentVaultItem
} from "./types";

export const INITIAL_PROFILE: UserProfile = {
  name: "Sarah Jenkins",
  email: "sarah.j@airbnb-inspired.ai",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
};

export const INITIAL_SETTINGS: UserSettings = {
  currency: "USD",
  language: "English",
  theme: "light",
};

// Beautiful curated places for Explore
export const CURATED_PLACES: Place[] = [
  {
    id: "place-1",
    name: "Kissa Saiki Cafe",
    category: "Restaurants",
    rating: 4.9,
    distance: 0.8,
    priceLevel: 2,
    openNow: true,
    address: "Higashiyama, Kyoto",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=500&q=80",
    description: "A hidden, minimalist coffee house serving traditional hand-drip matcha and artisanal local pastries in a 100-year-old wooden house."
  },
  {
    id: "place-2",
    name: "Aman Boutique Hotel & Spa",
    category: "Hotels",
    rating: 4.9,
    distance: 2.3,
    priceLevel: 4,
    openNow: true,
    address: "Kita Ward, Kyoto",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80",
    description: "An architectural masterpiece set in a hidden garden of moss and towering maples. Features traditional Onsen baths and pristine garden-view pavilion suites."
  },
  {
    id: "place-3",
    name: "Shed Restaurant & Garden",
    category: "Restaurants",
    rating: 4.7,
    distance: 1.2,
    priceLevel: 3,
    openNow: true,
    address: "Downtown Kyoto",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=80",
    description: "Farm-to-table dining inside an airy greenhouse setting. Curated seasonal menus sourced daily from local organic farms."
  },
  {
    id: "place-4",
    name: "Gion Autumn Lights Festival",
    category: "Events",
    rating: 4.8,
    distance: 1.5,
    priceLevel: 1,
    openNow: true,
    address: "Shirakawa Canal, Gion",
    image: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=500&q=80",
    description: "An annual illumination of cherry blossoms and historical wooden bridges. Local musicians perform traditional koto music along the canal path."
  },
  {
    id: "place-5",
    name: "Central General Medical Clinic",
    category: "Hospitals",
    rating: 4.6,
    distance: 3.1,
    priceLevel: 2,
    openNow: true,
    address: "Sanjo Dori, Kyoto",
    image: "https://images.unsplash.com/photo-1586773860418-d3b3df97e563?auto=format&fit=crop&w=500&q=80",
    description: "A state-of-the-art medical clinic providing English-speaking consultations, rapid laboratory tests, and multi-currency billing services."
  },
  {
    id: "place-6",
    name: "Shijo Designer Arcade",
    category: "Shopping",
    rating: 4.5,
    distance: 0.5,
    priceLevel: 3,
    openNow: true,
    address: "Shijo Street, Kyoto",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=500&q=80",
    description: "An upscale shopping avenue hosting independent local boutiques, craft pottery workshops, and minimalist fashion houses."
  },
  {
    id: "place-7",
    name: "Kyoto EcoFuel & Charge Station",
    category: "Fuel",
    rating: 4.4,
    distance: 4.0,
    priceLevel: 2,
    openNow: true,
    address: "Nishioji Road, Kyoto",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=500&q=80",
    description: "A ultra-fast electric vehicle supercharger and premium biofuels station equipped with a healthy organic coffee lounge and high-speed Wi-Fi."
  },
  {
    id: "place-8",
    name: "Sumitomo Trust Global ATM",
    category: "ATMs",
    rating: 4.8,
    distance: 0.2,
    priceLevel: 1,
    openNow: true,
    address: "Kawaramachi Station, Kyoto",
    image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=500&q=80",
    description: "A highly secure international ATM center supporting UnionPay, Visa, Mastercard, and offering competitive currency conversion rates with zero commission."
  }
];

// Beautiful initial Trip setup for "Kyoto Autumn Retreat"
export const INITIAL_TRIPS: Trip[] = [
  {
    id: "trip-1",
    destination: "Kyoto, Japan",
    startDate: "2026-10-15",
    endDate: "2026-10-22",
    invitees: ["Mark Jenkins", "Chloe Mercer"],
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    estimatedBudget: 3200,
    expenses: [
      { id: "te-1", description: "Boutique Hotel Deposit", amount: 1200, category: "Hotels", date: "2026-07-01" },
      { id: "te-2", description: "Shinkansen Bullet Train Tickets", amount: 310, category: "Transport", date: "2026-07-02" },
      { id: "te-3", description: "Traditional Kaiseki Dinner Booking", amount: 240, category: "Food", date: "2026-07-03" }
    ],
    itinerary: [
      {
        id: "iti-1",
        type: "flight",
        time: "10:30 AM",
        title: "Flight JL-006 to Osaka (KIX)",
        location: "SFO International Terminal",
        notes: "Boarding at gate A12. Carry-on bags only.",
        confirmationNumber: "JL988F"
      },
      {
        id: "iti-2",
        type: "hotel",
        time: "03:00 PM",
        title: "Check-in at Aman Kyoto Pavilions",
        location: "Kita Ward, Kyoto",
        notes: "Requested garden-view villa. Includes daily breakfast.",
        confirmationNumber: "AMN49821"
      },
      {
        id: "iti-3",
        type: "attraction",
        time: "08:00 AM",
        title: "Arashiyama Bamboo Forest & Tenryu-ji",
        location: "Arashiyama, Western Kyoto",
        notes: "Arrive early before crowds. Rent wooden rowboats on Hozu River afterwards.",
        cost: 20
      },
      {
        id: "iti-4",
        type: "transport",
        time: "01:30 PM",
        title: "Sagano Scenic Romantic Train",
        location: "Saga-Arashiyama Station",
        notes: "Open-air car number 5 is reserved.",
        cost: 15,
        confirmationNumber: "SGN8829"
      }
    ],
    packingList: [
      { id: "pack-1", name: "Passports & Travel Visas", packed: true, category: "Documents" },
      { id: "pack-2", name: "Universal Power Adapters", packed: true, category: "Electronics" },
      { id: "pack-3", name: "Comfortable Walking Shoes", packed: false, category: "Clothing" },
      { id: "pack-4", name: "Light Rain Jacket", packed: false, category: "Clothing" },
      { id: "pack-5", name: "Noise-canceling headphones", packed: true, category: "Electronics" },
      { id: "pack-6", name: "Prescription Medicines", packed: true, category: "Toiletries" }
    ],
    documents: [
      { id: "doc-1", name: "Japan eVisa PDF Approval", category: "Identity", fileSize: "1.2 MB", uploadDate: "2026-06-25" },
      { id: "doc-2", name: "ANA Round-Trip Boarding Passes", category: "Ticket", fileSize: "840 KB", uploadDate: "2026-07-01" },
      { id: "doc-3", name: "Hotel Booking Confirmation Voucher", category: "Hotel", fileSize: "2.1 MB", uploadDate: "2026-07-02" }
    ],
    emergencyContacts: [
      "Japan National Tourism Helpline: +81-50-3786-2220",
      "US Consulate Osaka-Kobe: +81-6-6315-5900",
      "Kyoto Tourist Information Center: +81-75-343-0548",
      "Police Department emergency: 110",
      "Ambulance / Fire emergency: 119"
    ]
  }
];

// Initial Tasks
export const INITIAL_TASKS: Task[] = [
  { id: "task-1", title: "Review Japan eVisa document requirements", completed: true, category: "Life" },
  { id: "task-2", title: "Renew gym membership before billing date", completed: false, category: "Personal" },
  { id: "task-3", title: "Pick up fresh groceries & meal-prep vegetables", completed: false, category: "Grocery" },
  { id: "task-4", title: "Submit travel budget draft to Chloe", completed: false, category: "Work" },
  { id: "task-5", title: "Water houseplants (Calathea and Bonsai)", completed: true, category: "Personal" }
];

// Initial Notes
export const INITIAL_NOTES: Note[] = [
  {
    id: "note-1",
    title: "Kyoto Food Wishlist",
    content: "Must try:\n1. Gion Karyo - Traditional Kaiseki banquet\n2. Honke Owariya - Historical buckwheat soba noodles (since 1465!)\n3. Monk - Wood-fired culinary pizza tasting menu (book months ahead)\n4. Kyoto Gyoza Hohei - Thin crispy garlic ginger pan-fried gyoza.",
    date: "2026-07-01T14:30:00.000Z"
  },
  {
    id: "note-2",
    title: "Airbnb Minimalist Design Principles",
    content: "Key principles for my home design project:\n- Prioritize white space & breathability.\n- Focus on local natural textures (oak, linen, hand-made ceramics).\n- Conceal cluttered items behind flat sliding closet doors.\n- Soft amber diffused accent lighting instead of harsh overhead cold white lights.",
    date: "2026-06-28T09:15:00.000Z"
  }
];

// Initial Bills
export const INITIAL_BILLS: Bill[] = [
  { id: "bill-1", title: "High-Speed Gigabit Fiber Internet", amount: 75.00, dueDate: "2026-07-10", isPaid: false, category: "Utilities" },
  { id: "bill-2", title: "Equinox Fitness Club Subscription", amount: 185.00, dueDate: "2026-07-15", isPaid: true, category: "Healthcare" },
  { id: "bill-3", title: "Tesla Model S Monthly Finance", amount: 640.00, dueDate: "2026-07-20", isPaid: false, category: "Transport" },
  { id: "bill-4", title: "Google One Storage Upgrade", amount: 9.99, dueDate: "2026-07-08", isPaid: false, category: "Utilities" }
];

// Initial Expenses
export const INITIAL_EXPENSES: Expense[] = [
  { id: "exp-1", description: "Fresh produce at Farmer's Market", amount: 48.50, date: "2026-07-02T11:20:00.000Z", type: "expense", category: "Grocery" },
  { id: "exp-2", description: "Boutique hand-thrown ceramic mug", amount: 35.00, date: "2026-07-01T15:40:00.000Z", type: "expense", category: "Shopping" },
  { id: "exp-3", description: "Direct Deposit Monthly Salary", amount: 6200.00, date: "2026-07-01T09:00:00.000Z", type: "income", category: "Salary" },
  { id: "exp-4", description: "Cozy neighborhood espresso & scone", amount: 9.50, date: "2026-06-30T08:30:00.000Z", type: "expense", category: "Food" },
  { id: "exp-5", description: "Rideshare from museum to office", amount: 24.10, date: "2026-06-29T17:15:00.000Z", type: "expense", category: "Transport" }
];

// Initial Medicine Reminders
export const INITIAL_MEDICINES: MedicineReminder[] = [
  { id: "med-1", name: "Daily Multivitamin + Zinc", time: "08:00 AM", dosage: "1 tablet", takenToday: true },
  { id: "med-2", name: "Omega-3 Pure Fish Oil", time: "01:00 PM", dosage: "2 capsules", takenToday: false },
  { id: "med-3", name: "Magnesium Bisglycinate (Sleep)", time: "09:30 PM", dosage: "250 mg", takenToday: false }
];

// Initial Habits
export const INITIAL_HABITS: Habit[] = [
  { id: "habit-1", name: "Morning Meditation (15 min)", streak: 12, completedToday: true, frequency: "Daily" },
  { id: "habit-2", name: "Read Non-Fiction Books", streak: 5, completedToday: false, frequency: "Daily" },
  { id: "habit-3", name: "Strength Training Gym", streak: 3, completedToday: true, frequency: "Weekly" },
  { id: "habit-4", name: "8 Hours High-Quality Sleep", streak: 18, completedToday: true, frequency: "Daily" }
];

// Currency Formatter
export function formatCurrency(amount: number, currencyCode: string = "USD"): string {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
}

// Universal Search across entire app dataset
export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: "trip" | "task" | "bill" | "document" | "note" | "place" | "expense" | "saved_location";
  data: any; // Direct reference
}

export function searchAcrossApp(
  query: string,
  trips: Trip[],
  tasks: Task[],
  bills: Bill[],
  notes: Note[],
  places: Place[],
  expenses: Expense[]
): SearchResult[] {
  if (!query || query.trim() === "") return [];
  const q = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  // Search Trips
  trips.forEach(t => {
    if (t.destination.toLowerCase().includes(q)) {
      results.push({
        id: t.id,
        title: t.destination,
        subtitle: `Trip Plan (${t.startDate} to ${t.endDate})`,
        type: "trip",
        data: t
      });
    }
  });

  // Search Tasks
  tasks.forEach(t => {
    if (t.title.toLowerCase().includes(q)) {
      results.push({
        id: t.id,
        title: t.title,
        subtitle: `To-do Task (${t.completed ? "Completed" : "Pending"})`,
        type: "task",
        data: t
      });
    }
  });

  // Search Bills
  bills.forEach(b => {
    if (b.title.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)) {
      results.push({
        id: b.id,
        title: b.title,
        subtitle: `Bill Due (${formatCurrency(b.amount)} - ${b.isPaid ? "Paid" : "Unpaid"})`,
        type: "bill",
        data: b
      });
    }
  });

  // Search Notes
  notes.forEach(n => {
    if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) {
      results.push({
        id: n.id,
        title: n.title,
        subtitle: `Personal Note (${new Date(n.date).toLocaleDateString()})`,
        type: "note",
        data: n
      });
    }
  });

  // Search Places
  places.forEach(p => {
    if (p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) {
      results.push({
        id: p.id,
        title: p.name,
        subtitle: `Local ${p.category} (${p.rating} ★, ${p.distance} km away)`,
        type: "place",
        data: p
      });
    }
  });

  // Search Expenses
  expenses.forEach(e => {
    if (e.description.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)) {
      results.push({
        id: e.id,
        title: e.description,
        subtitle: `Transaction (${e.type === "income" ? "+" : "-"}${formatCurrency(e.amount)})`,
        type: "expense",
        data: e
      });
    }
  });

  return results;
}
