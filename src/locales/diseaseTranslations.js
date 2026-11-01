// src/locales/diseaseTranslations.js
// Localized Agronomic Disease Catalog for SeoContentSection and Disease Modals

import { SUPPORTED_DISEASES } from '../data/diseasesData.js';

export const LOCALIZED_DISEASES = {
  kn: [
    {
      slug: 'early-blight',
      title: 'ಆರಂಭಿಕ ರೋಗ (Early Blight)',
      scientificName: 'Alternaria solani',
      category: 'ಶಿಲೀಂಧ್ರ ರೋಗಕಾರಕ (Fungal)',
      typeBadge: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/60',
      icon: '🎯',
      crops: ['ಟೊಮ್ಯಾಟೊ', 'ಆಲೂಗಡ್ಡೆ', 'ಬದನೆ'],
      presetKey: 'Early_Blight',
      summary: 'ಬೆಚ್ಚನೆಯ ಮತ್ತು ತೇವ ವಾತಾವರಣದಲ್ಲಿ ಕೆಳಗಿನ ಎಲೆಗಳ ಮೇಲೆ ಏಕಕೇಂದ್ರಕ ಉಂಗುರದಂತಹ (ಗುರಿ ಚುಕ್ಕೆಗಳ) ಕಲೆಗಳು ವೇಗವಾಗಿ ಹರಡುವ ಸಾಮಾನ್ಯ ಶಿಲೀಂಧ್ರ ರೋಗ.',
      symptoms: [
        'ಹಳೆಯ ಎಲೆಗಳ ಮೇಲೆ ಕಂದು-ಕಪ್ಪು ಬಣ್ಣದ ಏಕಕೇಂದ್ರಕ ಉಂಗುರದ ಚುಕ್ಕೆಗಳು (ಗುರಿ ಚುಕ್ಕೆಗಳು).',
        'ಗಾಯಗಳ ಸುತ್ತಲೂ ಹಳದಿ ಬಣ್ಣದ ವಲಯ, ಎಲೆಗಳು ಅಕಾಲಿಕವಾಗಿ ಒಣಗಿ ಉದುರುವುದು.',
        'ಕೆಳಗಿನ ಎಲೆಗಳಿಂದ ಪ್ರಾರಂಭವಾಗಿ ಸಸ್ಯದ ಮೇಲ್ಭಾಗಕ್ಕೆ ಹರಡುವ ರೋಗ.',
        'ಹಣ್ಣಿನ ತೊಟ್ಟಿನ ಬಳಿ ಕಪ್ಪು, ಕುಸಿದ ಚರ್ಮದಂತಹ ಕಲೆಗಳು.'
      ],
      weatherTriggers: 'ಬೆಚ್ಚನೆಯ ಉಷ್ಣಾಂಶ (24–29°C) ಮತ್ತು ಹೆಚ್ಚಿನ ಆರ್ದ್ರತೆ (>80%).',
      culturalPrevention: [
        'ಕನಿಷ್ಠ 3 ವರ್ಷಗಳ ಕಾಲ ಬೆಳೆ ಪರಿವರ್ತನೆ (ಕ್ರಾಪ್ ರೊಟೇಶನ್) ಅನುಸರಿಸಿ.',
        'ಹನಿ ನೀರಾವರಿ ಬಳಸಿ ಎಲೆಗಳು ಒಣಗಿರುವಂತೆ ನೋಡಿಕೊಳ್ಳಿ.',
        'ಮಣ್ಣಿನಿಂದ ಮಳೆ ನೀರು ಚಿಮ್ಮುವುದನ್ನು ತಡೆಯಲು ಬುಡದಲ್ಲಿ ಒಣಹುಲ್ಲಿನ ಹೊದಿಕೆ (ಮಲ್ಚಿಂಗ್) ಹಾಕಿ.'
      ],
      organicRemedies: [
        'ಬ್ಯಾಸಿಲಸ್ ಸಬ್ಟಿಲಿಸ್ ಜೈವಿಕ ಶಿಲೀಂಧ್ರನಾಶಕವನ್ನು ಪ್ರತಿ 7-10 ದಿನಗಳಿಗೊಮ್ಮೆ ಸಿಂಪಡಿಸಿ.',
        'ತಾಮ್ರದ ಸೋಪ್ ಅಥವಾ ಬೋರ್ಡೊ ಮಿಶ್ರಣವನ್ನು ರಕ್ಷಣಾತ್ಮಕವಾಗಿ ಸಿಂಪಡಿಸಿ.'
      ],
      chemicalTreatment: 'ಕ್ಲೋರೋಥಲೋನಿಲ್ (2.0 ಗ್ರಾಂ/ಲೀ) ಅಥವಾ ಅಜೋಕ್ಸಿಸ್ಟ್ರೋಬಿನ್ (1.0 ಮಿಲಿ/ಲೀ) ಸಿಂಪಡಿಸಿ.'
    },
    {
      slug: 'late-blight',
      title: 'ತಡವಾದ ಅಂಗಮಾರಿ ರೋಗ (Late Blight)',
      scientificName: 'Phytophthora infestans',
      category: 'ಮಾರಕ ಜಲ-ಶಿಲೀಂಧ್ರ ರೋಗ (Oomycete)',
      typeBadge: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700/60',
      icon: '🥀',
      crops: ['ಆಲೂಗಡ್ಡೆ', 'ಟೊಮ್ಯಾಟೊ'],
      presetKey: 'Late_Blight',
      summary: 'ತಂಪಾದ, ತೇವ ಮತ್ತು ಮಂಜು ಕವಿದ ವಾತಾವರಣದಲ್ಲಿ ಇಡೀ ಬೆಳೆಗಳನ್ನು ಕೆಲವೇ ದಿನಗಳಲ್ಲಿ ನಾಶಪಡಿಸಬಲ್ಲ ಅತ್ಯಂತ ಮಾರಕ ಜಲ-ಶಿಲೀಂಧ್ರ ರೋಗ.',
      symptoms: [
        'ಎಲೆಗಳ ಮೇಲೆ ನೀರಿನಿಂದ ನೆನೆದಂತಹ ದೊಡ್ಡ, ಅನಿಯಮಿತ ಕಡು ಕಂದು ಕಲೆಗಳು.',
        'ಹೆಚ್ಚಿನ ತೇವಾಂಶದಲ್ಲಿ ಎಲೆಯ ಕೆಳಭಾಗದಲ್ಲಿ ಬಿಳಿ ಬೂಸ್ಟಿನಂತಹ ಪದರ.',
        'ಕಾಂಡ ಕಪ್ಪಾಗಿ ಕೊಳೆಯುವುದು ಮತ್ತು ಇಡೀ ಗಿಡವು ತಕ್ಷಣವೇ ಕುಸಿಯುವುದು.',
        'ಗೆಡ್ಡೆಗಳು ಮತ್ತು ಹಣ್ಣುಗಳ ಒಳಗೆ ಕಂದು ಬಣ್ಣದ ರೋಗಗ್ರಸ್ತ ಕೊಳೆತ.'
      ],
      weatherTriggers: 'ತಂಪಾದ, ತೇವ ಮತ್ತು ಮಂಜು ಕವಿದ ವಾತಾವರಣ (15–20°C, >90% RH).',
      culturalPrevention: [
        'ಪ್ರಮಾಣೀಕೃತ ರೋಗಮುಕ್ತ ಬಿತ್ತನೆ ಆಲೂಗಡ್ಡೆಗಳನ್ನು ಮಾತ್ರ ನೆಡಿ.',
        'ಸೋಂಕಿತ ಆಲೂಗಡ್ಡೆ ರಾಶಿಗಳನ್ನು ಹೊಲದಿಂದ ದೂರವಿಟ್ಟು ನಾಶಮಾಡಿ.',
        'ಗಿಡಗಳ ನಡುವೆ ಕನಿಷ್ಠ 75 ಸೆಂ.ಮೀ ಅಂತರವಿರಲಿ.'
      ],
      organicRemedies: [
        'ಸೋಂಕಿತ ಗಿಡಗಳನ್ನು ತಕ್ಷಣ ಪ್ರತ್ಯೇಕಿಸಿ ಸುಟ್ಟುಹಾಕಿ.',
        'ಮಳೆ ಬರುವ ಮೊದಲು ತಾಮ್ರದ ಹೈಡ್ರಾಕ್ಸೈಡ್ ರಕ್ಷಣಾತ್ಮಕ ಸಿಂಪಡಣೆ ಮಾಡಿ.'
      ],
      chemicalTreatment: 'ಮೆಟಲಾಕ್ಸಿಲ್-ಎಂ + ಮ್ಯಾಂಕೋಜೆಬ್ (2.5 ಗ್ರಾಂ/ಲೀ) ಅಥವಾ ಸೈಮೋಕ್ಸಾನಿಲ್ ತುರ್ತು ಸಿಂಪಡಣೆ.'
    },
    {
      slug: 'bacterial-spot',
      title: 'ಬ್ಯಾಕ್ಟೀರಿಯಾದ ಚುಕ್ಕೆ ರೋಗ (Bacterial Spot)',
      scientificName: 'Xanthomonas perforans',
      category: 'ಬ್ಯಾಕ್ಟೀರಿಯಾ ರೋಗಕಾರಕ (Bacterial)',
      typeBadge: 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700/60',
      icon: '🍂',
      crops: ['ಮೆಣಸಿನಕಾಯಿ', 'ಟೊಮ್ಯಾಟೊ'],
      presetKey: 'Bacterial_Spot',
      summary: 'ಎಲೆಗಳ ಮೇಲೆ ಸಣ್ಣ ನೀರಿನ ಚುಕ್ಕೆಗಳನ್ನು ಉಂಟುಮಾಡುವ ಮತ್ತು ಒಣಗಿ ರಂಧ್ರಗಳಾಗುವ ಬ್ಯಾಕ್ಟೀರಿಯಾ ರೋಗ.',
      symptoms: [
        'ಎಲೆಗಳ ಮೇಲೆ ಸಣ್ಣ, ಕೋನೀಯ, ಜಿಡ್ಡಿನಂತಹ ನೀರಿನ ಚುಕ್ಕೆಗಳು (1–3 ಮಿ.ಮೀ).',
        'ಚುಕ್ಕೆಗಳ ಕೇಂದ್ರ ಭಾಗ ಒಡೆದು ರಂಧ್ರಗಳಾಗುವುದು (ಶಾಟ್-ಹೋಲ್).',
        'ಎಲೆಗಳು ಹಳದಿಯಾಗಿ ಉದುರುವುದು ಮತ್ತು ಹಣ್ಣುಗಳ ಮೇಲೆ ಕಲೆಗಳು.'
      ],
      weatherTriggers: 'ಭಾರೀ ಮಳೆ, ಹೆಚ್ಚಿನ ತೇವಾಂಶ ಮತ್ತು 25–30°C ಉಷ್ಣಾಂಶ.',
      culturalPrevention: [
        'ಎಲೆಗಳು ತೇವವಾಗಿರುವಾಗ ಹೊಲದಲ್ಲಿ ಕೆಲಸ ಮಾಡಬೇಡಿ.',
        'ಹನಿ ನೀರಾವರಿ ಬಳಸಿ; ರೋಗ ಪ್ರತಿರೋಧಕ ತಳಿಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.'
      ],
      organicRemedies: [
        'ಬ್ಯಾಸಿಲಸ್ ಜೈವಿಕ ಬ್ಯಾಕ್ಟೀರಿಯಾನಾಶಕವನ್ನು ಪ್ರತಿ 7 ದಿನಗಳಿಗೊಮ್ಮೆ ಸಿಂಪಡಿಸಿ.'
      ],
      chemicalTreatment: 'ಕಾಪರ್ ಹೈಡ್ರಾಕ್ಸೈಡ್ (2.0 ಗ್ರಾಂ/ಲೀ) + ಮ್ಯಾಂಕೋಜೆಬ್ (1.5 ಗ್ರಾಂ/ಲೀ) ಸಿಂಪಡಣೆ.'
    },
    {
      slug: 'rose-black-spot',
      title: 'ಗುಲಾಬಿ ಕಪ್ಪು ಚುಕ್ಕೆ ರೋಗ (Rose Black Spot)',
      scientificName: 'Diplocarpon rosae',
      category: 'ತೋಟಗಾರಿಕಾ ಶಿಲೀಂಧ್ರ ರೋಗ',
      typeBadge: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700/60',
      icon: '🌹',
      crops: ['ಗುಲಾಬಿ ಗಿಡಗಳು'],
      presetKey: 'Rose_Black_Spot',
      summary: 'ಗುಲಾಬಿ ಗಿಡಗಳ ಎಲೆಗಳ ಮೇಲೆ ನಾರಿನ ಅಂಚುಗಳಿರುವ ಕಡು ಕಪ್ಪು ಚುಕ್ಕೆಗಳನ್ನು ಉಂಟುಮಾಡುವ ಶಿಲೀಂಧ್ರ ರೋಗ.',
      symptoms: [
        'ಗರಿಗಳಂತಹ ನಾರಿನ ಅಂಚುಗಳಿರುವ ಕಡು ಕಪ್ಪು ಬಣ್ಣದ ವೃತ್ತಾಕಾರದ ಚುಕ್ಕೆಗಳು.',
        'ಚುಕ್ಕೆಗಳ ಸುತ್ತಲೂ ಹಳದಿ ವಲಯ ಮತ್ತು ಎಲೆಗಳ ಶೀಘ್ರ ಪತನ.',
        'ಗಿಡ ಬಲಹೀನವಾಗಿ ಕಡಿಮೆ ಹೂವುಗಳು ಬಿಡುವುದು.'
      ],
      weatherTriggers: 'ಬೆಚ್ಚನೆಯ ಆರ್ದ್ರ ಹವೆ ಮತ್ತು ಎಲೆಗಳ ಮೇಲಿನ ನಿರಂತರ ತೇವಾಂಶ.',
      culturalPrevention: [
        'ಗಿಡದ ಬುಡಕ್ಕೆ ಮಾತ್ರ ನೀರುಣಿಸಿ; ಒಣಗಿದ ಎಲೆಗಳನ್ನು ತೆಗೆದು ಸುಟ್ಟುಹಾಕಿ.',
        'ಗಿಡಕ್ಕೆ ಗಾಳಿ ಮತ್ತು ಸೂರ್ಯನ ಬೆಳಕು ಸಿಗುವಂತೆ ಕತ್ತರಿಸಿ.'
      ],
      organicRemedies: [
        'ಪೊಟ್ಯಾಸಿಯಮ್ ಬೈಕಾರ್ಬನೇಟ್ (3 ಗ್ರಾಂ/ಲೀ) + ಬೇವಿನ ಎಣ್ಣೆ (5 ಮಿಲಿ/ಲೀ) ಸಿಂಪಡಿಸಿ.'
      ],
      chemicalTreatment: 'ಮೈಕ್ಲೋಬುಟಾನಿಲ್ ಅಥವಾ ಟೆಬುಕೊನಜೋಲ್ (1.0 ಮಿಲಿ/ಲೀ) + ಮ್ಯಾಂಕೋಜೆಬ್.'
    },
    {
      slug: 'healthy-foliage',
      title: 'ಆರೋಗ್ಯಕರ ಎಲೆ (Healthy Foliage)',
      scientificName: 'Optimal Foliar Homeostasis',
      category: 'ರೋಗಮುಕ್ತ ಸಸ್ಯ (Optimal)',
      typeBadge: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60',
      icon: '🌿',
      crops: ['ಎಲ್ಲಾ ಬೆಳೆಗಳು'],
      presetKey: 'Healthy',
      summary: 'ಯಾವುದೇ ನೆಕ್ರೋಟಿಕ್ ಗಾಯಗಳಿಲ್ಲದ, ಸಮೃದ್ಧ ಹಸಿರು ಕ್ಲೋರೋಫಿಲ್ ಹೊಂದಿರುವ ಅತ್ಯುತ್ತಮ ಆರೋಗ್ಯಕರ ಸಸ್ಯ.',
      symptoms: [
        'ಏಕರೂಪದ ನೈಸರ್ಗಿಕ ಹಸಿರು ಬಣ್ಣ.',
        'ಯಾವುದೇ ಕಲೆಗಳು, ಗಾಯಗಳು ಅಥವಾ ಬೂಸ್ಟಿನ ಲಕ್ಷಣಗಳಿಲ್ಲ.',
        'ಬಲಿಷ್ಠ ನರಗಳ ರಚನೆ ಮತ್ತು ಉತ್ತಮ ಬೆಳವಣಿಗೆ.'
      ],
      weatherTriggers: 'ಸಮತೋಲಿತ ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿಗಳು.',
      culturalPrevention: [
        'ಸಮತೋಲಿತ ನೀರು ಮತ್ತು ಪೋಷಕಾಂಶಗಳ ನಿರ್ವಹಣೆ ಮುಂದುವರಿಸಿ.'
      ],
      organicRemedies: [
        'ಜೀವಾಮೃತ ಅಥವಾ ಎರೆಹುಳು ಗೊಬ್ಬರದ ಬಳಕೆಯನ್ನು ಮುಂದುವರಿಸಿ.'
      ],
      chemicalTreatment: 'ಯಾವುದೇ ರಾಸಾಯನಿಕ ಶಿಲೀಂಧ್ರನಾಶಕಗಳ ಅಗತ್ಯವಿಲ್ಲ.'
    }
  ],

  hi: [
    {
      slug: 'early-blight',
      title: 'अगेती झुलसा (Early Blight)',
      scientificName: 'Alternaria solani',
      category: 'कवक रोगज़नक़ (Fungal)',
      typeBadge: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/60',
      icon: '🎯',
      crops: ['टमाटर', 'आलू', 'बैंगन'],
      presetKey: 'Early_Blight',
      summary: 'गर्म और नम मौसम में निचली पत्तियों पर संकेंद्री छल्लेदार (बुलआई) धब्बे बनाने वाला एक आम कवक रोग।',
      symptoms: [
        'निचली पत्तियों पर संकेंद्री छल्लेदार (बुलआई) भूरे-काले धब्बे।',
        'घावों के चारों ओर पीले रंग का घेरा (क्लोरोटिक हेलो)।',
        'गंभीर अवस्था में पत्तियों का पीला पड़कर नीचे से ऊपर की ओर झड़ना।',
        'फलों के डंठल के पास काले, धंसे हुए चमड़े जैसे घाव।'
      ],
      weatherTriggers: 'गर्म तापमान (24–29°C) और उच्च आर्द्रता (>80%)।',
      culturalPrevention: [
        'कम से कम 3 साल का फसल चक्र (क्रॉप रोटेशन) अपनाएं।',
        'ड्रिप सिंचाई का उपयोग करें ताकि पत्तियां सूखी रहें।',
        'मिट्टी से बारिश के छींटे रोकने के लिए मल्चिंग करें।'
      ],
      organicRemedies: [
        'बैसिलस सबटिलिस जैव-कवकनाशी का हर 7-10 दिनों में छिड़काव करें।',
        'कॉपर सोप या बोर्डो मिश्रण का सुरक्षात्मक स्प्रे करें।'
      ],
      chemicalTreatment: 'क्लोरोथैलोनिल (2.0 ग्राम/लीटर) या एज़ोक्सीस्ट्रोबिन (1.0 मिली/लीटर)।'
    },
    {
      slug: 'late-blight',
      title: 'पछेती झुलसा (Late Blight)',
      scientificName: 'Phytophthora infestans',
      category: 'घातक जल-फफूंद रोग (Oomycete)',
      typeBadge: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700/60',
      icon: '🥀',
      crops: ['आलू', 'टमाटर'],
      presetKey: 'Late_Blight',
      summary: 'ठंडे, गीले और कोहरे वाले मौसम में पूरी फसल को कुछ ही दिनों में नष्ट करने वाला विनाशकारी जल-फफूंद रोग।',
      symptoms: [
        'पत्तियों पर पानी से भीगे हुए बड़े, अनियमित गहरे भूरे धब्बे।',
        'उच्च आर्द्रता में पत्ती की निचली सतह पर सफेद मखमली फफूंद।',
        'तनों का काला पड़ना और पूरी फसल का अचानक मुरझा जाना।',
        'आलू के कंदों और फलों में कड़ा, भूरा सड़ांध।'
      ],
      weatherTriggers: 'ठंडा, गीला और कोहरे वाला मौसम (15–20°C, >90% RH)।',
      culturalPrevention: [
        'केवल प्रमाणित रोगमुक्त बीज आलू का ही उपयोग करें।',
        'संक्रमित मलबे और आलू के ढेरों को खेत से दूर नष्ट करें।',
        'पंक्तियों के बीच कम से कम 75 सेमी की दूरी रखें।'
      ],
      organicRemedies: [
        'संक्रमित पौधों को तुरंत उखाड़कर नष्ट करें।',
        'बारिश से पहले कॉपर हाइड्रॉक्साइड का सुरक्षात्मक छिड़काव करें।'
      ],
      chemicalTreatment: 'मेटालैक्सिल-एम + मैंकोज़ेब (2.5 ग्राम/लीटर) या साइमोक्सानिल का आपातकालीन स्प्रे।'
    },
    {
      slug: 'bacterial-spot',
      title: 'जीवाणु धब्बा रोग (Bacterial Spot)',
      scientificName: 'Xanthomonas perforans',
      category: 'जीवाणु रोगज़नक़ (Bacterial)',
      typeBadge: 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700/60',
      icon: '🍂',
      crops: ['मिर्च', 'टमाटर'],
      presetKey: 'Bacterial_Spot',
      summary: 'पत्तियों पर छोटे पानी से भीगे तैलीय धब्बे और छेद (शॉट-होल) बनाने वाला गंभीर जीवाणु रोग।',
      symptoms: [
        'पत्तियों पर छोटे, कोणीय, तैलीय पानी से भीगे धब्बे (1-3 मिमी)।',
        'धब्बों का केंद्र सूखकर गिरना (शॉट-होल पैटर्न)।',
        'पत्तियों का पीला पड़ना और फलों पर उभरे हुए खुरदुरे धब्बे।'
      ],
      weatherTriggers: 'भारी बारिश, उच्च आर्द्रता और 25–30°C तापमान।',
      culturalPrevention: [
        'पत्तियां गीली होने पर खेत में काम न करें।',
        'ड्रिप सिंचाई अपनाएं; रोग प्रतिरोधी किस्मों की बुवाई करें।'
      ],
      organicRemedies: [
        'बैसिलस जैव-जीवाणुनाशक का हर 7 दिनों में छिड़काव करें।'
      ],
      chemicalTreatment: 'कॉपर हाइड्रॉक्साइड (2.0 ग्राम/लीटर) + मैंकोज़ेब (1.5 ग्राम/लीटर)।'
    },
    {
      slug: 'rose-black-spot',
      title: 'गुलाब काला धब्बा रोग (Rose Black Spot)',
      scientificName: 'Diplocarpon rosae',
      category: 'पुष्प कवक रोग',
      typeBadge: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700/60',
      icon: '🌹',
      crops: ['गुलाब के पौधे'],
      presetKey: 'Rose_Black_Spot',
      summary: 'गुलाब की पत्तियों पर पंखदार किनारों वाले काले धब्बे और गंभीर पत्ती पतन का कारण बनने वाला रोग।',
      symptoms: [
        'पंखदार, रेशेदार किनारों वाले गोल गहरे काले धब्बे।',
        'काले धब्बों के चारों ओर पीले घेरे और पत्तियों का समय से पहले गिरना।',
        'पौधे की कमजोरी और फूलों की संख्या में कमी।'
      ],
      weatherTriggers: 'गर्म, आर्द्र मौसम और पत्तियों पर लंबे समय तक पानी रहना।',
      culturalPrevention: [
        'केवल पौधे की जड़ में पानी दें; गिरी हुई पत्तियों को जला दें।',
        'हवा और धूप के लिए पौधों की छंटाई करें।'
      ],
      organicRemedies: [
        'पोटेशियम बाइकार्बोनेट (3 ग्राम/लीटर) + नीम का तेल (5 मिली/लीटर)।'
      ],
      chemicalTreatment: 'माइक्लोबुटानिल या टेबुकोनाज़ोल (1.0 मिली/लीटर) + मैंकोज़ेब।'
    },
    {
      slug: 'healthy-foliage',
      title: 'स्वस्थ पत्ती (Healthy Foliage)',
      scientificName: 'Optimal Foliar Homeostasis',
      category: 'रोगमुक्त पौधा (Optimal)',
      typeBadge: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60',
      icon: '🌿',
      crops: ['सभी पौधे'],
      presetKey: 'Healthy',
      summary: 'बिना किसी नेक्रोटिक घाव के, समान समृद्ध हरे क्लोरोफिल वाला पूर्णतः स्वस्थ पौधा।',
      symptoms: [
        'पूरी पत्ती पर एकसमान समृद्ध हरा रंग।',
        'कोई धब्बे, घाव या फफूंददार लक्षण नहीं।',
        'मजबूत शिरा संरचना और उत्कृष्ट वृद्धि।'
      ],
      weatherTriggers: 'संतुलित मौसमी परिस्थितियाँ।',
      culturalPrevention: [
        'संतुलित जल और पोषण प्रबंधन जारी रखें।'
      ],
      organicRemedies: [
        'जीवामृत या जैविक खाद का उपयोग जारी रखें।'
      ],
      chemicalTreatment: 'किसी रासायनिक कवकनाशी की आवश्यकता नहीं है।'
    }
  ]
};

export function getLocalizedDiseases(lang = 'en') {
  if (lang === 'kn') return LOCALIZED_DISEASES.kn;
  if (lang === 'hi') return LOCALIZED_DISEASES.hi;
  return SUPPORTED_DISEASES;
}

export function getLocalizedDiseaseBySlug(slug, lang = 'en') {
  const list = getLocalizedDiseases(lang);
  return list.find((d) => d.slug === slug) || SUPPORTED_DISEASES.find((d) => d.slug === slug);
}
