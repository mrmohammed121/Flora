// FloraScan AI Client Controller
let currentBlob = null;
let stream = null;
let lastDiagnosisData = null;

// DOM Elements
const tabUpload = document.getElementById("tabUpload");
const tabCamera = document.getElementById("tabCamera");
const tabPresets = document.getElementById("tabPresets");

const uploadPane = document.getElementById("uploadPane");
const cameraPane = document.getElementById("cameraPane");
const presetsPane = document.getElementById("presetsPane");

const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");
const previewHeader = document.getElementById("previewHeader");
const previewImg = document.getElementById("previewImg");
const clearBtn = document.getElementById("clearBtn");

const webcam = document.getElementById("webcam");
const snapBtn = document.getElementById("snapBtn");
const snapshotCanvas = document.getElementById("snapshotCanvas");
const analyzeBtn = document.getElementById("analyzeBtn");

const loading = document.getElementById("loading");
const emptyState = document.getElementById("emptyState");
const resultContent = document.getElementById("resultContent");
const reportActions = document.getElementById("reportActions");
const printBtn = document.getElementById("printBtn");
const copyBtn = document.getElementById("copyBtn");
const toast = document.getElementById("toast");

// Toast Notification Helper
function showToast(msg) {
  if (!toast) return;
  toast.innerText = msg;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 2600);
}

// Tab Switching
function switchTab(activeTab, activePane) {
  [tabUpload, tabCamera, tabPresets].forEach(t => t.classList.remove("active"));
  [uploadPane, cameraPane, presetsPane].forEach(p => p.classList.remove("active"));

  activeTab.classList.add("active");
  activePane.classList.add("active");

  if (activeTab !== tabCamera) {
    stopCamera();
  }
}

tabUpload.addEventListener("click", () => switchTab(tabUpload, uploadPane));
tabCamera.addEventListener("click", async () => {
  switchTab(tabCamera, cameraPane);
  await startCamera();
});
tabPresets.addEventListener("click", () => switchTab(tabPresets, presetsPane));

// Camera Handlers
async function startCamera() {
  try {
    if (stream) {
      stopCamera();
    }
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
    });
    webcam.srcObject = stream;
  } catch (err) {
    console.error("Camera error:", err);
    alert("Camera permission denied or camera device not accessible.");
    switchTab(tabUpload, uploadPane);
  }
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  if (webcam.srcObject) {
    webcam.srcObject = null;
  }
}

snapBtn.addEventListener("click", () => {
  if (!webcam.videoWidth) {
    alert("Camera stream is initializing. Please wait a moment.");
    return;
  }
  snapshotCanvas.width = webcam.videoWidth;
  snapshotCanvas.height = webcam.videoHeight;
  const ctx = snapshotCanvas.getContext("2d");
  ctx.drawImage(webcam, 0, 0);

  snapshotCanvas.toBlob(blob => {
    currentBlob = blob;
    displayPreview(blob);
    stopCamera();
    switchTab(tabUpload, uploadPane);
  }, "image/jpeg", 0.92);
});

// Drag and Drop & File Upload
dropZone.addEventListener("click", () => fileInput.click());

["dragenter", "dragover"].forEach(evtName => {
  dropZone.addEventListener(evtName, (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });
});

["dragleave", "drop"].forEach(evtName => {
  dropZone.addEventListener(evtName, (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
  });
});

dropZone.addEventListener("drop", (e) => {
  if (e.dataTransfer.files && e.dataTransfer.files.length) {
    handleFile(e.dataTransfer.files[0]);
  }
});

fileInput.addEventListener("change", (e) => {
  if (e.target.files.length) {
    handleFile(e.target.files[0]);
  }
});

function handleFile(file) {
  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image file (PNG, JPG, JPEG, WEBP).");
    return;
  }
  currentBlob = file;
  displayPreview(file);
}

function displayPreview(blobOrFile) {
  previewImg.src = URL.createObjectURL(blobOrFile);
  previewImg.style.display = "block";
  previewHeader.style.display = "flex";
  analyzeBtn.disabled = false;
}

