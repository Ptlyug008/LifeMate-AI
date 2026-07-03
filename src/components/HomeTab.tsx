import React from "react";
import { 
  Trip, 
  Task, 
  Bill, 
  Expense, 
  MedicineReminder, 
  Habit, 
  WaterLog 
} from "../types";
import { 
  Sun, 
  CloudRain, 
  Compass, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  DollarSign, 
  Sparkles, 
  Droplet, 
  Plus, 
  Heart, 
  MapPin, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Flame,
  Search
} from "lucide-react";
import { formatCurrency } from "../utils";
import { TRANSLATIONS, Language } from "../translations";

interface HomeTabProps {
  profileName: string;
  trips: Trip[];
  tasks: Task[];
  bills: Bill[];
  expenses: Expense[];
  medicines: MedicineReminder[];
  habits: Habit[];
  waterLog: WaterLog;
  onLogWater: () => void;
  onToggleTask: (id: string) => void;
  onToggleMedicine: (id: string) => void;
  onToggleHabit: (id: string) => void;
  onNavigateTab: (tabId: string) => void;
  onQuickAction: (actionType: string) => void;
  onSearchFocus: () => void;
  language: string;
  currency: string;
}

export default function HomeTab({
  profileName,
  trips,
  tasks,
  bills,
  expenses,
  medicines,
  habits,
  waterLog,
  onLogWater,
  onToggleTask,
  onToggleMedicine,
  onToggleHabit,
  onNavigateTab,
  onQuickAction,
  onSearchFocus,
  language,
  currency
}: HomeTabProps) {
  // Translation Helper
  const lang = (language as Language) || "English";
  const t = (key: string, fallback?: string) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS["English"]?.[key] || fallback || key;
  };

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("greetingMorning", "Good morning");
    if (hour < 17) return t("greetingAfternoon", "Good afternoon");
    return t("greetingEvening", "Good evening");
  };

  // Get active or upcoming trip
  const activeTrip = trips[0];

  // Filter items for dashboard view
  const pendingTasks = tasks.filter(t => !t.completed);
  const unpaidBills = bills.filter(b => !b.isPaid);
  const recentExpenses = expenses;
  
  // Calculate hydration progress percentage
  const hydrationPercent = Math.min(Math.round((waterLog.current / waterLog.goal) * 100), 100);

  // Generate AI Daily Tip dynamically based on state
  const getAIDailyTip = () => {
    if (unpaidBills.length > 0) {
      return `${t("askIris", "Iris")} says: You have ${unpaidBills.length} upcoming bill${unpaidBills.length > 1 ? 's' : ''} due soon. Setting up auto-pay can save you up to $45 in potential late fees this month!`;
    }
    if (waterLog.current < 4) {
      return `${t("askIris", "Iris")} says: Hydration boosts focus and memory. Tap 'Log Cup' to record another glass of water and hit your daily goal!`;
    }
    if (activeTrip) {
      return `${t("askIris", "Iris")} says: Your trip to ${activeTrip.destination} is coming up! Let me help you compile your custom travel packing checklist and track flight schedules today.`;
    }
    return `${t("askIris", "Iris")} says: Establishing a 15-minute morning meditation ritual builds cognitive resilience and reduces stress levels by 23%.`;
  };

  // State for inside-Home tabs
  const [activeSubTab, setActiveSubTab] = React.useState<"overview" | "wellness" | "checklist" | "ledger">("overview");

  const subTabs = [
    { id: "overview", label: t("overview", "Overview"), icon: Sparkles },
    { id: "wellness", label: t("wellness", "Wellness"), icon: Heart },
    { id: "checklist", label: t("checklist", "Checklist"), icon: CheckCircle2 },
    { id: "ledger", label: t("ledger", "Ledger"), icon: DollarSign }
  ] as const;

  return (
    <div className="h-full flex flex-col overflow-hidden space-y-4">
      {/* Search Header Hero Bar - Mimicking Airbnb search trigger */}
      <div 
        onClick={onSearchFocus}
        className="bg-white border border-neutral-200/80 rounded-full py-2.5 px-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between cursor-pointer group shrink-0"
      >
        <div className="flex items-center gap-3">
          <Search className="w-4 h-4 text-[#FF385C]" />
          <div className="text-left">
            <p className="text-[11px] font-semibold text-neutral-800">{t("whereTo", "Where to? What's next?")}</p>
            <p className="text-[9px] text-neutral-400 font-normal">{t("searchTrips", "Search trips, tasks, documents...")}</p>
          </div>
        </div>
        <div className="bg-[#FF385C] text-white p-1.5 rounded-full group-hover:scale-105 transition-transform">
          <Compass className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Greeting and Elegant Weather Box */}
      <div className="flex justify-between items-center bg-transparent shrink-0">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-neutral-900 leading-tight">{getGreeting()}, {profileName.split(" ")[0]}</h1>
          <p className="text-[10px] text-neutral-500 mt-0.5">{t("subtitleHome", "Let's design a mindful, productive day today.")}</p>
        </div>
        <div className="bg-white border border-neutral-100 rounded-xl px-3 py-1.5 shadow-xs flex items-center gap-2 text-right">
          <div className="bg-[#FF385C]/10 p-1 rounded-lg text-[#FF385C]">
            <Sun className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <p className="text-[9px] text-neutral-400 font-medium leading-none">Kyoto, JP</p>
            <p className="text-xs font-bold text-neutral-800 leading-tight">24°C, Sunny</p>
          </div>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div className="grid grid-cols-4 gap-2 shrink-0">
        <button 
          onClick={() => onQuickAction("add-trip")}
          className="bg-white border border-neutral-150 rounded-xl py-2 flex flex-col items-center justify-center text-center shadow-xs hover:border-[#FF385C]/30 transition-all cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-[#FF385C]/10 text-[#FF385C] flex items-center justify-center mb-1">
            <Plus className="w-3.5 h-3.5" />
          </div>
          <span className="text-[9px] font-bold text-neutral-700">{t("addTrip", "Add Trip")}</span>
        </button>
        <button 
          onClick={onLogWater}
          className="bg-white border border-neutral-150 rounded-xl py-2 flex flex-col items-center justify-center text-center shadow-xs hover:border-blue-200 transition-all cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-1">
            <Droplet className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <span className="text-[9px] font-bold text-neutral-700">{t("logCup", "Log Cup")}</span>
        </button>
        <button 
          onClick={() => onNavigateTab("ai")}
          className="bg-white border border-neutral-150 rounded-xl py-2 flex flex-col items-center justify-center text-center shadow-xs hover:border-indigo-200 transition-all cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <span className="text-[9px] font-bold text-neutral-700">{t("askIris", "Ask Iris")}</span>
        </button>
        <button 
          onClick={() => onQuickAction("log-expense")}
          className="bg-white border border-neutral-150 rounded-xl py-2 flex flex-col items-center justify-center text-center shadow-xs hover:border-emerald-200 transition-all cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <span className="text-[9px] font-bold text-neutral-700">{t("expense", "Expense")}</span>
        </button>
      </div>

      {/* Internal Airbnb-style sub-tabs bar */}
      <div className="flex bg-neutral-100 p-1 rounded-2xl shrink-0">
        {subTabs.map(tab => {
          const isActive = activeSubTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${isActive ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500 hover:text-neutral-850"}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Scrollable inner widgets area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
        {activeSubTab === "overview" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* AI Daily Tip Card - Styled premium Airbnb experience */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-850 text-white rounded-2xl p-4 shadow-md relative overflow-hidden">
              <div className="absolute right-[-20px] bottom-[-20px] w-24 h-24 bg-[#FF385C]/15 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-[#FF385C] rounded-xl text-white shadow-sm mt-0.5 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[9px] uppercase font-bold tracking-wider text-[#FF385C]">{t("dailyInsight", "Iris Daily Insight")}</p>
                  <p className="text-[11px] leading-relaxed text-neutral-100 font-medium">
                    {getAIDailyTip()}
                  </p>
                </div>
              </div>
            </div>

            {/* Today's Schedule Timeline & Upcoming Trip Card */}
            {activeTrip ? (
              <div className="bg-white border border-neutral-150 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#FF385C]" />
                    <span className="text-xs font-bold text-neutral-800">{t("yourNextEscape", "Your Next Escape")}</span>
                  </div>
                  <button 
                    onClick={() => onNavigateTab("trips")}
                    className="text-[#FF385C] text-[10px] font-bold flex items-center gap-0.5"
                  >
                    {t("manage", "Manage")} <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="flex gap-4">
                  <img 
                    src={activeTrip.coverImage} 
                    alt={activeTrip.destination} 
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex flex-col justify-center space-y-0.5">
                    <span className="text-xs text-[#FF385C] font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {activeTrip.destination}
                    </span>
                    <h3 className="text-xs font-bold text-neutral-900">{activeTrip.destination === "Kyoto, Japan" ? "Autumn Getaway" : activeTrip.destination}</h3>
                    <p className="text-[10px] text-neutral-400">
                      {new Date(activeTrip.startDate).toLocaleDateString(lang === "Japanese" ? "ja-JP" : "en-US", { month: "short", day: "numeric" })} - {new Date(activeTrip.endDate).toLocaleDateString(lang === "Japanese" ? "ja-JP" : "en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-50 border border-neutral-150 rounded-2xl p-4 text-center space-y-2">
                <p className="text-xs text-neutral-500 font-medium">{t("noTripsActive", "No trips active yet")}</p>
                <button 
                  onClick={() => onNavigateTab("trips")}
                  className="bg-neutral-900 text-white rounded-full px-4 py-1.5 text-[10px] font-bold"
                >
                  {t("createTripItinerary", "Create Trip Itinerary")}
                </button>
              </div>
            )}
          </div>
        )}

        {activeSubTab === "wellness" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-3">
              {/* Hydration Reminder */}
              <div className="bg-white border border-neutral-150 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-500">{t("hydration", "Hydration")}</span>
                    <Droplet className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1">{t("dailyGoal", "Daily goal")}: {waterLog.goal} {t("cups", "cups")}</p>
                  <h3 className="text-md font-extrabold text-neutral-900 mt-1">{waterLog.current} <span className="text-[10px] text-neutral-500 font-semibold">{t("cups", "cups")}</span></h3>
                </div>
                
                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full bg-neutral-100 h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-1 rounded-full transition-all duration-500"
                      style={{ width: `${hydrationPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[8px] font-semibold text-neutral-400">
                    <span>{hydrationPercent}% {t("reached", "reached")}</span>
                    <button 
                      onClick={onLogWater}
                      className="text-blue-500 hover:underline"
                    >
                      + {t("add", "Add")}
                    </button>
                  </div>
                </div>
              </div>

              {/* Daily Habits Quick Look */}
              <div className="bg-white border border-neutral-150 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500">{t("habits", "Habits")}</span>
                    <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1">{t("streakTracker", "Streak tracker")}</p>
                  <div className="space-y-1.5 mt-2">
                    {habits.slice(0, 2).map(habit => (
                      <div 
                        key={habit.id}
                        onClick={() => onToggleHabit(habit.id)}
                        className="flex items-center justify-between cursor-pointer group"
                      >
                        <span className={`text-[10px] font-bold truncate max-w-[60px] ${habit.completedToday ? "line-through text-neutral-400" : "text-neutral-700"}`}>
                          {habit.name}
                        </span>
                        <span className={`text-[8px] font-extrabold px-1 py-0.5 rounded ${habit.completedToday ? "bg-rose-50 text-rose-500" : "bg-neutral-50 text-neutral-500"}`}>
                          {habit.streak}d
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => onNavigateTab("profile")}
                  className="text-neutral-500 text-[9px] font-extrabold text-left hover:underline"
                >
                  {t("manageHabits", "Manage Habits")} →
                </button>
              </div>
            </div>

            {/* Medicine Checklist */}
            <div className="bg-white border border-neutral-150 rounded-2xl p-4 shadow-sm space-y-2.5">
              <div className="flex items-center gap-1.5 border-b border-neutral-100 pb-1.5">
                <Heart className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-bold text-neutral-800">{t("medicineChecklist", "Medicines Checklist")}</span>
              </div>
              {medicines.length === 0 ? (
                <p className="text-[10px] text-neutral-400 py-1.5 text-center">{t("noMedicineReminders", "No medicine reminders configured.")}</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {medicines.map(med => (
                    <div 
                      key={med.id}
                      onClick={() => onToggleMedicine(med.id)}
                      className="flex items-start gap-2 bg-neutral-50 border border-neutral-150 rounded-xl p-2 cursor-pointer hover:bg-neutral-100 transition-all"
                    >
                      {med.takenToday ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-neutral-300 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className={`text-[10px] font-bold leading-tight ${med.takenToday ? "line-through text-neutral-400" : "text-neutral-700"}`}>
                          {med.name}
                        </p>
                        <p className="text-[8px] text-neutral-400">{med.time} • {med.dosage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeSubTab === "checklist" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Daily Tasks Checklists */}
            <div className="bg-white border border-neutral-150 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF385C]" />
                  <span className="text-xs font-bold text-neutral-800">{t("dailyTasksChecklist", "Daily Tasks Checklist")}</span>
                </div>
                <button 
                  onClick={() => onNavigateTab("profile")}
                  className="text-[#FF385C] text-[10px] font-bold"
                >
                  {t("configureTasks", "Configure Tasks")}
                </button>
              </div>

              {pendingTasks.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-xs text-neutral-400">{t("allTasksCompleted", "All tasks completed! Grab a tea. ☕")}</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto no-scrollbar">
                  {pendingTasks.map(task => (
                    <div 
                      key={task.id}
                      onClick={() => onToggleTask(task.id)}
                      className="flex items-center gap-3 py-2 cursor-pointer hover:bg-neutral-50 rounded-xl px-2 transition-all border border-neutral-100 bg-white"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#FF385C] shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-neutral-300 shrink-0 hover:text-[#FF385C]" />
                      )}
                      <div className="flex-1">
                        <span className="text-xs text-neutral-700 font-bold">{task.title}</span>
                        <span className="text-[8px] font-bold uppercase tracking-wider bg-neutral-50 text-neutral-400 border border-neutral-150 px-1.5 py-0.5 rounded-md ml-2 inline-block">
                          {task.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeSubTab === "ledger" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-3">
              {/* Bills Alerts Dashboard */}
              <div className="bg-white border border-neutral-150 rounded-2xl p-4 shadow-sm space-y-2">
                <div className="flex items-center gap-1.5 border-b border-neutral-100 pb-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span className="text-xs font-bold text-neutral-800">{t("billsDue", "Bills Due")}</span>
                </div>
                <div className="space-y-2 max-h-[120px] overflow-y-auto no-scrollbar">
                  {unpaidBills.length === 0 ? (
                    <p className="text-[10px] text-neutral-400 py-2">{t("noBillsDue", "No bills due! 🎉")}</p>
                  ) : (
                    unpaidBills.map(bill => (
                      <div key={bill.id} className="flex justify-between items-start border-b border-neutral-50 pb-1 last:border-0">
                        <div>
                          <h4 className="text-[9px] font-bold text-neutral-700 line-clamp-1 leading-tight">{bill.title}</h4>
                          <p className="text-[8px] text-amber-600 font-bold mt-0.5">{t("due", "Due")} {new Date(bill.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                        </div>
                        <span className="text-[9px] font-bold text-neutral-900 shrink-0">
                          {formatCurrency(bill.amount, currency)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Finance Tracker Summary */}
              <div className="bg-white border border-neutral-150 rounded-2xl p-4 shadow-sm space-y-2">
                <div className="flex items-center gap-1.5 border-b border-neutral-100 pb-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs font-bold text-neutral-800">{t("ledgerSummary", "Ledger Summary")}</span>
                </div>
                <div className="space-y-1 text-center py-2 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="text-[8px] uppercase tracking-wider text-neutral-400 font-extrabold">{t("recentMonthSpend", "Recent Month Spend")}</span>
                  <p className="text-sm font-black text-[#FF385C]">
                    {formatCurrency(recentExpenses.filter(e => e.type === "expense").reduce((sum, e) => sum + e.amount, 0), currency)}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Expenses List */}
            <div className="bg-white border border-neutral-150 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                <span className="text-xs font-bold text-neutral-800">{t("recentTransactions", "Recent Transactions")}</span>
                <button 
                  onClick={() => onNavigateTab("profile")}
                  className="text-neutral-400 text-[10px] font-bold hover:text-neutral-800"
                >
                  {t("manageLedger", "Manage Ledger")} →
                </button>
              </div>

              <div className="space-y-2 max-h-[140px] overflow-y-auto no-scrollbar">
                {recentExpenses.length === 0 ? (
                  <p className="text-xs text-neutral-400 text-center py-4">{t("noRecentExpenses", "No recent expenses logged.")}</p>
                ) : (
                  recentExpenses.slice(0, 3).map(exp => (
                    <div key={exp.id} className="flex justify-between items-center text-xs border-b border-neutral-50 pb-1.5 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${exp.type === 'income' ? 'bg-emerald-500' : 'bg-[#FF385C]'}`} />
                        <div>
                          <p className="font-bold text-neutral-700 line-clamp-1">{exp.description}</p>
                          <p className="text-[9px] text-neutral-400">{exp.category} • {new Date(exp.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`font-bold ${exp.type === 'income' ? 'text-emerald-500' : 'text-neutral-850'}`}>
                        {exp.type === 'income' ? '+' : '-'}{formatCurrency(exp.amount, currency)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
