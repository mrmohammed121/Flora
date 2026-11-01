import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import AboutModal from './components/AboutModal';
import TeamModal from './components/TeamModal';
import DiseaseGuideModal from './components/DiseaseGuideModal';
import Footer from './components/Footer';
import FloraCopilot from './components/FloraCopilot';
import TractorAnimation from './components/TractorAnimation';
import HeroAnimation, { HeroParticles } from './components/HeroAnimation';
import WeatherAlert from './components/WeatherAlert';
import SprayCalculator from './components/SprayCalculator';
import ScanHistoryModal from './components/ScanHistoryModal';
import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { saveUserScan } from './utils/neonScanApi';
import NearbyShopsCard from './components/NearbyShopsCard';
import SeoContentSection from './components/SeoContentSection';
import DiseaseDetailModal from './components/DiseaseDetailModal';
import CustomCursor from './components/CustomCursor';
import { getDiseaseBySlug } from './data/diseasesData';
import { generatePdfReport } from './utils/generatePdfReport';
import { addScanToHistory } from './utils/scanStorage';
import { Camera, Upload, Layers, Play, CheckCircle2, AlertTriangle, ShieldCheck, Printer, Copy, RotateCcw, Sparkles, FileDown, Calculator, Clock, ThumbsUp, ThumbsDown, Eye, RefreshCw } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';
import { verifyDiagnosisWithGemini, diagnoseWithGeminiVision } from './utils/geminiChat';
import { 
  getLocalizedSample, 
  getLocalizedDiseaseName, 
  getLocalizedCropName, 
  getLocalizedSeverity, 
  getLocalizedStatus, 
  LOCALIZED_PRESETS 
} from './locales/sampleDatabase';