clearBtn.addEventListener("click", () => {
  currentBlob = null;
  previewImg.src = "";
  previewImg.style.display = "none";
  previewHeader.style.display = "none";
  analyzeBtn.disabled = true;
  fileInput.value = "";
  emptyState.style.display = "block";
  resultContent.style.display = "none";
  if (reportActions) reportActions.style.display = "none";
});

// Preset Sample Leaves Generation
document.querySelectorAll(".preset-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const sampleType = btn.getAttribute("data-sample");
    generateSampleLeaf(sampleType);
  });
});

function generateSampleLeaf(sampleType) {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 400, 400);

  // Draw Leaf Shape
  ctx.save();
  ctx.translate(200, 200);
  ctx.beginPath();
  ctx.moveTo(0, -160);
  ctx.bezierCurveTo(120, -100, 140, 100, 0, 170);
  ctx.bezierCurveTo(-140, 100, -120, -100, 0, -160);
  ctx.closePath();

  // Color according to disease
  if (sampleType === "Healthy") {
    const grad = ctx.createLinearGradient(0, -150, 0, 150);
    grad.addColorStop(0, "#22c55e");
    grad.addColorStop(0.5, "#16a34a");
    grad.addColorStop(1, "#15803d");
    ctx.fillStyle = grad;
  } else if (sampleType === "Bacterial_Spot") {
    ctx.fillStyle = "#4ade80";
  } else if (sampleType === "Early_Blight") {
    ctx.fillStyle = "#86efac";
  } else { // Late_Blight
    ctx.fillStyle = "#65a30d";
  }
  ctx.fill();

  // Central Vein
  ctx.strokeStyle = "#166534";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, -150);
  ctx.lineTo(0, 160);
  ctx.stroke();

  // Side Veins
  for (let y = -100; y < 120; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.quadraticCurveTo(35, y - 10, 70, y - 25);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.quadraticCurveTo(-35, y - 10, -70, y - 25);
    ctx.stroke();
  }

  // Draw Lesions / Spots based on sampleType
  if (sampleType === "Bacterial_Spot") {
    ctx.fillStyle = "#78350f"; // dark brown spots
    for (let i = 0; i < 28; i++) {
      const rx = (Math.random() - 0.5) * 140;
      const ry = (Math.random() - 0.5) * 220;
      const r = 3 + Math.random() * 6;
      ctx.beginPath();
      ctx.arc(rx, ry, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (sampleType === "Early_Blight") {
    // Concentric target spots
    const spots = [[-30, -40, 24], [35, 30, 28], [-15, 60, 18], [25, -80, 16]];
    spots.forEach(([sx, sy, rad]) => {
      ctx.fillStyle = "#d97706";
      ctx.beginPath();
      ctx.arc(sx, sy, rad, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#78350f";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sx, sy, rad * 0.65, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(sx, sy, rad * 0.35, 0, Math.PI * 2);
      ctx.stroke();
    });
  } else if (sampleType === "Late_Blight") {
    // Large necrotic decaying patches
    ctx.fillStyle = "#451a03";
    ctx.beginPath();
    ctx.ellipse(30, -20, 50, 35, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#713f12";
    ctx.beginPath();
    ctx.ellipse(-35, 50, 45, 30, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();

  canvas.toBlob(blob => {
    currentBlob = blob;
    displayPreview(blob);
  }, "image/jpeg", 0.95);
}

// Prediction Request Handler
analyzeBtn.addEventListener("click", async () => {
  if (!currentBlob) return;

  loading.style.display = "block";
  emptyState.style.display = "none";
  resultContent.style.display = "none";
  if (reportActions) reportActions.style.display = "none";
  analyzeBtn.disabled = true;

  const formData = new FormData();
  formData.append("file", currentBlob, "leaf_specimen.jpg");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch("/predict", {
      method: "POST",
      body: formData,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await response.json();
    loading.style.display = "none";
    analyzeBtn.disabled = false;

    if (data.error) {
      alert("Pathology Analysis Error: " + data.error);
      emptyState.style.display = "block";
      return;
    }

    lastDiagnosisData = data;

    // 1. Diagnosis Banner
    document.getElementById("resDisease").innerText = data.disease;
    document.getElementById("resScientific").innerText = data.scientific_name || "";
    const statusElem = document.getElementById("resStatus");
    statusElem.innerText = data.status;

    if (data.status.toLowerCase().includes("healthy")) {
      statusElem.className = "badge healthy";
    } else {
      statusElem.className = "badge infected";
    }

    const cropElem = document.getElementById("resCrop");
    if (cropElem) {
      if (data.crop) {
        cropElem.innerText = data.crop;
        cropElem.style.display = "inline-block";
      } else {
        cropElem.style.display = "none";
      }
    }

    document.getElementById("resConfidence").innerText = data.confidence + "%";
    document.getElementById("resArea").innerText = data.affected_area_pct + "%";

    const progressBar = document.getElementById("areaProgressBar");
    if (progressBar) {
      progressBar.style.width = Math.min(100, Math.max(3, data.affected_area_pct)) + "%";
    }

    document.getElementById("resSeverity").innerText = data.severity;
    const severityDesc = document.getElementById("resSeverityDesc");
    if (severityDesc) {
      if (data.severity === "None") {
        severityDesc.innerText = "No infectious symptoms detected; healthy foliage";
      } else if (data.severity === "Critical") {
        severityDesc.innerText = "High emergency urgency — quarantine & treat immediately";
      } else {
        severityDesc.innerText = "Targeted curative & protectant program required";
      }
    }

    // 2. Sections 1 & 2: Chemical Ingredients & Dilution Table
    document.getElementById("resChemicalOverview").innerText = data.chemical_overview || "";
    const tbody = document.getElementById("chemicalTableBody");
    tbody.innerHTML = "";

    if (data.active_ingredients && data.active_ingredients.length) {
      data.active_ingredients.forEach(item => {
        const tr = document.createElement("tr");

        let pillClass = "contact";
        const typeLower = (item.type || "").toLowerCase();
        if (typeLower.includes("systemic")) pillClass = "systemic";
        else if (typeLower.includes("bio") || typeLower.includes("microb")) pillClass = "bio";

        tr.innerHTML = `
          <td>
            <span class="table-chem-name">${item.name}</span>
            <span class="table-chem-role">${item.role || ""}</span>
          </td>
          <td>
            <div>${item.type}</div>
            <span class="frac-pill ${pillClass}">${item.frac_group || ""}</span>
          </td>
          <td><strong>${item.dosage_knapsack}</strong></td>
          <td>${item.dosage_broadcast}</td>
          <td><span class="safety-tag">${item.phi}</span></td>
          <td><span class="safety-tag">${item.rei}</span></td>
        `;
        tbody.appendChild(tr);
      });
    }

    // Tank Mix Box
    document.getElementById("resTankMix").innerText = data.tank_mix || "Standard rotation without tank mixing.";

    // 3. Section 3: Spraying Schedule
    if (data.spraying_schedule) {
      document.getElementById("schedFreq").innerText = data.spraying_schedule.frequency || "";
      document.getElementById("schedStewardship").innerText = data.spraying_schedule.resistance_stewardship || "";
      document.getElementById("schedWindow").innerText = data.spraying_schedule.application_window || "";
      document.getElementById("schedRain").innerText = data.spraying_schedule.rainfastness || "";
    }

    // 4. Section 4: Safety & PPE
    if (data.safety_ppe) {
      document.getElementById("phiBadge").innerText = data.safety_ppe.phi_summary || "0 Days";
      document.getElementById("reiBadge").innerText = data.safety_ppe.rei_summary || "0 Hours";
      document.getElementById("resPpe").innerText = data.safety_ppe.ppe || "Standard farm gear.";
    }

    // 5. Section 5: Integrated Organic & Cultural
    document.getElementById("resOrganic").innerText = data.organic_remedy || "";
    document.getElementById("resCultural").innerText = data.cultural_remedy || "";

    resultContent.style.display = "block";
    if (reportActions) reportActions.style.display = "flex";

  } catch (err) {
    loading.style.display = "none";
    analyzeBtn.disabled = false;
    emptyState.style.display = "block";
    alert("Connection to Flask backend server failed. Make sure python app.py is running on port 5000.");
  }
});

// Print Plan Handler
if (printBtn) {
  printBtn.addEventListener("click", () => {
    window.print();
  });
}

// Copy Summary Handler
if (copyBtn) {
  copyBtn.addEventListener("click", () => {
    if (!lastDiagnosisData) return;
    const d = lastDiagnosisData;
    let text = `AGRONOMIC PRESCRIPTION REPORT\n`;
    if (d.crop) {
      text += `Crop: ${d.crop}\n`;
    }
    text += `Diagnosis: ${d.disease} (${d.scientific_name})\n`;
    text += `Confidence: ${d.confidence}%\n`;
    text += `Lesion Area: ${d.affected_area_pct}% (Severity: ${d.severity})\n\n`;
    text += `--- PRESCRIBED CHEMICALS ---\n`;
    if (d.active_ingredients) {
      d.active_ingredients.forEach(c => {
        text += `- ${c.name} [${c.type} / ${c.frac_group}]: Dilution: ${c.dosage_knapsack} | Broadcast: ${c.dosage_broadcast} | PHI: ${c.phi} | REI: ${c.rei}\n`;
      });
    }
    text += `\nTank Mix: ${d.tank_mix}\n`;
    text += `Frequency: ${d.spraying_schedule.frequency}\n`;
    text += `Resistance: ${d.spraying_schedule.resistance_stewardship}\n`;
    text += `PPE: ${d.safety_ppe.ppe}\n`;
    text += `Organic: ${d.organic_remedy}\n`;
    text += `Cultural: ${d.cultural_remedy}\n`;

    navigator.clipboard.writeText(text).then(() => {
      showToast("✓ Treatment plan copied to clipboard!");
    }).catch(() => {
      showToast("Unable to copy to clipboard.");
    });
  });
}

// ========================================================
// NAVIGATION & MODAL CONTROLLERS
// ========================================================
// ========================================================
// NAVIGATION & MODAL CONTROLLERS (Hamburger Menu Button)
// ========================================================
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileMenu = document.getElementById("mobileMenu");

function toggleMenu(forceState) {
  if (!mobileMenu) return;
  const isCurrentlyOpen = mobileMenu.classList.contains("open");
  const willOpen = typeof forceState === "boolean" ? forceState : !isCurrentlyOpen;
  
  if (willOpen) {
    mobileMenu.classList.add("open");
  } else {
    mobileMenu.classList.remove("open");
  }

  if (hamburgerBtn) {
    if (willOpen) {
      hamburgerBtn.classList.add("active");
    } else {
      hamburgerBtn.classList.remove("active");
    }
    hamburgerBtn.setAttribute("aria-expanded", willOpen ? "true" : "false");
  }
}

// Expose globally for any caller
window.toggleNavMenu = function(e) {
  if (e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }
  toggleMenu();
};

if (hamburgerBtn && mobileMenu) {
  // Single click handler to guarantee exactly one state toggle per click
  hamburgerBtn.onclick = function(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    toggleMenu();
  };

  // Auto-close on clicking/tapping outside
  document.addEventListener("click", (e) => {
    if (mobileMenu && mobileMenu.classList.contains("open")) {
      if (hamburgerBtn && (hamburgerBtn === e.target || hamburgerBtn.contains(e.target))) {
        return;
      }
      if (mobileMenu === e.target || mobileMenu.contains(e.target)) {
        return;
      }
      toggleMenu(false);
    }
  });

  // Auto-close on Escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu && mobileMenu.classList.contains("open")) {
      toggleMenu(false);
    }
  });
}

// Smooth scroll handler for Diagnostic Studio links
const mobStudio = document.getElementById("mobStudioBtn");
if (mobStudio) {
  mobStudio.addEventListener("click", (e) => {
    e.preventDefault();
    const el = document.getElementById("diagnosticStudio");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    toggleMenu(false);
  });
}

// Modals Setup
const modals = {
  aboutModal: document.getElementById("aboutModal"),
  teamModal: document.getElementById("teamModal"),
  guideModal: document.getElementById("guideModal")
};

function openModal(modalId) {
  const modal = modals[modalId];
  if (!modal) return;
  modal.classList.add("active");
  document.body.classList.add("modal-open");

  // Focus close button or first focusable element for accessibility
  const closeBtn = modal.querySelector(".modal-close-btn");
  if (closeBtn) closeBtn.focus();
}

function closeModal(modalOrId) {
  let modal = null;
  if (typeof modalOrId === "string") {
    modal = modals[modalOrId] || document.getElementById(modalOrId);
  } else {
    modal = modalOrId;
  }
  if (!modal) return;
  modal.classList.remove("active");

  // Check if any other modal is still active
  const anyActive = Object.values(modals).some(m => m && m.classList.contains("active"));
  if (!anyActive) {
    document.body.classList.remove("modal-open");
  }
}

function closeAllModals() {
  Object.values(modals).forEach(m => {
    if (m) m.classList.remove("active");
  });
  document.body.classList.remove("modal-open");
}

// Attach Triggers for About Us
["navAboutBtn", "mobAboutBtn", "footAboutBtn"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("click", () => {
    openModal("aboutModal");
    toggleMenu(false);
  });
});

// Attach Triggers for Our Team
["navTeamBtn", "mobTeamBtn", "footTeamBtn"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("click", () => {
    openModal("teamModal");
    toggleMenu(false);
  });
});

// Attach Triggers for Disease Guide
["navGuideBtn", "mobGuideBtn", "footGuideBtn"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("click", () => {
    openModal("guideModal");
    toggleMenu(false);
  });
});

// Close buttons with [data-close] attribute
document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", () => {
    const targetModalId = btn.getAttribute("data-close");
    closeModal(targetModalId);
  });
});

