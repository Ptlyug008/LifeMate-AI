import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Sparkles, Send, Coffee, Compass, Smile, Calendar, ListTodo, DollarSign } from "lucide-react";

import { TRANSLATIONS, Language } from "../translations";

interface AITabProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => void;
  isSending: boolean;
  language: string;
}

export default function AITab({ chatHistory, onSendMessage, isSending, language }: AITabProps) {
  const lang = (language as Language) || "English";
  const t = (key: string, fallback?: string) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS["English"]?.[key] || fallback || key;
  };

  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isSending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() === "" || isSending) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  // Curated list of quick prompt touch triggers
  const promptTriggers = [
    { text: t("askKyoto", "Plan my day in Kyoto"), icon: Calendar, color: "text-[#FF385C]" },
    { text: t("askSushi", "Suggest boutique sushi spots"), icon: Coffee, color: "text-amber-500" },
    { text: t("askPacking", "Create packing list for mountains"), icon: Compass, color: "text-blue-500" },
    { text: t("askGrocery", "Help me reduce grocery expenses"), icon: DollarSign, color: "text-emerald-500" },
    { text: t("askWellness", "Generate daily wellness checklist"), icon: ListTodo, color: "text-indigo-500" }
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Header Info Banner */}
      <div className="bg-white border border-neutral-150 p-4 rounded-3xl shadow-xs flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full bg-[#FF385C]/15 text-[#FF385C] flex items-center justify-center font-bold relative shrink-0">
          <Sparkles className="w-5 h-5 text-[#FF385C] animate-pulse" />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full" />
        </div>
        <div>
          <h2 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
            Iris Assistant <span className="bg-emerald-50 text-emerald-600 text-[8px] font-bold px-1.5 py-0.5 rounded-md">Online</span>
          </h2>
          <p className="text-[10px] text-neutral-400">Ask me to plan trips, schedule routines, draft checklists, or suggest local spots.</p>
        </div>
      </div>

      {/* Chat Messages Log Section */}
      <div className="flex-1 overflow-y-auto py-4 px-1.5 space-y-4 no-scrollbar">
        {chatHistory.length === 0 ? (
          /* Empty state - Onboarding suggestions */
          <div className="text-center py-10 px-5 space-y-5 animate-in fade-in duration-300">
            <div className="w-12 h-12 bg-[#FF385C]/15 rounded-full flex items-center justify-center mx-auto text-[#FF385C]">
              <Sparkles className="w-5 h-5 text-[#FF385C]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-neutral-800">{t("meetIrisTitle", "Meet Iris, your lifestyle architect")}</h3>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                {t("meetIrisSubtitle", "I can help organize your tasks, estimate travel budgets, log habits, find nearby attractions, or map out detailed itineraries.")}
              </p>
            </div>

            {/* Grid of quick prompts */}
            <div className="space-y-2 max-w-xs mx-auto text-left pt-2">
              <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 text-center mb-1.5">{t("tapToAsk", "Tap to ask instantly")}</p>
              <div className="grid grid-cols-1 gap-2">
                {promptTriggers.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => onSendMessage(p.text)}
                      className="bg-white border border-neutral-200 hover:border-[#FF385C]/35 hover:bg-neutral-50 rounded-2xl p-3 text-xs font-semibold text-neutral-700 flex items-center gap-3 transition-all cursor-pointer shadow-xs text-left"
                    >
                      <div className={`p-1 bg-neutral-50 rounded-lg shrink-0`}>
                        <Icon className={`w-4 h-4 ${p.color}`} />
                      </div>
                      <span className="line-clamp-1">{p.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map(msg => {
              const isAi = msg.sender === "ai";
              return (
                <div 
                  key={msg.id}
                  className={`flex ${isAi ? "justify-start" : "justify-end"} items-end gap-2.5`}
                >
                  {isAi && (
                    <div className="w-7 h-7 rounded-full bg-[#FF385C]/10 text-[#FF385C] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs border border-[#FF385C]/10">
                      ✧
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-3xl px-4 py-3 text-xs leading-relaxed ${
                    isAi 
                      ? "bg-white border border-neutral-150 text-neutral-800 shadow-xs rounded-bl-sm" 
                      : "bg-[#FF385C] text-white font-medium shadow-xs rounded-br-sm"
                  }`}>
                    {/* Render message formatting - replace newlines with br */}
                    {msg.text.split("\n").map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < msg.text.split("\n").length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* AI is thinking/typing indicator */}
            {isSending && (
              <div className="flex justify-start items-end gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#FF385C]/10 text-[#FF385C] flex items-center justify-center font-bold text-xs shrink-0">
                  ✧
                </div>
                <div className="bg-white border border-neutral-150 rounded-3xl px-5 py-3 text-xs shadow-xs rounded-bl-sm">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-full p-1.5 shadow-sm shrink-0 flex items-center gap-1">
        <input 
          type="text" 
          placeholder={t("askIrisPlaceholder", "Ask Iris anything...")}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isSending}
          className="flex-1 bg-transparent px-4.5 py-2 text-xs font-medium focus:outline-none placeholder-neutral-400 disabled:opacity-50"
        />
        <button 
          type="submit" 
          disabled={inputText.trim() === "" || isSending}
          className="bg-[#FF385C] text-white p-3 rounded-full hover:bg-rose-600 disabled:opacity-30 disabled:scale-100 scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </form>
    </div>
  );
}