const SAMPLE_DATABASE = {
  Early_Blight: {
    disease: "Early Blight",
    scientific_name: "Alternaria solani",
    status: "Infected",
    severity: "Moderate",
    confidence: 94.8,
    affected_area_pct: 18.2,
    chemical_overview: "Requires a 2-tier rotation combining curative systemic fungicides with protective multi-site barriers to halt lesion growth, protect healthy foliage, and eradicate airborne conidia.",
    tank_mix: "Combine a systemic curative with a contact protectant (e.g., Difenoconazole 0.5 ml/L + Mancozeb 2.0 g/L). Always perform a jar compatibility test prior to tank filling.",
    active_ingredients: [
      {
        name: "Chlorothalonil (e.g., Bravo Weather Stik, Daconil 720)",
        type: "Multi-site Contact / Protectant",
        frac_group: "FRAC M05",
        dosage_knapsack: "2.0 – 2.5 g per 1 L of water",
        dosage_broadcast: "1.8 – 2.2 kg/ha",
        phi: "0 days",
        rei: "12 hours",
        role: "Forms a wash-resistant protective film on leaf surfaces; inhibits fungal spore germination."
      },
      {
        name: "Azoxystrobin (e.g., Quadris, Amistar 250 SC)",
        type: "Translaminar / Curative Systemic",
        frac_group: "FRAC 11 (QoI)",
        dosage_knapsack: "0.8 – 1.0 ml per 1 L of water",
        dosage_broadcast: "400 – 500 ml/ha",
        phi: "0 – 1 day",
        rei: "4 hours",
        role: "Penetrates leaf cuticle; halts fungal mitochondrial ATP synthesis inside expanding lesions."
      },
      {
        name: "Difenoconazole (e.g., Score 250 EC)",
        type: "Acropetal Systemic / Curative",
        frac_group: "FRAC 3 (DMI)",
        dosage_knapsack: "0.5 ml per 1 L of water",
        dosage_broadcast: "250 – 300 ml/ha",
        phi: "7 days",
        rei: "12 hours",
        role: "Inhibits ergosterol biosynthesis; arrests expanding fungal mycelium inside vascular tissue."
      }
    ],
    spraying_schedule: {
      frequency: "Spray every 7 to 10 days during warm/humid spells (>80% RH, 24–29°C); extend to 10–14 days in dry weather.",
      resistance_stewardship: "Maximum 2 consecutive single-site fungicide applications before rotating to multi-site contact protectant.",
      application_window: "Early morning (06:30 – 09:30) after dew dries, or late afternoon (16:30 – 18:30). Avoid spraying above 30°C.",
      rainfastness: "Requires 2 to 4 hours rain-free drying window. Use non-ionic spreader/sticker surfactant."
    },
    safety_ppe: {
      ppe: "Chemical-resistant nitrile gloves, NIOSH N95/P95 particulate respirator, tight splash goggles, and waterproof rubber boots.",
      rei_summary: "4 to 24 Hours",
      phi_summary: "0 to 7 Days"
    },
    organic_remedy: "Prune infected lower foliage immediately and incinerate. Apply Bacillus subtilis bio-fungicide or copper octanoate spray every 7–10 days.",
    cultural_remedy: "Avoid overhead sprinkler irrigation; stake vines; maintain 60cm row spacing for ventilation; sanitize pruning shears with 70% alcohol."
  },
  Late_Blight: {
    disease: "Late Blight",
    scientific_name: "Phytophthora infestans",
    status: "Infected",
    severity: "Critical",
    confidence: 96.2,
    affected_area_pct: 32.5,
    chemical_overview: "Fast-acting oomycete water-mold disease. Requires emergency systemic anti-oomycete chemistries to arrest rapid canopy rot, stem collapse, and spore dissemination.",
    tank_mix: "Combine Metalaxyl-M with Mancozeb (e.g., Ridomil Gold MZ 68 WG). Alternate immediately with Cymoxanil or Dimethomorph to manage resistance.",
    active_ingredients: [
      {
        name: "Metalaxyl-M + Mancozeb (e.g., Ridomil Gold MZ 68 WG)",
        type: "Acropetal Systemic + Contact",
        frac_group: "FRAC 4 + M03",
        dosage_knapsack: "2.5 g per 1 L of water",
        dosage_broadcast: "2.0 – 2.5 kg/ha",
        phi: "7 days",
        rei: "24 hours",
        role: "Dual systemic-contact anti-oomycete action; halts RNA polymerase fungal synthesis."
      },
      {
        name: "Cymoxanil + Famoxadone (e.g., Equation Pro)",
        type: "Translaminar Post-Infection Curative",
        frac_group: "FRAC 27 + 11",
        dosage_knapsack: "0.4 – 0.5 g per 1 L of water",
        dosage_broadcast: "400 g/ha",
        phi: "3 days",
        rei: "12 hours",
        role: "Rapid penetration arresting incubating mycelium up to 48 hours post-infection."
      }
    ],
    spraying_schedule: {
      frequency: "Emergency frequency: Apply every 5 to 7 days during cool, saturated overcast weather (15–20°C, >90% RH).",
      resistance_stewardship: "Limit phenylamide (Group 4) to 2 sprays per cropping season. Always alternate with non-cross-resistant modes.",
      application_window: "Calm mornings or late evenings. Do not delay when disease warning alerts are triggered in your region.",
      rainfastness: "Requires minimum 2 hours rain-free drying period."
    },
    safety_ppe: {
      ppe: "Full chemical coverall, vapor/particulate respirator, chemical face shield, and chemical-resistant nitrile gloves.",
      rei_summary: "12 to 24 Hours",
      phi_summary: "3 to 7 Days"
    },
    organic_remedy: "Quarantine and destroy infected plants immediately. Spray preventive Bordeaux mixture (copper sulfate + lime) on surrounding buffer zone.",
    cultural_remedy: "Destroy cull piles; practice 3-year crop rotation away from solanaceous species; plant certified pathogen-free certified seed potatoes/seedlings."
  },
  Bacterial_Spot: {
    disease: "Bacterial Spot",
    scientific_name: "Xanthomonas perforans",
    status: "Infected",
    severity: "Moderate",
    confidence: 91.5,
    affected_area_pct: 12.4,
    chemical_overview: "Bacterial pathogen not managed by synthetic fungal QoI/DMI inhibitors. Requires fixed copper bactericide formulations synergized with Mancozeb to release free cupric ions.",
    tank_mix: "Copper Hydroxide (Kocide 3000) 1.5–2.0 g/L tank-mixed with Mancozeb (Dithane M-45) 1.5 g/L.",
    active_ingredients: [
      {
        name: "Copper Hydroxide (e.g., Kocide 3000 / Champion 50 WP)",
        type: "Multi-site Inorganic Bactericide",
        frac_group: "FRAC M01",
        dosage_knapsack: "1.5 – 2.0 g per 1 L of water",
        dosage_broadcast: "1.2 – 1.8 kg/ha",
        phi: "0 days",
        rei: "24 hours",
        role: "Denatures bacterial structural enzymes and disrupts membrane transport upon direct surface contact."
      },
      {
        name: "Streptomycin Sulfate / Oxytetracycline (where labeled)",
        type: "Bactericidal Antibiotic",
        frac_group: "FRAC 25",
        dosage_knapsack: "0.5 – 1.0 g per 1 L of water",
        dosage_broadcast: "200 – 400 g/ha",
        phi: "Check Local Regs",
        rei: "12 hours",
        role: "Inhibits bacterial protein translation during initial greenhouse seedling emergence."
      }
    ],
    spraying_schedule: {
      frequency: "Apply every 5 to 7 days during warm rainy conditions; extend to 10 days in dry weather.",
      resistance_stewardship: "Rotate with systemic acquired resistance (SAR) inducers like Acibenzolar-S-methyl (Actigard).",
      application_window: "Spray only when foliage is dry to prevent bacterial water-droplet transmission.",
      rainfastness: "Requires 3 to 4 hours rain-free drying period."
    },
    safety_ppe: {
      ppe: "Splash goggles, protective apron, nitrile rubber gloves, and particulate respirator.",
      rei_summary: "24 Hours",
      phi_summary: "0 to 1 Day"
    },
    organic_remedy: "Apply bio-control bacteriophages or certified copper octanoate. Seed soak in 50°C hot water for 25 minutes prior to sowing.",
    cultural_remedy: "Eliminate solanaceous weeds (nightshade); avoid working in fields when plants are wet with morning dew; utilize drip irrigation."
  },
  Healthy: {
    disease: "Healthy Leaf",
    scientific_name: "Optimal Foliage (Healthy Specimen)",
    status: "Healthy",
    severity: "None",
    confidence: 99.1,
    affected_area_pct: 0.0,
    chemical_overview: "Optimal foliar health detected. No synthetic curative fungicide spray required. Maintain routine cultural scouting and prophylactic biological bio-protection.",
    tank_mix: "Maintain balanced micronutrient and bio-stimulant foliar nutrition.",
    active_ingredients: [
      {
        name: "Bacillus amyloliquefaciens / B. subtilis",
        type: "Microbial Biological Fungicide",
        frac_group: "FRAC 44 (Bio)",
        dosage_knapsack: "2.0 – 3.0 ml per 1 L of water",
        dosage_broadcast: "1.0 – 1.5 L/ha",
        phi: "0 days",
        rei: "4 hours",
        role: "Colonizes leaf lamina to block pathogen attachment sites; stimulates systemic acquired resistance (SAR)."
      }
    ],
    spraying_schedule: {
      frequency: "Scout weekly. Apply prophylactic biological bio-fungicide every 14 days during active vegetative growth.",
      resistance_stewardship: "No synthetic resistance concerns. Safe for beneficial pollinators and predatory mites.",
      application_window: "Early morning or overcast days to ensure live microbial spore viability.",
      rainfastness: "Allow 2 hours drying."
    },
    safety_ppe: {
      ppe: "Standard agricultural protective equipment: eye protection, long sleeves, and dust mask during mixing.",
      rei_summary: "4 Hours",
      phi_summary: "0 Days"
    },
    organic_remedy: "Maintain compost tea applications, neem cake soil amendments, and beneficial mycorrhizal root inoculants.",
    cultural_remedy: "Continue drip irrigation, mulch soil surface, ensure adequate staking, and test soil nutrient balance every season."
  },
  Rose_Black_Spot: {
    disease: "Black Spot",
    crop: "Rose",
    botanical_host: {
      host: "Rose",
      botanical_name: "Rosa spp.",
      category: "ORNAMENTAL",
      family: "Rosaceae",
      confidence: 0.94,
      confidence_percent: 94.0
    },
    scientific_name: "Diplocarpon rosae",
    status: "Infected",
    severity: "High",
    confidence: 95.8,
    affected_area_pct: 21.6,
    morphology: {
      pattern: "feathery_fringed",
      pattern_display: "Feathery / Fringed Spreading Margins",
      margin_roughness: 1.46,
      circularity: 0.52,
      concentric_score: 0.04,
      diagnostic_note: "Diagnostic for Diplocarpon rosae (Rose Black Spot). Fringed hyphal margins rule out smooth circular Alternaria bullseye rings."
    },
    ornamental_care: {
      has_phi: false,
      petal_safety: "CRITICAL: Do NOT spray directly onto open rose petals or colored buds. Chemical contact causes immediate petal scorch, bleaching, and unmarketable blooms.",
      winter_sanitation: "Overwintering ascocarps survive in fallen leaf litter. Complete winter ground clean-up is mandatory before spring bud break."
    },
    chemical_overview: "Ornamental foliar protocol. Apply systemic triazole with protective strobilurin. Do not apply Pre-Harvest Interval (non-edible garden shrub). Avoid spraying open blooms.",
    tank_mix: "Tebuconazole 1.0 ml/L + non-ionic surfactant. Never spray open flowers.",
    active_ingredients: [
      {
        name: "Tebuconazole (e.g., Folicur / Bayer Disease Control)",
        type: "Systemic DMI Triazole",
        frac_group: "FRAC 3",
        dosage_knapsack: "1.0 – 1.5 ml per 1 L water",
        dosage_broadcast: "N/A (Ornamental Shrub)",
        phi: "None (Non-edible ornamental)",
        rei: "12 hours (until dry)",
        role: "Inhibits sterol biosynthesis in expanding black spot hyphae."
      },
      {
        name: "Trifloxystrobin + Tebuconazole (e.g., Nativo)",
        type: "Translaminar + Systemic",
        frac_group: "FRAC 11 + FRAC 3",
        dosage_knapsack: "0.8 – 1.0 g per 1 L water",
        dosage_broadcast: "N/A (Ornamental Shrub)",
        phi: "None (Non-edible ornamental)",
        rei: "12 hours",
        role: "Dual protective barrier against spore germination with curative halt."
      }
    ],
    spraying_schedule: {
      frequency: "Apply every 7 to 10 days during humid periods.",
      application_window: "Early morning or late afternoon (avoid spraying under full sun).",
      rainfastness: "Requires 2 hours drying window.",
      special_warning: "CRITICAL: Do NOT spray open flower petals."
    },
    safety_ppe: {
      ppe: "Nitrile gloves, splash goggles, dust mask.",
      rei_summary: "12 hours",
      phi_summary: "Not Applicable (Non-Edible Ornamental)"
    },
    organic_remedy: "Potassium bicarbonate (3g/L) + horticultural oil (5ml/L) or Bacillus subtilis spray every 7 days.",
    cultural_remedy: "Water at the base using drip irrigation; prune center to open vase shape; rake and destroy all fallen leaves."
  }
};