// Click outside modal box (backdrop click) to dismiss
Object.values(modals).forEach(modal => {
  if (!modal) return;
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
});

// Keyboard Esc key to dismiss any active modal
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.key === "Esc") {
    closeAllModals();
  }
});

// Initialize Tractor Field Telemetry Animation
const tractorContainer = document.getElementById("tractorLottieContainer");
if (tractorContainer && typeof lottie !== "undefined") {
  fetch("/static/tractorAnimation.json")
    .then((res) => res.json())
    .then((animationData) => {
      lottie.loadAnimation({
        container: tractorContainer,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: animationData,
      });
    })
    .catch((err) => {
      console.warn("Could not load local tractor animation JSON:", err);
    });
}

// ---------------------------------------------------------------------------
// Multi-Language Translation Engine (English, Kannada, Hindi)
// ---------------------------------------------------------------------------
const I18N = {
  en: {
    navHeader: "Navigation",
    navBadge: "Menu",
    navStudio: "Diagnostic Studio",
    navGuide: "Disease Guide",
    navAbout: "About Us",
    navTeam: "Our Team",
    brandBadge: "Expert Crop Pathology & Agronomy Advisory",
    headerDesc: "Plant Leaf Disease Detection & Computer Vision Diagnostics Studio",
    inputTitle: "Input Specimen",
    inputSubtitle: "Upload, photograph, or choose a calibrated leaf sample",
    tabUpload: "Upload Photo",
    tabCamera: "Live Camera",
    tabPresets: "Sample Presets",
    dropTitle: "Drag & drop leaf photo here",
    dropDesc: "Supports PNG, JPG, JPEG, WEBP or",
    browseBtn: "Browse Files",
    snapBtn: "Capture Specimen Frame",
    presetsInfo: "Select a calibrated test sample to evaluate model pathology:",
    presetEarlyBlight: "Early Blight",
    presetLateBlight: "Late Blight",
    presetBacterialSpot: "Bacterial Spot",
    presetHealthy: "Healthy Leaf",
    previewTitle: "Current Specimen Preview",
    clearBtn: "Clear",
    analyzeBtn: "Run AI Pathology Analysis",
    growerInstructions: "💡 Grower Instructions",
    tip1: "Ensure the leaf is in focus and well-lit without direct solar glare.",
    tip2: "Take close-ups showing both healthy lamina and lesion margins.",
    tip3: "OpenCV automatically computes affected surface area via HSV filtering.",
    outputTitle: "Pathology & Treatment Prescription",
    outputSubtitle: "OpenCV lesion metrics & agronomic chemical prescription",
    printBtn: "Print Plan",
    copyBtn: "Copy",
    loadingTitle: "Analyzing foliar pathology & OpenCV lesions...",
    loadingSubtitle: "Evaluating HSV color space & retrieving chemical prescription plan",
    emptyTitle: "Awaiting Leaf Specimen",
    emptyDesc: "Upload a photo, capture from webcam, or choose a preset sample to view pathology diagnosis, lesion percentage, and chemical treatment plan.",
    statLesion: "Lesion Surface Area",
    statSeverity: "Pathology Severity",
    statConfidence: "Diagnostic Confidence",
    langChanged: "Language set to English"
  },
  kn: {
    navHeader: "ನ್ಯಾವಿಗೇಷನ್",
    navBadge: "ಮೆನು",
    navStudio: "ರೋಗನಿರ್ಣಯ ಸ್ಟುಡಿಯೋ",
    navGuide: "ರೋಗ ಮಾರ್ಗದರ್ಶಿ",
    navAbout: "ನಮ್ಮ ಬಗ್ಗೆ",
    navTeam: "ನಮ್ಮ ತಂಡ",
    brandBadge: "ತಜ್ಞ ಬೆಳೆ ರೋಗಶಾಸ್ತ್ರ ಮತ್ತು ಕೃಷಿ ಸಲಹೆ",
    headerDesc: "ಸಸ್ಯ ಎಲೆ ರೋಗ ಪತ್ತೆ ಮತ್ತು ಕಂಪ್ಯೂಟರ್ ವಿಷನ್ ರೋಗನಿರ್ಣಯ ಸ್ಟುಡಿಯೋ",
    inputTitle: "ಮಾದರಿ ನಮೂದು",
    inputSubtitle: "ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ, ಲೈವ್ ಕ್ಯಾಮೆರಾ ಬಳಸಿ ಅಥವಾ ಮಾದರಿ ಆಯ್ಕೆಮಾಡಿ",
    tabUpload: "ಫೋಟೋ ಅಪ್‌ಲೋಡ್",
    tabCamera: "ಲೈವ್ ಕ್ಯಾಮೆರಾ",
    tabPresets: "ಪರೀಕ್ಷಾ ಮಾದರಿಗಳು",
    dropTitle: "ಇಲ್ಲಿ ಎಲೆಯ ಫೋಟೋವನ್ನು ಎಳೆದು ಬಿಡಿ",
    dropDesc: "PNG, JPG, JPEG, WEBP ಬೆಂಬಲಿಸುತ್ತದೆ ಅಥವಾ",
    browseBtn: "ಫೈಲ್‌ಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ",
    snapBtn: "ಎಲೆಯ ಫ್ರೇಮ್ ಸೆರೆಹಿಡಿಯಿರಿ",
    presetsInfo: "ಮಾದರಿ ರೋಗಶಾಸ್ತ್ರವನ್ನು ಪರೀಕ್ಷಿಸಲು ಮಾದರಿಯನ್ನು ಆರಿಸಿ:",
    presetEarlyBlight: "ಆರಂಭಿಕ ಬ್ಲೈಟ್ (ಮುಂಚಿನ ರೋಗ)",
    presetLateBlight: "ತಡವಾದ ಬ್ಲೈಟ್ (ಹಿಂಗಾರು ರೋಗ)",
    presetBacterialSpot: "ಬ್ಯಾಕ್ಟೀರಿಯಾದ ಚುಕ್ಕೆ ರೋಗ",
    presetHealthy: "ಆರೋಗ್ಯಕರ ಎಲೆ",
    previewTitle: "ಪ್ರಸ್ತುತ ಮಾದರಿ ಮುನ್ನೋಟ",
    clearBtn: "ತೆರವುಗೊಳಿಸಿ",
    analyzeBtn: "AI ರೋಗಶಾಸ್ತ್ರ ವಿಶ್ಲೇಷಣೆ ನಡೆಸಿ",
    growerInstructions: "💡 ರೈತರಿಗೆ ಸೂಚನೆಗಳು",
    tip1: "ಎಲೆಯು ನೇರ ಸೂರ್ಯನ ಬೆಳಕಿಲ್ಲದೆ ಸ್ಪಷ್ಟವಾಗಿ ಮತ್ತು ಉತ್ತಮ ಬೆಳಕಿನಲ್ಲಿರಲಿ.",
    tip2: "ಆರೋಗ್ಯಕರ ಭಾಗ ಮತ್ತು ರೋಗದ ಲಕ್ಷಣಗಳು ಎರಡೂ ಕಾಣಿಸುವಂತೆ ಕ್ಲೋಸ್-ಅಪ್ ಫೋಟೋ ತೆಗೆಯಿರಿ.",
    tip3: "OpenCV ತಂತ್ರಜ್ಞಾನವು ಪೀಡಿತ ಮೇಲ್ಮೈ ವಿಸ್ತೀರ್ಣವನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಲೆಕ್ಕಾಚಾರ ಮಾಡುತ್ತದೆ.",
    outputTitle: "ರೋಗನಿರ್ಣಯ ಮತ್ತು ಚಿಕಿತ್ಸಾ ಶಿಫಾರಸು",
    outputSubtitle: "OpenCV ಲಕ್ಷಣ ಮಾಪನಗಳು ಮತ್ತು ಕೃಷಿ ರಾಸಾಯನಿಕ ಚಿಕಿತ್ಸಾ ಯೋಜನೆ",
    printBtn: "ಯೋಜನೆ ಮುದ್ರಿಸಿ",
    copyBtn: "ನಕಲಿಸಿ",
    loadingTitle: "ಎಲೆಯ ರೋಗಶಾಸ್ತ್ರ ಮತ್ತು ಗಾಯಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    loadingSubtitle: "HSV ಬಣ್ಣ ಜಾಗವನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಲಾಗುತ್ತಿದೆ ಮತ್ತು ರಾಸಾಯನಿಕ ಯೋಜನೆಯನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ",
    emptyTitle: "ಎಲೆಯ ಮಾದರಿಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ",
    emptyDesc: "ರೋಗನಿರ್ಣಯ, ಹಾನಿಯ ಶೇಕಡಾವಾರು ಮತ್ತು ಚಿಕಿತ್ಸಾ ಯೋಜನೆಯನ್ನು ವೀಕ್ಷಿಸಲು ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ, ಕ್ಯಾಮೆರಾ ಬಳಸಿ ಅಥವಾ ಸ್ಯಾಂಪಲ್ ಆಯ್ಕೆಮಾಡಿ.",
    statLesion: "ಪೀಡಿತ ಮೇಲ್ಮೈ ವಿಸ್ತೀರ್ಣ",
    statSeverity: "ರೋಗದ ತೀವ್ರತೆ",
    statConfidence: "ರೋಗನಿರ್ಣಯದ ನಿಖರತೆ",
    langChanged: "ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ"
  },
  hi: {
    navHeader: "नेविगेशन",
    navBadge: "मेनू",
    navStudio: "निदान स्टूडियो",
    navGuide: "रोग मार्गदर्शिका",
    navAbout: "हमारे बारे में",
    navTeam: "हमारी टीम",
    brandBadge: "विशेषज्ञ फसल विकृति विज्ञान एवं कृषि परामर्श",
    headerDesc: "पादप पत्ती रोग पहचान एवं कंप्यूटर विज़न निदान स्टूडियो",
    inputTitle: "पत्ती का नमूना",
    inputSubtitle: "फोटो अपलोड करें, कैमरे से कैप्चर करें या टेस्ट सैंपल चुनें",
    tabUpload: "फोटो अपलोड",
    tabCamera: "लाइव कैमरा",
    tabPresets: "नमूना प्रिसेट्स",
    dropTitle: "पत्ती की तस्वीर यहाँ खींचकर छोड़ें",
    dropDesc: "PNG, JPG, JPEG, WEBP समर्थित या",
    browseBtn: "फ़ाइलें चुनें",
    snapBtn: "नमूना फ़्रेम कैप्चर करें",
    presetsInfo: "मॉडल पैथोलॉजी का मूल्यांकन करने के लिए एक नमूना चुनें:",
    presetEarlyBlight: "अगेती झुलसा (Early Blight)",
    presetLateBlight: "पछेती झुलसा (Late Blight)",
    presetBacterialSpot: "जीवाणु धब्बा रोग (Bacterial Spot)",
    presetHealthy: "स्वस्थ पत्ती (Healthy Leaf)",
    previewTitle: "वर्तमान नमूना पूर्वावलोकन",
    clearBtn: "हटाएं",
    analyzeBtn: "AI पैथोलॉजी विश्लेषण शुरू करें",
    growerInstructions: "💡 किसान निर्देश",
    tip1: "सुनिश्चित करें कि पत्ती फोकस में हो और उस पर सीधी तेज धूप न पड़ रही हो।",
    tip2: "स्वस्थ सतह और रोगग्रस्त धब्बे दोनों को दर्शाने वाले क्लोज़-अप फोटो लें।",
    tip3: "OpenCV स्वचालित रूप से प्रभावित सतह क्षेत्र की गणना करता है।",
    outputTitle: "रोग निदान एवं उपचार परामर्श",
    outputSubtitle: "OpenCV घाव मेट्रिक्स और कृषि रासायनिक उपचार योजना",
    printBtn: "प्रिंट करें",
    copyBtn: "कॉपी करें",
    loadingTitle: "पत्ती विकृति विज्ञान एवं घावों का विश्लेषण हो रहा है...",
    loadingSubtitle: "HSV रंग स्थान का मूल्यांकन और रासायनिक नुस्खे प्राप्त हो रहे हैं",
    emptyTitle: "पत्ती के नमूने की प्रतीक्षा है",
    emptyDesc: "रोग निदान, प्रभावित क्षेत्र प्रतिशत और रासायनिक उपचार योजना देखने के लिए फोटो अपलोड करें, कैमरे से लें या नमूना चुनें।",
    statLesion: "प्रभावित सतह क्षेत्र",
    statSeverity: "रोग की गंभीरता",
    statConfidence: "निदान सटीकता",
    langChanged: "भाषा बदलकर हिंदी कर दी गई है"
  }
};

