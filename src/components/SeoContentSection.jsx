// src/components/SeoContentSection.jsx
// High-Quality, Multilingual Search-Engine-Optimized Content Section for FloraScan AI

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
  Leaf, 
  Zap, 
  BookOpen, 
  FlaskConical 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedDiseases } from '../locales/diseaseTranslations';

export default function SeoContentSection({ onSelectDisease, onLoadSample }) {
  const { language, t } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const localizedFaqs = {
    en: [
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
    ],
    kn: [
      {
        q: "AI ಸಸ್ಯ ರೋಗ ಪತ್ತೆ ಎಂದರೇನು ಮತ್ತು ಫ್ಲೋರಾಸ್ಕ್ಯಾನ್ AI ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?",
        a: "AI ಸಸ್ಯ ರೋಗ ಪತ್ತೆಯು ಎಲೆಯ ಫೋಟೋಗಳಲ್ಲಿ ಶಿಲೀಂಧ್ರ, ಬ್ಯಾಕ್ಟೀರಿಯಾ ಮತ್ತು ವೈರಸ್ ರೋಗಲಕ್ಷಣಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಲು ಕಂಪ್ಯೂಟರ್ ದೃಷ್ಟಿ ಮತ್ತು ಡೀಪ್ ಲರ್ನಿಂಗ್ ಬಳಸುತ್ತದೆ. ಫ್ಲೋರಾಸ್ಕ್ಯಾನ್ AI ಮೊದಲು ಸಸ್ಯ ತಳಿಯನ್ನು ದೃಢಪಡಿಸಿ, ನಂತರ ಓಪನ್‌ಸಿವಿ ಮತ್ತು ಮೊಬೈಲ್‌ನೆಟ್‌ವಿ2 ಮೂಲಕ ಗಾಯದ ವಿಸ್ತೀರ್ಣ ಮತ್ತು ರೋಗವನ್ನು ನಿಖರವಾಗಿ ಗುರುತಿಸುತ್ತದೆ."
      },
      {
        q: "ಕೇವಲ ಒಂದು ಎಲೆಯ ಫೋಟೋದಿಂದ ಸಸ್ಯ ರೋಗವನ್ನು ನಿಖರವಾಗಿ ಪತ್ತೆಹಚ್ಚಬಹುದೇ?",
        a: "ಹೌದು. ಎಲೆಯ ಫೋಟೋ ಸ್ಪಷ್ಟ ಲಕ್ಷಣಗಳನ್ನು ತೋರಿಸಿದಾಗ AI ಮಾದರಿಗಳು 90% ಕ್ಕಿಂತ ಹೆಚ್ಚು ನಿಖರತೆಯನ್ನು ಸಾಧಿಸುತ್ತವೆ. ಸಂದೇಹಾಸ್ಪದ ಮಾದರಿಗಳಿಗಾಗಿ ಕೃಷಿ ಸಖ ಮತ್ತು ಮಾನವ ಪರಿಶೀಲನಾ ವ್ಯವಸ್ಥೆಯು ಲಭ್ಯವಿದೆ."
      },
      {
        q: "ಫ್ಲೋರಾಸ್ಕ್ಯಾನ್ AI ಯಾವ ಬೆಳೆಗಳು ಮತ್ತು ಸಸ್ಯ ರೋಗಗಳನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ?",
        a: "ಟೊಮ್ಯಾಟೊ, ಆಲೂಗಡ್ಡೆ, ಮೆಣಸಿನಕಾಯಿ, ಸೇಬು, ನಿಂಬೆ, ಸೌತೆಕಾಯಿ ಮತ್ತು ಗುಲಾಬಿ ಸೇರಿದಂತೆ ಪ್ರಮುಖ ಬೆಳೆಗಳ ಆರಂಭಿಕ ಬ್ಲೈಟ್, ತಡವಾದ ಬ್ಲೈಟ್, ಬ್ಯಾಕ್ಟೀರಿಯಾದ ಚುಕ್ಕೆ, ಕಪ್ಪು ಚುಕ್ಕೆ ಮತ್ತು ಆರೋಗ್ಯಕರ ಎಲೆಗಳನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ."
      },
      {
        q: "ಫ್ಲೋರಾಸ್ಕ್ಯಾನ್ AI ಶಿಲೀಂಧ್ರನಾಶಕ ಪ್ರತಿರೋಧವನ್ನು ತಡೆಯಲು ಹೇಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ?",
        a: "ಒಂದೇ ರಾಸಾಯನಿಕವನ್ನು ಪದೇ ಪದೇ ಸಿಂಪಡಿಸುವುದರಿಂದ ರೋಗಕಾರಕಗಳು ಪ್ರತಿರೋಧ ಬೆಳೆಸಿಕೊಳ್ಳುತ್ತವೆ. ಫ್ಲೋರಾಸ್ಕ್ಯಾನ್ AI FRAC ಕೋಡ್‌ಗಳ ಆಧಾರದ ಮೇಲೆ ಔಷಧ ಬದಲಾವಣೆ ಮತ್ತು ಸಾವಯವ ಪರ್ಯಾಯಗಳನ್ನು ಕಡ್ಡಾಯವಾಗಿ ಶಿಫಾರಸು ಮಾಡುತ್ತದೆ."
      },
      {
        q: "ಫ್ಲೋರಾಸ್ಕ್ಯಾನ್ AI ಪ್ರಮಾಣೀಕೃತ ಕೃಷಿ ಅಧಿಕಾರಿಯ ಸ್ಥಾನವನ್ನು ತುಂಬಬಹುದೇ?",
        a: "ಇಲ್ಲ. ಫ್ಲೋರಾಸ್ಕ್ಯಾನ್ AI ಹೊಲದಲ್ಲೇ ತ್ವರಿತ ಮಾರ್ಗದರ್ಶನ ನೀಡುವ ನಿರ್ಧಾರ ಬೆಂಬಲ ವ್ಯವಸ್ಥೆಯಾಗಿದೆ. ದೊಡ್ಡ ಪ್ರಮಾಣದ ಔಷಧ ಸಿಂಪಡಣೆಗೆ ಮುನ್ನ ನಿಮ್ಮ ಪ್ರಾದೇಶಿಕ ಕೃಷಿ ಅಧಿಕಾರಿಗಳನ್ನು ಸಂಪರ್ಕಿಸುವುದು ಸೂಕ್ತ."
      },
      {
        q: "ನಾನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಬೆಳೆಗಳ ಫೋಟೋಗಳು ಸುರಕ್ಷಿತವಾಗಿವೆಯೇ?",
        a: "ಹೌದು. ನಿಮ್ಮ ಗೌಪ್ಯತೆಯು ಸುರಕ್ಷಿತವಾಗಿದೆ. ಫೋಟೋಗಳು ನಿಮ್ಮ ಸಾಧನದಲ್ಲೇ ಸುರಕ್ಷಿತವಾಗಿ ಪರಿಶೀಲಿಸಲ್ಪಡುತ್ತವೆ ಮತ್ತು ಯಾವುದೇ ಸಾರ್ವಜನಿಕ ಸರ್ಚ್ ಎಂಜಿನ್‌ಗಳಲ್ಲಿ ಪ್ರಕಟವಾಗುವುದಿಲ್ಲ."
      }
    ],
    hi: [
      {
        q: "एआई पादप रोग पहचान क्या है और फ्लोरास्कैन AI कैसे काम करता है?",
        a: "एआई पादप रोग पहचान पत्तियों की तस्वीरों में कवक, बैक्टीरिया और वायरस के लक्षणों का पता लगाने के लिए कंप्यूटर विज़न और डीप लर्निंग का उपयोग करती है। फ्लोरास्कैन AI पौधे की प्रजाति की पुष्टि करके घाव क्षेत्र और सटीक रोग का निर्धारण करता है।"
      },
      {
        q: "क्या एक पत्ती की तस्वीर से पादप रोग की सटीक पहचान की जा सकती है?",
        a: "हाँ। जब पत्ती की तस्वीर स्पष्ट नैदानिक लक्षण दिखाती है तो एआई मॉडल 90% से अधिक सटीकता प्राप्त करते हैं। संदिग्ध नमूनों के लिए कृषि सखा और मानवीय सत्यापन उपलब्ध है।"
      },
      {
        q: "फ्लोरास्कैन AI किन फसलों और रोगों का समर्थन करता है?",
        a: "टमाटर, आलू, मिर्च, सेब, नींबू, खीरा और गुलाब सहित प्रमुख फसलों के अगेती झुलसा, पछेती झुलसा, जीवाणु धब्बा, काला धब्बा और स्वस्थ पत्तियों का समर्थन करता है।"
      },
      {
        q: "फ्लोरास्कैन AI कवकनाशी प्रतिरोध को रोकने में कैसे मदद करता है?",
        a: "एक ही रसायन का बार-बार छिड़काव रोग प्रतिरोध पैदा करता है। फ्लोरास्कैन AI एफआरएसी कोड के अनुसार रसायनों के चक्रीय उपयोग और जैविक विकल्पों की सिफारिश करता है।"
      },
      {
        q: "क्या फ्लोरास्कैन AI प्रमाणित कृषि अधिकारी का स्थान ले सकता है?",
        a: "नहीं। फ्लोरास्कैन AI खेत में त्वरित सहायता के लिए निर्णय समर्थन मंच है। बड़े पैमाने पर रासायनिक छिड़काव से पहले हमेशा स्थानीय कृषि अधिकारियों से परामर्श करें।"
      },
      {
        q: "क्या मेरी अपलोड की गई तस्वीरें सुरक्षित और निजी हैं?",
        a: "हाँ। आपकी गोपनीयता पूर्णतः सुरक्षित है। तस्वीरें आपके डिवाइस और सुरक्षित सत्रों में संसाधित होती हैं और कभी सार्वजनिक रूप से प्रकाशित नहीं होती हैं।"
      }
    ]
  };

  const currentFaqs = localizedFaqs[language] || localizedFaqs.en;
  const diseases = getLocalizedDiseases(language);

  return (
    <section className="w-full mt-14 sm:mt-20 border-t border-slate-200 dark:border-slate-800/80 pt-12 sm:pt-16 text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* ── Section 1: What is FloraScan AI? ── */}
      <article className="mb-16">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t('seoMainTitle')}
          </h2>
          
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('seoMainDesc')}
          </p>
        </div>

        {/* 3 Pillar Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('seoCard1Title')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('seoCard1Desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('seoCard2Title')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('seoCard2Desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('seoCard3Title')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('seoCard3Desc')}
            </p>
          </div>
        </div>
      </article>

      {/* ── Section 2: How AI Plant Disease Detection Works ── */}
      <article className="mb-16 p-8 sm:p-10 rounded-3xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
            {t('heroBadge')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('seoPipelineTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            {t('heroSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-3 relative">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">{t('seoStep1Title')}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('seoStep1Desc')}
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-3 relative">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">{t('seoStep2Title')}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('seoStep2Desc')}
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-3 relative">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">{t('seoStep3Title')}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('seoStep3Desc')}
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-3 relative">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center">
              4
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">{t('seoStep4Title')}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('seoStep4Desc')}
            </p>
          </div>
        </div>
      </article>

      {/* ── Section 3: Supported Plant Diseases Knowledge Base (Infinite Marquee Gallery) ── */}
      <article id="diseaseDirectory" className="mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
              {t('guideTitle', 'Pathology Knowledge Base')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('seoDirectoryTitle')}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              {t('seoDirectoryDesc')}
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700/60 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{diseases.length} Pathologies</span>
          </div>
        </div>

        {/* ── Infinite Marquee / Responsive Cards ── */}
        <div className="disease-marquee-container py-3">
          <div className="disease-marquee-track">
            {[...diseases, ...diseases].map((disease, idx) => {
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
                        alt={`${disease.title} foliar symptoms`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                      
                      {/* Crop Badge Pill */}
                      {disease.crops && disease.crops[0] && (
                        <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 shadow-sm border ${disease.typeBadge}`}>
                          {disease.crops[0]}
                        </span>
                      )}

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
                          {disease.scientificName || disease.scientific}
                        </p>
                      </div>
                    </div>

                    {/* Summary / Symptoms Preview */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 mb-3 text-xs space-y-1">
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed line-clamp-2">
                        {disease.summary || disease.desc}
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
                      {t('viewFullGuideBtn', 'View Guide')}
                    </button>
                    {disease.presetKey && (
                      <button
                        type="button"
                        onClick={() => onLoadSample && onLoadSample(disease.presetKey)}
                        className="py-1.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
                        title={t('testInStudioBtn', 'Test Sample in Studio')}
                      >
                        <FlaskConical className="w-3.5 h-3.5" />
                        <span>{t('testInStudioBtn', 'Test AI')}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </article>

      {/* ── Section 4: Frequently Asked Questions (FAQ) ── */}
      <article id="faqSection" className="mb-16">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
            {t('seoFaqTitle', 'Questions & Answers')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('seoFaqTitle', 'Frequently Asked Questions About AI Plant Disease Detection')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            {t('seoFaqDesc', 'Clear, honest answers about machine learning accuracy, supported crops, leaf photography, and agronomic verification.')}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {currentFaqs.map((faq, idx) => {
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
