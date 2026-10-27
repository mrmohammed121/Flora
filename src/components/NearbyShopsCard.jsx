import React, { useState } from "react";
import { MapPin, ShoppingBag, ChevronRight, X } from "lucide-react";

export default function NearbyShopsCard({ diagnosisData }) {
  const [step, setStep] = useState("gate");

  function openRadarMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const url = `https://www.google.com/maps/search/agrochemical+pesticide+dealers/@${coords.latitude},${coords.longitude},13z`;
          window.open(url, "_blank", "noopener,noreferrer");
        },
        () => window.open("https://www.google.com/maps/search/agrochemical+shops+near+me", "_blank", "noopener,noreferrer")
      );
    } else {
      window.open("https://www.google.com/maps/search/agrochemical+shops+near+me", "_blank", "noopener,noreferrer");
    }
  }

  const chemName = diagnosisData?.active_ingredients?.[0]?.name?.split("(")[0]?.trim() ?? "Fungicide";
  const chemQuery = encodeURIComponent(chemName + " agrochemical store");

  const curated = [
    { label: "Kisan Agro Center", href: "https://www.google.com/maps/search/?api=1&query=Kisan+Agro+Center", dist: "~2.4 km" },
    { label: "Sri Lakshmi Fertilizers & Pesticides", href: "https://www.google.com/maps/search/?api=1&query=Sri+Lakshmi+Fertilizers+and+Pesticides", dist: "~4.1 km" },
    { label: `Search "${chemName}" stores`, href: `https://www.google.com/maps/search/?api=1&query=${chemQuery}`, dist: "Any range" },
  ];

  if (step === "gate") return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-3">
      <div className="flex items-start gap-2">
        <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Would you like me to find nearby agrochemical supply shops on Google Maps to help you source these treatments?
        </p>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 pl-7">
        Your location is used only to open Google Maps — nothing is stored or transmitted.
      </p>
      <div className="flex items-center gap-2 pl-7 flex-wrap">
        <button type="button" onClick={() => setStep("shops")}
          className="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer">
          <MapPin className="w-3.5 h-3.5" /> Yes, find nearby shops
        </button>
        <button type="button" onClick={() => setStep("declined")}
          className="min-h-[40px] px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer">
          <X className="w-3.5 h-3.5" /> No thanks
        </button>
      </div>
    </div>
  );

  if (step === "declined") return (
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
      <p className="font-semibold text-slate-700 dark:text-slate-300">Understood. Consult your local agricultural extension officer or cooperative for sourcing.</p>
      <p>Always purchase from authorised, licensed agrochemical dealers and verify product labels before application.</p>
    </div>
  );

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Nearby Agrochemical Suppliers</h4>
        </div>
        <button type="button" onClick={() => setStep("gate")} className="text-[10px] text-slate-500 dark:text-slate-400 hover:underline cursor-pointer">Close</button>
      </div>

      <ul className="space-y-2">
        {curated.map((shop) => (
          <li key={shop.label}>
            <a href={shop.href} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-sm transition-all group">
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{shop.label}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{shop.dist}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
              </div>
            </a>
          </li>
        ))}
      </ul>

      <button type="button" onClick={openRadarMap}
        className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer">
        <MapPin className="w-4 h-4" />
        ?? View all agrochemical shops on radar map (Google Maps)
      </button>

      <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
        Uses device location for the most accurate nearby results.
      </p>
    </div>
  );
}