let currentAppLanguage = "en";

function setAppLanguage(lang) {
  if (!I18N[lang]) lang = "en";
  currentAppLanguage = lang;
  document.documentElement.lang = lang;

  const dict = I18N[lang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  const langSelect = document.getElementById("languageSelect");
  if (langSelect && langSelect.value !== lang) {
    langSelect.value = lang;
  }

  try {
    localStorage.setItem("florascan_language", lang);
  } catch (e) {
    console.warn("Could not save language to localStorage", e);
  }
}

// Attach change listener to dropdown
const languageSelect = document.getElementById("languageSelect");
if (languageSelect) {
  languageSelect.addEventListener("change", (e) => {
    const chosenLang = e.target.value;
    setAppLanguage(chosenLang);
    showToast(I18N[chosenLang]?.langChanged || "Language updated");
  });
}

// Restore saved language on load
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("florascan_language") || "en";
  setAppLanguage(savedLang);
});

// Immediate execution in case DOM is already loaded
const initSavedLang = localStorage.getItem("florascan_language") || "en";
setAppLanguage(initSavedLang);

// ========================================================
// THEME TOGGLE CONTROLLER (Dark / Light Mode)
// ========================================================
function applyTheme(theme) {
  const root = document.documentElement;
  const toggleBtn = document.getElementById("themeToggleBtn");
  if (theme === "dark") {
    root.classList.add("dark");
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-checked", "true");
      toggleBtn.setAttribute("aria-label", "Switch to light mode");
      toggleBtn.setAttribute("title", "Switch to Light Mode");
    }
  } else {
    root.classList.remove("dark");
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-checked", "false");
      toggleBtn.setAttribute("aria-label", "Switch to dark mode");
      toggleBtn.setAttribute("title", "Switch to Dark Mode");
    }
  }
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {
    console.warn("Could not save theme to localStorage", e);
  }
}

function initTheme() {
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem("theme");
  } catch (e) {}

  if (savedTheme === "dark" || savedTheme === "light") {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    applyTheme("light");
  } else {
    applyTheme("dark");
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains("dark");
  const nextTheme = isDark ? "light" : "dark";
  applyTheme(nextTheme);
  showToast(nextTheme === "dark" ? "🌙 Dark Mode Activated" : "☀️ Light Mode Activated");
}

initTheme();
document.addEventListener("DOMContentLoaded", initTheme);




