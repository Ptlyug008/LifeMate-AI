import React, { useState } from "react";
import { Trip, ItineraryItem, PackingItem, TripExpense, DocumentVaultItem } from "../types";
import { formatCurrency } from "../utils";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft, 
  Info, 
  Plane, 
  Hotel, 
  Map, 
  DollarSign, 
  FileText, 
  Coins, 
  AlertCircle, 
  CloudSun, 
  Trash2,
  Share2
} from "lucide-react";

import { TRANSLATIONS, Language } from "../translations";

interface TripsTabProps {
  trips: Trip[];
  onAddTrip: (trip: Omit<Trip, "id">) => void;
  onDeleteTrip: (id: string) => void;
  onUpdateTrip: (tripId: string, updated: Partial<Trip>) => void;
  onAskIrisTripRecommendations: (destination: string) => void;
  language: string;
  currency: string;
}

export default function TripsTab({ 
  trips, 
  onAddTrip, 
  onDeleteTrip, 
  onUpdateTrip, 
  onAskIrisTripRecommendations,
  language,
  currency
}: TripsTabProps) {
  const lang = (language as Language) || "English";
  const t = (key: string, fallback?: string) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS["English"]?.[key] || fallback || key;
  };

  const [selectedTripId, setSelectedTripId] = useState<string | null>(trips[0]?.id || null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Trip creation form states
  const [dest, setDest] = useState("");
  const [sDate, setSDate] = useState("2026-10-15");
  const [eDate, setEDate] = useState("2026-10-22");
  const [budgetVal, setBudgetVal] = useState<number>(3000);
  const [inviteeText, setInviteeText] = useState("");
  const [inviteesList, setInviteesList] = useState<string[]>([]);
  const [coverImgUrl, setCoverImgUrl] = useState("https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80");

  // Sub-tab selection inside Trip detail page
  const [tripSubTab, setTripSubTab] = useState<"itinerary" | "packing" | "budget" | "documents" | "tools">("itinerary");

  // New Itinerary form states
  const [showItiForm, setShowItiForm] = useState(false);
  const [itiType, setItiType] = useState<"flight" | "hotel" | "attraction" | "transport" | "other">("flight");
  const [itiTime, setItiTime] = useState("");
  const [itiTitle, setItiTitle] = useState("");
  const [itiLoc, setItiLoc] = useState("");
  const [itiNotes, setItiNotes] = useState("");
  const [itiCost, setItiCost] = useState("");
  const [itiConf, setItiConf] = useState("");

  // New Packing item form states
  const [packName, setPackName] = useState("");
  const [packCat, setPackCat] = useState("Clothing");

  // New Trip Expense states
  const [expDesc, setExpDesc] = useState("");
  const [expAmt, setExpAmt] = useState("");
  const [expCat, setExpCat] = useState("Food");

  // Currency converter simulator states
  const [convAmount, setConvAmount] = useState<string>("100");
  const [currencyRate, setCurrencyRate] = useState<number>(154.5); // USD to JPY defaults
  const [currencySymbol, setCurrencySymbol] = useState("¥");

  const selectedTrip = trips.find(t => t.id === selectedTripId);

  // Calculate stats for selected trip
  const totalSpent = selectedTrip?.expenses.reduce((sum, e) => sum + e.amount, 0) || 0;
  const budgetProgressPercent = selectedTrip ? Math.min(Math.round((totalSpent / selectedTrip.estimatedBudget) * 100), 100) : 0;

  // Cover image preset selector
  const coverPresets = [
    { name: "Kyoto Temple", url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80" },
    { name: "Paris Eiffel", url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80" },
    { name: "Tokyo Neon", url: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80" },
    { name: "Amalfi Cabins", url: "https://images.unsplash.com/photo-1486016006115-74a41448aea2?auto=format&fit=crop&w=800&q=80" }
  ];

  const handleAddInvitee = () => {
    if (inviteeText.trim() !== "") {
      setInviteesList([...inviteesList, inviteeText.trim()]);
      setInviteeText("");
    }
  };

  const handleRemoveInvitee = (index: number) => {
    setInviteesList(inviteesList.filter((_, i) => i !== index));
  };

  const handleCreateTripSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dest) return;

    onAddTrip({
      destination: dest,
      startDate: sDate,
      endDate: eDate,
      invitees: inviteesList,
      coverImage: coverImgUrl,
      estimatedBudget: budgetVal,
      expenses: [],
      itinerary: [
        {
          id: `iti-def-${Date.now()}`,
          type: "hotel",
          time: "03:00 PM",
          title: `Arrival Check-in in ${dest}`,
          location: dest,
          notes: "Trip officially starts today!"
        }
      ],
      packingList: [
        { id: `pack-def-1-${Date.now()}`, name: "Passports & Tickets", packed: true, category: "Documents" },
        { id: `pack-def-2-${Date.now()}`, name: "Toothbrush & Paste", packed: false, category: "Toiletries" },
        { id: `pack-def-3-${Date.now()}`, name: "Cash & Cards", packed: true, category: "Documents" }
      ],
      documents: [],
      emergencyContacts: [
        `Local Emergency Department: 112`,
        `Hospital Assist: Emergency line`,
        `Tourist Info Center: Helpline`
      ]
    });

    // Reset forms
    setDest("");
    setSDate("2026-10-15");
    setEDate("2026-10-22");
    setBudgetVal(3000);
    setInviteesList([]);
    setShowCreateModal(false);
  };

  // Mutators for active trip
  const handleTogglePackingItem = (packId: string) => {
    if (!selectedTrip) return;
    const nextList = selectedTrip.packingList.map(item => 
      item.id === packId ? { ...item, packed: !item.packed } : item
    );
    onUpdateTrip(selectedTrip.id, { packingList: nextList });
  };

  const handleAddPackingItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip || !packName) return;
    const newItem: PackingItem = {
      id: `pack-${Date.now()}`,
      name: packName,
      packed: false,
      category: packCat
    };
    onUpdateTrip(selectedTrip.id, { packingList: [...selectedTrip.packingList, newItem] });
    setPackName("");
  };

  const handleDeletePackingItem = (packId: string) => {
    if (!selectedTrip) return;
    const nextList = selectedTrip.packingList.filter(item => item.id !== packId);
    onUpdateTrip(selectedTrip.id, { packingList: nextList });
  };

  const handleAddItinerarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip || !itiTitle) return;
    const newItem: ItineraryItem = {
      id: `iti-${Date.now()}`,
      type: itiType,
      time: itiTime || "12:00 PM",
      title: itiTitle,
      location: itiLoc || undefined,
      notes: itiNotes || undefined,
      cost: itiCost ? parseFloat(itiCost) : undefined,
      confirmationNumber: itiConf || undefined
    };
    onUpdateTrip(selectedTrip.id, { itinerary: [...selectedTrip.itinerary, newItem] });
    // Reset
    setItiTitle("");
    setItiLoc("");
    setItiNotes("");
    setItiCost("");
    setItiConf("");
    setShowItiForm(false);
  };

  const handleDeleteItineraryItem = (itiId: string) => {
    if (!selectedTrip) return;
    const nextList = selectedTrip.itinerary.filter(item => item.id !== itiId);
    onUpdateTrip(selectedTrip.id, { itinerary: nextList });
  };

  const handleAddTripExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip || !expDesc || !expAmt) return;
    const newItem: TripExpense = {
      id: `te-${Date.now()}`,
      description: expDesc,
      amount: parseFloat(expAmt),
      category: expCat,
      date: new Date().toISOString().split("T")[0]
    };
    onUpdateTrip(selectedTrip.id, { expenses: [...selectedTrip.expenses, newItem] });
    setExpDesc("");
    setExpAmt("");
  };

  const handleDeleteTripExpense = (expenseId: string) => {
    if (!selectedTrip) return;
    const nextList = selectedTrip.expenses.filter(e => e.id !== expenseId);
    onUpdateTrip(selectedTrip.id, { expenses: nextList });
  };

  const handleSimulatedDocUpload = () => {
    if (!selectedTrip) return;
    const docNames = ["Japan eVisa Slip", "ANA Boarding Confirmation", "Airbnb Villa Agreement", "Travel Health Insurance Card"];
    const randomName = docNames[Math.floor(Math.random() * docNames.length)] + ` (Uploaded)`;
    const newDoc: DocumentVaultItem = {
      id: `doc-${Date.now()}`,
      name: randomName,
      category: "Other",
      fileSize: "1.4 MB",
      uploadDate: new Date().toISOString().split("T")[0]
    };
    onUpdateTrip(selectedTrip.id, { documents: [...selectedTrip.documents, newDoc] });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden space-y-3.5">
      {/* If no trip is selected, show list of Trips */}
      {!selectedTrip ? (
        <div className="h-full flex flex-col overflow-hidden space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-neutral-900">Your Journeys</h1>
              <p className="text-xs text-neutral-500">Plan itineraries, invitees, checklists, and documents.</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-[#FF385C] hover:bg-rose-600 text-white rounded-full p-2.5 shadow-sm hover:scale-105 transition-transform flex items-center gap-1.5 text-xs font-bold shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" /> Plan New Trip
            </button>
          </div>

          {trips.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-3xl p-10 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-neutral-50 flex items-center justify-center mx-auto text-neutral-400">
                <MapPin className="w-6 h-6 text-neutral-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-800">No trips planned yet</h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">Build an Airbnb-inspired travel guide, log hotels, manage packing lists, and invite family members to join.</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-neutral-900 text-white px-5 py-2.5 rounded-full text-xs font-bold cursor-pointer"
              >
                Create Your First Itinerary
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
              {trips.map(trip => (
                <div 
                  key={trip.id}
                  onClick={() => setSelectedTripId(trip.id)}
                  className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-sm hover:border-[#FF385C]/20 transition-all cursor-pointer group"
                >
                  <div className="h-40 relative overflow-hidden bg-neutral-100">
                    <img src={trip.coverImage} alt={trip.destination} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 right-3 bg-neutral-900/40 backdrop-blur-xs text-white p-2 rounded-full hover:bg-neutral-900/60 transition-all" onClick={(e) => { e.stopPropagation(); onDeleteTrip(trip.id); }}>
                      <Trash2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-neutral-900">{trip.destination}</h3>
                    <p className="text-[11px] text-neutral-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" /> {trip.startDate} to {trip.endDate}
                    </p>
                    <div className="flex justify-between items-center pt-2.5 border-t border-neutral-100 text-[10px] font-bold text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-neutral-400" /> {trip.invitees.length + 1} travelers
                      </span>
                      <span className="text-[#FF385C]">
                        Budget: {formatCurrency(trip.estimatedBudget)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* TRIP DASHBOARD DETAIL PAGE */
        <div className="h-full flex flex-col overflow-hidden space-y-3">
          {/* Back to all trips header */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button 
              onClick={() => setSelectedTripId(null)}
              className="p-2 hover:bg-neutral-100 rounded-full cursor-pointer transition-colors shrink-0"
            >
              <ArrowLeft className="w-4.5 h-4.5 text-neutral-800" />
            </button>
            <div>
              <h2 className="text-md font-extrabold text-neutral-900 leading-none">{selectedTrip.destination}</h2>
              <p className="text-[10px] text-neutral-400 mt-1">{selectedTrip.startDate} — {selectedTrip.endDate}</p>
            </div>
            
            {/* Offline and AI recommendation Quick Actions */}
            <div className="ml-auto flex items-center gap-1.5">
              <span className="bg-neutral-50 border border-neutral-200 text-neutral-500 text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1" title="This itinerary is saved locally for offline access.">
                <AlertCircle className="w-3 h-3 text-neutral-400" /> Offline Mode
              </span>
              <button 
                onClick={() => onAskIrisTripRecommendations(selectedTrip.destination)}
                className="bg-[#FF385C]/15 text-[#FF385C] border border-[#FF385C]/15 text-[9px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 hover:bg-[#FF385C]/20 cursor-pointer transition-all shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF385C]" /> AI Recs
              </button>
            </div>
          </div>

          {/* Locked Inner Scroll Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-4">
            {/* Large Header Banner with Cover Image */}
            <div className="h-28 rounded-2xl overflow-hidden relative shadow-sm shrink-0">
              <img src={selectedTrip.coverImage} alt={selectedTrip.destination} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-[8px] font-black uppercase tracking-wider text-[#FF385C] bg-white px-2 py-0.5 rounded shadow-xs">Active Escape</span>
                <h1 className="text-sm font-extrabold text-white mt-1 leading-none">{selectedTrip.destination} Getaway</h1>
              </div>
            </div>

            {/* Sub-tabs Horizontal Navigation inside active trip details - STICKY to remain accessible */}
            <div className="overflow-x-auto no-scrollbar -mx-6 px-6 shrink-0 sticky top-0 bg-white py-1 z-10">
              <div className="flex gap-2 pb-1 border-b border-neutral-100">
              {[
                { id: "itinerary", label: "Timeline", icon: Calendar },
                { id: "packing", label: "Packing", icon: CheckCircle2 },
                { id: "budget", label: "Expenses", icon: DollarSign },
                { id: "documents", label: "Papers", icon: FileText },
                { id: "tools", label: "Travel Desk", icon: Coins }
              ].map(tab => {
                const isActive = tripSubTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setTripSubTab(tab.id as any)}
                    className={`py-2 px-3 text-[11px] font-extrabold flex items-center gap-1.5 whitespace-nowrap border-b-2 cursor-pointer transition-all ${isActive ? "border-[#FF385C] text-[#FF385C]" : "border-transparent text-neutral-500 hover:text-neutral-800"}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE SUB-TAB CONTENTS */}

          {/* TIMELINE / ITINERARY SUB-TAB */}
          {tripSubTab === "itinerary" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-neutral-800">Itinerary Schedule</h3>
                <button 
                  onClick={() => setShowItiForm(!showItiForm)}
                  className="text-xs text-[#FF385C] font-bold flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Booking
                </button>
              </div>

              {/* Add booking inline form */}
              {showItiForm && (
                <form onSubmit={handleAddItinerarySubmit} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Type</label>
                      <select 
                        value={itiType} 
                        onChange={(e) => setItiType(e.target.value as any)}
                        className="w-full bg-white border border-neutral-200 rounded-xl py-2 px-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FF385C]"
                      >
                        <option value="flight">🛫 Flight</option>
                        <option value="hotel">🏨 Hotel</option>
                        <option value="attraction">🗺️ Attraction</option>
                        <option value="transport">🚗 Transport</option>
                        <option value="other">☕ Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Time</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 10:30 AM" 
                        value={itiTime}
                        onChange={(e) => setItiTime(e.target.value)}
                        className="w-full bg-white border border-neutral-200 rounded-xl py-2 px-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FF385C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Event Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ANA Boarding Flight JL-006" 
                      value={itiTitle}
                      onChange={(e) => setItiTitle(e.target.value)}
                      required
                      className="w-full bg-white border border-neutral-200 rounded-xl py-2 px-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FF385C]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Location</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Gate A12, KIX" 
                        value={itiLoc}
                        onChange={(e) => setItiLoc(e.target.value)}
                        className="w-full bg-white border border-neutral-200 rounded-xl py-2 px-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FF385C]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Confirmation #</label>
                      <input 
                        type="text" 
                        placeholder="e.g. AMN9828" 
                        value={itiConf}
                        onChange={(e) => setItiConf(e.target.value)}
                        className="w-full bg-white border border-neutral-200 rounded-xl py-2 px-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FF385C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Notes / Reminders</label>
                    <textarea 
                      placeholder="Special baggage instructions or directions..." 
                      rows={2}
                      value={itiNotes}
                      onChange={(e) => setItiNotes(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-xl py-2 px-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FF385C]"
                    />
                  </div>

                  <div className="flex gap-2.5 justify-end">
                    <button 
                      type="button" 
                      onClick={() => setShowItiForm(false)}
                      className="text-xs font-bold text-neutral-500 py-2 px-4 hover:underline"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="bg-neutral-900 text-white rounded-full py-2 px-5 text-xs font-bold cursor-pointer"
                    >
                      Save to Timeline
                    </button>
                  </div>
                </form>
              )}

              {/* Itinerary Timeline */}
              {selectedTrip.itinerary.length === 0 ? (
                <p className="text-xs text-neutral-400 py-4 text-center">No timeline cards created. Click 'Add Booking' above!</p>
              ) : (
                <div className="space-y-4 relative pl-4 border-l border-neutral-200">
                  {selectedTrip.itinerary.map(item => (
                    <div key={item.id} className="relative space-y-1 bg-white border border-neutral-150 p-4 rounded-2xl shadow-xs">
                      {/* Timeline dot icon based on type */}
                      <span className="absolute left-[-23px] top-4.5 bg-white border border-neutral-300 text-neutral-700 w-4.5 h-4.5 rounded-full flex items-center justify-center text-[8px] font-bold shadow-xs">
                        {item.type === "flight" ? "🛫" : item.type === "hotel" ? "🏨" : item.type === "attraction" ? "🗺️" : item.type === "transport" ? "🚗" : "☕"}
                      </span>
                      
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-[#FF385C] uppercase bg-[#FF385C]/5 px-2 py-0.5 rounded-md">{item.time}</span>
                        <button 
                          onClick={() => handleDeleteItineraryItem(item.id)}
                          className="text-neutral-300 hover:text-[#FF385C] transition-all cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      <h4 className="text-xs font-bold text-neutral-900 mt-1">{item.title}</h4>
                      
                      {item.location && (
                        <p className="text-[10px] text-neutral-500 font-medium flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-neutral-400" /> {item.location}
                        </p>
                      )}

                      {item.notes && (
                        <p className="text-xs text-neutral-500 bg-neutral-50 rounded-xl p-2.5 mt-2 leading-relaxed border border-neutral-100 italic">
                          "{item.notes}"
                        </p>
                      )}

                      {item.confirmationNumber && (
                        <div className="pt-2 text-[9px] text-neutral-400 font-extrabold flex items-center gap-1.5 uppercase tracking-wider">
                          <span>Conf Number:</span>
                          <span className="bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded-md font-mono">{item.confirmationNumber}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PACKING CHECKLIST SUB-TAB */}
          {tripSubTab === "packing" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                <h3 className="text-xs font-bold text-neutral-800">Packing Checklist</h3>
                <span className="text-[10px] font-bold bg-neutral-50 px-2 py-0.5 rounded-lg text-neutral-500">
                  {selectedTrip.packingList.filter(item => item.packed).length} of {selectedTrip.packingList.length} Packed
                </span>
              </div>

              {/* Add packing item inline form */}
              <form onSubmit={handleAddPackingItemSubmit} className="flex gap-2 bg-neutral-50 p-2 border border-neutral-200 rounded-2xl shadow-xs">
                <input 
                  type="text" 
                  placeholder="Add custom packing item... e.g. sunscreen"
                  value={packName}
                  onChange={(e) => setPackName(e.target.value)}
                  className="flex-1 bg-white border border-neutral-150 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none"
                />
                <select 
                  value={packCat} 
                  onChange={(e) => setPackCat(e.target.value)}
                  className="bg-white border border-neutral-150 rounded-xl px-2.5 py-1 text-xs font-bold text-neutral-600 focus:outline-none"
                >
                  <option value="Clothing">👕 Clothes</option>
                  <option value="Electronics">🔌 Tech</option>
                  <option value="Documents">📄 Papers</option>
                  <option value="Toiletries">🧼 Toiletries</option>
                  <option value="Other">💼 Other</option>
                </select>
                <button 
                  type="submit" 
                  className="bg-[#FF385C] text-white p-2.5 rounded-xl hover:bg-rose-600 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </form>

              {/* Packing item checklist display */}
              {selectedTrip.packingList.length === 0 ? (
                <p className="text-xs text-neutral-400 py-4 text-center">Your packing drawer is empty. Add some items above!</p>
              ) : (
                <div className="space-y-2.5">
                  {["Documents", "Electronics", "Clothing", "Toiletries", "Other"].map(category => {
                    const itemsInCat = selectedTrip.packingList.filter(i => i.category === category);
                    if (itemsInCat.length === 0) return null;

                    return (
                      <div key={category} className="space-y-1.5 bg-white border border-neutral-150 rounded-2xl p-3 shadow-xs">
                        <h4 className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1">{category}</h4>
                        {itemsInCat.map(item => (
                          <div 
                            key={item.id}
                            className="flex items-center justify-between group py-1"
                          >
                            <div 
                              onClick={() => handleTogglePackingItem(item.id)}
                              className="flex items-center gap-3 cursor-pointer"
                            >
                              {item.packed ? (
                                <CheckCircle2 className="w-4 h-4 text-[#FF385C]" />
                              ) : (
                                <Circle className="w-4 h-4 text-neutral-300" />
                              )}
                              <span className={`text-xs ${item.packed ? "line-through text-neutral-400 font-medium" : "text-neutral-700 font-semibold"}`}>
                                {item.name}
                              </span>
                            </div>
                            <button 
                              onClick={() => handleDeletePackingItem(item.id)}
                              className="text-neutral-300 hover:text-[#FF385C]"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* BUDGET & EXPENSES SUB-TAB */}
          {tripSubTab === "budget" && (
            <div className="space-y-4">
              {/* Estimator progress banner */}
              <div className="bg-white border border-neutral-150 rounded-2xl p-4 shadow-xs space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Total Travel Budget</span>
                    <h3 className="text-lg font-bold text-neutral-800 mt-0.5">{formatCurrency(selectedTrip.estimatedBudget)}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#FF385C]">Expenses Spent</span>
                    <h3 className="text-lg font-bold text-[#FF385C] mt-0.5">{formatCurrency(totalSpent)}</h3>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${budgetProgressPercent > 90 ? "bg-red-500" : budgetProgressPercent > 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                      style={{ width: `${budgetProgressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400">
                    <span>{budgetProgressPercent}% spent</span>
                    <span className={`${selectedTrip.estimatedBudget - totalSpent < 0 ? "text-red-500" : "text-neutral-500"}`}>
                      {selectedTrip.estimatedBudget - totalSpent < 0 ? 'Over' : 'Remaining'}: {formatCurrency(Math.abs(selectedTrip.estimatedBudget - totalSpent))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Add Trip Expense inline form */}
              <form onSubmit={handleAddTripExpenseSubmit} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-3.5 space-y-3 shadow-xs">
                <h4 className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">Log Trip Expense</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <input 
                    type="text" 
                    placeholder="e.g. Ramen Lunch" 
                    value={expDesc}
                    onChange={(e) => setExpDesc(e.target.value)}
                    required
                    className="bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-bold">$</span>
                    <input 
                      type="number" 
                      placeholder="Amount" 
                      value={expAmt}
                      onChange={(e) => setExpAmt(e.target.value)}
                      required
                      className="w-full bg-white border border-neutral-200 rounded-xl pl-6 pr-3 py-2 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select 
                    value={expCat} 
                    onChange={(e) => setExpCat(e.target.value)}
                    className="flex-1 bg-white border border-neutral-200 rounded-xl py-2 px-3 text-xs font-bold text-neutral-600 focus:outline-none"
                  >
                    <option value="Food">🍔 Food & Dining</option>
                    <option value="Hotels">🏨 Accommodation</option>
                    <option value="Transport">🚗 Transport</option>
                    <option value="Attractions">🗺️ Sightseeing</option>
                    <option value="Shopping">🛍️ Shopping</option>
                    <option value="Other">💼 Miscellaneous</option>
                  </select>
                  <button 
                    type="submit" 
                    className="bg-neutral-900 text-white rounded-xl px-5 text-xs font-bold hover:bg-neutral-800 transition-all cursor-pointer"
                  >
                    Log
                  </button>
                </div>
              </form>

              {/* Expense entries list */}
              {selectedTrip.expenses.length === 0 ? (
                <p className="text-xs text-neutral-400 py-4 text-center">No expenses logged yet. Save dining receipts or bills!</p>
              ) : (
                <div className="space-y-2">
                  {selectedTrip.expenses.map(exp => (
                    <div key={exp.id} className="bg-white border border-neutral-150 p-3 rounded-2xl flex justify-between items-center text-xs">
                      <div className="space-y-0.5">
                        <p className="font-bold text-neutral-700">{exp.description}</p>
                        <p className="text-[9px] text-neutral-400">{exp.category} • {exp.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-neutral-800">
                          {formatCurrency(exp.amount)}
                        </span>
                        <button 
                          onClick={() => handleDeleteTripExpense(exp.id)}
                          className="text-neutral-300 hover:text-[#FF385C]"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* DOCUMENTS VAULT SUB-TAB */}
          {tripSubTab === "documents" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                <h3 className="text-xs font-bold text-neutral-800">Travel Document Safe</h3>
                <button 
                  onClick={handleSimulatedDocUpload}
                  className="text-xs text-[#FF385C] font-bold flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Upload File
                </button>
              </div>

              {/* Warning badge */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-3 flex gap-2.5 items-start">
                <Info className="w-4.5 h-4.5 text-neutral-400 mt-0.5 shrink-0" />
                <p className="text-[10px] text-neutral-500 leading-relaxed">
                  <strong>Travel Desk Tip:</strong> Documents are encrypted and cached locally on your device, ensuring 100% offline lookup access during flights or tunnel train rides.
                </p>
              </div>

              {/* Documents list */}
              {selectedTrip.documents.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-neutral-200 rounded-3xl space-y-2">
                  <p className="text-xs text-neutral-400">Vault empty. Store your flight passes or hotel reservations securely.</p>
                  <button 
                    onClick={handleSimulatedDocUpload}
                    className="bg-neutral-900 text-white rounded-full px-4 py-1.5 text-[10px] font-bold cursor-pointer"
                  >
                    Simulate Upload
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedTrip.documents.map(doc => (
                    <div key={doc.id} className="bg-white border border-neutral-150 p-3 rounded-2xl flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-500">
                          <FileText className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-700 line-clamp-1">{doc.name}</p>
                          <p className="text-[8px] text-neutral-400">{doc.category} • {doc.fileSize} • Uploaded {doc.uploadDate}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const nextDocs = selectedTrip.documents.filter(d => d.id !== doc.id);
                          onUpdateTrip(selectedTrip.id, { documents: nextDocs });
                        }}
                        className="text-neutral-300 hover:text-[#FF385C] p-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TRAVEL TOOLS SUB-TAB (CURRENCY CONVERTER & CONTACTS) */}
          {tripSubTab === "tools" && (
            <div className="space-y-4">
              {/* Currency converter widget */}
              <div className="bg-white border border-neutral-150 rounded-2xl p-4 shadow-xs space-y-3">
                <div className="flex items-center gap-1.5 border-b border-neutral-100 pb-2">
                  <Coins className="w-4 h-4 text-[#FF385C]" />
                  <span className="text-xs font-bold text-neutral-800">Global Currency Desk</span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex gap-2.5 items-center">
                    <div className="flex-1">
                      <label className="text-[8px] font-bold uppercase tracking-wider text-neutral-400">From USD ($)</label>
                      <input 
                        type="number" 
                        value={convAmount}
                        onChange={(e) => setConvAmount(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
                      />
                    </div>
                    <span className="text-neutral-400 pt-3 text-xs">➜</span>
                    <div className="flex-1">
                      <label className="text-[8px] font-bold uppercase tracking-wider text-neutral-400">To Local ({currencySymbol})</label>
                      <div className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-bold text-neutral-700">
                        {convAmount ? (parseFloat(convAmount) * currencyRate).toFixed(0) : "0"} {currencySymbol}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[9px] text-neutral-400 font-bold border-t border-neutral-50 pt-2 bg-neutral-50/50 p-2 rounded-xl">
                    <span>Rate: 1 USD = {currencyRate} JPY</span>
                    <button 
                      onClick={() => {
                        // Toggle between JPY, EUR, GBP
                        if (currencySymbol === "¥") {
                          setCurrencySymbol("€");
                          setCurrencyRate(0.92);
                        } else if (currencySymbol === "€") {
                          setCurrencySymbol("£");
                          setCurrencyRate(0.79);
                        } else {
                          setCurrencySymbol("¥");
                          setCurrencyRate(154.5);
                        }
                      }}
                      className="text-[#FF385C] text-[9px]"
                    >
                      Change Currency
                    </button>
                  </div>
                </div>
              </div>

              {/* Weather Forecast mock widget */}
              <div className="bg-white border border-neutral-150 rounded-2xl p-4 shadow-xs space-y-3">
                <div className="flex items-center gap-1.5 border-b border-neutral-100 pb-2">
                  <CloudSun className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-neutral-800">Kyoto Autumn Forecast</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { day: "Mon", temp: "22°", type: "☀️" },
                    { day: "Tue", temp: "24°", type: "☀️" },
                    { day: "Wed", temp: "19°", type: "🌧️" },
                    { day: "Thu", temp: "21°", type: "⛅" }
                  ].map((f, i) => (
                    <div key={i} className="bg-neutral-50 p-2 rounded-xl border border-neutral-100 space-y-1">
                      <span className="text-[9px] font-bold text-neutral-400">{f.day}</span>
                      <p className="text-sm">{f.type}</p>
                      <p className="text-[10px] font-extrabold text-neutral-800">{f.temp}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency travel contacts */}
              <div className="bg-white border border-neutral-150 rounded-2xl p-4 shadow-xs space-y-3">
                <div className="flex items-center gap-1.5 border-b border-neutral-100 pb-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-neutral-800">Emergency Contacts</span>
                </div>
                <div className="space-y-1.5">
                  {selectedTrip.emergencyContacts.map((contact, index) => (
                    <div key={index} className="text-[10px] bg-red-50/50 border border-red-100 p-2 rounded-xl text-neutral-700 leading-relaxed font-semibold">
                      {contact}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      )}

      {/* CREATE TRIP MODAL DRAWER */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-neutral-900/60 z-50 flex items-end justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-5 duration-300">
            <div className="p-5 border-b border-neutral-100 flex justify-between items-center shrink-0">
              <h2 className="text-sm font-bold text-neutral-900">Plan Your Next Trip</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-neutral-500 font-bold hover:text-[#FF385C]">✕</button>
            </div>

            <form onSubmit={handleCreateTripSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Destination</label>
                <input 
                  type="text" 
                  placeholder="e.g. Kyoto, Japan or Paris, France" 
                  value={dest}
                  onChange={(e) => setDest(e.target.value)}
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FF385C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Start Date</label>
                  <input 
                    type="date" 
                    value={sDate}
                    onChange={(e) => setSDate(e.target.value)}
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl py-3 px-4 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">End Date</label>
                  <input 
                    type="date" 
                    value={eDate}
                    onChange={(e) => setEDate(e.target.value)}
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl py-3 px-4 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Travel Budget (Estimated $)</label>
                <input 
                  type="number" 
                  value={budgetVal}
                  onChange={(e) => setBudgetVal(parseInt(e.target.value) || 0)}
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FF385C]"
                />
              </div>

              {/* Cover Image Preset Selector */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Visual Theme</label>
                <div className="grid grid-cols-4 gap-2 mt-1.5">
                  {coverPresets.map(p => (
                    <div 
                      key={p.name}
                      onClick={() => setCoverImgUrl(p.url)}
                      className={`relative rounded-xl overflow-hidden h-12 cursor-pointer border-2 transition-all ${coverImgUrl === p.url ? "border-[#FF385C] scale-95 shadow-sm" : "border-transparent opacity-75"}`}
                    >
                      <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Travelers Invitation field */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Invite Friends & Family</label>
                <div className="flex gap-2 mt-1">
                  <input 
                    type="text" 
                    placeholder="e.g. mark@mercer.com" 
                    value={inviteeText}
                    onChange={(e) => setInviteeText(e.target.value)}
                    className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddInvitee}
                    className="bg-neutral-900 text-white rounded-xl px-4 text-xs font-bold hover:bg-neutral-850 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {inviteesList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                    {inviteesList.map((inv, idx) => (
                      <span key={idx} className="bg-white border border-neutral-200 text-neutral-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        {inv}
                        <button type="button" onClick={() => handleRemoveInvitee(idx)} className="text-neutral-400 hover:text-red-500">✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#FF385C] hover:bg-rose-600 text-white rounded-full py-3.5 text-xs font-bold shadow-md transition-all pt-3 shrink-0 cursor-pointer"
              >
                Create Airbnb Travel Guide
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
