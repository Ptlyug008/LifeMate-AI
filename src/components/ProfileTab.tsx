import React, { useState } from "react";
import { 
  UserProfile, 
  UserSettings, 
  Task, 
  Note, 
  Bill, 
  Expense, 
  MedicineReminder, 
  Habit, 
  DocumentVaultItem,
  WaterLog
} from "../types";
import { formatCurrency } from "../utils";
import { 
  User, 
  Settings, 
  ListTodo, 
  FileText, 
  Calendar as CalendarIcon, 
  ShoppingCart, 
  PiggyBank, 
  Heart, 
  Droplet, 
  Flame, 
  ShieldAlert, 
  FolderLock, 
  BellRing, 
  Plus, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ArrowLeft, 
  DollarSign, 
  FileCode,
  Lock,
  Moon,
  Sun,
  Trash2,
  Volume2
} from "lucide-react";

interface ProfileTabProps {
  profile: UserProfile;
  settings: UserSettings;
  tasks: Task[];
  notes: Note[];
  bills: Bill[];
  expenses: Expense[];
  medicines: MedicineReminder[];
  waterLog: WaterLog;
  habits: Habit[];
  documents: DocumentVaultItem[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onUpdateSettings: (updated: Partial<UserSettings>) => void;
  // Mutations from App
  onAddTask: (title: string, category: any) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onAddNote: (title: string, content: string) => void;
  onDeleteNote: (id: string) => void;
  onAddBill: (title: string, amount: number, dueDate: string, category: string) => void;
  onMarkBillPaid: (id: string) => void;
  onDeleteBill: (id: string) => void;
  onAddExpense: (description: string, amount: number, type: "income" | "expense", category: string) => void;
  onDeleteExpense: (id: string) => void;
  onAddMedicine: (name: string, time: string, dosage: string) => void;
  onToggleMedicine: (id: string) => void;
  onDeleteMedicine: (id: string) => void;
  onAddHabit: (name: string, frequency: string) => void;
  onToggleHabit: (id: string) => void;
  onDeleteHabit: (id: string) => void;
  onLogWaterCup: () => void;
  onResetWaterCup: () => void;
  onAddDocument: (name: string, category: any, size: string) => void;
  onDeleteDocument: (id: string) => void;
  onResetData: () => void;
  onLoadDemoData?: () => void;
}

export default function ProfileTab({
  profile,
  settings,
  tasks,
  notes,
  bills,
  expenses,
  medicines,
  waterLog,
  habits,
  onUpdateProfile,
  onUpdateSettings,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onAddNote,
  onDeleteNote,
  onAddBill,
  onMarkBillPaid,
  onDeleteBill,
  onAddExpense,
  onDeleteExpense,
  onAddMedicine,
  onToggleMedicine,
  onDeleteMedicine,
  onAddHabit,
  onToggleHabit,
  onDeleteHabit,
  onLogWaterCup,
  onResetWaterCup,
  onAddDocument,
  onDeleteDocument,
  onResetData,
  onLoadDemoData,
  documents
}: ProfileTabProps) {
  // Navigation inside profile tab to detailed sub-views
  const [activeSubPanel, setActiveSubPanel] = useState<string | null>(null);

  // Form states for sub-panels
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCat, setNewTaskCat] = useState<"Personal" | "Work" | "Grocery" | "Life">("Personal");

  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");

  const [newBillTitle, setNewBillTitle] = useState("");
  const [newBillAmount, setNewBillAmount] = useState("");
  const [newBillDueDate, setNewBillDueDate] = useState("2026-07-15");
  const [newBillCat, setNewBillCat] = useState("Utilities");

  const [newExpDesc, setNewExpDesc] = useState("");
  const [newExpAmt, setNewExpAmt] = useState("");
  const [newExpType, setNewExpType] = useState<"income" | "expense">("expense");
  const [newExpCat, setNewExpCat] = useState("Food");

