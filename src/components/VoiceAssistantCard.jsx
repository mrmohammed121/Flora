import React, { useState, useEffect, useRef } from "react";
import { VoiceBeam } from "voice-glow";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  RefreshCw,
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import "../styles/voice-assistant.css";
import { useLanguage } from "../context/LanguageContext";
import { sendCopilotMessage } from "../utils/geminiChat";

const ELEVENLABS_VOICE_ID =
  import.meta.env.VITE_ELEVENLABS_VOICE_ID || "HBZPYXXu7MHBOUlDZtD6";
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || "";
const ELEVENLABS_TTS_ENDPOINT = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`;


// Preset Agronomic Prompt Chips
const QUICK_CHIPS = [
  "How to treat Early Blight?",
  "Bio-control for bacterial spot?",
  "What is Mancozeb dilution rate?",
  "What causes late blight?"
];

export default function VoiceAssistantCard({ currentLanguage = null, diagnosisData = null, className = "" }) {
  const { language: contextLang, t } = useLanguage();
  const language = currentLanguage || contextLang || "en";
  // States: 'idle' | 'listening' | 'thinking' | 'speaking'
  const [phase, setPhase] = useState("idle");
  const [userTranscript, setUserTranscript] = useState("");
  const [aiResponseText, setAiResponseText] = useState(
    "Ask me anything about crop symptoms, leaf blight, or pesticide dosage."
  );
  const [displayedFloraText, setDisplayedFloraText] = useState(
    "Ask me anything about crop symptoms, leaf blight, or pesticide dosage."
  );
  const [typedInput, setTypedInput] = useState("");
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Tap to speak");
  const [sttSupported, setSttSupported] = useState(true);

  // Audio / Speech Recognition Refs
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const rafIdRef = useRef(null);
  const micStreamRef = useRef(null);
  const wordStreamTimerRef = useRef(null);

  // Check Web Speech Recognition support on mount
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSttSupported(false);
    }

    return () => {
      stopAllAudio();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  // Update caption based on phase
  useEffect(() => {
    switch (phase) {
      case "listening":
        setStatusMessage("Listening to your question...");
        break;
      case "thinking":
        setStatusMessage("Krishi Sakha is analyzing...");
        break;
      case "speaking":
        setStatusMessage("Krishi Sakha is responding...");
        break;
      case "idle":
      default:
        setStatusMessage("Tap to speak");
        break;
    }
  }, [phase]);

  // Clean up all playing audio and speech
  const stopAllAudio = () => {
    if (wordStreamTimerRef.current) {
      clearInterval(wordStreamTimerRef.current);
      wordStreamTimerRef.current = null;
    }
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    setVoiceLevel(0);
  };

  // 1. Microphone Start & Speech Recognition
  const startListening = async () => {
    stopAllAudio();
    setUserTranscript("");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Browser speech recognition is not supported in this browser. You can type your query below!");
      return;
    }

    try {
      // Initialize Web Audio API for reactive mic level
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          micStreamRef.current = stream;

          const AudioContext = window.AudioContext || window.webkitAudioContext;
          const audioCtx = new AudioContext();
          audioCtxRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 128;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const checkMicVolume = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            const normalized = Math.min(1, Math.max(0, avg / 128));
            setVoiceLevel(normalized);
            rafIdRef.current = requestAnimationFrame(checkMicVolume);
          };
          checkMicVolume();
        } catch (micErr) {
          console.warn("Mic visualizer initialization warning:", micErr);
        }
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;

      // Adapt recognition language to application language
      if (language === "kn") {
        recognition.lang = "kn-IN";
      } else if (language === "hi") {
        recognition.lang = "hi-IN";
      } else {
        recognition.lang = "en-US";
      }

      recognition.onstart = () => {
        setPhase("listening");
      };

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setUserTranscript(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          setStatusMessage("Could not hear speech clearly. Try again.");
        }
      };

      recognition.onend = () => {
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        if (micStreamRef.current) {
          micStreamRef.current.getTracks().forEach((track) => track.stop());
          micStreamRef.current = null;
        }

        // If we captured a query, send to Gemini
        setUserTranscript((latestTranscript) => {
          if (latestTranscript && latestTranscript.trim().length > 1) {
            handleGeminiQuery(latestTranscript.trim());
          } else {
            setPhase("idle");
          }
          return latestTranscript;
        });
      };

      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setPhase("idle");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
  };

  // 2. Gemini Query Processing via Backend
  const handleGeminiQuery = async (queryText) => {
    setPhase("thinking");
    stopAllAudio();

    try {
      const effectivePrompt = diagnosisData?.disease
        ? `[Current specimen scan: ${diagnosisData.disease} (${diagnosisData.status}, Severity: ${diagnosisData.severity}, Affected Leaf Area: ${diagnosisData.affected_area_pct}%)] User question: ${queryText}`
        : queryText;

      const reply = await sendCopilotMessage(effectivePrompt, [], { diagnosisData, language });
      let aiReplyText = reply || "I was unable to assess that symptom. Please inspect the leaf directly or test with the camera studio.";

      // Clean up markdown markers for crisp speech
      const spokenClean = aiReplyText.replace(/[*_#`]/g, "").trim();
      setAiResponseText(spokenClean);

      // Transition to Audio & TTS playback
      await playVoiceResponse(spokenClean);
    } catch (err) {
      console.error("Voice Assistant processing error:", err);
      const fallbackReply =
        "For foliar spotting or blights, ensure proper plant spacing, eliminate weeds, and apply protective copper or bio-fungicides.";
      setAiResponseText(fallbackReply);
      await playVoiceResponse(fallbackReply);
    }
  };


  // 3 & 4. ElevenLabs TTS with SpeechSynthesis Fallback & Waveform Reactivity
  const playVoiceResponse = async (textToSpeak) => {
    if (isMuted) {
      setDisplayedFloraText(textToSpeak);
      setPhase("idle");
      return;
    }

    setPhase("speaking");
    setDisplayedFloraText("");

    let elevenLabsSuccess = false;

    // Check if ElevenLabs API key is configured
    if (ELEVENLABS_API_KEY) {
      try {
        const ttsResponse = await fetch(ELEVENLABS_TTS_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY
          },
          body: JSON.stringify({
            text: textToSpeak,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75
            }
          })
        });

        if (ttsResponse.ok) {
          const audioBlob = await ttsResponse.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audioRef.current = audio;

          // Connect Web Audio API Analyser for VoiceBeam level
          try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioCtx = new AudioContext();
            audioCtxRef.current = audioCtx;
            const source = audioCtx.createMediaElementSource(audio);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 128;
            source.connect(analyser);
            analyser.connect(audioCtx.destination);
            analyserRef.current = analyser;

            const freqData = new Uint8Array(analyser.frequencyBinCount);
            const samplePlayback = () => {
              if (!analyserRef.current || phase !== "speaking") return;
              analyserRef.current.getByteFrequencyData(freqData);
              let sum = 0;
              for (let i = 0; i < freqData.length; i++) sum += freqData[i];
              const avg = sum / freqData.length;
              setVoiceLevel(Math.min(1, Math.max(0, avg / 120)));
              rafIdRef.current = requestAnimationFrame(samplePlayback);
            };
            samplePlayback();
          } catch (audioCtxErr) {
            console.warn("AudioContext analyzer setup warning:", audioCtxErr);
          }

          // Word-by-word progressive streaming
          streamWords(textToSpeak);

          audio.onended = () => {
            stopAllAudio();
            setDisplayedFloraText(textToSpeak);
            setPhase("idle");
          };

          audio.onerror = () => {
            console.warn("Audio playback error, falling back to speech synthesis");
            fallbackSpeechSynthesis(textToSpeak);
          };

          await audio.play();
          elevenLabsSuccess = true;
        }
      } catch (ttsErr) {
        console.warn("ElevenLabs TTS error:", ttsErr);
      }
    }

    if (!elevenLabsSuccess) {
      fallbackSpeechSynthesis(textToSpeak);
    }
  };

  // Fallback to Browser SpeechSynthesis
  const fallbackSpeechSynthesis = (text) => {
    if (!window.speechSynthesis) {
      setDisplayedFloraText(text);
      setPhase("idle");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    const targetLangCode = language === "kn" ? "kn-IN" : language === "hi" ? "hi-IN" : "en-US";
    utterance.lang = targetLangCode;

    // Select natural female/assistant voice if available, prioritizing active language
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) => v.lang === targetLangCode || v.lang.startsWith(language));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    } else {
      const naturalVoice = voices.find(
        (v) =>
          (v.name.includes("Natural") ||
            v.name.includes("Google") ||
            v.name.includes("Samantha") ||
            v.name.includes("Zira")) &&
          v.lang.startsWith("en")
      );
      if (naturalVoice) utterance.voice = naturalVoice;
    }

    // Simulate animated speech level pulses for VoiceBeam
    let step = 0;
    const pulseInterval = setInterval(() => {
      step++;
      const val = 0.35 + 0.45 * Math.abs(Math.sin(step * 0.4));
      setVoiceLevel(val);
    }, 100);

    streamWords(text);

    utterance.onend = () => {
      clearInterval(pulseInterval);
      stopAllAudio();
      setDisplayedFloraText(text);
      setPhase("idle");
    };

    utterance.onerror = () => {
      clearInterval(pulseInterval);
      stopAllAudio();
      setDisplayedFloraText(text);
      setPhase("idle");
    };

    window.speechSynthesis.speak(utterance);
  };

  // Stream words progressively
  const streamWords = (fullText) => {
    if (wordStreamTimerRef.current) clearInterval(wordStreamTimerRef.current);
    const words = fullText.split(" ");
    let index = 0;
    setDisplayedFloraText(words[0] || "");

    const intervalTime = Math.max(100, Math.min(260, 4000 / Math.max(words.length, 1)));
    wordStreamTimerRef.current = setInterval(() => {
      index++;
      if (index < words.length) {
        setDisplayedFloraText((prev) => `${prev} ${words[index]}`);
      } else {
        clearInterval(wordStreamTimerRef.current);
        wordStreamTimerRef.current = null;
      }
    }, intervalTime);
  };

  // Tap button handler
  const handleMicTap = () => {
    if (phase === "idle") {
      startListening();
    } else if (phase === "listening") {
      stopListening();
    } else if (phase === "speaking") {
      stopAllAudio();
      setPhase("idle");
    }
  };

  // Submit typed query
  const handleTypedSubmit = (e) => {
    e.preventDefault();
    if (!typedInput.trim()) return;
    const query = typedInput.trim();
    setUserTranscript(query);
    setTypedInput("");
    handleGeminiQuery(query);
  };

  // Click on a prompt chip
  const handleChipClick = (chipText) => {
    setUserTranscript(chipText);
    handleGeminiQuery(chipText);
  };

  return (
    <div className={`va-card-wrapper ${className}`}>
      {/* Sound-Reactive Glow Beam */}
      <VoiceBeam
        level={phase === "listening" || phase === "speaking" ? voiceLevel : 0.05}
        processing={phase === "thinking"}
        colorVariant="forest"
        sensitivity={1.8}
        spread={0.7}
        reach={1.3}
        bend={35}
        idle={0.12}
        className="rounded-[1.5rem]"
      >
        <div className="va-card">
          {/* Header */}
          <div className="va-header">
            <div className="va-header-left">
              <div className="va-avatar-wrap">
                <div className="va-avatar">KS</div>
                <div className={`va-status-dot ${phase}`} />
              </div>
              <div className="va-title-wrap">
                <h3 className="text-slate-900 dark:text-white flex items-center gap-1.5 font-extrabold">
                  {language === 'en' ? 'Krishi Sakha (ಕೃಷಿ ಸಖ)' : t('assistantName')}
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    AGRI-AI
                  </span>
                </h3>
                <p>{t('assistantTagline')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMuted((m) => !m)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={isMuted ? "Unmute Voice" : "Mute Voice"}
                aria-label={isMuted ? "Unmute Voice" : "Mute Voice"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-500" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-500" />
                )}
              </button>

              <span className="va-badge">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                {phase === "listening"
                  ? "Listening"
                  : phase === "thinking"
                  ? "Analyzing"
                  : phase === "speaking"
                  ? "Speaking"
                  : "Ready"}
              </span>
            </div>
          </div>

          {/* Chat & Transcript Area */}
          <div className="va-content-canvas">
            {/* Krishi Sakha Floating Response */}
            <div className="va-bubble va-bubble-flora">
              <strong className="block text-emerald-600 dark:text-emerald-400 text-[11px] uppercase tracking-wider mb-0.5 font-bold">
                Krishi Sakha (ಕೃಷಿ ಸಖ)
              </strong>
              <p className="text-slate-800 dark:text-slate-100 text-xs sm:text-sm leading-relaxed">
                {displayedFloraText || aiResponseText}
              </p>
            </div>

            {/* User Live Transcript */}
            {userTranscript && (
              <div className="va-bubble va-bubble-user">
                <div className="va-transcript">
                  {phase === "listening" && (
                    <span className="va-transcript-live-dot" />
                  )}
                  <span className="text-xs sm:text-sm font-medium">
                    "{userTranscript}"
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Inquiry Chips */}
          <div className="va-chips-wrap">
            {QUICK_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip)}
                disabled={phase === "thinking" || phase === "listening"}
                className="va-chip"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Controls: Central Mic & Waveform */}
          <div className="va-controls">
            <button
              type="button"
              onClick={handleMicTap}
              className={`va-mic-btn ${phase}`}
              aria-label={
                phase === "listening"
                  ? "Stop Listening"
                  : phase === "speaking"
                  ? "Interrupt Flora"
                  : "Start Speaking to Flora"
              }
              title={
                phase === "listening"
                  ? "Click to finish speaking"
                  : phase === "speaking"
                  ? "Click to stop voice"
                  : "Click and speak your question"
              }
            >
              {phase === "listening" ? (
                <MicOff className="w-6 h-6 animate-pulse" />
              ) : phase === "thinking" ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : phase === "speaking" ? (
                <Volume2 className="w-6 h-6 animate-bounce" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>

            {/* Sound Wave Indicators */}
            {(phase === "speaking" || phase === "listening") && (
              <div className="va-wave-wrap">
                <span className="va-wave-bar speaking" />
                <span className="va-wave-bar speaking" />
                <span className="va-wave-bar speaking" />
                <span className="va-wave-bar speaking" />
                <span className="va-wave-bar speaking" />
              </div>
            )}

            <p className={`va-caption ${phase !== "idle" ? "active" : ""}`}>
              {statusMessage}
            </p>
          </div>

          {/* Text Input Option for Keyboard / Quiet Environments */}
          <form onSubmit={handleTypedSubmit} className="va-input-row">
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="Or type a farming question..."
              disabled={phase === "thinking" || phase === "listening"}
              className="va-input"
            />
            <button
              type="submit"
              disabled={!typedInput.trim() || phase === "thinking"}
              className="va-send-btn"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      </VoiceBeam>
    </div>
  );
}
