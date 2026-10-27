// src/components/SeoContentSection.jsx
// High-Quality, Search-Engine-Optimized Content Section for FloraScan AI

import React, { useState } from 'react';
import { 
  Sparkles, 
  Camera, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Leaf, 
  Zap, 
  BookOpen, 
  Activity, 
  TrendingUp, 
  FlaskConical 
} from 'lucide-react';
import { SUPPORTED_DISEASES } from '../data/diseasesData';

export default function SeoContentSection({ onSelectDisease, onLoadSample }) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "What is AI plant disease detection and how does FloraScan AI work?",
      a: "AI plant disease detection uses advanced computer vision and deep learning models to inspect leaf photographs for symptoms of fungal, bacterial, viral, and oomycete pathogens. FloraScan AI employs a two-tier architecture: it first verifies the botanical host species (e.g. Solanaceae vs. Rosaceae) to prevent cross-species misdiagnosis, then analyzes lesion color and texture using OpenCV HSV segmentation and MobileNetV2 classification to identify the exact pathogen and calculate affected leaf area."
    },
    {
      q: "Can I identify a plant disease accurately from a single leaf photo?",
      a: "Yes. When leaf photos show distinct diagnostic symptoms—such as the concentric bullseye rings of Early Blight, water-soaked dark patches of Late Blight, or feathery black spots of Rose Black Spot—AI models achieve over 90% diagnostic accuracy. For ambiguous field samples, FloraScan AI provides a Human-in-the-Loop clarification system and multimodal Krishi Sakha visual inspection to guarantee biological precision."
    },
    {
      q: "What crops and plant diseases does FloraScan AI support?",
      a: "FloraScan AI provides verified diagnostic protocols for major agricultural crops and ornamentals including Tomatoes, Potatoes, Bell Peppers, Apples, Citrus, Cucumbers, Melons, and Roses. Calibrated pathologies include Early Blight (Alternaria solani), Late Blight (Phytophthora infestans), Bacterial Spot (Xanthomonas), Rose Black Spot (Diplocarpon rosae), Apple Scab (Venturia inaequalis), Apple Black Rot (Botryosphaeria obtusa), Citrus Greening/HLB, Powdery Mildew, Downy Mildew, and Healthy foliage."
    },
    {
      q: "How does FloraScan AI help prevent fungicide resistance?",
      a: "Indiscriminate spraying of single-site fungicides often leads to rapid pathogen resistance. FloraScan AI aligns its chemical recommendations with FRAC (Fungicide Resistance Action Committee) codes, explicitly providing multi-site tank mix options (such as FRAC M05 or M01), rotation intervals, and mandatory organic bio-controls to safeguard chemical efficacy for future cropping cycles."
    },
    {
      q: "Can FloraScan AI replace a certified agricultural extension officer or agronomist?",
      a: "No. FloraScan AI is an assistive decision-support platform built to empower growers with immediate foliar diagnosis in the field. Large-scale agrochemical applications or critical acreage management decisions should always be verified with your regional university extension service, certified crop advisor (CCA), or government agricultural department."
    },
    {
      q: "Are my uploaded crop photos private and protected?",
      a: "Yes. Your privacy is paramount. FloraScan AI processes image diagnosis in the browser and across secure temporary inference sessions. User-uploaded leaf photos and scan history remain strictly local on your device and are never published to public search engine indexes."
    }
  ];

  return (
    <section className="w-full mt-14 sm:mt-20 border-t border-slate-200 dark:border-slate-800/80 pt-12 sm:pt-16 text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* ── Section 1: What is FloraScan AI? ── */}
      <article className="mb-16">
        <div className="max-w-4xl mx-auto text-center space-y-4">

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Precision AI Plant Disease Detection & Crop Health Diagnostics
          </h2>
          
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            FloraScan AI is an open agricultural intelligence platform that bridges the gap between digital computer vision and actionable foliar pathology. By analyzing photographs of plant leaves captured directly in the field, FloraScan AI identifies foliar infections in real time, measures necrotic lesion surface area, and provides verified agronomic treatment plans with strict safety gating.
          </p>
        </div>

        {/* 3 Pillar Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Instant In-Field Diagnosis</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload existing gallery photos or activate the live field camera. Instant edge-optimized inference returns pathogen predictions and confidence scores in under 200ms.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">OpenCV Lesion Quantification</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Advanced HSV color-space thresholding segments chlorotic and necrotic tissue from healthy green lamina, calculating exact lesion surface area percentage to quantify severity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Verified Agronomic Protocols</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Receive FRAC-aligned fungicide rotations, tank mixes, knapsack dilution rates, organic bio-controls (Bacillus subtilis), and critical Pre-Harvest Intervals (PHI).
            </p>
          </div>
        </div>
      </article>

      {/* ── Section 2: How AI Plant Disease Detection Works ── */}
      <article className="mb-16 p-8 sm:p-10 rounded-3xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
            Engine Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How AI Plant Disease Detection Works Step-by-Step
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            FloraScan AI combines digital image processing (DIP) with two-tier deep convolutional neural networks to ensure robust, biologically grounded diagnoses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-3 relative">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Image Acquisition</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              The user takes a crisp leaf photo in daylight or uploads an existing image. The frame captures both symptomatic spots and healthy leaf margins.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-3 relative">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Host Species Verification</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Tier 1 biological gating classifies whether the host is a Solanaceous crop (Tomato/Potato), Cucurbit, Fruit Tree, or Ornamental Shrub (Rose) to rule out impossible diseases.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-3 relative">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Lesion Segmentation</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              OpenCV HSV filters segment chlorotic halos and necrotic spots, evaluating circularity, margin roughness (feathery vs smooth), and total lesion surface area percentage.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-3 relative">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center">
              4
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Actionable Prescription</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              The agronomic engine outputs verified FRAC active ingredients, knapsack sprayer dilutions, cultural field sanitation, and certified organic bio-control alternatives.
            </p>
          </div>
        </div>
      </article>

      {/* ── Section 3: Supported Plant Diseases Knowledge Base (Infinite Marquee Gallery) ── */}
      <article id="diseaseDirectory" className="mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
              Pathology Knowledge Base
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Supported Crops & Plant Disease Identification Gallery
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Continuous foliar pathology stream across calibrated crops. Hover over any disease card to pause scrolling, inspect leaf symptom patterns, or test directly in the AI diagnostic studio.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700/60 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Hover to pause</span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">9 Pathologies</span>
          </div>
        </div>

        {/* ── Modern Infinite Marquee Container ── */}
        <div className="disease-marquee-container py-3">
          <div className="disease-marquee-track">
            {[...SUPPORTED_DISEASES, ...SUPPORTED_DISEASES].map((disease, idx) => {
              const imageSrc = `/images/diseases/${disease.slug}.jpg`;
              return (
                <div
                  key={`${disease.slug}-${idx}`}
                  className="w-[280px] sm:w-[310px] flex-shrink-0 group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Disease Foliar Photo Container */}
                    <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3 border border-slate-100 dark:border-slate-800">
                      <img
                        src={imageSrc}
                        alt={`${disease.title} foliar symptoms on ${disease.crops[0]}`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                      
                      {/* Crop Badge Pill */}
                      <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 shadow-sm border ${disease.typeBadge}`}>
                        {disease.crops[0].split(' ')[0]}
                      </span>

                      {/* Icon Badge */}
                      <span className="absolute top-2.5 right-2.5 text-lg p-1 rounded-lg bg-black/40 backdrop-blur-sm">
                        {disease.icon}
                      </span>

                      {/* Title Overlay at bottom of photo */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5">
                        <h3 className="font-bold text-sm text-white drop-shadow-md leading-tight">
                          {disease.title}
                        </h3>
                        <p className="text-[11px] font-mono italic text-emerald-300 drop-shadow leading-tight">
                          {disease.scientificName}
                        </p>
                      </div>
                    </div>

                    {/* Diagnostic Marker Box */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 mb-3 text-xs space-y-1">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                        Diagnostic Marker
                      </span>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed line-clamp-2">
                        {disease.visualMarkers}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => onSelectDisease && onSelectDisease(disease)}
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-bold transition-all text-center cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                      View Guide
                    </button>
                    {disease.presetKey && (
                      <button
                        type="button"
                        onClick={() => onLoadSample && onLoadSample(disease.presetKey)}
                        className="py-1.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
                        title={`Test ${disease.title} in Diagnostic Studio`}
                      >
                        <FlaskConical className="w-3.5 h-3.5" />
                        <span>Test AI</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </article>

      {/* ── Section 4: Why Use AI for Plant Disease Detection? ── */}
      <article className="mb-16">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
            Agronomic Impact
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why Use AI for Crop Foliar Pathology & Plant Health?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            Early, precise disease identification safeguards harvest yields, protects farm profitability, and prevents environmental contamination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
              🛡️
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">Arrest Crop Yield Loss</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Foliar pathogens like Late Blight can destroy 100% of tomato or potato acreage in under two weeks. Detecting lesions at the 1–5% severity stage enables curative containment.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-lg">
              🧪
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">Stop Blanket Spraying</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Applying fungal fungicides to bacterial spot or applying crop fungicides to ornamental shrubs causes wasteful chemical expenses and risks crop phytotoxicity.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">
              🐝
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">Protect Pollinators & Soil</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              By recommending organic bio-fungicides (Bacillus amyloliquefaciens) and respecting Pre-Harvest Intervals (PHI), FloraScan AI protects soil biology and beneficial pollinators.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-lg">
              📱
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">Democratize Agriscience</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Smallholder farmers and remote rural growers often lack immediate access to certified plant pathologists. FloraScan AI delivers instant expert knowledge directly onto mobile browsers.
            </p>
          </div>
        </div>
      </article>

      {/* ── Section 5: Frequently Asked Questions (FAQ) ── */}
      <article id="faqSection" className="mb-16">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
            Questions & Answers
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions About AI Plant Disease Detection
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Clear, honest answers about machine learning accuracy, supported crops, leaf photography, and agronomic verification.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-850 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </article>

    </section>
  );
}
