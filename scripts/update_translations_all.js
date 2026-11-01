import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import translations from '../src/locales/translations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extraKeys = {
  en: {
    // Nearby Shops
    nearbyShopsPrompt: "Would you like me to find nearby agrochemical supply shops on Google Maps to help you source these treatments?",
    nearbyShopsPrivacy: "Your location is used only to open Google Maps — nothing is stored or transmitted.",
    nearbyShopsYes: "Yes, find nearby shops",
    nearbyShopsNo: "No thanks",
    nearbyShopsTitle: "Nearby Agrochemical Suppliers",
    nearbyShopsRadar: "View all agrochemical shops on radar map (Google Maps)",
    nearbyShopsLocationNote: "Uses device location for the most accurate nearby results.",
    nearbyShopsDeclined: "Understood. Consult your local agricultural extension officer or cooperative for sourcing.",
    nearbyShopsLicenseWarning: "Always purchase from authorised, licensed agrochemical dealers and verify product labels before application.",
    nearbyShopsClose: "Close",

    // Weather & Microclimate
    tempLabel: "Temp",
    humidityLabel: "Humidity",
    precipLabel: "Precip",
    refreshWeather: "Refresh",
    scanningWeather: "Scanning...",
    gpsActive: "GPS Active",
    agroBeltAuto: "Agricultural Belt (Auto-Detect)",
    fieldCoordinates: "Field Coordinates: {lat}°N, {lon}°E",

    // About Modal
    aboutTitle: "About FloraScan AI",
    aboutSubtitle: "Visual pathology AI & agronomic prescription studio",
    aboutMissionTitle: "Core Mission: Empowering Agricultural Resilience",
    aboutMissionDesc: "FloraScan AI bridges the gap between laboratory foliar diagnosis and rural farm operations. By providing instant edge-based disease identification, OpenCV HSV necrosis quantification, and FRAC-aligned treatment plans, we help protect crop yields and prevent fungicide resistance.",
    aboutPillar1Title: "Edge-First AI Architecture",
    aboutPillar1Desc: "Quantized neural networks optimized to run in-browser and on low-bandwidth rural networks in under 200ms.",
    aboutPillar2Title: "Dual-Engine Lesion Quantification",
    aboutPillar2Desc: "OpenCV HSV segmentation calculates exact leaf surface necrosis percentage to gate chemical intervention.",
    aboutPillar3Title: "FRAC Stewardship & Safety Gating",
    aboutPillar3Desc: "Enforces multi-site fungicide rotation, Pre-Harvest Intervals (PHI), and safety precautions to stop chemical resistance.",
    aboutPillar4Title: "Multilingual Farmer Accessibility",
    aboutPillar4Desc: "Full support for English, Kannada (ಕನ್ನಡ), and Hindi (हिंदी) across foliar reports, voice interactions, and prescriptions.",
    aboutCloseBtn: "Close About Modal",

    // Team Modal
    teamTitle: "Project Development Team",
    teamSubtitle: "Undergraduate Engineering Showcase — Department of Computer Science & Engineering",
    teamLeadTitle: "Technical Leadership & Core Architecture",
    teamMohammedBio: "Implemented MobileNetV2 transfer learning, model quantization, and OpenCV HSV lesion thresholding pipelines.",
    teamAbhishekBio: "Designed visual branding, intuitive interface layout aesthetics, bespoke icons, and digital presentation graphics.",
    teamLingarajaBio: "Architected responsive grid structures, interactive canvas studio layouts, and cross-platform component styling.",
    teamFacultyMentor: "Faculty Research Advisor",
    teamCloseBtn: "Close Team Modal",

    // Disease Guide Modal
    guideTitle: "Field Pathology Guide",
    guideSubtitle: "Quick Reference Diagnostic Protocols for Agricultural Extension",
    guideWeather: "Weather Triggers",
    guideTreatment: "Recommended Treatment",
    guideCloseBtn: "Close Guide Modal",

    // SEO Content Section
    seoMainTitle: "Precision AI Plant Disease Detection & Crop Health Diagnostics",
    seoMainDesc: "FloraScan AI is an open agricultural intelligence platform that bridges the gap between digital computer vision and actionable foliar pathology. By analyzing photographs of plant leaves captured directly in the field, FloraScan AI identifies foliar infections in real time, measures necrotic lesion surface area, and provides verified agronomic treatment plans with strict safety gating.",
    seoCard1Title: "Instant In-Field Diagnosis",
    seoCard1Desc: "Upload existing gallery photos or activate the live field camera. Instant edge-optimized inference returns pathogen predictions and confidence scores in under 200ms.",
    seoCard2Title: "OpenCV Lesion Quantification",
    seoCard2Desc: "Advanced HSV color-space thresholding segments chlorotic and necrotic tissue from healthy green lamina, calculating exact lesion surface area percentage to quantify severity.",
    seoCard3Title: "FRAC-Aligned Prescriptions",
    seoCard3Desc: "Prevents chemical fungicide resistance with mode-of-action rotation, multi-site tank mixes, and mandatory Pre-Harvest Intervals (PHI).",
    seoPipelineTitle: "4-Step Agricultural Diagnostics Pipeline",
    seoStep1Title: "1. Specimen Ingestion & Optical Quality Check",
    seoStep1Desc: "Specimens are validated for sharpness, lighting exposure, and resolution before computational inspection begins.",
    seoStep2Title: "2. Taxonomic Crop Species Validation",
    seoStep2Desc: "The system verifies botanical family to prevent dangerous cross-species misdiagnoses.",
    seoStep3Title: "3. Dual-Engine Lesion Segmentation & Pathogen Classification",
    seoStep3Desc: "MobileNetV2 classifies the pathogen while OpenCV isolates infected areas to calculate surface percentage.",
    seoStep4Title: "4. Agronomic Prescription & Human-in-the-Loop Safeguards",
    seoStep4Desc: "Outputs verified tank-mix dosages, organic cultural alternatives, and safety guidelines with farmer confirmation.",
    seoDirectoryTitle: "Comprehensive Plant Disease & Pathogen Directory",
    seoDirectoryDesc: "Browse calibrated foliar pathologies supported by FloraScan AI. Click any card to review complete etiology, diagnostic visual symptoms, and agronomic management protocols.",
    testInStudioBtn: "Test Sample in Studio →",
    viewFullGuideBtn: "View Full Guide",
    seoFaqTitle: "Frequently Asked Questions (Agronomic & Technical)",
    seoFaqDesc: "Expert guidance regarding model accuracy, supported crops, fungicide safety, and image diagnosis protocols.",
    seoCtaTitle: "Ready to Protect Your Harvest with AI Vision?",
    seoCtaDesc: "Upload a leaf specimen now for instant in-field diagnosis, lesion percentage quantification, and FRAC-aligned treatment prescription.",
    seoCtaBtn: "Scan Your Leaf Specimen Now"
  },

  kn: {
    // Nearby Shops
    nearbyShopsPrompt: "ಈ ಚಿಕಿತ್ಸೆಗಳನ್ನು ಖರೀದಿಸಲು ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್‌ನಲ್ಲಿ ಹತ್ತಿರದ ಕೃಷಿ ರಾಸಾಯನಿಕ ಮಳಿಗೆಗಳನ್ನು ಹುಡುಕಬೇಕೇ?",
    nearbyShopsPrivacy: "ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್ ತೆರೆಯಲು ಮಾತ್ರ ಬಳಸಲಾಗುತ್ತದೆ — ಯಾವುದೇ ಡೇಟಾವನ್ನು ಸಂಗ್ರಹಿಸಲಾಗುವುದಿಲ್ಲ.",
    nearbyShopsYes: "ಹೌದು, ಹತ್ತಿರದ ಮಳಿಗೆಗಳನ್ನು ಹುಡುಕಿ",
    nearbyShopsNo: "ಬೇಡ, ಧನ್ಯವಾದಗಳು",
    nearbyShopsTitle: "ಹತ್ತಿರದ ಕೃಷಿ ರಾಸಾಯನಿಕ ವಿತರಕರು",
    nearbyShopsRadar: "ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್‌ನಲ್ಲಿ ಎಲ್ಲಾ ಕೃಷಿ ಮಳಿಗೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    nearbyShopsLocationNote: "ನಿಖರ ಫಲಿತಾಂಶಗಳಿಗಾಗಿ ಸಾಧನದ ಸ್ಥಳವನ್ನು ಬಳಸುತ್ತದೆ.",
    nearbyShopsDeclined: "ಅರ್ಥವಾಯಿತು. ಅಗತ್ಯ ಔಷಧಿಗಳಿಗಾಗಿ ನಿಮ್ಮ ಸ್ಥಳೀಯ ಕೃಷಿ ಅಧಿಕಾರಿ ಅಥವಾ ಸಹಕಾರಿ ಸಂಘವನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    nearbyShopsLicenseWarning: "ಯಾವಾಗಲೂ ಪರವಾನಗಿ ಪಡೆದ ಕೃಷಿ ವ್ಯಾಪಾರಿಗಳಿಂದಲೇ ಖರೀದಿಸಿ ಮತ್ತು ಸಿಂಪಡಿಸುವ ಮುನ್ನ ಲೇಬಲ್ ಪರಿಶೀಲಿಸಿ.",
    nearbyShopsClose: "ಮುಚ್ಚಿ",

    // Weather & Microclimate
    tempLabel: "ತಾಪಮಾನ",
    humidityLabel: "ಆರ್ದ್ರತೆ",
    precipLabel: "ಮಳೆ",
    refreshWeather: "ನವೀಕರಿಸಿ",
    scanningWeather: "ಸ್ಕ್ಯಾನ್ ಆಗುತ್ತಿದೆ...",
    gpsActive: "ಜಿಪಿಎಸ್ ಸಕ್ರಿಯ",
    agroBeltAuto: "ಕೃಷಿ ವಲಯ (ಸ್ವಯಂ ಪತ್ತೆ)",
    fieldCoordinates: "ಕ್ಷೇತ್ರ ನಿರ್ದೇಶಾಂಕಗಳು: {lat}°N, {lon}°E",

    // About Modal
    aboutTitle: "ಫ್ಲೋರಾಸ್ಕ್ಯಾನ್ AI ಬಗ್ಗೆ",
    aboutSubtitle: "ದೃಶ್ಯ ಸಸ್ಯ ರೋಗಶಾಸ್ತ್ರ AI ಮತ್ತು ಕೃಷಿ ಶಿಫಾರಸು ಸ್ಟುಡಿಯೋ",
    aboutMissionTitle: "ಮುಖ್ಯ ಉದ್ದೇಶ: ಕೃಷಿ ಸುಸ್ಥಿರತೆಯನ್ನು ಸಬಲೀಕರಣಗೊಳಿಸುವುದು",
    aboutMissionDesc: "ಫ್ಲೋರಾಸ್ಕ್ಯಾನ್ AI ಪ್ರಯೋಗಾಲಯದ ರೋಗನಿರ್ಣಯ ಮತ್ತು ರೈತರ ಹೊಲಗಳ ನಡುವಿನ ಅಂತರವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ. ತತ್ಕ್ಷಣದ ಎಲೆ ರೋಗ ಪತ್ತೆ, ಗಾಯದ ಶೇಕಡಾವಾರು ಅಳತೆ ಮತ್ತು ಸುರಕ್ಷಿತ ಚಿಕಿತ್ಸಾ ಯೋಜನೆಯನ್ನು ಒದಗಿಸುವ ಮೂಲಕ ಇಳುವರಿಯನ್ನು ಕಾಪಾಡುತ್ತದೆ.",
    aboutPillar1Title: "ಅಂಚಿನ-ಮೊದಲ AI ವಿನ್ಯಾಸ",
    aboutPillar1Desc: "200 ಮಿಲಿಸೆಕೆಂಡ್‌ಗಿಂತ ಕಡಿಮೆ ಸಮಯದಲ್ಲಿ ಕಡಿಮೆ ನೆಟ್‌ವರ್ಕ್‌ನಲ್ಲಿಯೂ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುವ ನರಮಂಡಲ ಜಾಲಗಳು.",
    aboutPillar2Title: "ದ್ವಿ-ಎಂಜಿನ್ ಗಾಯದ ಪ್ರಮಾಣೀಕರಣ",
    aboutPillar2Desc: "ಓಪನ್‌ಸಿವಿ ಎಚ್‌ಎಸ್‌ವಿ ವಿಭಜನೆಯು ಎಲೆಯ ಹಾನಿಗೊಳಗಾದ ಶೇಕಡಾವಾರು ಪ್ರದೇಶವನ್ನು ನಿಖರವಾಗಿ ಲೆಕ್ಕಾಚಾರ ಮಾಡುತ್ತದೆ.",
    aboutPillar3Title: "FRAC ನಿರ್ವಹಣೆ ಮತ್ತು ಸುರಕ್ಷತಾ ನಿಯಮಗಳು",
    aboutPillar3Desc: "ರಾಸಾಯನಿಕ ಪ್ರತಿರೋಧವನ್ನು ತಡೆಯಲು ಬಹು-ತಾಣ ಶಿಲೀಂಧ್ರನಾಶಕ ಪರಿವರ್ತನೆ ಮತ್ತು ಕಟಾವು ಮುನ್ನ ಮುನ್ನೆಚ್ಚರಿಕೆಗಳನ್ನು ಜಾರಿಗೊಳಿಸುತ್ತದೆ.",
    aboutPillar4Title: "ಬಹುಭಾಷಾ ರೈತ ಸ್ನೇಹಿ ವ್ಯವಸ್ಥೆ",
    aboutPillar4Desc: "ವರದಿಗಳು, ಧ್ವನಿ ಸಂಭಾಷಣೆ ಮತ್ತು ಚಿಕಿತ್ಸಾ ಯೋಜನೆಗಳಲ್ಲಿ ಇಂಗ್ಲಿಷ್, ಕನ್ನಡ ಮತ್ತು ಹಿಂದಿ ಭಾಷೆಗಳಿಗೆ ಸಂಪೂರ್ಣ ಬೆಂಬಲ.",
    aboutCloseBtn: "ಮಾಹಿತಿ ಮುಚ್ಚಿ",

    // Team Modal
    teamTitle: "ಯೋಜನಾ ಅಭಿವೃದ್ಧಿ ತಂಡ",
    teamSubtitle: "ಗಣಕ ವಿಜ್ಞಾನ ಮತ್ತು ಎಂಜಿನಿಯರಿಂಗ್ ವಿಭಾಗ — ಅಂತಿಮ ವರ್ಷದ ಪ್ರದರ್ಶನ",
    teamLeadTitle: "ತಾಂತ್ರಿಕ ನಾಯಕತ್ವ ಮತ್ತು ಮುಖ್ಯ ವಾಸ್ತುಶಿಲ್ಪ",
    teamMohammedBio: "ಮೊಬೈಲ್‌ನೆಟ್‌ವಿ2 ವರ್ಗಾವಣೆ ಕಲಿಕೆ, ಮಾದರಿ ಕ್ವಾಂಟೈಸೇಶನ್ ಮತ್ತು ಓಪನ್‌ಸಿವಿ ಎಚ್‌ಎಸ್‌ವಿ ಗಾಯದ ಮಿತಿ ಪೈಪ್‌ಲೈನ್‌ಗಳನ್ನು ಅಳವಡಿಸಲಾಗಿದೆ.",
    teamAbhishekBio: "ದೃಶ್ಯ ಬ್ರ್ಯಾಂಡಿಂಗ್, ಬಳಕೆದಾರ ಸ್ನೇಹಿ ಇಂಟರ್‌ಫೇಸ್ ಸೌಂದರ್ಯ, ಐಕಾನ್‌ಗಳು ಮತ್ತು ಪ್ರಸ್ತುತಿ ಗ್ರಾಫಿಕ್ಸ್ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.",
    teamLingarajaBio: "ಸ್ಪಂದಿಸುವ ಗ್ರಿಡ್ ರಚನೆಗಳು, ಸಂವಾದಾತ್ಮಕ ಕ್ಯಾನ್ವಾಸ್ ಸ್ಟುಡಿಯೋ ಲೇಔಟ್‌ಗಳು ಮತ್ತು ಕ್ರಾಸ್-ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಶೈಲಿಯನ್ನು ನಿರ್ಮಿಸಲಾಗಿದೆ.",
    teamFacultyMentor: "ಅಧ್ಯಾಪಕರ ಸಂಶೋಧನಾ ಮಾರ್ಗದರ್ಶಕರು",
    teamCloseBtn: "ತಂಡದ ಮಾಹಿತಿ ಮುಚ್ಚಿ",

    // Disease Guide Modal
    guideTitle: "ಕ್ಷೇತ್ರ ರೋಗಶಾಸ್ತ್ರ ಮಾರ್ಗದರ್ಶಿ",
    guideSubtitle: "ಕೃಷಿ ರೋಗನಿರ್ಣಯದ ತ್ವರಿತ ಉಲ್ಲೇಖ ಪ್ರೋಟೋಕಾಲ್‌ಗಳು",
    guideWeather: "ಹವಾಮಾನ ಪ್ರಚೋದಕಗಳು",
    guideTreatment: "ಶಿಫಾರಸು ಮಾಡಿದ ಚಿಕಿತ್ಸೆ",
    guideCloseBtn: "ಮಾರ್ಗದರ್ಶಿ ಮುಚ್ಚಿ",

    // SEO Content Section
    seoMainTitle: "ನಿಖರವಾದ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಸಸ್ಯ ರೋಗ ಪತ್ತೆ ಮತ್ತು ಬೆಳೆ ಆರೋಗ್ಯ ತಪಾಸಣೆ",
    seoMainDesc: "ಫ್ಲೋರಾಸ್ಕ್ಯಾನ್ AI ಡಿಜಿಟಲ್ ಕಂಪ್ಯೂಟರ್ ದೃಷ್ಟಿ ಮತ್ತು ಕೃಷಿ ರೋಗಶಾಸ್ತ್ರವನ್ನು ಸಂಯೋಜಿಸುವ ಕೃಷಿ ವೇದಿಕೆಯಾಗಿದೆ. ಹೊಲದಲ್ಲಿ ತೆಗೆದ ಎಲೆಯ ಫೋಟೋಗಳನ್ನು ನೈಜ ಸಮಯದಲ್ಲಿ ವಿಶ್ಲೇಷಿಸಿ, ರೋಗಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಿ, ಹಾನಿಯ ಶೇಕಡಾವಾರು ಅಳತೆ ಮಾಡಿ ಸುರಕ್ಷಿತ ಚಿಕಿತ್ಸಾ ಮಾರ್ಗಸೂಚಿಗಳನ್ನು ನೀಡುತ್ತದೆ.",
    seoCard1Title: "ಹೊಲದಲ್ಲೇ ತತ್ಕ್ಷಣದ ರೋಗನಿರ್ಣಯ",
    seoCard1Desc: "ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಲೈವ್ ಕ್ಯಾಮೆರಾ ಬಳಸಿ. 200 ಮಿಲಿಸೆಕೆಂಡ್‌ಗಳಿಗಿಂತ ಕಡಿಮೆ ಅವಧಿಯಲ್ಲಿ ನಿಖರ ಫಲಿತಾಂಶ ಪಡೆಯಿರಿ.",
    seoCard2Title: "ಓಪನ್‌ಸಿವಿ ಗಾಯದ ಶೇಕಡಾವಾರು ಅಳತೆ",
    seoCard2Desc: "ಎಲೆಯ ಹಸಿರು ಭಾಗದಿಂದ ಹಾನಿಗೊಳಗಾದ ಅಂಗಾಂಶವನ್ನು ಪ್ರತ್ಯೇಕಿಸಿ, ರೋಗದ ತೀವ್ರತೆಯನ್ನು ಅಳೆಯಲು ನಿಖರವಾದ ಶೇಕಡಾವಾರು ಲೆಕ್ಕಾಚಾರ ಮಾಡುತ್ತದೆ.",
    seoCard3Title: "FRAC-ಪ್ರಮಾಣೀಕೃತ ಶಿಫಾರಸುಗಳು",
    seoCard3Desc: "ಶಿಲೀಂಧ್ರನಾಶಕ ಪ್ರತಿರೋಧವನ್ನು ತಡೆಯಲು ಸೂಕ್ತ ಮಿಶ್ರಣಗಳು, ಸಿಂಪಡಣೆ ಅಂತರ ಮತ್ತು ಕಟಾವು ಮುನ್ನ ಸುರಕ್ಷತಾ ದಿನಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ.",
    seoPipelineTitle: "4-ಹಂತದ ಕೃಷಿ ರೋಗನಿರ್ಣಯ ಪ್ರಕ್ರಿಯೆ",
    seoStep1Title: "೧. ಎಲೆಯ ಚಿತ್ರ ಸ್ವೀಕಾರ ಮತ್ತು ಗುಣಮಟ್ಟ ಪರಿಶೀಲನೆ",
    seoStep1Desc: "ವಿಶ್ಲೇಷಣೆ ಪ್ರಾರಂಭವಾಗುವ ಮೊದಲು ಚಿತ್ರದ ತೀಕ್ಷ್ಣತೆ, ಬೆಳಕು ಮತ್ತು ಗುಣಮಟ್ಟವನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ.",
    seoStep2Title: "೨. ಸಸ್ಯದ ಬೆಳೆ ತಳಿ ದೃಢೀಕರಣ",
    seoStep2Desc: "ತಪ್ಪು ರೋಗನಿರ್ಣಯವನ್ನು ತಡೆಯಲು ಸಸ್ಯದ ಸರಿಯಾದ ಪ್ರಭೇದವನ್ನು ವ್ಯವಸ್ಥೆಯು ಮೊದಲು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳುತ್ತದೆ.",
    seoStep3Title: "೩. ದ್ವಿ-ಎಂಜಿನ್ ರೋಗ ವರ್ಗೀಕರಣ ಮತ್ತು ಗಾಯದ ಅಳತೆ",
    seoStep3Desc: "ಕೃತಕ ನರಮಂಡಲವು ರೋಗಕಾರಕವನ್ನು ಗುರುತಿಸುತ್ತದೆ ಮತ್ತು ಓಪನ್‌ಸಿವಿ ಹಾನಿಗೊಳಗಾದ ವಿಸ್ತೀರ್ಣವನ್ನು ಲೆಕ್ಕಹಾಕುತ್ತದೆ.",
    seoStep4Title: "೪. ಕೃಷಿ ಪರಿಹಾರ ಮತ್ತು ಸುರಕ್ಷತಾ ಮಾರ್ಗಸೂಚಿಗಳು",
    seoStep4Desc: "ರೈತರ ದೃಢೀಕರಣದೊಂದಿಗೆ ಪ್ರಮಾಣೀಕೃತ ಔಷಧ ಪ್ರಮಾಣ, ಸಾವಯವ ಪರಿಹಾರಗಳು ಮತ್ತು ಸುರಕ್ಷತಾ ಕ್ರಮಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ.",
    seoDirectoryTitle: "ಸಮಗ್ರ ಸಸ್ಯ ರೋಗಗಳು ಮತ್ತು ರೋಗಕಾರಕಗಳ ವಿವರಣಾ ಕೋಶ",
    seoDirectoryDesc: "ಫ್ಲೋರಾಸ್ಕ್ಯಾನ್ AI ಬೆಂಬಲಿಸುವ ಸಸ್ಯ ರೋಗಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ. ಸಂಪೂರ್ಣ ರೋಗಲಕ್ಷಣಗಳು, ಹವಾಮಾನ ಪ್ರಚೋದಕಗಳು ಮತ್ತು ಪರಿಹಾರಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಕಾರ್ಡ್ ಅನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ.",
    testInStudioBtn: "ಸ್ಟುಡಿಯೋದಲ್ಲಿ ಪರೀಕ್ಷಿಸಿ →",
    viewFullGuideBtn: "ಸಂಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿ ವೀಕ್ಷಿಸಿ",
    seoFaqTitle: "ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು (ಕೃಷಿ ಮತ್ತು ತಾಂತ್ರಿಕ)",
    seoFaqDesc: "ಮಾದರಿ ನಿಖರತೆ, ಬೆಂಬಲಿತ ಬೆಳೆಗಳು, ಶಿಲೀಂಧ್ರನಾಶಕ ಸುರಕ್ಷತೆ ಮತ್ತು ರೋಗ ಪತ್ತೆ ಕುರಿತು ತಜ್ಞರ ಮಾರ್ಗದರ್ಶನ.",
    seoCtaTitle: "ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆಯೊಂದಿಗೆ ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ರಕ್ಷಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?",
    seoCtaDesc: "ತತ್ಕ್ಷಣದ ರೋಗ ಪತ್ತೆ, ಹಾನಿಯ ಶೇಕಡಾವಾರು ಅಳತೆ ಮತ್ತು ಪರಿಣಾಮಕಾರಿ ಕೃಷಿ ಚಿಕಿತ್ಸಾ ಯೋಜನೆಗಾಗಿ ಈಗಲೇ ಎಲೆಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
    seoCtaBtn: "ಈಗಲೇ ನಿಮ್ಮ ಎಲೆಯ ಮಾದರಿಯನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ"
  },

  hi: {
    // Nearby Shops
    nearbyShopsPrompt: "क्या आप इन उपचारों को खरीदने के लिए गूगल मैप्स पर नजदीकी कृषि रसायन की दुकानें खोजना चाहते हैं?",
    nearbyShopsPrivacy: "आपके स्थान का उपयोग केवल गूगल मैप्स खोलने के लिए किया जाता है — कोई डेटा संग्रहीत नहीं किया जाता है।",
    nearbyShopsYes: "हाँ, नजदीकी दुकानें खोजें",
    nearbyShopsNo: "नहीं, धन्यवाद",
    nearbyShopsTitle: "नजदीकी कृषि रसायन विक्रेता",
    nearbyShopsRadar: "गूगल मैप्स पर सभी कृषि दुकानों को रडार मानचित्र पर देखें",
    nearbyShopsLocationNote: "सटीक परिणामों के लिए डिवाइस स्थान का उपयोग करता है।",
    nearbyShopsDeclined: "समझ गया। आवश्यक उपचारों के लिए अपने स्थानीय कृषि विस्तार अधिकारी या सहकारी समिति से परामर्श लें।",
    nearbyShopsLicenseWarning: "हमेशा अधिकृत और लाइसेंस प्राप्त डीलरों से ही खरीदें और उपयोग से पहले उत्पाद लेबल की जांच करें।",
    nearbyShopsClose: "बंद करें",

    // Weather & Microclimate
    tempLabel: "तापमान",
    humidityLabel: "आर्द्रता",
    precipLabel: "वर्षा",
    refreshWeather: "ताज़ा करें",
    scanningWeather: "स्कैन हो रहा है...",
    gpsActive: "जीपीएस सक्रिय",
    agroBeltAuto: "कृषि क्षेत्र (स्वचालित पहचान)",
    fieldCoordinates: "खेत निर्देशांक: {lat}°N, {lon}°E",

    // About Modal
    aboutTitle: "फ्लोरास्कैन AI के बारे में",
    aboutSubtitle: "दृश्य पादप विकृति विज्ञान AI और कृषि नुस्खा स्टूडियो",
    aboutMissionTitle: "मुख्य उद्देश्य: कृषि लचीलेपन और स्थिरता को सशक्त बनाना",
    aboutMissionDesc: "फ्लोरास्कैन AI प्रयोगशाला निदान और ग्रामीण खेतों के बीच की दूरी को समाप्त करता है। पत्तियों के त्वरित रोग विश्लेषण, घाव क्षेत्र प्रतिशत और सुरक्षित उपचार योजना द्वारा फसल सुरक्षा सुनिश्चित करता है।",
    aboutPillar1Title: "एज-फर्स्ट AI आर्किटेक्चर",
    aboutPillar1Desc: "200 मिलीसेकंड से कम समय में कम-बैंडविड्थ ग्रामीण नेटवर्क पर ब्राउज़र में चलने वाले क्वांटाइज्ड न्यूरल नेटवर्क।",
    aboutPillar2Title: "डुअल-इंजन घाव मात्रा निर्धारण",
    aboutPillar2Desc: "ओपनसीवी एचएसवी सेगमेंटेशन रासायनिक छिड़काव तय करने के लिए नेक्रोटिक पत्ती क्षेत्र प्रतिशत की सटीक गणना करता है।",
    aboutPillar3Title: "FRAC प्रबंधन और सुरक्षा गेटिंग",
    aboutPillar3Desc: "रासायनिक प्रतिरोध को रोकने के लिए बहु-साइट कवकनाशी रोटेशन और कटाई पूर्व सावधानियों को लागू करता है।",
    aboutPillar4Title: "बहुभाषी किसान सुलभता",
    aboutPillar4Desc: "निदान रिपोर्ट, आवाज बातचीत और नुस्खों में अंग्रेजी, कन्नड़ और हिंदी का पूर्ण समर्थन।",
    aboutCloseBtn: "जानकारी बंद करें",

    // Team Modal
    teamTitle: "परियोजना विकास दल",
    teamSubtitle: "कंप्यूटर विज्ञान और इंजीनियरिंग विभाग — अंतिम वर्ष का प्रोजेक्ट",
    teamLeadTitle: "तकनीकी नेतृत्व और कोर आर्किटेक्चर",
    teamMohammedBio: "मोबाइलनेटवी2 ट्रांसफर लर्निंग, मॉडल क्वांटाइजेशन और ओपनसीवी एचएसवी घाव सीमा पाइपलाइन विकसित की।",
    teamAbhishekBio: "विज़ुअल ब्रांडिंग, सहज ज्ञान युक्त इंटरफ़ेस सौंदर्य, कस्टम आइकन और डिजिटल प्रेजेंटेशन ग्राफिक्स डिज़ाइन किए।",
    teamLingarajaBio: "उत्तरदायी ग्रिड संरचनाएं, इंटरैक्टिव कैनवास स्टूडियो लेआउट और क्रॉस-प्लेटफ़ॉर्म स्टाइलिंग तैयार की।",
    teamFacultyMentor: "संकाय अनुसंधान सलाहकार",
    teamCloseBtn: "टीम विवरण बंद करें",

    // Disease Guide Modal
    guideTitle: "खेत विकृति विज्ञान मार्गदर्शिका",
    guideSubtitle: "कृषि विस्तार के लिए त्वरित संदर्भ नैदानिक प्रोटोकॉल",
    guideWeather: "मौसम ट्रिगर",
    guideTreatment: "अनुशंसित उपचार",
    guideCloseBtn: "मार्गदर्शिका बंद करें",

    // SEO Content Section
    seoMainTitle: "सटीक एआई पादप रोग पहचान एवं फसल स्वास्थ्य निदान प्रणाली",
    seoMainDesc: "फ्लोरास्कैन AI एक कृषि बुद्धिमत्ता मंच है जो कंप्यूटर विज़न और पादप विकृति विज्ञान को जोड़ता है। खेत में ली गई पत्तियों की तस्वीरों का वास्तविक समय में विश्लेषण करके रोगों की पहचान करता है, नेक्रोटिक क्षेत्र मापता है और सुरक्षित उपचार योजना प्रदान करता है।",
    seoCard1Title: "खेत में तत्काल रोग निदान",
    seoCard1Desc: "तस्वीर अपलोड करें या लाइव कैमरा चालू करें। 200 मिलीसेकंड से कम समय में रोग का सटीक परिणाम और विश्वास स्तर प्राप्त करें।",
    seoCard2Title: "ओपनसीवी घाव मात्रा निर्धारण",
    seoCard2Desc: "उन्नत रंग विश्लेषण द्वारा स्वस्थ पत्ती से संक्रमित ऊतक को अलग करके घाव क्षेत्र का सटीक प्रतिशत मापता है।",
    seoCard3Title: "FRAC-संरेखित रासायनिक नुस्खे",
    seoCard3Desc: "कवकनाशी प्रतिरोध को रोकने के लिए मोड-ऑफ-एक्शन रोटेशन, मल्टी-साइट टैंक मिक्स और फसल कटाई पूर्व सुरक्षा अंतराल प्रदान करता है।",
    seoPipelineTitle: "4-चरणीय कृषि नैदानिक प्रक्रिया",
    seoStep1Title: "1. नमूना ग्रहण एवं प्रकाशीय गुणवत्ता जांच",
    seoStep1Desc: "विश्लेषण से पहले पत्ती की स्पष्टता, प्रकाश और रिज़ॉल्यूशन की स्वचालित रूप से जांच की जाती है।",
    seoStep2Title: "2. फसल प्रजाति वर्गीकरण सत्यापन",
    seoStep2Desc: "गलत निदान को रोकने के लिए प्रणाली पहले पौधे की सही प्रजाति और परिवार की पुष्टि करती है।",
    seoStep3Title: "3. डुअल-इंजन घाव विभाजन एवं रोगज़नक़ वर्गीकरण",
    seoStep3Desc: "न्यूरल नेटवर्क रोगज़नक़ की पहचान करता है जबकि ओपनसीवी संक्रमित क्षेत्र का सटीक प्रतिशत निकालता है।",
    seoStep4Title: "4. कृषि नुस्खा और मानवीय सुरक्षा नियम",
    seoStep4Desc: "किसान की पुष्टि के साथ सटीक खुराक, जैविक विकल्प और श्रमिक सुरक्षा दिशानिर्देश जारी करता है।",
    seoDirectoryTitle: "व्यापक पादप रोग एवं रोगज़नक़ संदर्शिका",
    seoDirectoryDesc: "फ्लोरास्कैन AI द्वारा समर्थित पादप रोगों को ब्राउज़ करें। विस्तृत लक्षण, मौसम ट्रिगर और उपचार प्रोटोकॉल देखने के लिए किसी भी कार्ड पर क्लिक करें।",
    testInStudioBtn: "स्टूडियो में परीक्षण करें →",
    viewFullGuideBtn: "पूरी मार्गदर्शिका देखें",
    seoFaqTitle: "अक्सर पूछे जाने वाले प्रश्न (कृषि एवं तकनीकी)",
    seoFaqDesc: "मॉडल सटीकता, समर्थित फसलों, कवकनाशी सुरक्षा और छवि निदान प्रोटोकॉल पर विशेषज्ञ मार्गदर्शन।",
    seoCtaTitle: "क्या आप एआई विज़न के साथ अपनी फसल की रक्षा के लिए तैयार हैं?",
    seoCtaDesc: "तत्काल इन-फील्ड निदान, घाव प्रतिशत गणना और प्रभावी उपचार नुस्खे के लिए अभी पत्ती का नमूना अपलोड करें।",
    seoCtaBtn: "अभी अपने पत्ते के नमूने को स्कैन करें"
  }
};

// Merge keys into translations
for (const lang of ['en', 'kn', 'hi']) {
  Object.assign(translations[lang], extraKeys[lang]);
}

// Write updated translations.js
const updatedJs = `export const translations = ${JSON.stringify(translations, null, 2)};\n\nexport default translations;\n`;
fs.writeFileSync(path.resolve(__dirname, '../src/locales/translations.js'), updatedJs, 'utf8');

// Write updated JSON files
fs.writeFileSync(path.resolve(__dirname, '../src/locales/en.json'), JSON.stringify(translations.en, null, 2), 'utf8');
fs.writeFileSync(path.resolve(__dirname, '../src/locales/kn.json'), JSON.stringify(translations.kn, null, 2), 'utf8');
fs.writeFileSync(path.resolve(__dirname, '../src/locales/hi.json'), JSON.stringify(translations.hi, null, 2), 'utf8');

console.log('Successfully updated translations.js and JSON dictionaries!');
console.log('Total keys in en:', Object.keys(translations.en).length);
console.log('Total keys in kn:', Object.keys(translations.kn).length);
console.log('Total keys in hi:', Object.keys(translations.hi).length);
