import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Bot,
  X,
  Maximize2,
  Minimize2,
  Trash2,
  Send,
  Paperclip,
  Mic,
  MicOff,
  Copy,
  Check,
  RotateCcw,
  Image as ImageIcon,
  ChevronDown,
  Info
} from "lucide-react";
import { sendCopilotMessage } from "../utils/geminiChat";
import "../styles/flora-copilot.css";
import { useLanguage } from "../context/LanguageContext";

const STORAGE_KEY = "florascan_copilot_chat";

const DEFAULT_WELCOME_MESSAGE = {
  id: "welcome-krishi-sakha",
  role: "assistant",
  content: `Namaskara! I'm **Krishi Sakha (ಕೃಷಿ ಸಖ)**, your real-time agronomist and farming intelligence companion.

I can help you:
- 🌿 **Diagnose leaf symptoms** and identify blights, rusts, or spot diseases.
- 🧪 **Prescribe dosages** (Mancozeb, Copper Oxychloride, Azoxystrobin, etc.) with safety intervals (PHI & REI).
- 🌾 **Recommend organic bio-controls**, neem formulations, and cultural sanitation.
- 📷 **Interpret your active scans** from the Diagnostic Studio.
- 🌳 **Tree & Orchard Cultivation guides** (Mango, Coconut, Arecanut, Lemon, etc.).

How can I help your crop today?`,
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
};

