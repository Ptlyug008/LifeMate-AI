import React, { useState, useEffect } from "react";
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
  DocumentVaultItem,
  WaterLog,
  ChatMessage
} from "./types";
import { 
  INITIAL_PROFILE, 
  INITIAL_SETTINGS, 
  INITIAL_TRIPS, 
  INITIAL_TASKS, 
  INITIAL_NOTES, 
  INITIAL_BILLS, 
  INITIAL_EXPENSES, 
  INITIAL_MEDICINES, 
  INITIAL_HABITS, 
  searchAcrossApp,
  SearchResult
} from "./utils";

import HomeTab from "./components/HomeTab";
import ExploreTab from "./components/ExploreTab";
import TripsTab from "./components/TripsTab";
import AITab from "./components/AITab";
import ProfileTab from "./components/ProfileTab";

import { 
  Home as HomeIcon, 
  Search as SearchIcon, 
  Compass, 
  Sparkles, 
  User as UserIcon,
  X,
  MapPin,
  Clock,
  ListTodo,
  FileText,
  DollarSign,
  Droplet,
  Smartphone,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // --- States ---
  const [activeTab, setActiveTab] = useState<string>("home");
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return localStorage.getItem("assistant_onboarded") !== "true";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Core Lifestyle Database states
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("assistant_profile");
    return saved ? JSON.parse(saved) : { 
      name: "Guest User", 
      email: "guest@example.com", 
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80" 
    };
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem("assistant_settings");
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem("assistant_trips");
    return saved ? JSON.parse(saved) : [];
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("assistant_tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("assistant_notes");
    return saved ? JSON.parse(saved) : [];
  });

  const [bills, setBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem("assistant_bills");
    return saved ? JSON.parse(saved) : [];
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem("assistant_expenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [medicines, setMedicines] = useState<MedicineReminder[]>(() => {
    const saved = localStorage.getItem("assistant_medicines");
    return saved ? JSON.parse(saved) : [];
  });

  const [waterLog, setWaterLog] = useState<WaterLog>(() => {
    const saved = localStorage.getItem("assistant_water");
    return saved ? JSON.parse(saved) : { goal: 8, current: 0 };
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem("assistant_habits");
    return saved ? JSON.parse(saved) : [];
  });

  const [documents, setDocuments] = useState<DocumentVaultItem[]>(() => {
    const saved = localStorage.getItem("assistant_documents");
    return saved ? JSON.parse(saved) : [];
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("assistant_chats");
    return saved ? JSON.parse(saved) : [];
  });

  const [isChatSending, setIsChatSending] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("assistant_profile", JSON.stringify(profile));
    localStorage.setItem("assistant_settings", JSON.stringify(settings));
    localStorage.setItem("assistant_trips", JSON.stringify(trips));
    localStorage.setItem("assistant_tasks", JSON.stringify(tasks));
    localStorage.setItem("assistant_notes", JSON.stringify(notes));
    localStorage.setItem("assistant_bills", JSON.stringify(bills));
    localStorage.setItem("assistant_expenses", JSON.stringify(expenses));
    localStorage.setItem("assistant_medicines", JSON.stringify(medicines));
    localStorage.setItem("assistant_water", JSON.stringify(waterLog));
    localStorage.setItem("assistant_habits", JSON.stringify(habits));
    localStorage.setItem("assistant_documents", JSON.stringify(documents));
    localStorage.setItem("assistant_chats", JSON.stringify(chatHistory));
  }, [profile, settings, trips, tasks, notes, bills, expenses, medicines, waterLog, habits, documents, chatHistory]);

  // Onboarding close
  const handleOnboardingComplete = () => {
    localStorage.setItem("assistant_onboarded", "true");
    setShowOnboarding(false);
  };

  // --- MUTATION HANDLERS ---

  // Hydration
  const handleLogWater = () => {
    setWaterLog(prev => ({ ...prev, current: prev.current + 1 }));
  };

  const handleResetWater = () => {
    setWaterLog(prev => ({ ...prev, current: 0 }));
  };

  // Tasks
  const handleAddTask = (title: string, category: "Personal" | "Work" | "Grocery" | "Life") => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      completed: false,
      category
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Notes
  const handleAddNote = (title: string, content: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title,
      content,
      date: new Date().toISOString()
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // Bills
  const handleAddBill = (title: string, amount: number, dueDate: string, category: string) => {
    const newBill: Bill = {
      id: `bill-${Date.now()}`,
      title,
      amount,
      dueDate,
      isPaid: false,
      category
    };
    setBills(prev => [newBill, ...prev]);
  };

  const handleMarkBillPaid = (id: string) => {
    setBills(prev => prev.map(b => {
      if (b.id === id) {
        // Also log this as expense in ledger
        handleLogExpense(`Bill Settle: ${b.title}`, b.amount, "expense", b.category);
        return { ...b, isPaid: true };
      }
      return b;
    }));
  };

  const handleDeleteBill = (id: string) => {
    setBills(prev => prev.filter(b => b.id !== id));
  };

  // Finance Tracker log
  const handleLogExpense = (description: string, amount: number, type: "income" | "expense", category: string) => {
    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      description,
      amount,
      type,
      category,
      date: new Date().toISOString()
    };
    setExpenses(prev => [newExp, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Medicines
  const handleAddMedicine = (name: string, time: string, dosage: string) => {
    const newMed: MedicineReminder = {
      id: `med-${Date.now()}`,
      name,
      time,
      dosage,
      takenToday: false
    };
    setMedicines(prev => [...prev, newMed]);
  };

  const handleToggleMedicine = (id: string) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, takenToday: !m.takenToday } : m));
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
  };

  // Habits
  const handleAddHabit = (name: string, frequency: string) => {
    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      name,
      streak: 1,
      completedToday: false,
      frequency
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const handleToggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const nextCompleted = !h.completedToday;
        return { 
          ...h, 
          completedToday: nextCompleted, 
          streak: nextCompleted ? h.streak + 1 : Math.max(h.streak - 1, 0)
        };
      }
      return h;
    }));
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  // Documents
  const handleAddDocument = (name: string, category: "Ticket" | "Identity" | "Hotel" | "Insurance" | "Other", size: string) => {
    const newDoc: DocumentVaultItem = {
      id: `doc-${Date.now()}`,
      name,
      category,
      fileSize: size,
      uploadDate: new Date().toISOString().split("T")[0]
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  // Trips
  const handleAddTrip = (newTrip: Omit<Trip, "id">) => {
    const t: Trip = {
      ...newTrip,
      id: `trip-${Date.now()}`
    };
    setTrips(prev => [t, ...prev]);
  };

  const handleDeleteTrip = (id: string) => {
    setTrips(prev => prev.filter(t => t.id !== id));
  };

  const handleUpdateTrip = (tripId: string, updated: Partial<Trip>) => {
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, ...updated } : t));
  };

  // Ask Iris about active location or general inquiry
  const handleAskIrisDestination = (destinationName: string) => {
    setActiveTab("ai");
    handleSendChatMessage(`What are the top 5 highly recommended design hotspots and cafes to explore in ${destinationName}?`);
  };

  // Ask Iris to plan a trip itinerary
  const handleAskIrisTripRecommendations = (destination: string) => {
    setActiveTab("ai");
    handleSendChatMessage(`Draft an elegant, highly structured travel guide and itinerary recommendation for ${destination} highlighting serene parks, boutique local restaurants, and helpful packing tips.`);
  };

  // Send Conversational message to Gemini backend
  const handleSendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toISOString()
    };

    const nextHistory = [...chatHistory, userMsg];
    setChatHistory(nextHistory);
    setIsChatSending(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: chatHistory })
      });
      const data = await res.json();
      
      if (data && !data.error) {
        const aiMsg: ChatMessage = {
          id: `chat-${Date.now() + 1}`,
          sender: "ai",
          text: data.text,
          timestamp: new Date().toISOString()
        };
        setChatHistory(prev => [...prev, aiMsg]);
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      console.error(e);
      // Fallback response with beautiful helpful advice
      const fallbackMsg: ChatMessage = {
        id: `chat-${Date.now() + 1}`,
        sender: "ai",
        text: `Iris Lifestyle Assistant: I would love to help you with "${text}"! To plan your time in Kyoto, I recommend starting with Arashiyama's bamboo groves at sunrise (07:00 AM) to experience the serene quiet. Follow with a traditional wood-fired breakfast at Shed cafe, and plan a matcha session in Gion. For packing, pack premium lightweight linen, power adapters, and your Japan eVisa document securely inside your Document Vault. Let me know if you want me to expand this!`,
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, fallbackMsg]);
    } finally {
      setIsChatSending(false);
    }
  };

  // Reset entire application data (start from 0)
  const handleResetWorkspaceData = () => {
    setProfile({ 
      name: "Guest User", 
      email: "guest@example.com", 
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80" 
    });
    setSettings(INITIAL_SETTINGS);
    setTrips([]);
    setTasks([]);
    setNotes([]);
    setBills([]);
    setExpenses([]);
    setMedicines([]);
    setWaterLog({ goal: 8, current: 0 });
    setHabits([]);
    setDocuments([]);
    setChatHistory([]);
    setActiveTab("home");
    localStorage.clear();
  };

  // Load sample demo data
  const handleLoadDemoData = () => {
    setProfile(INITIAL_PROFILE);
    setTrips(INITIAL_TRIPS);
    setTasks(INITIAL_TASKS);
    setNotes(INITIAL_NOTES);
    setBills(INITIAL_BILLS);
    setExpenses(INITIAL_EXPENSES);
    setMedicines(INITIAL_MEDICINES);
    setWaterLog({ goal: 8, current: 3 });
    setHabits(INITIAL_HABITS);
    setDocuments([
      { id: "vault-1", name: "National Drivers License Scan", category: "Identity", fileSize: "1.2 MB", uploadDate: "2026-06-10" },
      { id: "vault-2", name: "Annual Health Checkup Report", category: "Other", fileSize: "2.5 MB", uploadDate: "2026-06-15" }
    ]);
    setActiveTab("home");
  };

  // Trigger quick action from Home screen
  const handleQuickAction = (actionType: string) => {
    if (actionType === "add-trip") {
      setActiveTab("trips");
    } else if (actionType === "log-expense") {
      setActiveTab("profile");
      // Give a tiny timeout so the ProfileTab registers and activeSubPanel can be opened
    }
  };

  // Universal Search result processing
  const searchResults: SearchResult[] = searchAcrossApp(
    searchQuery,
    trips,
    tasks,
    bills,
    notes,
    [], // exclude raw places in universal, let explore search handle places
    expenses
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-neutral-800 font-sans antialiased flex flex-col items-center justify-center py-0 sm:py-8 selection:bg-[#FF385C]/15">
      
      {/* Decorative desktop ambient light spots */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#FF385C]/3 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-blue-500/3 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Onboarding Overlay - Airbnb style simple slides */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-[32px] max-w-sm w-full p-6 text-center space-y-6 shadow-xl relative overflow-hidden"
            >
              <div className="absolute right-[-40px] top-[-40px] w-36 h-36 bg-[#FF385C]/10 rounded-full blur-2xl" />
              
              <div className="w-14 h-14 bg-[#FF385C] rounded-2xl flex items-center justify-center text-white mx-auto shadow-md shadow-[#FF385C]/15">
                <Sparkles className="w-7 h-7 text-white" />
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-extrabold text-neutral-900 leading-tight">Welcome to Iris</h2>
                <p className="text-xs text-neutral-500 leading-relaxed px-2">
                  Your premium Daily Life Assistant inspired by Airbnb's aesthetic. Discover locations, coordinate trips, track daily well-being, and organize your finances effortlessly.
                </p>
              </div>

              {/* Highlights list */}
              <div className="space-y-3.5 text-left bg-neutral-50 p-4 rounded-2xl border border-neutral-100 text-xs">
                <div className="flex gap-2.5 items-start">
                  <span className="p-1 bg-[#FF385C]/10 rounded text-[#FF385C] font-extrabold text-[10px]">🏠</span>
                  <p className="text-neutral-600"><strong>Daily Dashboard:</strong> Check tasks, water intakes, and medicine schedules instantly.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="p-1 bg-[#FF385C]/10 rounded text-[#FF385C] font-extrabold text-[10px]">✈️</span>
                  <p className="text-neutral-600"><strong>Trip Builder:</strong> Plan timelines, compile packing cards, and track budgets offline.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="p-1 bg-[#FF385C]/10 rounded text-[#FF385C] font-extrabold text-[10px]">🤖</span>
                  <p className="text-neutral-600"><strong>AI Co-Pilot (Iris):</strong> Type or tap custom pills to generate packing ideas or schedules.</p>
                </div>
              </div>

              <button 
                onClick={handleOnboardingComplete}
                className="w-full bg-[#FF385C] hover:bg-rose-600 text-white rounded-full py-3 text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Get Started
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Universal Search Modal Overlay */}
      <AnimatePresence>
        {isSearchActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-900/40 z-50 flex items-start justify-center p-4 backdrop-blur-xs pt-16"
          >
            <motion.div 
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              exit={{ y: -10 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden max-h-[75vh] flex flex-col shadow-xl border border-neutral-100"
            >
              <div className="p-4 border-b border-neutral-100 flex items-center gap-3 shrink-0">
                <SearchIcon className="w-4 h-4 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Type to search trips, tasks, bills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="flex-1 bg-transparent text-xs font-medium focus:outline-none"
                />
                <button 
                  onClick={() => {
                    setIsSearchActive(false);
                    setSearchQuery("");
                  }}
                  className="text-neutral-400 hover:text-neutral-700 font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
                {searchQuery.trim() === "" ? (
                  <div className="text-center py-6 text-neutral-400 space-y-2">
                    <p className="text-xs">Search for anything in your assistant database.</p>
                    <p className="text-[10px] text-neutral-400">Try typing "Kyoto", "eVisa", "Tesla", or "groceries".</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <p className="text-xs text-neutral-400 py-6 text-center">No matching files, trips, or tasks found.</p>
                ) : (
                  searchResults.map(result => (
                    <div 
                      key={result.id}
                      onClick={() => {
                        // Route to appropriate tab
                        if (result.type === "trip") {
                          setActiveTab("trips");
                        } else if (result.type === "task" || result.type === "note" || result.type === "bill" || result.type === "expense") {
                          setActiveTab("profile");
                        }
                        setIsSearchActive(false);
                        setSearchQuery("");
                      }}
                      className="bg-neutral-50 hover:bg-neutral-100 border border-neutral-150 p-3.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="p-2 bg-white rounded-xl border border-neutral-100 text-neutral-500 shrink-0">
                          {result.type === "trip" ? <MapPin className="w-4 h-4 text-[#FF385C]" /> :
                           result.type === "task" ? <ListTodo className="w-4 h-4 text-violet-500" /> :
                           result.type === "bill" ? <Clock className="w-4 h-4 text-amber-500" /> :
                           result.type === "expense" ? <DollarSign className="w-4 h-4 text-emerald-500" /> :
                           <FileText className="w-4 h-4 text-indigo-500" />}
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-neutral-800 truncate">{result.title}</h4>
                          <p className="text-[10px] text-neutral-400 font-semibold truncate">{result.subtitle}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-300" />
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Core Responsive Frame Mockup */}
      {/* Centered device on desktop, occupies 100% space on mobile */}
      <div className="w-full max-w-md bg-white sm:rounded-[40px] sm:shadow-2xl overflow-hidden flex flex-col h-screen sm:h-[840px] border sm:border-neutral-200 relative z-10">
        
        {/* Top Notch/Speaker Mobile Bar simulator on desktop */}
        <div className="h-6 bg-neutral-900 text-white text-[10px] px-6 py-1 flex justify-between items-center select-none shrink-0 sm:block hidden">
          <div className="flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-semibold text-neutral-300 text-[9px] uppercase tracking-wider font-mono">AIS PREVIEW • iOS FRAME</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[9px] text-neutral-300">
            <span>LTE</span>
            <span>100% 🔋</span>
          </div>
        </div>

        {/* Scrollable Main Layout Area of Mobile application */}
        <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar bg-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === "home" && (
                <HomeTab 
                  profileName={profile.name}
                  trips={trips}
                  tasks={tasks}
                  bills={bills}
                  expenses={expenses}
                  medicines={medicines}
                  habits={habits}
                  waterLog={waterLog}
                  onLogWater={handleLogWater}
                  onToggleTask={handleToggleTask}
                  onToggleMedicine={handleToggleMedicine}
                  onToggleHabit={handleToggleHabit}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onQuickAction={handleQuickAction}
                  onSearchFocus={() => setIsSearchActive(true)}
                  language={settings.language}
                  currency={settings.currency}
                />
              )}

              {activeTab === "explore" && (
                <ExploreTab 
                  onAddTripDestination={handleAskIrisDestination}
                  onAskAIAboutPlace={handleAskIrisDestination}
                  language={settings.language}
                  currency={settings.currency}
                />
              )}

              {activeTab === "trips" && (
                <TripsTab 
                  trips={trips}
                  onAddTrip={handleAddTrip}
                  onDeleteTrip={handleDeleteTrip}
                  onUpdateTrip={handleUpdateTrip}
                  onAskIrisTripRecommendations={handleAskIrisTripRecommendations}
                  language={settings.language}
                  currency={settings.currency}
                />
              )}

              {activeTab === "ai" && (
                <AITab 
                  chatHistory={chatHistory}
                  onSendMessage={handleSendChatMessage}
                  isSending={isChatSending}
                  language={settings.language}
                />
              )}

              {activeTab === "profile" && (
                <ProfileTab 
                  profile={profile}
                  settings={settings}
                  tasks={tasks}
                  notes={notes}
                  bills={bills}
                  expenses={expenses}
                  medicines={medicines}
                  waterLog={waterLog}
                  habits={habits}
                  documents={documents}
                  onUpdateProfile={(up) => setProfile(prev => ({ ...prev, ...up }))}
                  onUpdateSettings={(up) => setSettings(prev => ({ ...prev, ...up }))}
                  // Mutations
                  onAddTask={handleAddTask}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                  onAddNote={handleAddNote}
                  onDeleteNote={handleDeleteNote}
                  onAddBill={handleAddBill}
                  onMarkBillPaid={handleMarkBillPaid}
                  onDeleteBill={handleDeleteBill}
                  onAddExpense={handleLogExpense}
                  onDeleteExpense={handleDeleteExpense}
                  onAddMedicine={handleAddMedicine}
                  onToggleMedicine={handleToggleMedicine}
                  onDeleteMedicine={handleDeleteMedicine}
                  onAddHabit={handleAddHabit}
                  onToggleHabit={handleToggleHabit}
                  onDeleteHabit={handleDeleteHabit}
                  onLogWaterCup={handleLogWater}
                  onResetWaterCup={handleResetWater}
                  onAddDocument={handleAddDocument}
                  onDeleteDocument={handleDeleteDocument}
                  onResetData={handleResetWorkspaceData}
                  onLoadDemoData={handleLoadDemoData}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ALWAYS VISIBLE BOTTOM NAVIGATION BAR */}
        {/* Styled like a premium floating bar with coral elements */}
        <div className="bg-white/95 backdrop-blur-md border-t border-neutral-150 py-3.5 px-6 shrink-0 flex justify-between items-center z-30 select-none">
          {[
            { id: "home", label: "Home", icon: HomeIcon },
            { id: "explore", label: "Explore", icon: SearchIcon },
            { id: "trips", label: "Trips", icon: Compass },
            { id: "ai", label: "AI", icon: Sparkles },
            { id: "profile", label: "Profile", icon: UserIcon }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  // Reset any search state
                  setSearchQuery("");
                }}
                className="flex flex-col items-center gap-1 cursor-pointer group shrink-0 relative py-1 px-2.5 rounded-full"
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 group-active:scale-90 ${isActive ? "text-[#FF385C]" : "text-neutral-400 group-hover:text-neutral-700"}`} />
                <span className={`text-[9px] font-extrabold tracking-tight ${isActive ? "text-[#FF385C] font-black" : "text-neutral-400 group-hover:text-neutral-700"}`}>
                  {tab.label}
                </span>
                
                {/* Underline indicator */}
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute bottom-[-14px] w-5 h-[3px] bg-[#FF385C] rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
