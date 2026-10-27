# FloraScan: Plant Disease Detection & Image Processing Studio
## Roadmap & Execution Checklist

- [/] **Milestone 1: Project Scaffolding & Setup**
  - [x] Create project roadmap (`Design/tasks.md`)
  - [ ] Initialize Vite + React project with Tailwind CSS & PostCSS
  - [ ] Configure Tailwind theme with agricultural & biotech emerald/slate palette
  - [ ] Install dependencies: `lucide-react`, `@google/genai`, `canvas-confetti` (for delight)
  - [ ] Set up `.env.example` and environment configuration

- [ ] **Milestone 2: Core Utilities & Image Processing Algorithms**
  - [ ] Create `src/utils/imageFilters.js`:
    - [ ] Pure canvas pixel extraction & manipulation
    - [ ] Grayscale transformation
    - [ ] Sobel Edge Detection kernel (leaf vein & lesion margin delineation)
    - [ ] Chlorosis / Necrosis Mask (HSV/RGB thresholding for yellowing & necrosis)
    - [ ] Lesion Saliency Heatmap (gradient density mapping of damaged tissues)
    - [ ] Affected surface area percentage calculation from pixel statistics
  - [ ] Create `src/utils/fallbackPathology.js`:
    - [ ] Offline rule-based diagnostic database with symptoms, pathogens, severity, remedies
    - [ ] Heuristic image analyzer fallback (color balance, lesion mask percentage)
  - [ ] Create `src/utils/geminiClient.js`:
    - [ ] Multimodal vision prompt integration with `@google/genai`
    - [ ] Structured JSON schema output parsing
    - [ ] Graceful fallback handling for missing API key, rate limits, non-leaf photos, network errors

- [ ] **Milestone 3: Preset Data & Sample Assets**
  - [ ] Generate/provide 4 high-quality realistic sample diseased leaf images:
    - [ ] Tomato Early Blight (*Alternaria solani*)
    - [ ] Apple Scab (*Venturia inaequalis*)
    - [ ] Corn Leaf Rust (*Puccinia sorghi*)
    - [ ] Healthy Potato Leaf (*Solanum tuberosum*)
  - [ ] Store preset samples in `public/samples/`
  - [ ] Create SVG favicon in `public/favicon.svg`

- [ ] **Milestone 4: User Interface Components**
  - [ ] `Navbar.jsx`: Header, branding, API key status badge, quick actions, modal key config
  - [ ] `CameraCapture.jsx`:
    - [ ] Live webcam video stream via `navigator.mediaDevices.getUserMedia`
    - [ ] Camera selector / front-back camera switch
    - [ ] Interactive viewfinder guide reticle
    - [ ] High-res snapshot capture & proper track stopping (clean unmount / leak prevention)
    - [ ] Permission handling & friendly error states
  - [ ] `FileUpload.jsx`:
    - [ ] Drag-and-drop zone with animated feedback
    - [ ] File format validation (PNG, JPG, WEBP)
    - [ ] 4 Interactive quick-test sample cards with preview thumbnails & captions
  - [ ] `ImageProcessor.jsx`:
    - [ ] Interactive Canvas Studio with dual/side-by-side or tabbed inspection
    - [ ] Modes: Original, Grayscale, Sobel Edges, Chlorosis/Necrosis Mask, Saliency Heatmap
    - [ ] Zoom/pan or comparison slider, filter parameters (threshold/intensity)
    - [ ] Lesion area metrics overlay
  - [ ] `DiagnosisResult.jsx`:
    - [ ] Pathology summary card: Disease name, scientific name, confidence score badge
    - [ ] Infection severity gauge (Low / Moderate / Severe)
    - [ ] Affected leaf surface area meter (%)
    - [ ] 3 Actionable tabs: Organic Remedies, Chemical Treatments, Cultural/Preventative Practices
    - [ ] Printable / PDF export layout with clean print stylesheet
  - [ ] `HistoryLog.jsx`:
    - [ ] Persistent localStorage history of diagnostic scans
    - [ ] Item cards with thumbnail, timestamp, disease title, severity badge
    - [ ] Reload scan into studio, delete item, clear history
  - [ ] `DiseaseLibrary.jsx`:
    - [ ] Searchable offline crop disease encyclopedia
    - [ ] Filter by crop (Tomato, Apple, Potato, Corn, Wheat)
    - [ ] Comprehensive disease profile modal/cards with symptoms, cause, treatments

- [ ] **Milestone 5: Dashboard Assembly & State Integration**
  - [ ] `App.jsx`: State machine connecting camera/upload -> canvas filtering -> AI diagnosis -> history storage
  - [ ] Responsive navigation (Studio, Disease Encyclopedia, Scan History, Settings)
  - [ ] Toast notifications for status, errors, and success

- [ ] **Milestone 6: Verification, Testing & Polish**
  - [ ] Build verification (`npm run build`)
  - [ ] Local server test (`npm run dev`)
  - [ ] Browser verification via subagent: camera/upload flow, canvas filters rendering, sample testing, history persistence