export default function FloraCopilot({ diagnosisData = null, currentLanguage = null }) {
  const { language: contextLanguage, t } = useLanguage();
  const language = currentLanguage || contextLanguage || "en";
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If the chat contains the previous Flora welcome message, upgrade it cleanly
          if (
            parsed.length === 1 &&
            parsed[0].role === "assistant" &&
            (parsed[0].id === "welcome-1" || parsed[0].content?.includes("Flora Copilot"))
          ) {
            return [DEFAULT_WELCOME_MESSAGE];
          }
          return parsed;
        }
      }
    } catch (_) {}
    return [DEFAULT_WELCOME_MESSAGE];
  });

  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // base64 preview
  const [selectedImageMime, setSelectedImageMime] = useState("image/jpeg");
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  // Sync chat to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn("Error persisting copilot chat:", e);
    }
  }, [messages]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isThinking, isOpen]);

  // Keyboard shortcut: Esc to close panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // External trigger listener to open Krishi Sakha with optional image & prompt
  useEffect(() => {
    const handleOpenKrishiSakha = (e) => {
      setIsOpen(true);
      if (e.detail?.image) {
        setSelectedImage(e.detail.image);
        if (e.detail.mime) setSelectedImageMime(e.detail.mime);
      }
      if (e.detail?.prompt) {
        setInputValue(e.detail.prompt);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 300);
      }
    };
    window.addEventListener("open-krishi-sakha", handleOpenKrishiSakha);
    return () => window.removeEventListener("open-krishi-sakha", handleOpenKrishiSakha);
  }, []);

  // Web Speech STT setup
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Browser speech recognition is not supported in this browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;

      if (currentLanguage === "kn") recognition.lang = "kn-IN";
      else if (currentLanguage === "hi") recognition.lang = "hi-IN";
      else recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputValue(transcript);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (err) {
      console.error("Speech recognition error:", err);
      setIsListening(false);
    }
  };

  // Image Upload Handler
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    setSelectedImageMime(file.type);
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Send message
  const handleSend = async (textToSend = null) => {
    const rawPrompt = (textToSend || inputValue).trim();
    if (!rawPrompt && !selectedImage) return;

    const defaultPrompt = "Diagnose this plant leaf, identify any disease symptoms, and recommend immediate remedies.";
    const prompt = rawPrompt || defaultPrompt;

    const userMsgId = "user-" + Date.now();
    const userMessage = {
      id: userMsgId,
      role: "user",
      content: rawPrompt || "Diagnose this plant leaf, identify any disease symptoms, and recommend immediate remedies.",
      image: selectedImage || null,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    const imageToSubmit = selectedImage;
    const mimeToSubmit = selectedImageMime;
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsThinking(true);

    try {
      const botResponse = await sendCopilotMessage(prompt, newMessages, {
        diagnosisData,
        imageBase64: imageToSubmit,
        imageMimeType: mimeToSubmit,
        language
      });

      const botMessage = {
        id: "bot-" + Date.now(),
        role: "assistant",
        content: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Copilot send error:", err);
      const errorMessage = {
        id: "bot-err-" + Date.now(),
        role: "assistant",
        content: "I encountered a brief connection issue. Please verify your internet connection or ask again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Quick Action Rufus Chips (Tree Cultivation & Crop Pathology)
  const getPromptChips = () => {
    const chips = [];
    if (diagnosisData?.disease) {
      chips.push({
        label: `📋 Analyze my ${diagnosisData.disease} scan`,
        prompt: `Can you break down the treatment plan for my current scan: ${diagnosisData.disease} (${diagnosisData.status}, affected area ${diagnosisData.affected_area_pct}%)?`
      });
    }
    chips.push(
      {
        label: "🌳 Mango Orchard Care",
        prompt: "Provide the complete 6-point agronomist cultivation guide for Mango orchard farming."
      },
      {
        label: "🥥 Coconut Cultivation Guide",
        prompt: "Provide the complete 6-point cultivation guide for Coconut plantation farming."
      },
      {
        label: "🍋 Citrus & Lemon Farming",
        prompt: "How to cultivate Citrus and Lemon trees? Give me the 6-point agronomic advisory."
      },
      {
        label: "🍎 Apple Scab & Pruning",
        prompt: "Explain Apple tree orchard management, pruning schedule, and apple scab disease control."
      },
      {
        label: "🪵 Teak / Agroforestry Tips",
        prompt: "Give me the commercial timber cultivation guide for Teak agroforestry."
      },
      {
        label: "🌿 Organic Bio-Controls",
        prompt: "Recommend organic bio-fungicides and cultural methods to control leaf spots."
      },
      {
        label: "🍅 Tomato Blight Symptoms",
        prompt: "What are the early visual symptoms of Tomato Early Blight vs Late Blight?"
      }
    );
    return chips;
  };

  // Copy assistant response
  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Clear chat
  const handleClearChat = () => {
    if (window.confirm("Clear all copilot conversation history?")) {
      setMessages([DEFAULT_WELCOME_MESSAGE]);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (_) {}
    }
  };

  // Simple, elegant Markdown formatter
  const renderFormattedMarkdown = (text) => {
    if (!text) return null;

    // Detect markdown table
    if (text.includes("|") && text.includes("---")) {
      const lines = text.split("\n");
      const tableLines = [];
      const nonTableBefore = [];
      const nonTableAfter = [];
      let inTable = false;
      let pastTable = false;

      for (const line of lines) {
        if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
          inTable = true;
          tableLines.push(line);
        } else if (inTable) {
          pastTable = true;
          nonTableAfter.push(line);
        } else {
          nonTableBefore.push(line);
        }
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0]
          .split("|")
          .map((c) => c.trim())
          .filter(Boolean);
        const dataRows = tableLines
          .slice(2)
          .map((row) =>
            row
              .split("|")
              .map((c) => c.trim())
              .filter((c, i, a) => i > 0 && i < a.length - 1)
          );

        return (
          <div className="space-y-2">
            {nonTableBefore.length > 0 && (
              <div>{renderSimpleMarkdown(nonTableBefore.join("\n"))}</div>
            )}
            <div className="overflow-x-auto my-2 rounded-lg border border-slate-700/60">
              <table>
                <thead>
                  <tr>
                    {headerRow.map((h, i) => (
                      <th key={i}>{h.replace(/\*\*/g, "")}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/40">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx}>{cell.replace(/\*\*/g, "")}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {nonTableAfter.length > 0 && (
              <div>{renderSimpleMarkdown(nonTableAfter.join("\n"))}</div>
            )}
          </div>
        );
      }
    }

    return renderSimpleMarkdown(text);
  };

  const renderSimpleMarkdown = (text) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      // Top-level Report Header (e.g., # PLANT HEALTH & DIAGNOSTIC REPORT)
      if (trimmed.startsWith("# ")) {
        return (
          <div key={idx} className="mt-3 mb-2 pb-1.5 border-b border-emerald-500/30">
            <h2 className="text-sm sm:text-base font-extrabold tracking-wide text-emerald-400 uppercase flex items-center gap-1.5">
              <span>🌿</span>
              <span>{trimmed.replace(/^#\s+/, "")}</span>
            </h2>
          </div>
        );
      }

      // Major Section Headers (e.g., ### 1. Specimen Identification)
      if (trimmed.startsWith("### ") || trimmed.startsWith("## ")) {
        return (
          <h3 key={idx} className="text-xs sm:text-sm font-bold text-emerald-300 mt-2.5 mb-1 flex items-center gap-1">
            <span className="text-emerald-500">▶</span>
            <span>{trimmed.replace(/^###?\s+/, "")}</span>
          </h3>
        );
      }

      // Subsection Headers (e.g., #### Cultural & Organic Controls:)
      if (trimmed.startsWith("#### ")) {
        return (
          <h4 key={idx} className="text-xs font-semibold text-slate-200 dark:text-slate-200 mt-2 mb-0.5 underline decoration-emerald-500/40">
            {trimmed.replace(/^####\s+/, "")}
          </h4>
        );
      }

      // Bullet point
      if (trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.startsWith("* ")) {
        const content = trimmed.replace(/^[-•*]\s+/, "");
        return (
          <div key={idx} className="flex items-start gap-1.5 ml-1 my-0.5 text-xs sm:text-[13px] leading-relaxed">
            <span className="text-emerald-400 font-bold mt-0.5 select-none">•</span>
            <span dangerouslySetInnerHTML={{ __html: inlineFormat(content) }} />
          </div>
        );
      }

      // Numbered point
      if (/^\d+\.\s+/.test(trimmed)) {
        return (
          <div key={idx} className="ml-1 my-0.5 text-xs sm:text-[13px] leading-relaxed" dangerouslySetInnerHTML={{ __html: inlineFormat(trimmed) }} />
        );
      }

      if (!trimmed) {
        return <div key={idx} className="h-1.5" />;
      }

      return (
        <p key={idx} className="my-0.5 text-xs sm:text-[13px] leading-relaxed" dangerouslySetInnerHTML={{ __html: inlineFormat(trimmed) }} />
      );
    });
  };

  const inlineFormat = (str) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-emerald-400">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-800 text-emerald-300 px-1 py-0.5 rounded text-[11px] font-mono">$1</code>');
  };

  return (
    <>
      {/* =========================================================================
          1. Collapsed Floating Action Button (FAB)
          ========================================================================= */}
      {!isOpen && (
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 sm:z-50 flex items-center group">
          {/* Hover Tooltip Label */}
          <div className="hidden sm:flex items-center gap-1.5 mr-3 px-3 py-1.5 rounded-full bg-slate-900/95 text-white border border-emerald-500/30 text-xs font-semibold shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Need farming help? Ask Krishi Sakha (ಕೃಷಿ ಸಖ)</span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative min-w-[54px] min-h-[54px] p-3.5 sm:p-4 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-emerald-400/50 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-emerald-500/40 touch-manipulation"
            aria-label="Open Krishi Sakha AI Assistant"
            title="Ask Krishi Sakha (ಕೃಷಿ ಸಖ)"
          >
            {/* Active Radar Ping */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-slate-950"></span>
            </span>

            <Bot className="w-6 h-6 transform group-hover:rotate-12 transition-transform duration-200" />
          </button>
        </div>
      )}

      {/* =========================================================================
          2. Expanded Floating Panel / Mobile Bottom Sheet (Rufus & Monica Style)
          ========================================================================= */}
      {isOpen && (
        <>
          {/* Mobile Backdrop Overlay */}
          <div
            className="sm:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <aside
            role="complementary"
            aria-label="Krishi Sakha AI Assistant"
            className={`fixed inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-6 sm:right-6 z-50 flex flex-col bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl border-t sm:border border-slate-200 dark:border-emerald-500/30 rounded-t-3xl sm:rounded-2xl copilot-panel-shadow overflow-hidden transition-all duration-300 text-slate-800 dark:text-slate-100 ${
              isExpanded
                ? "w-full sm:w-[720px] h-[92vh] sm:h-[86vh] max-w-4xl"
                : "w-full sm:w-[420px] h-[85vh] sm:h-[600px] max-h-[85vh]"
            }`}
          >
            {/* Mobile Sheet Pull Indicator */}
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2 sm:hidden flex-shrink-0" />

            {/* Top Decorative Border Accent */}
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 font-extrabold text-sm">
                    🌿
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base tracking-tight">
                      {language === 'en' ? 'Krishi Sakha (ಕೃಷಿ ಸಖ)' : t('assistantName')}
                    </h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                      AGRI-AI
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {diagnosisData?.disease ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        🎯 Context: {diagnosisData.disease}
                      </span>
                    ) : (
                      t('assistantTagline')
                    )}
                  </p>
                </div>
              </div>

              {/* Quick Header Controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClearChat}
                  className="min-w-[40px] min-h-[40px] p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                  title="Clear Conversation History"
                  aria-label="Clear Conversation History"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsExpanded((e) => !e)}
                  className="hidden sm:inline-flex min-w-[40px] min-h-[40px] p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 items-center justify-center cursor-pointer"
                  title={isExpanded ? "Restore Size" : "Expand Fullscreen"}
                  aria-label={isExpanded ? "Restore Size" : "Expand Fullscreen"}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="min-w-[44px] min-h-[44px] p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                  title="Close Krishi Sakha"
                  aria-label="Close Krishi Sakha"
                >
                  <ChevronDown className="w-6 h-6 sm:hidden text-emerald-500" />
                  <X className="hidden sm:block w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contextual Suggested Prompts (Rufus Pill Chips) */}
            <div className="px-3.5 py-2 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-850/50 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
                Suggestions:
            </span>
            {getPromptChips().map((chip, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isThinking}
                onClick={() => handleSend(chip.prompt)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/60 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-750 transition-all cursor-pointer shadow-2xs"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Scrollable Chat Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs sm:text-sm">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar Icon */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      isUser
                        ? "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                        : "bg-emerald-600 text-white shadow-sm"
                    }`}
                  >
                    {isUser ? "👤" : "🌿"}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`relative max-w-[85%] rounded-2xl p-3 shadow-xs ${
                      isUser
                        ? "copilot-bubble-user text-white"
                        : "copilot-bubble-bot text-slate-800 dark:text-slate-100"
                    }`}
                  >
                    {/* Attached Image Thumbnail */}
                    {msg.image && (
                      <div className="mb-2 rounded-lg overflow-hidden border border-white/20 max-w-[200px]">
                        <img
                          src={msg.image}
                          alt="User attached plant leaf specimen for visual diagnostic inspection"
                          className="w-full h-auto object-cover max-h-36"
                        />
                      </div>
                    )}

                    {/* Formatted Content */}
                    <div className="copilot-prose leading-relaxed">
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        renderFormattedMarkdown(msg.content)
                      )}
                    </div>

                    {/* Footer / Copy Action */}
                    <div className="flex items-center justify-between gap-3 mt-1.5 pt-1 text-[10px] opacity-70">
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="hover:opacity-100 p-0.5 rounded transition-opacity cursor-pointer inline-flex items-center gap-1"
                          title="Copy Answer"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Thinking Animated Wave / Dots */}
            {isThinking && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">
                  🌿
                </div>
                <div className="copilot-bubble-bot rounded-2xl p-3 px-4 flex items-center gap-2">
                  <span className="text-xs text-slate-400">Flora is analyzing...</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 copilot-dot-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 copilot-dot-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 copilot-dot-pulse" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Attached Image Preview Chip before sending */}
          {selectedImage && (
            <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={selectedImage}
                  alt="Selected plant leaf photo preview"
                  className="w-10 h-10 object-cover rounded-md border border-emerald-500/40"
                />
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Leaf image attached for analysis
                </span>
              </div>
              <button
                type="button"
                onClick={removeSelectedImage}
                className="p-1 rounded-full text-slate-400 hover:text-rose-500 transition-colors"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Bottom Input Bar */}
          <div className="p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-slate-200 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              {/* Image Upload Input with capture="environment" for native camera option */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageSelect}
                className="hidden"
                id="copilotImageInput"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`min-w-[44px] min-h-[44px] p-2.5 rounded-xl border transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                  selectedImage
                    ? "bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                    : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-emerald-500 hover:border-emerald-500/50"
                }`}
                title="Attach a Leaf Image"
                aria-label="Attach Leaf Photo"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Text Input - 16px font size on mobile prevents browser auto-zoom */}
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  isListening
                    ? "Listening to your voice..."
                    : t('assistantPlaceholder')
                }
                disabled={isThinking}
                className="flex-1 min-h-[44px] bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-base sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
              />

              {/* Speech-to-Text Mic Button - Large & Centered Thumb Reach */}
              <button
                type="button"
                onClick={toggleListening}
                className={`min-w-[44px] min-h-[44px] p-2.5 rounded-xl border transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                  isListening
                    ? "bg-rose-500 border-rose-600 text-white shadow-lg shadow-rose-500/30 animate-pulse scale-105"
                    : "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400/50 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white"
                }`}
                title={isListening ? "Listening... Click to stop" : "Speak to Krishi Sakha"}
                aria-label={isListening ? "Listening" : "Speak to Krishi Sakha"}
              >
                {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={(!inputValue.trim() && !selectedImage) || isThinking}
                className={`min-w-[44px] min-h-[44px] p-2.5 rounded-xl font-semibold transition-all active:scale-95 flex items-center justify-center ${
                  (inputValue.trim() || selectedImage) && !isThinking
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 cursor-pointer"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                }`}
                aria-label="Send message"
                title="Send Message"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </aside>
      </>
      )}
    </>
  );
}