  const [newMedName, setNewMedName] = useState("");
  const [newMedTime, setNewMedTime] = useState("08:00 AM");
  const [newMedDosage, setNewMedDosage] = useState("1 pill");

  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitFreq, setNewHabitFreq] = useState("Daily");

  const [newDocName, setNewDocName] = useState("");
  const [newDocCat, setNewDocCat] = useState<"Ticket" | "Identity" | "Hotel" | "Insurance" | "Other">("Identity");

  const [emergencyPhoneNumbers, setEmergencyPhoneNumbers] = useState<string[]>([
    "National Emergency Line: 911",
    "Local Medical Responders: 112",
    "Mental Health Support Line: 988",
    "Family Emergency Primary: 555-0192"
  ]);
  const [newEmergencyContact, setNewEmergencyContact] = useState("");

  // Edit profile toggle
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);

  const handleSaveProfile = () => {
    onUpdateProfile({ name: editName, email: editEmail });
    setIsEditingProfile(false);
  };

  // Sub panel submit helpers
  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    onAddTask(newTaskTitle, newTaskCat);
    setNewTaskTitle("");
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle || !newNoteContent) return;
    onAddNote(newNoteTitle, newNoteContent);
    setNewNoteTitle("");
    setNewNoteContent("");
  };

  const handleAddBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBillTitle || !newBillAmount) return;
    onAddBill(newBillTitle, parseFloat(newBillAmount), newBillDueDate, newBillCat);
    setNewBillTitle("");
    setNewBillAmount("");
  };

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpDesc || !newExpAmt) return;
    onAddExpense(newExpDesc, parseFloat(newExpAmt), newExpType, newExpCat);
    setNewExpDesc("");
    setNewExpAmt("");
  };

  const handleAddMedicineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName) return;
    onAddMedicine(newMedName, newMedTime, newMedDosage);
    setNewMedName("");
  };

  const handleAddHabitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName) return;
    onAddHabit(newHabitName, newHabitFreq);
    setNewHabitName("");
  };

  const handleAddDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;
    onAddDocument(newDocName, newDocCat, "1.2 MB");
    setNewDocName("");
  };

  const handleAddEmergencySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmergencyContact) return;
    setEmergencyPhoneNumbers([...emergencyPhoneNumbers, newEmergencyContact.trim()]);
    setNewEmergencyContact("");
  };

  // Bento cards for Daily Life features
  const BENTO_CARDS = [
    { id: "todo", title: "To-do List", icon: ListTodo, color: "text-[#FF385C] bg-[#FF385C]/10", count: `${tasks.filter(t=>!t.completed).length} pending` },
    { id: "notes", title: "Notes", icon: FileText, color: "text-amber-500 bg-amber-50", count: `${notes.length} entries` },
    { id: "finance", title: "Finances", icon: PiggyBank, color: "text-emerald-500 bg-emerald-50", count: "Ledger & Budgets" },
    { id: "hydration", title: "Water Tracker", icon: Droplet, color: "text-blue-500 bg-blue-50", count: `${waterLog.current}/${waterLog.goal} cups` },
    { id: "medicine", title: "Medicines", icon: Heart, color: "text-rose-500 bg-rose-50", count: `${medicines.filter(m=>!m.takenToday).length} scheduled` },
    { id: "habits", title: "Habit Tracker", icon: Flame, color: "text-violet-500 bg-violet-50", count: `${habits.length} routines` },
    { id: "documents", title: "Document Vault", icon: FolderLock, color: "text-indigo-500 bg-indigo-50", count: "Secure PDFs" },
    { id: "bills", title: "Bill Alerts", icon: BellRing, color: "text-amber-600 bg-amber-50", count: `${bills.filter(b=>!b.isPaid).length} unpaid` },
    { id: "emergency", title: "Emergency Desk", icon: ShieldAlert, color: "text-red-500 bg-red-50", count: "Helplines" }
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      {activeSubPanel === null ? (
        /* MAIN PROFILE SCREEN VIEW */
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-4">
          {/* Profile User Header Panel - styled elegantly like Airbnb */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className="w-16 h-16 rounded-full object-cover border border-neutral-200 shadow-xs"
              />
              {isEditingProfile ? (
                <div className="space-y-2">
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-neutral-50 border border-neutral-200 rounded-xl px-2.5 py-1 text-xs font-bold text-neutral-800"
                  />
                  <input 
                    type="email" 
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="bg-neutral-50 border border-neutral-200 rounded-xl px-2.5 py-1 text-[10px] font-medium text-neutral-600 block"
                  />
                  <button 
                    onClick={handleSaveProfile}
                    className="bg-[#FF385C] text-white px-3 py-1 rounded-full text-[10px] font-bold"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-md font-extrabold text-neutral-900 leading-none">{profile.name}</h2>
                  <p className="text-[10px] text-neutral-400 mt-1">{profile.email}</p>
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="text-[#FF385C] text-[10px] font-extrabold mt-2 hover:underline"
                  >
                    Edit Profile Details
                  </button>
                </div>
              )}
            </div>

            {/* Quick stats summary card */}
            <div className="text-right shrink-0 bg-neutral-50 px-4 py-3 rounded-2xl border border-neutral-100 hidden sm:block">
              <p className="text-[9px] uppercase font-bold text-neutral-400">Streak Level</p>
              <h3 className="text-md font-black text-[#FF385C] mt-0.5">🔥 12 Days</h3>
            </div>
          </div>

          {/* Title of Daily Life Features Bento Dashboard */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Daily Lifestyle Bento Suite</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Toggle and edit modular trackers from one hub.</p>
          </div>

          {/* Bento Grid layout representing all 11 Daily Life Features */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {BENTO_CARDS.map(bento => {
              const Icon = bento.icon;
              return (
                <div
                  key={bento.id}
                  onClick={() => setActiveSubPanel(bento.id)}
                  className="bg-white border border-neutral-200 hover:border-[#FF385C]/30 hover:shadow-xs rounded-3xl p-4 flex flex-col justify-between h-32 transition-all cursor-pointer shadow-xs group"
                >
                  <div className="flex justify-between items-start">
                    <div className={`p-2.5 rounded-2xl ${bento.color} shrink-0`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800">{bento.title}</h4>
                    <p className="text-[10px] text-neutral-400 font-semibold mt-0.5 leading-none">{bento.count}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Settings Section underneath */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-4 shadow-xs space-y-3.5">
            <h3 className="text-xs font-bold text-neutral-800 flex items-center gap-1.5 border-b border-neutral-100 pb-2">
              <Settings className="w-4.5 h-4.5 text-neutral-400" /> Platform Configurations
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-neutral-700">Preferred Currency</span>
                <select 
                  value={settings.currency} 
                  onChange={(e) => onUpdateSettings({ currency: e.target.value })}
                  className="bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-1 font-bold text-neutral-600 focus:outline-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-neutral-700">Language Pack</span>
                <select 
                  value={settings.language} 
                  onChange={(e) => onUpdateSettings({ language: e.target.value })}
                  className="bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-1 font-bold text-neutral-600 focus:outline-none"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>

              {/* Danger Zone */}
              <div className="border-t border-neutral-100 pt-3.5 flex justify-between items-center">
                <div>
                  <span className="font-bold text-red-500 block">Clear Local State</span>
                  <span className="text-[10px] text-neutral-400">Revert all local storage variables.</span>
                </div>
                <button 
                  onClick={onResetData}
                  className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 px-3 py-1.5 rounded-full text-[10px] font-bold cursor-pointer transition-all shrink-0"
                >
                  Reset App
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* EXPANDED SUB PANEL VIEW */
        <div className="h-full flex flex-col overflow-hidden space-y-3 animate-in slide-in-from-right-4 duration-200">
          {/* Subpanel Header Back Button */}
          <button 
            onClick={() => setActiveSubPanel(null)}
            className="flex items-center gap-2 text-neutral-500 hover:text-neutral-800 text-xs font-bold pb-1 cursor-pointer transition-all shrink-0"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          {/* Locked Inner Scroll Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-4">

          {/* 1. TODO LIST MANAGER */}
          {activeSubPanel === "todo" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                <h2 className="text-md font-extrabold text-neutral-900">Task To-Do Manager</h2>
                <span className="text-xs bg-neutral-100 text-neutral-500 font-bold px-2 py-0.5 rounded-lg">
                  {tasks.filter(t=>!t.completed).length} pending
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleAddTaskSubmit} className="bg-neutral-50 border border-neutral-200 p-3 rounded-2xl shadow-xs space-y-2">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="New task name..." 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    required
                    className="flex-1 bg-white border border-neutral-150 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none"
                  />
                  <select 
                    value={newTaskCat} 
                    onChange={(e) => setNewTaskCat(e.target.value as any)}
                    className="bg-white border border-neutral-150 rounded-xl px-2.5 py-1 text-xs font-bold text-neutral-600 focus:outline-none"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Grocery">Grocery</option>
                    <option value="Life">Life</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-[#FF385C] text-white py-2 rounded-xl text-xs font-bold hover:bg-rose-600 cursor-pointer"
                >
                  Create Task
                </button>
              </form>

              {/* Tasks List */}
              <div className="space-y-2">
                {tasks.map(task => (
                  <div key={task.id} className="bg-white border border-neutral-150 p-3 rounded-2xl flex justify-between items-center text-xs">
                    <div 
                      onClick={() => onToggleTask(task.id)}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-[#FF385C]" />
                      ) : (
                        <Circle className="w-4.5 h-4.5 text-neutral-300 hover:text-[#FF385C]" />
                      )}
                      <div>
                        <p className={`font-semibold ${task.completed ? "line-through text-neutral-400" : "text-neutral-800"}`}>
                          {task.title}
                        </p>
                        <span className="text-[8px] uppercase tracking-wider bg-neutral-50 px-2 py-0.5 rounded text-neutral-400 font-bold font-sans">
                          {task.category}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => onDeleteTask(task.id)}
                      className="text-neutral-300 hover:text-red-500 p-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. NOTES MANAGER */}
          {activeSubPanel === "notes" && (
            <div className="space-y-4">
              <h2 className="text-md font-extrabold text-neutral-900 border-b border-neutral-100 pb-2">Notes & Ideas Drawer</h2>
              
              <form onSubmit={handleAddNoteSubmit} className="bg-neutral-50 border border-neutral-200 p-4 rounded-2xl shadow-xs space-y-3">
                <input 
                  type="text" 
                  placeholder="Note Title" 
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  required
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                />
                <textarea 
                  placeholder="Draft your thoughts here..." 
                  rows={4}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  required
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                />
                <button 
                  type="submit" 
                  className="w-full bg-neutral-900 text-white py-2 rounded-xl text-xs font-bold hover:bg-neutral-850 cursor-pointer"
                >
                  Save Note Entry
                </button>
              </form>

              <div className="grid grid-cols-1 gap-3.5">
                {notes.map(note => (
                  <div key={note.id} className="bg-white border border-neutral-150 p-4 rounded-3xl space-y-2 shadow-xs">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xs font-bold text-neutral-900">{note.title}</h3>
                      <button 
                        onClick={() => onDeleteNote(note.id)}
                        className="text-neutral-300 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                    {/* Render newlines */}
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {note.content.split("\n").map((l, idx) => (
                        <React.Fragment key={idx}>
                          {l}
                          {idx < note.content.split("\n").length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </p>
                    <p className="text-[9px] text-neutral-400 pt-1">
                      {new Date(note.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. FINANCE TRACKER */}
          {activeSubPanel === "finance" && (
            <div className="space-y-4">
              <h2 className="text-md font-extrabold text-neutral-900 border-b border-neutral-100 pb-2">Household Ledger & Finance</h2>

              {/* Add expense */}
              <form onSubmit={handleAddExpenseSubmit} className="bg-neutral-50 border border-neutral-200 p-4 rounded-2xl shadow-xs space-y-3">
                <h4 className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">Add Income / Expense log</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <input 
                    type="text" 
                    placeholder="Description" 
                    value={newExpDesc}
                    onChange={(e) => setNewExpDesc(e.target.value)}
                    required
                    className="bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  />
                  <input 
                    type="number" 
                    placeholder="Amount ($)" 
                    value={newExpAmt}
                    onChange={(e) => setNewExpAmt(e.target.value)}
                    required
                    className="bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <select 
                    value={newExpType} 
                    onChange={(e) => setNewExpType(e.target.value as any)}
                    className="bg-white border border-neutral-200 rounded-xl py-2 px-3 text-xs font-bold text-neutral-600 focus:outline-none"
                  >
                    <option value="expense">Expense (-)</option>
                    <option value="income">Income (+)</option>
                  </select>
                  <select 
                    value={newExpCat} 
                    onChange={(e) => setNewExpCat(e.target.value)}
                    className="bg-white border border-neutral-200 rounded-xl py-2 px-3 text-xs font-bold text-neutral-600 focus:outline-none"
                  >
                    <option value="Food">Food & Dining</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Transport">Transport</option>
                    <option value="Salary">Salary</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-[#FF385C] text-white py-2 rounded-xl text-xs font-bold hover:bg-rose-600 cursor-pointer"
                >
                  Log Transaction
                </button>
              </form>

              {/* Transactions list */}
              <div className="space-y-2">
                {expenses.map(exp => (
                  <div key={exp.id} className="bg-white border border-neutral-150 p-3.5 rounded-2xl flex justify-between items-center text-xs shadow-xs">
                    <div>
                      <p className="font-bold text-neutral-800">{exp.description}</p>
                      <p className="text-[9px] text-neutral-400">{exp.category} • {new Date(exp.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-extrabold ${exp.type === "income" ? "text-emerald-500" : "text-neutral-800"}`}>
                        {exp.type === "income" ? "+" : "-"}{formatCurrency(exp.amount)}
                      </span>
                      <button 
                        onClick={() => onDeleteExpense(exp.id)}
                        className="text-neutral-300 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. WATER REMINDER */}
          {activeSubPanel === "hydration" && (
            <div className="space-y-5 text-center">
              <h2 className="text-md font-extrabold text-neutral-900 border-b border-neutral-100 pb-2 text-left">Water Hydration Desk</h2>
              
              <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 space-y-4 max-w-sm mx-auto">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-500">
                  <Droplet className="w-8 h-8 text-blue-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-neutral-900">{waterLog.current} / {waterLog.goal} cups</h3>
                  <p className="text-xs text-neutral-500 mt-1">Goal: 8 cups a day (2.0L) to support cognitive focus.</p>
                </div>

                <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((waterLog.current / waterLog.goal) * 100, 100)}%` }}
                  />
                </div>

                <div className="flex gap-2.5">
                  <button 
                    onClick={onResetWaterCup}
                    className="flex-1 bg-white border border-neutral-200 text-neutral-500 py-3 rounded-full text-xs font-bold hover:bg-neutral-50 cursor-pointer"
                  >
                    Reset Count
                  </button>
                  <button 
                    onClick={onLogWaterCup}
                    className="flex-1 bg-blue-500 text-white py-3 rounded-full text-xs font-bold hover:bg-blue-600 shadow-sm cursor-pointer"
                  >
                    + Add Cup
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. MEDICINES LOG */}
          {activeSubPanel === "medicine" && (
            <div className="space-y-4">
              <h2 className="text-md font-extrabold text-neutral-900 border-b border-neutral-100 pb-2">Medicine & Health Reminder</h2>

              <form onSubmit={handleAddMedicineSubmit} className="bg-neutral-50 border border-neutral-200 p-3 rounded-2xl shadow-xs space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Medicine Name" 
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    required
                    className="bg-white border border-neutral-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="e.g. 08:00 AM" 
                    value={newMedTime}
                    onChange={(e) => setNewMedTime(e.target.value)}
                    required
                    className="bg-white border border-neutral-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Dosage (e.g. 1 capsule)" 
                  value={newMedDosage}
                  onChange={(e) => setNewMedDosage(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
                />
                <button 
                  type="submit" 
                  className="w-full bg-neutral-900 text-white py-2 rounded-xl text-xs font-bold hover:bg-neutral-850 cursor-pointer"
                >
                  Save Schedule
                </button>
              </form>

              <div className="space-y-2.5">
                {medicines.map(med => (
                  <div key={med.id} className="bg-white border border-neutral-150 p-3.5 rounded-2xl flex justify-between items-center text-xs">
                    <div 
                      onClick={() => onToggleMedicine(med.id)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      {med.takenToday ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-rose-500" />
                      ) : (
                        <Circle className="w-4.5 h-4.5 text-neutral-300" />
                      )}
                      <div>
                        <p className={`font-bold ${med.takenToday ? "line-through text-neutral-400" : "text-neutral-800"}`}>
                          {med.name}
                        </p>
                        <p className="text-[9px] text-neutral-400">{med.time} • {med.dosage}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onDeleteMedicine(med.id)}
                      className="text-neutral-300 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. HABITS TRACKER */}
          {activeSubPanel === "habits" && (
            <div className="space-y-4">
              <h2 className="text-md font-extrabold text-neutral-900 border-b border-neutral-100 pb-2">Habits & Routines Tracker</h2>

              <form onSubmit={handleAddHabitSubmit} className="bg-neutral-50 border border-neutral-200 p-3.5 rounded-2xl shadow-xs space-y-2.5">
                <input 
                  type="text" 
                  placeholder="e.g. Read 10 Pages or Daily Walk" 
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  required
                  className="w-full bg-white border border-neutral-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
                />
                <div className="flex gap-2">
                  <select 
                    value={newHabitFreq} 
                    onChange={(e) => setNewHabitFreq(e.target.value)}
                    className="flex-1 bg-white border border-neutral-250 rounded-xl py-1.5 px-3 text-xs font-bold text-neutral-600 focus:outline-none"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                  <button 
                    type="submit" 
                    className="bg-neutral-900 text-white rounded-xl px-4 text-xs font-bold hover:bg-neutral-850 cursor-pointer"
                  >
                    Add Routine
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                {habits.map(habit => (
                  <div key={habit.id} className="bg-white border border-neutral-150 p-3.5 rounded-2xl flex justify-between items-center text-xs">
                    <div 
                      onClick={() => onToggleHabit(habit.id)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      {habit.completedToday ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-violet-500" />
                      ) : (
                        <Circle className="w-4.5 h-4.5 text-neutral-300" />
                      )}
                      <div>
                        <p className={`font-bold ${habit.completedToday ? "line-through text-neutral-400" : "text-neutral-800"}`}>
                          {habit.name}
                        </p>
                        <p className="text-[9px] text-neutral-400">{habit.frequency} frequency</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] bg-violet-50 text-violet-600 font-extrabold px-2 py-0.5 rounded-lg">
                        🔥 {habit.streak}d streak
                      </span>
                      <button 
                        onClick={() => onDeleteHabit(habit.id)}
                        className="text-neutral-300 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. DOCUMENT VAULT */}
          {activeSubPanel === "documents" && (
            <div className="space-y-4">
              <h2 className="text-md font-extrabold text-neutral-900 border-b border-neutral-100 pb-2">Secure Document Vault</h2>

              <form onSubmit={handleAddDocSubmit} className="bg-neutral-50 border border-neutral-200 p-3.5 rounded-2xl shadow-xs space-y-2">
                <input 
                  type="text" 
                  placeholder="Document Name (e.g. Identity Passport)" 
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  required
                  className="w-full bg-white border border-neutral-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
                />
                <div className="flex gap-2">
                  <select 
                    value={newDocCat} 
                    onChange={(e) => setNewDocCat(e.target.value as any)}
                    className="flex-1 bg-white border border-neutral-250 rounded-xl py-1.5 px-3 text-xs font-bold text-neutral-600 focus:outline-none"
                  >
                    <option value="Identity">🪪 Identity Card</option>
                    <option value="Ticket">🎟️ Travel Ticket</option>
                    <option value="Hotel">🏨 Hotel booking</option>
                    <option value="Insurance">📄 Insurance</option>
                    <option value="Other">💼 Miscellaneous</option>
                  </select>
                  <button 
                    type="submit" 
                    className="bg-neutral-900 text-white rounded-xl px-4 text-xs font-bold hover:bg-neutral-850 cursor-pointer"
                  >
                    Secure Upload
                  </button>
                </div>
              </form>

              {/* Secure simulated document lists */}
              <div className="space-y-2">
                {documents.map(doc => (
                  <div key={doc.id} className="bg-white border border-neutral-150 p-3 rounded-2xl flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-neutral-50 rounded-lg text-neutral-500">
                        <FolderLock className="w-4 h-4 text-neutral-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-700">{doc.name}</h4>
                        <p className="text-[8px] text-neutral-400">{doc.category} • {doc.fileSize} • Saved {doc.uploadDate}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onDeleteDocument(doc.id)}
                      className="text-neutral-300 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. BILLS ALERTS */}
          {activeSubPanel === "bills" && (
            <div className="space-y-4">
              <h2 className="text-md font-extrabold text-neutral-900 border-b border-neutral-100 pb-2">Monthly Bill reminders</h2>

              <form onSubmit={handleAddBillSubmit} className="bg-neutral-50 border border-neutral-200 p-3.5 rounded-2xl shadow-xs space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Bill Title" 
                    value={newBillTitle}
                    onChange={(e) => setNewBillTitle(e.target.value)}
                    required
                    className="bg-white border border-neutral-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
                  />
                  <input 
                    type="number" 
                    placeholder="Due Amount ($)" 
                    value={newBillAmount}
                    onChange={(e) => setNewBillAmount(e.target.value)}
                    required
                    className="bg-white border border-neutral-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="date" 
                    value={newBillDueDate}
                    onChange={(e) => setNewBillDueDate(e.target.value)}
                    className="bg-white border border-neutral-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
                  />
                  <select 
                    value={newBillCat} 
                    onChange={(e) => setNewBillCat(e.target.value)}
                    className="bg-white border border-neutral-200 rounded-xl px-2 py-1 text-xs font-bold text-neutral-600 focus:outline-none"
                  >
                    <option value="Utilities">Utilities</option>
                    <option value="Rent">Rent</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Subscription">Subscriptions</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-[#FF385C] text-white py-2 rounded-xl text-xs font-bold hover:bg-rose-600 cursor-pointer"
                >
                  Create Bill Due
                </button>
              </form>

              <div className="space-y-2">
                {bills.map(bill => (
                  <div key={bill.id} className="bg-white border border-neutral-150 p-3.5 rounded-2xl flex justify-between items-center text-xs shadow-xs">
                    <div>
                      <p className="font-bold text-neutral-800">{bill.title}</p>
                      <p className={`text-[9px] font-bold mt-0.5 ${bill.isPaid ? "text-emerald-500" : "text-amber-500 animate-pulse"}`}>
                        {bill.isPaid ? "Paid in full" : `Due ${bill.dueDate}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-neutral-800">
                        {formatCurrency(bill.amount)}
                      </span>
                      {!bill.isPaid && (
                        <button 
                          onClick={() => onMarkBillPaid(bill.id)}
                          className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-500 px-2.5 py-1 rounded-xl font-bold text-[9px] cursor-pointer"
                        >
                          Settle
                        </button>
                      )}
                      <button 
                        onClick={() => onDeleteBill(bill.id)}
                        className="text-neutral-300 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. EMERGENCY CONTACTS DESK */}
          {activeSubPanel === "emergency" && (
            <div className="space-y-4">
              <h2 className="text-md font-extrabold text-neutral-900 border-b border-neutral-100 pb-2">Emergency Contacts Suite</h2>

              <form onSubmit={handleAddEmergencySubmit} className="flex gap-2 bg-neutral-50 p-2.5 border border-neutral-250 rounded-2xl">
                <input 
                  type="text" 
                  placeholder="e.g. Doctor primary: 555-2911" 
                  value={newEmergencyContact}
                  onChange={(e) => setNewEmergencyContact(e.target.value)}
                  required
                  className="flex-1 bg-white border border-neutral-150 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none"
                />
                <button 
                  type="submit" 
                  className="bg-red-500 text-white rounded-xl px-4 text-xs font-bold hover:bg-red-600 cursor-pointer"
                >
                  Save Number
                </button>
              </form>

              <div className="space-y-2.5">
                {emergencyPhoneNumbers.map((phone, idx) => (
                  <div key={idx} className="bg-red-50/50 border border-red-100 p-3 rounded-2xl flex justify-between items-center text-xs">
                    <span className="font-bold text-neutral-700 leading-relaxed">{phone}</span>
                    <button 
                      onClick={() => setEmergencyPhoneNumbers(emergencyPhoneNumbers.filter((_, i) => i !== idx))}
                      className="text-neutral-300 hover:text-red-500 p-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
}