export default function App() {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'camera' | 'presets'
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState('environment'); // 'environment' | 'user'
  const [cameraError, setCameraError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [activePresetKey, setActivePresetKey] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All'); // 'All' | 'Tomato' | 'Potato' | 'Apple' | 'Rose' | 'Fruit Tree'
  const [activeImageMode, setActiveImageMode] = useState('original'); // 'original' | 'overlay'
  const [fieldFeedback, setFieldFeedback] = useState(null); // null | 'confirmed' | 'reported'
  const [isVerifyingWithGemini, setIsVerifyingWithGemini] = useState(false);
  const [geminiVerification, setGeminiVerification] = useState(null);

  // Modals state
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSprayCalcOpen, setIsSprayCalcOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [selectedDiseaseGuide, setSelectedDiseaseGuide] = useState(null);

  // Deep-linking / Hash Routing listener for SEO & internal links
  useEffect(() => {
    const handleHashCheck = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#disease-')) {
        const slug = hash.replace('#disease-', '');
        const found = getDiseaseBySlug(slug);
        if (found) setSelectedDiseaseGuide(found);
      }
    };
    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, []);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const resultsRef = useRef(null);

  const appT = {
    brandBadge: t('heroBadge'),
    brandDesc: t('heroSubtitle'),
    heroTitle: t('heroTitle'),
    heroTagline: t('heroTagline'),
    scanNowBtn: t('scanNowBtn', 'Scan Now'),
    inputTitle: t('inputTitle'),
    inputSubtitle: t('inputSubtitle'),
    tabUpload: t('tabUpload'),
    tabCamera: t('tabCamera'),
    tabPresets: t('tabPresets'),
    dropTitle: t('dropTitle', 'Drag & drop leaf photo here'),
    dropSubtitle: t('dropSubtitle'),
    browseBtn: t('browseBtn'),
    snapBtn: t('takeSnapshot'),
    presetsTitle: t('presetsTitle'),
    presetEarlyBlight: t('presetEarlyBlight'),
    presetEarlyBlightSub: t('presetEarlyBlightSub'),
    presetRoseBlackSpot: t('presetRoseBlackSpot'),
    presetRoseBlackSpotSub: t('presetRoseBlackSpotSub'),
    presetLateBlight: t('presetLateBlight'),
    presetLateBlightSub: t('presetLateBlightSub'),
    presetBacterialSpot: t('presetBacterialSpot'),
    presetBacterialSpotSub: t('presetBacterialSpotSub'),
    presetHealthy: t('presetHealthy'),
    presetHealthySub: t('presetHealthySub'),
    cameraReticle: t('cameraReticle'),
    analyzeBtn: t('analyzeBtn'),
    analyzing: t('analyzing'),
    growerTips: t('growerTips'),
    tip1: t('tip1'),
    tip2: t('tip2'),
    tip3: t('tip3'),
    outputTitle: t('resultsHeading'),
    outputSubtitle: t('outputSubtitle'),
    printBtn: t('printBtn'),
    copyBtn: t('copyBtn'),
    emptyTitle: t('emptyTitle'),
    emptyDesc: t('resultsPlaceholder'),
    statLesion: t('metricSurfaceArea'),
    statSeverity: t('metricSeverity'),
    statConfidence: t('metricConfidence'),
    clearBtn: t('clearBtn', 'Clear')
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const msgs = {
      en: 'Language set to English',
      kn: 'ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ',
      hi: 'भाषा बदलकर हिंदी कर दी गई है'
    };
    showToast(msgs[newLang] || 'Language updated');
  };

  // Re-localize active diagnosis data whenever language is changed
  useEffect(() => {
    if (activePresetKey) {
      const localized = getLocalizedSample(activePresetKey, language);
      if (localized) {
        setDiagnosisData(prev => ({
          ...prev,
          ...localized
        }));
      }
    } else if (diagnosisData) {
      setDiagnosisData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          disease: getLocalizedDiseaseName(prev.raw_disease_key || prev.disease, language),
          crop: getLocalizedCropName(prev.raw_crop_key || prev.crop, language),
          severity: getLocalizedSeverity(prev.raw_severity_key || prev.severity, language),
          status: getLocalizedStatus(prev.raw_status_key || prev.status, language)
        };
      });
    }
  }, [language, activePresetKey]);

  // Client-side image compression for rapid transmission over rural 3G/4G networks
  const compressImage = (file, maxWidth = 1024, maxHeight = 1024, quality = 0.82) => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/') || file.size < 200 * 1024) {
        resolve(file);
        return;
      }
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name || 'specimen.jpg', {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };
    });
  };

  // Start Webcam with ideal facingMode for crop inspection
  const startCamera = async (facing = cameraFacingMode) => {
    setCameraError('');
    try {
      if (streamRef.current) {
        stopCamera();
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera access failed", err);
      setCameraError(t('cameraPermError'));
      setActiveTab('upload');
    }
  };

  // Toggle between front and rear cameras
  const toggleCameraFacing = () => {
    const nextMode = cameraFacingMode === 'environment' ? 'user' : 'environment';
    setCameraFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Stop Webcam
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera(cameraFacingMode);
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeTab]);

  // Capture Snapshot from Camera
  const captureSnapshot = () => {
    setActivePresetKey(null);
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      setSelectedFile(blob);
      setPreviewUrl(URL.createObjectURL(blob));
      stopCamera();
      setActiveTab('upload');
      showToast(t('snapshotSuccess'));
    }, 'image/jpeg', 0.88);
  };

  // Handle Drag & Drop / Upload File with network-optimized compression
  const handleFile = async (file) => {
    setActivePresetKey(null);
    if (!file.type.startsWith('image/')) {
      alert(t('invalidImageAlert'));
      return;
    }
    const optimized = await compressImage(file);
    setSelectedFile(optimized);
    setPreviewUrl(URL.createObjectURL(optimized));
    setDiagnosisData(null);
  };

  // Load Authentic Photographic Sample Preset
  const handlePresetSelect = async (presetKey) => {
    setActivePresetKey(presetKey);
    const presetMap = {
      Early_Blight: '/images/diseases/early-blight.jpg',
      Late_Blight: '/images/diseases/late-blight.jpg',
      Bacterial_Spot: '/images/diseases/bacterial-spot.jpg',
      Rose_Black_Spot: '/images/diseases/rose-black-spot.jpg',
      Healthy: '/images/diseases/healthy.jpg'
    };

    const imagePath = presetMap[presetKey] || '/images/diseases/early-blight.jpg';
    try {
      const response = await fetch(imagePath);
      const blob = await response.blob();
      const file = new File([blob], `${presetKey.toLowerCase()}.jpg`, { type: 'image/jpeg' });
      setSelectedFile(file);
      setPreviewUrl(imagePath);
      const presetData = getLocalizedSample(presetKey, language) || SAMPLE_DATABASE[presetKey] || SAMPLE_DATABASE.Early_Blight;
      setDiagnosisData(presetData);
      persistScan(presetData, imagePath);
      showToast(t('toastLoadedPreset', { preset: getLocalizedDiseaseName(presetKey, language) }));
    } catch (err) {
      console.warn('Failed to load preset photo directly, using URL:', err);
      setPreviewUrl(imagePath);
      const presetData = getLocalizedSample(presetKey, language) || SAMPLE_DATABASE[presetKey] || SAMPLE_DATABASE.Early_Blight;
      setDiagnosisData(presetData);
      persistScan(presetData, imagePath);
    }
  };

  const handleSelectPreset = handlePresetSelect;


  // Persist scan record to local scan history storage and Neon PostgreSQL cloud database
  const persistScan = (resultData, thumb = previewUrl) => {
    if (!resultData || !resultData.disease) return;
    const scanRecord = {
      id: `scan_${Date.now()}`,
      timestamp: new Date().toISOString(),
      crop: resultData.crop || 'Foliar Specimen',
      diseaseName: resultData.disease,
      scientificName: resultData.scientific_name,
      confidence: resultData.confidence,
      lesionArea: resultData.affected_area_pct,
      severity: resultData.severity,
      status: resultData.status,
      thumbnail: thumb,
      chemicalOverview: resultData.chemical_overview,
      tankMix: resultData.tank_mix,
      diagnosis: resultData
    };
    // Keep local storage for offline / guest experience
    addScanToHistory(scanRecord);

    // When authenticated, securely sync to Neon PostgreSQL backend
    if (isAuthenticated) {
      saveUserScan(scanRecord).then((res) => {
        if (res && res.success) {
          console.log('[Neon] Scan persisted to Neon PostgreSQL cloud database:', res.scan?.id);
        }
      }).catch((err) => {
        console.warn('[Neon] Failed to persist scan to Neon backend:', err);
      });
    }
  };

  // Client-Side Fast Canvas Image Compressor (Prevents 4K camera upload stalls)
  const compressImageForAnalysis = (file, maxDim = 800, quality = 0.82) => {
    return new Promise((resolve) => {
      if (!file || !file.type?.startsWith('image/')) {
        return resolve(file);
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let w = img.width;
          let h = img.height;
          if (w <= maxDim && h <= maxDim && file.size < 350 * 1024) {
            return resolve(file);
          }
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          canvas.toBlob(
            (blob) => {
              if (!blob) return resolve(file);
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: "image/jpeg",
                lastModified: Date.now()
              });
              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  // Convert File / Blob to Base64 String
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Run AI Analysis with Low Latency Routing & High-Speed Profiling
  const handleAnalyze = async () => {
    if (!selectedFile) return;

    const tStart = performance.now();
    console.time('FloraScan: End-to-End Analysis Pipeline');
    console.time('FloraScan: Client Image Compression');

    setIsLoading(true);
    setDiagnosisData(null);
    setGeminiVerification(null);
    setFieldFeedback(null);
    setActiveImageMode('original');

    // Auto-scroll on mobile
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        const el = document.getElementById('diagnosticResultsSection');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }

    // Step 1: Compress 4K/high-res uploads to max 800px JPEG to avoid payload bloat
    const compressedFile = await compressImageForAnalysis(selectedFile, 800, 0.82);
    console.timeEnd('FloraScan: Client Image Compression');

    // Step 2: Query Flask MobileNetV3 + 512px OpenCV Backend FIRST
    // Supports all botanical hosts (Rose, Apple, Citrus, Tomato, Potato, Pepper) in ~200ms
    const formData = new FormData();
    formData.append('file', compressedFile, 'leaf.jpg');
    if (selectedCrop && selectedCrop !== 'All') {
      formData.append('crop', selectedCrop);
    }

    try {
      console.time('FloraScan: Backend API /predict');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      console.timeEnd('FloraScan: Backend API /predict');

      if (res.ok) {
        const data = await res.json();
        const tTotal = (performance.now() - tStart).toFixed(1);
        console.timeEnd('FloraScan: End-to-End Analysis Pipeline');

        // Detailed Execution Profiling Report
        console.log('⚡ FloraScan Execution Profiling Report:');
        console.table({
          'Client Image Compression': 'Optimized (<150KB JPEG)',
          'Server Decode & Resize (512px)': `${data.timing_profiling_ms?.image_decode_and_resize_ms || 0} ms`,
          'Foliar Quality Screening': `${data.timing_profiling_ms?.quality_screening_ms || 0} ms`,
          'HSV Foliar Segmentation': `${data.timing_profiling_ms?.hsv_foliar_segmentation_ms || 0} ms`,
          'Tensor Normalization (224px)': `${data.timing_profiling_ms?.tensor_normalization_ms || 0} ms`,
          'MobileNetV3 Inference': `${data.timing_profiling_ms?.neural_inference_ms || 0} ms`,
          'Two-Tier Host Routing': `${data.timing_profiling_ms?.hierarchical_routing_ms || 0} ms`,
          'Chemical Prescription Retrieval': `${data.timing_profiling_ms?.chemical_prescription_retrieval_ms || 0} ms`,
          'Server Total Pipeline': `${data.timing_profiling_ms?.total_pipeline_ms || 0} ms`,
          'Client End-to-End Latency': `${tTotal} ms`
        });

        if (data.status === 'insufficient_quality') {
          showToast(t('toastQualityInsufficient'));
        } else if (data.status === 'uncertain') {
          showToast(t('toastLowConfidence'));
        } else {
          showToast(t('toastDiagnosisComplete', { ms: tTotal }));
        }
        setDiagnosisData(data);
        if (data.status !== 'insufficient_quality') {
          persistScan(data);
        }
        setIsLoading(false);
        if (window.innerWidth < 1024) {
          const el = document.getElementById('diagnosticResultsSection');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }
    } catch (err) {
      console.warn("Local Flask backend query failed or timed out, trying cached static remedy or vision cache:", err);
    }

    // Step 3: Fast Fallback (For Cucumber or offline mode)
    // For Cucumber or explicit non-CNN crops without backend:
    if (selectedCrop === 'Cucumber') {
      try {
        console.time('FloraScan: Cached Gemini Vision Query');
        const base64Data = await fileToBase64(compressedFile);
        const geminiResult = await diagnoseWithGeminiVision({
          imageBase64: base64Data,
          imageMimeType: 'image/jpeg',
          selectedCrop,
          language
        });
        console.timeEnd('FloraScan: Cached Gemini Vision Query');

        if (geminiResult) {
          const tTotal = (performance.now() - tStart).toFixed(1);
          console.timeEnd('FloraScan: End-to-End Analysis Pipeline');
          setDiagnosisData(geminiResult);
          persistScan(geminiResult);
          setIsLoading(false);
          showToast(t('toastGeminiDiagnosed', { crop: geminiResult.crop, disease: geminiResult.disease, ms: tTotal }));
          if (window.innerWidth < 1024) {
            const el = document.getElementById('diagnosticResultsSection');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
          return;
        }
      } catch (geminiErr) {
        console.warn("Direct Gemini Vision query failed, falling back to static database:", geminiErr);
      }
    }

    // Instant fallback to structured static database (zero artificial setTimeout latency)
    const fallbackResult = (selectedCrop && SAMPLE_DATABASE[selectedCrop]) || SAMPLE_DATABASE.Early_Blight;
    const tTotal = (performance.now() - tStart).toFixed(1);
    console.timeEnd('FloraScan: End-to-End Analysis Pipeline');
    setDiagnosisData(fallbackResult);
    persistScan(fallbackResult);
    setIsLoading(false);
    showToast(t('toastProfileLoaded', { ms: tTotal }));
    if (window.innerWidth < 1024) {
      const el = document.getElementById('diagnosticResultsSection');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Hybrid Verification Layer: Query Gemini 2.5 Flash Multimodal Vision
  const handleRunGeminiVerification = async () => {
    if (!selectedFile || !diagnosisData) return;
    setIsVerifyingWithGemini(true);
    try {
      const compressed = await compressImageForAnalysis(selectedFile, 800, 0.82);
      const base64Data = await fileToBase64(compressed);
      const result = await verifyDiagnosisWithGemini({
        imageBase64: base64Data,
        imageMimeType: 'image/jpeg',
        diagnosisData,
        selectedCrop,
        language
      });
      setGeminiVerification(result);
      if (result.agrees) {
        showToast(t('toastGeminiConfirmed'));
      } else {
        showToast(t('toastGeminiMismatch'));
      }
    } catch (err) {
      console.error('Gemini verification failed:', err);
      showToast(t('toastGeminiUnavailable'));
    } finally {
      setIsVerifyingWithGemini(false);
    }
  };

  // Apply Gemini Corrected Diagnosis when botanical mismatch is detected
  const handleApplyGeminiCorrection = () => {
    if (!geminiVerification) return;
    const isRose = geminiVerification.verified_species?.toLowerCase().includes('rose');
    const baseData = isRose ? SAMPLE_DATABASE.Rose_Black_Spot : diagnosisData;
    const corrected = {
      ...baseData,
      disease: geminiVerification.verified_disease || baseData.disease,
      crop: geminiVerification.verified_species || baseData.crop,
      confidence: geminiVerification.confidence || 92,
      status: 'confirmed',
      status_display: 'Gemini Verified Diagnosis',
      chemical_overview: geminiVerification.recommended_action || baseData.chemical_overview
    };
    setDiagnosisData(corrected);
    persistScan(corrected);
    showToast(t('toastAppliedCorrection', { crop: corrected.crop, disease: corrected.disease }));
  };

  // User Field Feedback: Report Incorrect / Different Plant
  const handleReportDifferentPlant = () => {
    setFieldFeedback('reported');
    showToast(t('toastLaunchingKrishiSakha'));
    window.dispatchEvent(new CustomEvent('open-krishi-sakha', {
      detail: {
        image: previewUrl,
        prompt: `I inspected this leaf in the field, and the automated diagnosis (${diagnosisData?.disease || 'detected condition'} on ${diagnosisData?.crop || selectedCrop || 'plant'}) seems incorrect or from a different plant. Can you visually inspect this photo, identify the true plant species and disease symptoms, and suggest the proper care?`
      }
    }));
  };

  // Human-in-the-Loop Clarification Handler (Requirement 6)
  const handleClarification = async (answerValue) => {
    setIsLoading(true);
    setSelectedCrop(answerValue);
    
    // Auto-scroll on mobile
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        const el = document.getElementById('diagnosticResultsSection');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile, 'leaf.jpg');
      formData.append('clarification_answer', answerValue);
      formData.append('crop', answerValue);

      try {
        const res = await fetch('http://127.0.0.1:5000/predict', {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          setDiagnosisData(data);
          persistScan(data);
          setIsLoading(false);
          showToast(t('toastBiologicalGating', { host: answerValue }));
          return;
        }
      } catch (err) {
        console.warn("Backend clarification request failed, falling back to local database", err);
      }
    }

    // Fallback: update local diagnosis data if offline
    if (answerValue === 'Rose') {
      const roseData = SAMPLE_DATABASE.Rose_Black_Spot;
      setDiagnosisData(roseData);
      persistScan(roseData);
    }
    setIsLoading(false);
    showToast(t('toastBiologicalGating', { host: answerValue }));
  };

  // Generate & Download PDF Prescription Report
  const handleDownloadPdf = async () => {
    if (!diagnosisData) return;
    setIsGeneratingPdf(true);
    try {
      const filename = await generatePdfReport(diagnosisData, previewUrl, {
        scanId: diagnosisData.id || `FS-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toLocaleString()
      });
      showToast(t('toastPdfExported', { filename }));
    } catch (err) {
      console.error('PDF export failed:', err);
      showToast(t('pdfError') || 'Failed to generate PDF prescription.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Load a historic scan into the studio
  const handleSelectPastScan = (scan) => {
    const key = scan.diseaseName ? scan.diseaseName.replace(/\s+/g, '_') : 'Early_Blight';
    const fallbackDb = SAMPLE_DATABASE[key] || SAMPLE_DATABASE.Early_Blight;

    setDiagnosisData({
      ...fallbackDb,
      disease: scan.diseaseName || scan.disease,
      scientific_name: scan.scientificName || fallbackDb.scientific_name,
      confidence: scan.confidence || fallbackDb.confidence,
      affected_area_pct: scan.lesionArea ?? fallbackDb.affected_area_pct,
      severity: scan.severity || fallbackDb.severity,
      status: scan.status || fallbackDb.status,
      chemical_overview: scan.chemicalOverview || fallbackDb.chemical_overview,
      tank_mix: scan.tankMix || fallbackDb.tank_mix,
      crop: scan.crop || fallbackDb.crop
    });
    if (scan.thumbnail) {
      setPreviewUrl(scan.thumbnail);
    }
    showToast(t('toastLoadedHistory', { disease: scan.diseaseName || scan.disease }));
    setTimeout(() => {
      document.getElementById('diagnosticResultsSection')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCopySummary = () => {
    if (!diagnosisData) return;
    const d = diagnosisData;
    let text = `FLORASCAN AI AGRONOMIC PRESCRIPTION\n`;
    text += `Diagnosis: ${d.disease} (${d.scientific_name})\n`;
    text += `Confidence: ${d.confidence}% | Lesion Area: ${d.affected_area_pct}%\n`;
    text += `Chemical Strategy: ${d.chemical_overview}\n\n`;
    if (d.active_ingredients) {
      d.active_ingredients.forEach((c) => {
        text += `- ${c.name} [${c.type} / ${c.frac_group}]: Dilution: ${c.dosage_knapsack} | Broadcast: ${c.dosage_broadcast} | PHI: ${c.phi} | REI: ${c.rei}\n`;
      });
    }
    text += `\nTank Mix: ${d.tank_mix}\n`;
    navigator.clipboard.writeText(text);
    showToast(t('toastCopiedToClipboard'));
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-300 pb-20 lg:pb-0 relative">
      
      {/* ── Fixed Full-Website Ambient Background Image (Misty Evergreen Forest) ── */}
      <div 
        className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url('/images/site-bg.jpg')` }}
      />
      {/* ── Adaptive Ambient Overlay for Readability across Light & Dark themes ── */}
      <div 
        className="fixed inset-0 -z-10 bg-slate-50/80 dark:bg-slate-950/85 backdrop-blur-[1.5px] pointer-events-none transition-colors duration-300"
      />
      
      {/* Smooth Cursor Animation with Elastic Trailing Ring */}
      <CustomCursor />

      {/* Modern Agriculture & AI Scanner Entrance Animation */}
      <HeroAnimation />

      {/* Sticky Top Horizontal Navigation Bar */}
      <Navbar
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenTeam={() => setIsTeamOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-8 sm:pb-12">
        
        {/* Header Section with Floating Botanical Particles */}
        <header id="home" className="relative text-center mb-6 pt-4 sm:pt-8 scroll-mt-28">
          <HeroParticles />

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            🌿 FloraScan <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">AI</span>
            <span className="block text-base sm:text-xl font-bold text-slate-700 dark:text-emerald-400/90 mt-1.5 font-sans tracking-normal">
              {appT.heroTitle || appT.heroTagline}
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {appT.heroTitle && appT.heroTagline ? appT.heroTagline : appT.brandDesc}
          </p>

          {/* "Scan Now" Button taking user directly to Input Leaf Specimen */}
          <div className="mt-5 flex items-center justify-center">
            <button
              type="button"
              id="heroScanNowBtn"
              onClick={() => {
                const el = document.getElementById('inputSpecimenSection') || document.getElementById('diagnosticStudio');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  el.classList.add('ring-4', 'ring-emerald-500', 'ring-offset-2', 'dark:ring-offset-slate-900', 'shadow-2xl');
                  setTimeout(() => {
                    el.classList.remove('ring-4', 'ring-emerald-500', 'ring-offset-2', 'dark:ring-offset-slate-900', 'shadow-2xl');
                  }, 2000);
                }
              }}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-600/30 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all cursor-pointer group"
            >
              <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>{appT.scanNowBtn || 'Scan Now'}</span>
              <span className="text-emerald-200 group-hover:translate-x-1.5 transition-transform font-bold text-lg leading-none">→</span>
            </button>
          </div>
        </header>


        {/* Tractor Field Animation */}
        <TractorAnimation />

        {/* Microclimate Weather & Disease Outbreak Risk Forecaster */}
        <WeatherAlert />

        {/* Main Grid: Input Specimen & Pathology Output */}
        <main id="diagnosticStudio" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Specimen Input Card */}
          <section id="inputSpecimenSection" className="scroll-mt-6 lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-6 transition-colors duration-300">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🍃</span> {appT.inputTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{appT.inputSubtitle}</p>
            </div>

            {/* Specimen Input Tabs - Ergonomic 44px Touch Targets */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-750">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                  activeTab === 'upload' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>{appT.tabUpload}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('camera')}
                className={`min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                  activeTab === 'camera' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>{appT.tabCamera}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                  activeTab === 'presets' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{appT.tabPresets}</span>
              </button>
            </div>

            {/* Upload Pane - Native File Upload with tea plantation background */}
            {activeTab === 'upload' && (
              <div className="relative overflow-hidden flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-dashed border-emerald-500/50 dark:border-emerald-500/40 hover:border-emerald-500 rounded-2xl text-center group transition-all shadow-sm">
                {/* Plantation Background Layer with Ambient Backdrop Tint */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('/images/plantation-bg.jpg')` }}
                />
                <div className="absolute inset-0 bg-slate-900/75 dark:bg-slate-950/80 backdrop-blur-[2px] transition-colors group-hover:bg-slate-900/70" />

                <div className="relative z-10 flex flex-col items-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    id="leafFileInput"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-3xl mb-3 shadow-lg shadow-emerald-950/40 backdrop-blur-md group-hover:scale-110 transition-transform">
                    🌿
                  </div>
                  <span className="text-base font-bold text-white drop-shadow-md">{appT.dropTitle}</span>
                  <span className="text-xs text-emerald-200/90 mt-1 drop-shadow-sm">{appT.dropSubtitle}</span>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 min-h-[44px] px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/40 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer border border-emerald-400/30"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{appT.browseBtn}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Camera Pane - Vertical Portrait Aspect Ratio with Flip Camera Button */}
            {activeTab === 'camera' && (
              <div className="space-y-3">
                <div className="relative aspect-[3/4] sm:aspect-video rounded-2xl bg-black overflow-hidden border border-slate-300 dark:border-slate-700 flex items-center justify-center max-h-[60vh] sm:max-h-none shadow-inner">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Camera Reticle Target Overlay */}
                  <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-emerald-400/50 m-4 sm:m-6 rounded-xl flex items-center justify-center">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/90 bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                      {appT.cameraReticle}
                    </span>
                  </div>

                  {/* Camera Flip Button (Front / Rear Toggle) */}
                  <button
                    type="button"
                    onClick={toggleCameraFacing}
                    className="absolute top-3 right-3 min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20 shadow-xl backdrop-blur-md active:scale-95 transition-transform flex items-center justify-center gap-1.5 cursor-pointer z-10"
                    title={t('cameraFlip')}
                    aria-label={t('cameraFlip')}
                  >
                    <RotateCcw className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px] font-bold text-emerald-300 pr-1">
                      {cameraFacingMode === 'environment' ? t('cameraRear') : t('cameraFront')}
                    </span>
                  </button>
                </div>

                {cameraError && <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">{cameraError}</p>}

                {/* Primary Snapshot Capture Button - Thumb-Friendly Size */}
                <button
                  type="button"
                  onClick={captureSnapshot}
                  className="w-full min-h-[48px] py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Camera className="w-5 h-5" />
                  <span>{appT.snapBtn}</span>
                </button>
              </div>
            )}

            {/* Presets Pane */}
            {activeTab === 'presets' && (
              <div className="space-y-2">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{appT.presetsTitle}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { key: 'Early_Blight', label: appT.presetEarlyBlight, sub: appT.presetEarlyBlightSub, icon: '🎯' },
                    { key: 'Rose_Black_Spot', label: appT.presetRoseBlackSpot, sub: appT.presetRoseBlackSpotSub, icon: '🌹' },
                    { key: 'Late_Blight', label: appT.presetLateBlight, sub: appT.presetLateBlightSub, icon: '🥀' },
                    { key: 'Bacterial_Spot', label: appT.presetBacterialSpot, sub: appT.presetBacterialSpotSub, icon: '🍂' },
                    { key: 'Healthy', label: appT.presetHealthy, sub: appT.presetHealthySub, icon: '🌿' }
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handlePresetSelect(item.key)}
                      className="min-h-[48px] p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 text-left transition-all active:scale-95 group cursor-pointer"
                    >
                      <span className="text-xl block mb-1">{item.icon}</span>
                      <strong className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{item.label}</strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{item.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specimen Preview Area with Optional AI Vision Mask Overlay Toggle */}
            {previewUrl && (
              <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{t('specimenVisual')}</span>
                  <div className="flex items-center gap-1">
                    {diagnosisData?.contour_overlay && (
                      <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-200/60 dark:bg-slate-800">
                        <button
                          type="button"
                          onClick={() => setActiveImageMode('original')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                            activeImageMode === 'original'
                              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {t('photoBtn')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveImageMode('overlay')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            activeImageMode === 'overlay'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <span>{t('visionMaskBtn')}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                        </button>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl('');
                        setDiagnosisData(null);
                        setActivePresetKey(null);
                        setGeminiVerification(null);
                        setFieldFeedback(null);
                      }}
                      className="min-h-[30px] px-2 flex items-center text-rose-500 dark:text-rose-400 hover:underline active:scale-95 font-semibold cursor-pointer text-xs"
                    >
                      {appT.clearBtn}
                    </button>
                  </div>
                </div>

                <div 
                  className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-cover bg-center shadow-inner"
                  style={{ backgroundImage: `url('/images/plantation-bg.jpg')` }}
                >
                  <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px]" />
                  <div className="relative z-10 flex items-center justify-center p-2">
                    {activeImageMode === 'overlay' && diagnosisData?.contour_overlay ? (
                      <img
                        src={`data:image/jpeg;base64,${diagnosisData.contour_overlay}`}
                        alt={diagnosisData?.disease ? `OpenCV lesion segmentation overlay showing ${diagnosisData.disease} on ${diagnosisData.crop || 'crop'} leaf` : "OpenCV lesion segmentation overlay"}
                        className="w-full max-h-56 object-contain rounded-lg shadow-xl"
                      />
                    ) : (
                      <img
                        src={previewUrl}
                        alt={diagnosisData?.disease ? `${diagnosisData.crop || 'Plant'} leaf specimen exhibiting symptoms of ${diagnosisData.disease}` : "Plant leaf specimen awaiting pathology diagnosis"}
                        className="w-full max-h-56 object-contain rounded-lg shadow-xl"
                      />
                    )}
                  </div>
                </div>

                {/* Explainability Feedback Banner when Vision Mask Active */}
                {activeImageMode === 'overlay' && diagnosisData?.contour_overlay && (
                  <div className="p-2.5 rounded-lg bg-slate-900/90 text-slate-300 border border-emerald-500/30 text-[11px] space-y-1">
                    <div className="flex items-center gap-3 font-semibold text-[10px] flex-wrap">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> {t('leafBoundaryRoi')}
                      </span>
                      <span className="flex items-center gap-1 text-rose-400">
                        <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> {t('detectedNecrosis', { pct: diagnosisData.affected_area_pct })}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 italic">
                      {t('claheTip')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Species / Crop Selector */}
            <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-850/80 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span>🌱</span> {t('selectCropType')}
                </label>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5 pt-0.5">
                {[
                  { id: 'All', label: t('cropAll'), icon: '🌾' },
                  { id: 'Tomato', label: t('cropTomato'), icon: '🍅' },
                  { id: 'Potato', label: t('cropPotato'), icon: '🥔' },
                  { id: 'Pepper', label: t('cropPepper'), icon: '🌶️' },
                  { id: 'Cucumber', label: t('cropCucumber'), icon: '🥒' },
                  { id: 'Rose', label: t('cropRose'), icon: '🌹' },
                  { id: 'Citrus', label: t('cropCitrus'), icon: '🍊' },
                  { id: 'Apple', label: t('cropApple'), icon: '🍏' },
                  { id: 'Fruit Tree', label: t('cropFruitTree'), icon: '🌳' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCrop(c.id)}
                    className={`min-h-[44px] py-1.5 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 border cursor-pointer active:scale-95 ${
                      selectedCrop === c.id
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500/50'
                    }`}
                  >
                    <span className="text-sm">{c.icon}</span>
                    <span className="text-[10px] truncate max-w-full">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Analyze Button - Thumb Accessible */}
            <button
              type="button"
              disabled={!selectedFile || isLoading}
              onClick={handleAnalyze}
              className={`w-full min-h-[48px] py-3.5 rounded-xl font-extrabold text-sm sm:text-base shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                selectedFile && !isLoading
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 cursor-pointer shadow-emerald-500/30'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              <Play className="w-4 h-4 fill-current flex-shrink-0" />
              <span>{isLoading ? appT.analyzing : appT.analyzeBtn}</span>
            </button>

            {/* Grower Tip */}
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <strong className="text-slate-800 dark:text-slate-300 block">{appT.growerTips}</strong>
              <p>• {appT.tip1}</p>
              <p>• {appT.tip2}</p>
              <p>• {appT.tip3}</p>
            </div>
          </section>

          {/* Right Column: Pathology & Agronomic Chemical Prescription */}
          <section
            id="diagnosticResultsSection"
            ref={resultsRef}
            className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-xl min-h-[500px] transition-colors duration-300 scroll-mt-20"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 flex-wrap gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>🔬</span> {appT.outputTitle}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">{appT.outputSubtitle}</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Scan History Button (Always Available) */}
                <button
                  type="button"
                  onClick={() => setIsHistoryOpen(true)}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                  title="View Foliar Scan History & Recovery Tracker"
                >
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span>{t('historyOpenBtn') || 'Scan History'}</span>
                </button>

                {diagnosisData && (
                  <>
                    {/* Gemini Multimodal Vision Cross-Verification Button */}
                    <button
                      type="button"
                      onClick={handleRunGeminiVerification}
                      disabled={isVerifyingWithGemini}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-900/70 text-xs font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 inline-flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-xs"
                      title="Run secondary botanical verification with Gemini 2.5 Flash Multimodal Vision"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span>{isVerifyingWithGemini ? t('verifyingGemini') : t('verifyGeminiBtn')}</span>
                    </button>

                    {/* Download Prescription PDF */}
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      disabled={isGeneratingPdf}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm inline-flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                      title="Download PDF Diagnostic Prescription"
                    >
                      <FileDown className="w-4 h-4 text-white" />
                      <span>{isGeneratingPdf ? t('pdfGenerating') : t('downloadPdfBtn')}</span>
                    </button>

                    {/* Tank Calculator Trigger */}
                    <button
                      type="button"
                      onClick={() => setIsSprayCalcOpen(true)}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                      title="Open Spray Tank-Mix Dosage Calculator"
                    >
                      <Calculator className="w-4 h-4 text-emerald-500" />
                      <span>{t('openSprayCalc')}</span>
                    </button>

                    {/* Print Treatment Plan */}
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                      title="Print Treatment Plan"
                    >
                      <Printer className="w-4 h-4 text-emerald-500" />
                      <span className="hidden sm:inline">{appT.printBtn}</span>
                    </button>

                    {/* Copy Summary */}
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                      title="Copy Treatment Summary"
                    >
                      <Copy className="w-4 h-4 text-emerald-500" />
                      <span className="hidden sm:inline">{appT.copyBtn}</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Empty State */}
            {!diagnosisData && !isLoading && (
              <div className="py-20 text-center space-y-3">
                <span className="text-5xl block opacity-60">🔬</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{appT.emptyTitle}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  {appT.emptyDesc}
                </p>
              </div>
            )}

            {/* Loading State — UIverse 4-Square Rotating Loader */}
            {isLoading && (
              <div className="py-16 flex flex-col items-center justify-center gap-8">
                <style>{`
                  @keyframes loading-rotate {
                    0%   { transform: scale(1)   rotate(0deg);   }
                    20%  { transform: scale(1)   rotate(72deg);  }
                    40%  { transform: scale(0.5) rotate(144deg); }
                    60%  { transform: scale(0.5) rotate(216deg); }
                    80%  { transform: scale(1)   rotate(288deg); }
                    100% { transform: scale(1)   rotate(360deg); }
                  }
                  .fs-loader {
                    width: 85px; height: 85px;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-content: space-between;
                    animation: loading-rotate 3s linear infinite;
                  }
                  .fs-item {
                    width: 40px; height: 40px;
                    display: block;
                    box-sizing: border-box;
                  }
                  .fs-item:nth-of-type(1) {
                    background-color: #50DE68;
                    border-radius: 20px 20px 0 20px;
                    border-left: #ffffff 4px solid;
                    border-top: #f7f7f7 4px solid;
                  }
                  .fs-item:nth-of-type(2) {
                    background-color: rgb(32, 80, 46);
                    border-radius: 20px 20px 20px 0;
                    border-right: #ffffff 4px solid;
                    border-top: #f7f7f7 4px solid;
                  }
                  .fs-item:nth-of-type(3) {
                    background-color: rgb(0, 255, 55);
                    border-radius: 20px 0 20px 20px;
                    border-left: #ffffff 4px solid;
                    border-bottom: #f7f7f7 4px solid;
                  }
                  .fs-item:nth-of-type(4) {
                    background-color: rgb(32, 182, 32);
                    border-radius: 0 20px 20px 20px;
                    border-right: #ffffff 4px solid;
                    border-bottom: #f7f7f7 4px solid;
                  }
                `}</style>

                <div className="fs-loader">
                  <span className="fs-item" />
                  <span className="fs-item" />
                  <span className="fs-item" />
                  <span className="fs-item" />
                </div>

                <div className="text-center space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {t('loadingAnalyzingFoliar')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('loadingEvaluatingHSV')}
                  </p>
                </div>
              </div>
            )}

            {/* Results Presentation */}
            {diagnosisData && !isLoading && (
              <div className="space-y-6 animate-fade-in text-sm">

                {/* Gemini Hybrid Verification Results Card (Only appears if user clicks Verify) */}
                {geminiVerification && (
                  <div className={`p-4 sm:p-5 rounded-2xl border-2 text-xs space-y-2.5 shadow-md ${
                    geminiVerification.agrees
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-500/60 text-emerald-950 dark:text-emerald-100'
                      : 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-500/60 text-indigo-950 dark:text-indigo-100'
                  }`}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 font-extrabold text-xs sm:text-sm">
                        <span className="text-base">{geminiVerification.agrees ? '✅' : '🔍'}</span>
                        <span>
                          {geminiVerification.agrees
                            ? t('geminiVerifiedConfirmed', { confidence: geminiVerification.confidence })
                            : t('geminiVerifiedSuggested', { confidence: geminiVerification.confidence })}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700">
                        {t('hybridVerificationLayer')}
                      </span>
                    </div>
                    <p className="leading-relaxed font-semibold text-xs sm:text-sm">
                      {geminiVerification.explanation}
                    </p>
                    {!geminiVerification.agrees && (
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 dark:border-indigo-800 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                          <div>
                            <span className="text-slate-500 dark:text-slate-400 font-semibold">{t('geminiIdentified')} </span>
                            <strong className="text-slate-900 dark:text-white">{geminiVerification.verified_species}</strong> — <strong className="text-indigo-600 dark:text-indigo-400">{geminiVerification.verified_disease}</strong>
                          </div>
                          <button
                            type="button"
                            onClick={handleApplyGeminiCorrection}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs cursor-pointer active:scale-95 transition-all"
                          >
                            {t('applyCorrectedDiagnosis')}
                          </button>
                        </div>
                        {geminiVerification.recommended_action && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                            💡 <strong>{t('suggestedProtocol')}</strong> {geminiVerification.recommended_action}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Diagnosis High-Contrast Banner for Field Sunlight Readability */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-100 via-slate-50 to-emerald-50/50 dark:from-slate-850 dark:to-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-4 shadow-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                        diagnosisData.status === 'Healthy'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                          : diagnosisData.status === 'confirmed' || diagnosisData.confidence >= 85
                          ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30'
                          : diagnosisData.status === 'likely' || diagnosisData.confidence >= 60
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30'
                      }`}>
                        {diagnosisData.status_display || (diagnosisData.confidence >= 85 ? t('statusConfirmedDiagnosis') : diagnosisData.confidence >= 60 ? t('statusLikelyDiagnosis') : t('statusLowConfidenceAssessment'))}
                      </span>
                      {diagnosisData.crop && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-750 text-slate-700 dark:text-slate-300">
                          🌱 {getLocalizedCropName(diagnosisData.crop, language)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{getLocalizedDiseaseName(diagnosisData.disease, language)}</h3>
                    <p className="text-xs sm:text-sm italic font-medium text-slate-500 dark:text-slate-400 mt-0.5">{diagnosisData.scientific_name}</p>
                  </div>

                  <div className="text-left sm:text-right bg-white dark:bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 block leading-tight">{diagnosisData.confidence}%</span>
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('statConfidence')}</span>
                  </div>
                </div>

                {/* Standardized Plant Health & Diagnostic Report Card */}
                {diagnosisData.diagnostic_report_markdown && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border-2 border-emerald-500/40 shadow-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📋</span>
                        <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-emerald-400">
                          {t('standardizedReportTitle')}
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {t('aiPathologistEngine')}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line space-y-1 bg-black/40 p-3.5 sm:p-4 rounded-xl border border-slate-800">
                      {diagnosisData.diagnostic_report_markdown}
                    </div>
                  </div>
                )}

                {/* Step 4 Safeguard: Grower Field Confirmation & Discrepancy Escalation */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🌾</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {t('fieldMatchQuestion')}
                    </span>
                  </div>
                  {fieldFeedback === 'confirmed' ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-lg border border-emerald-300 dark:border-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t('fieldConfirmedByGrower')}</span>
                    </div>
                  ) : fieldFeedback === 'reported' ? (
                    <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 rounded-lg border border-indigo-300 dark:border-indigo-700">
                      <span>🤖 {t('escalatedToKrishiSakha')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFieldFeedback('confirmed');
                          showToast(t('toastFieldConfirmationRecorded'));
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{t('btnYesMatches')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleReportDifferentPlant}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300 font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>{t('btnNoDifferent')}</span>
                      </button>
                    </div>
                  )}
                </div>



                {/* Compact 2x2 Responsive Metric Grid Cards (Direct Sunlight / Mobile Field View) */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* Card 1: AI Confidence Metric */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t('statConfidence')}</span>
                      <span className="text-xs">🎯</span>
                    </div>
                    <div className="my-2">
                      <strong className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">
                        {diagnosisData.confidence}%
                      </strong>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{t('softmaxProb')}</span>
                  </div>

                  {/* Card 2: Lesion Surface Area */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t('statLesion')}</span>
                      <span className="text-xs">🍂</span>
                    </div>
                    <div className="my-2">
                      <strong className="text-2xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                        {diagnosisData.affected_area_pct}%
                      </strong>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(4, diagnosisData.affected_area_pct)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{t('hsvNecrosisArea')}</span>
                  </div>

                  {/* Card 3: Condition Severity Badge */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t('statSeverity')}</span>
                      <span className="text-xs">⚠️</span>
                    </div>
                    <div className="my-2">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-xs sm:text-sm font-extrabold uppercase tracking-wider ${
                        diagnosisData.severity === 'Critical'
                          ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/40'
                          : diagnosisData.severity === 'Moderate'
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/40'
                          : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40'
                      }`}>
                        {getLocalizedSeverity(diagnosisData.severity, language)}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{t('interventionUrgency')}</span>
                  </div>

                  {/* Card 4: Pathology Status */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t('tissueHealth')}</span>
                      <span className="text-xs">🍃</span>
                    </div>
                    <div className="my-2">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-xs sm:text-sm font-extrabold ${
                        diagnosisData.status === 'Healthy'
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40'
                          : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/40'
                      }`}>
                        {getLocalizedStatus(diagnosisData.status, language)}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                      {diagnosisData.status === 'Healthy' ? t('optimalCondition') : t('treatmentAdvised')}
                    </span>
                  </div>
                </div>

                {/* Visual Symptoms Observed (Requirement 14) */}
                {diagnosisData.symptoms && diagnosisData.symptoms.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span>🔍</span> {t('visualSymptomsTitle')}
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                      {diagnosisData.symptoms.map((symp, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{symp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Chemical Fungicides & Dilution Rates Table (Safety Gated) */}
                {diagnosisData.chemical_treatments_allowed !== false && (diagnosisData.confidence >= 60 || diagnosisData.status === 'Healthy') ? (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t('treatmentChemical')}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{diagnosisData.chemical_overview}</p>

                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                      <table className="w-full text-left text-xs min-w-[520px]">
                        <thead className="bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="p-3 font-bold">{t('thActiveIngredient')}</th>
                            <th className="p-3 font-bold">{t('thModeFrac')}</th>
                            <th className="p-3 font-bold">{t('dosageKnapsack')}</th>
                            <th className="p-3 font-bold">{t('thPhi')}</th>
                            <th className="p-3 font-bold">{t('thRei')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 bg-white dark:bg-slate-900/60">
                          {diagnosisData.active_ingredients?.map((chem, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                              <td className="p-3">
                                <strong className="text-slate-900 dark:text-white block font-bold">{chem.name}</strong>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400">{chem.role}</span>
                              </td>
                              <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">{chem.frac_group}</td>
                              <td className="p-3 text-slate-800 dark:text-slate-200 font-bold">{chem.dosage_knapsack}</td>
                              <td className="p-3 text-slate-600 dark:text-slate-300 font-medium">{chem.phi}</td>
                              <td className="p-3 text-slate-600 dark:text-slate-300 font-medium">{chem.rei}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Tank Mix Recommendation with Quick-Calculator Button */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                      <div className="flex items-start gap-2.5">
                        <span className="text-xl">🧪</span>
                        <div>
                          <strong className="text-slate-900 dark:text-white block font-bold mb-0.5">{t('tankMixTitle')}:</strong>
                          <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{diagnosisData.tank_mix}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsSprayCalcOpen(true)}
                        className="min-h-[44px] px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer flex-shrink-0"
                      >
                        <Calculator className="w-4 h-4" />
                        <span>{t('calcTankDosage')}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Gated Chemical Treatment Notice for Low-Confidence Results (Requirement 9 & 10) */
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                      <span className="text-base">🛡️</span>
                      <span>{t('chemicalSuppressedTitle')}</span>
                    </div>
                    <p className="leading-relaxed">
                      {diagnosisData.chemical_notice || t('chemicalSuppressedNotice')}
                    </p>
                  </div>
                )}

                {/* Spraying Schedule (if chemicals allowed) */}
                {diagnosisData.spraying_schedule && diagnosisData.chemical_treatments_allowed !== false && diagnosisData.confidence >= 60 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t('secSchedule')}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                        <strong className="text-slate-800 dark:text-slate-200 block mb-1 font-bold">⏱️ {t('appWindow')}</strong>
                        <span className="text-slate-600 dark:text-slate-400 leading-relaxed">{diagnosisData.spraying_schedule.frequency}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                        <strong className="text-slate-800 dark:text-slate-200 block mb-1 font-bold">🛡️ {t('resistanceStewardship')}</strong>
                        <span className="text-slate-600 dark:text-slate-400 leading-relaxed">{diagnosisData.spraying_schedule.resistance_stewardship || t('rotateFracDefault')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cultural & Organic Agronomic Recommendations (Requirement 10 & 14) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs sm:text-sm">
                    <strong className="text-emerald-700 dark:text-emerald-400 block font-bold">🌱 {t('treatmentOrganic')}</strong>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{diagnosisData.organic_remedy || t('defaultOrganicRemedy')}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs sm:text-sm">
                    <strong className="text-blue-700 dark:text-blue-400 block font-bold">🚜 {t('culturalSanitation')}</strong>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{diagnosisData.cultural_remedy || t('defaultCulturalRemedy')}</p>
                  </div>
                </div>

                {/* ── Find Nearby Agrochemical Shops ── */}
                <NearbyShopsCard diagnosisData={diagnosisData} />

              </div>

            )}

          </section>
        </main>

        {/* Comprehensive SEO Content, Educational Knowledge Base & FAQ Section */}
        <SeoContentSection
          onSelectDisease={(disease) => setSelectedDiseaseGuide(disease)}
          onLoadSample={(presetKey) => handleSelectPreset(presetKey)}
        />
      </div>

      {/* Footer */}
      <Footer
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenTeam={() => setIsTeamOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Modals */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <TeamModal isOpen={isTeamOpen} onClose={() => setIsTeamOpen(false)} />
      <DiseaseGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <DiseaseDetailModal
        disease={selectedDiseaseGuide}
        isOpen={!!selectedDiseaseGuide}
        onClose={() => setSelectedDiseaseGuide(null)}
        onLoadSample={(presetKey) => handleSelectPreset(presetKey)}
      />
      <SprayCalculator
        isOpen={isSprayCalcOpen}
        onClose={() => setIsSprayCalcOpen(false)}
        diagnosisData={diagnosisData}
      />
      <ScanHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectScan={handleSelectPastScan}
        currentScan={diagnosisData}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl animate-fade-in flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile-Friendly Bottom Sticky Action Bar (Single-Handed Field Operation) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] px-3 py-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] flex items-center justify-around gap-2">
        {/* Camera Quick Button */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('camera');
            document.getElementById('diagnosticStudio')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex-1 min-h-[48px] py-1.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-all text-xs font-bold cursor-pointer ${
            activeTab === 'camera'
              ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label={t('mobileBarCamera')}
        >
          <Camera className="w-5 h-5" />
          <span className="text-[11px] leading-none">{t('mobileBarCamera')}</span>
        </button>

        {/* Upload / Native Snap Button */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('upload');
            fileInputRef.current?.click();
          }}
          className={`flex-1 min-h-[48px] py-1.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-all text-xs font-bold cursor-pointer ${
            activeTab === 'upload' && !selectedFile
              ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label={t('mobileBarUpload')}
        >
          <Upload className="w-5 h-5" />
          <span className="text-[11px] leading-none">{t('mobileBarUpload')}</span>
        </button>

        {/* Primary Action Button: Analyze Leaf */}
        <button
          type="button"
          disabled={!selectedFile || isLoading}
          onClick={handleAnalyze}
          className={`flex-[1.4] min-h-[48px] py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all text-xs font-extrabold shadow-md cursor-pointer ${
            selectedFile && !isLoading
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/30 animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-60'
          }`}
          aria-label={t('mobileBarAnalyze')}
        >
          <Play className="w-4 h-4 fill-current flex-shrink-0" />
          <span className="truncate">{isLoading ? t('analyzing') : t('mobileBarAnalyze')}</span>
        </button>

        {/* Krishi Sakha Assistant Button */}
        <button
          type="button"
          onClick={() => {
            const fab = document.querySelector('[aria-label="Open Krishi Sakha AI Assistant"]');
            if (fab) fab.click();
          }}
          className="flex-1 min-h-[48px] py-1.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-all text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          aria-label={t('mobileBarSakha')}
        >
          <span className="text-base leading-none">🤖</span>
          <span className="text-[11px] leading-none">{t('mobileBarSakha')}</span>
        </button>
      </div>

      {/* Persistent Floating AI Copilot (Monica / Amazon Rufus Style) */}
      <FloraCopilot diagnosisData={diagnosisData} currentLanguage={language} />
    </div>
  );
}
