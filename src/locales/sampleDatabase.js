// src/locales/sampleDatabase.js
// Localized Pathology Knowledge Base for Presets & Diagnosis Results

export const LOCALIZED_PRESETS = {
  Early_Blight: {
    en: {
      disease: "Early Blight",
      scientific_name: "Alternaria solani",
      status: "Infected",
      severity: "Moderate",
      confidence: 94.8,
      affected_area_pct: 18.2,
      crop: "Tomato",
      symptoms: [
        "Concentric circular bullseye rings on mature lower leaves.",
        "Yellow chlorotic halos surrounding expanding necrotic lesions.",
        "Upward progressing foliar defoliation under high humidity.",
        "Dark, sunken leathery lesions near fruit stem attachments."
      ],
      chemical_overview: "Foliar fungal pathogen Alternaria solani. Apply FRAC Group 11 (QoI) or Group 3 (DMI) systemic fungicides rotated with multi-site protectant contact chemistry.",
      tank_mix: "Azoxystrobin 1.0 ml/L or Difenoconazole 0.5 ml/L tank-mixed with Chlorothalonil 2.0 g/L or Mancozeb 2.0 g/L.",
      organic_remedy: "Prune infected lower foliage immediately and incinerate. Apply Bacillus subtilis bio-fungicide or copper octanoate spray every 7–10 days.",
      cultural_remedy: "Avoid overhead sprinkler irrigation; stake vines; maintain 60cm row spacing for ventilation; sanitize pruning shears with 70% alcohol.",
      spraying_schedule: {
        frequency: "Spray every 7 to 10 days during warm/humid spells (>80% RH, 24–29°C); extend to 10–14 days in dry weather.",
        resistance_stewardship: "Maximum 2 consecutive single-site fungicide applications before rotating to multi-site contact protectant."
      }
    },
    kn: {
      disease: "ಆರಂಭಿಕ ರೋಗ (Early Blight)",
      scientific_name: "Alternaria solani",
      status: "ಸೋಂಕಿತ (Infected)",
      severity: "ಮಧ್ಯಮ (Moderate)",
      confidence: 94.8,
      affected_area_pct: 18.2,
      crop: "ಟೊಮ್ಯಾಟೊ (Tomato)",
      symptoms: [
        "ಹಳೆಯ ಕೆಳಗಿನ ಎಲೆಗಳ ಮೇಲೆ ಏಕಕೇಂದ್ರಕ ಉಂಗುರದಂತಹ (ಗುರಿ ಚುಕ್ಕೆಗಳ) ಗಾಯಗಳು.",
        "ವಿಸ್ತರಿಸುವ ಗಾಯಗಳ ಸುತ್ತಲೂ ಹಳದಿ ಬಣ್ಣದ ವಲಯ (ಕ್ಲೋರೋಟಿಕ್ ಹಾಲೋ).",
        "ಹೆಚ್ಚಿನ ತೇವಾಂಶದಲ್ಲಿ ಕೆಳಗಿನಿಂದ ಮೇಲಕ್ಕೆ ಹರಡುವ ಎಲೆ ಉದುರುವಿಕೆ.",
        "ಹಣ್ಣಿನ ತೊಟ್ಟಿನ ಬಳಿ ಕಪ್ಪು, ಕುಸಿದ ಚರ್ಮದಂತಹ ಕಲೆಗಳು."
      ],
      chemical_overview: "ಶಿಲೀಂಧ್ರ ರೋಗಕಾರಕ ಆಲ್ಟರ್ನೇರಿಯಾ ಸೊಲಾನಿ. ಕ್ಯುಒಐ (QoI) ಅಥವಾ ಡಿಎಂಐ (DMI) ವ್ಯವಸ್ಥಿತ ಶಿಲೀಂಧ್ರನಾಶಕಗಳ ಜೊತೆಗೆ ಬಹು-ತಾಣ ರಕ್ಷಣಾತ್ಮಕ ಸಿಂಪಡಣೆಯನ್ನು ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.",
      tank_mix: "ಅಜೋಕ್ಸಿಸ್ಟ್ರೋಬಿನ್ (1.0 ಮಿಲಿ/ಲೀ) ಅಥವಾ ಡೈಫೆನೊಕೊನಜೋಲ್ (0.5 ಮಿಲಿ/ಲೀ) ಜೊತೆಗೆ ಮ್ಯಾಂಕೋಜೆಬ್ (2.0 ಗ್ರಾಂ/ಲೀ) ಅಥವಾ ಕ್ಲೋರೋಥಲೋನಿಲ್ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ.",
      organic_remedy: "ಸೋಂಕಿತ ಕೆಳಗಿನ ಎಲೆಗಳನ್ನು ತಕ್ಷಣ ಕತ್ತರಿಸಿ ಸುಟ್ಟುಹಾಕಿ. ಬ್ಯಾಸಿಲಸ್ ಸಬ್ಟಿಲಿಸ್ ಜೈವಿಕ ಶಿಲೀಂಧ್ರನಾಶಕ ಅಥವಾ ತಾಮ್ರದ ಸೋಪ್ ಅನ್ನು ಪ್ರತಿ 7–10 ದಿನಗಳಿಗೊಮ್ಮೆ ಸಿಂಪಡಿಸಿ.",
      cultural_remedy: "ಮೇಲಿನಿಂದ ನೀರುಣಿಸುವುದನ್ನು ತಪ್ಪಿಸಿ (ಹನಿ ನೀರಾವರಿ ಬಳಸಿ); ಗಿಡಗಳ ನಡುವೆ 60 ಸೆಂ.ಮೀ ಅಂತರವಿರಲಿ; ಕತ್ತರಿಸುವ ಕತ್ತರಿಗಳನ್ನು 70% ಆಲ್ಕೋಹಾಲ್‌ನಿಂದ ಸ್ವಚ್ಛಗೊಳಿಸಿ.",
      spraying_schedule: {
        frequency: "ಬೆಚ್ಚನೆಯ ಮತ್ತು ಆರ್ದ್ರ ವಾತಾವರಣದಲ್ಲಿ ಪ್ರತಿ 7 ರಿಂದ 10 ದಿನಗಳಿಗೊಮ್ಮೆ ಸಿಂಪಡಿಸಿ; ಒಣ ವಾತಾವರಣದಲ್ಲಿ 10-14 ದಿನಗಳಿಗೆ ವಿಸ್ತರಿಸಿ.",
        resistance_stewardship: "ರಾಸಾಯನಿಕ ಪ್ರತಿರೋಧ ತಡೆಯಲು ಬಹು-ತಾಣ ರಕ್ಷಕಕ್ಕೆ ಬದಲಾಯಿಸುವ ಮೊದಲು ಗರಿಷ್ಠ 2 ಸತತ ಏಕ-ತಾಣ ಸಿಂಪಡಣೆಗಳು."
      }
    },
    hi: {
      disease: "अगेती झुलसा (Early Blight)",
      scientific_name: "Alternaria solani",
      status: "संक्रमित (Infected)",
      severity: "मध्यम (Moderate)",
      confidence: 94.8,
      affected_area_pct: 18.2,
      crop: "टमाटर (Tomato)",
      symptoms: [
        "परिपक्व निचली पत्तियों पर संकेंद्री छल्लेदार (बुलआई) भूरे-काले धब्बे।",
        "फैलते हुए घावों के चारों ओर पीले रंग का घेरा (क्लोरोटिक हेलो)।",
        "उच्च आर्द्रता में पत्तियों का पीला पड़कर नीचे से ऊपर की ओर झड़ना।",
        "फलों के डंठल के पास काले, धंसे हुए चमड़े जैसे घाव।"
      ],
      chemical_overview: "कवक रोगज़नक़ अल्टरनेरिया सोलानी। व्यापक नियंत्रण के लिए बहु-साइट सुरक्षात्मक कवकनाशी के साथ QoI या DMI प्रणालीगत कवकनाशी का प्रयोग करें।",
      tank_mix: "एज़ोक्सीस्ट्रोबिन (1.0 मिली/लीटर) या डिफेनोकोनाज़ोल (0.5 मिली/लीटर) + मैंकोज़ेब (2.0 ग्राम/लीटर) पानी में मिलाकर छिड़कें।",
      organic_remedy: "संक्रमित निचली पत्तियों को तुरंत काटकर नष्ट कर दें। बैसिलस सबटिलिस जैव-कवकनाशी या कॉपर सोप का स्प्रे हर 7–10 दिनों में करें।",
      cultural_remedy: "ऊपर से सिंचाई से बचें (ड्रिप सिंचाई का उपयोग करें); 60 सेमी पंक्ति अंतर बनाए रखें; छंटाई उपकरणों को 70% अल्कोहल से साफ करें।",
      spraying_schedule: {
        frequency: "गर्म और आर्द्र मौसम में हर 7 से 10 दिनों में छिड़काव करें; सूखे मौसम में 10-14 दिनों तक बढ़ाएं।",
        resistance_stewardship: "मल्टी-साइट रक्षक पर जाने से पहले अधिकतम 2 लगातार एकल-साइट स्प्रे करें।"
      }
    }
  },

  Late_Blight: {
    en: {
      disease: "Late Blight",
      scientific_name: "Phytophthora infestans",
      status: "Infected",
      severity: "Critical",
      confidence: 96.2,
      affected_area_pct: 32.5,
      crop: "Potato / Tomato",
      symptoms: [
        "Large, irregular water-soaked pale green to dark brown lesions.",
        "White velvet-like fungal down appearing on leaf undersides under high humidity.",
        "Blackened vine stems collapsing rapidly in cool, saturated conditions.",
        "Firm, brown leathery decay on developing fruit and tubers."
      ],
      chemical_overview: "Fast-acting oomycete water-mold disease. Requires emergency systemic anti-oomycete chemistries to arrest rapid canopy rot, stem collapse, and spore dissemination.",
      tank_mix: "Metalaxyl-M + Mancozeb (Ridomil Gold MZ 68 WG) 2.5 g/L or Cymoxanil + Famoxadone (Equation Pro) 0.5 g/L.",
      organic_remedy: "Quarantine and destroy infected plants immediately. Spray preventive Bordeaux mixture (copper sulfate + lime) on surrounding buffer zone.",
      cultural_remedy: "Destroy cull piles; practice 3-year crop rotation away from solanaceous species; plant certified pathogen-free certified seed potatoes/seedlings.",
      spraying_schedule: {
        frequency: "Emergency frequency: Apply every 5 to 7 days during cool, saturated overcast weather (15–20°C, >90% RH).",
        resistance_stewardship: "Limit phenylamide (Group 4) to 2 sprays per cropping season. Always alternate with non-cross-resistant modes."
      }
    },
    kn: {
      disease: "ತಡವಾದ ಅಂಗಮಾರಿ ರೋಗ (Late Blight)",
      scientific_name: "Phytophthora infestans",
      status: "ಸೋಂಕಿತ (Infected)",
      severity: "ತೀವ್ರ ತುರ್ತು (Critical)",
      confidence: 96.2,
      affected_area_pct: 32.5,
      crop: "ಆಲೂಗಡ್ಡೆ / ಟೊಮ್ಯಾಟೊ",
      symptoms: [
        "ಎಲೆಗಳ ಮೇಲೆ ನೀರಿನಿಂದ ನೆನೆದಂತಹ ದೊಡ್ಡ, ಅನಿಯಮಿತ ಕಡು ಕಂದು ಕಲೆಗಳು.",
        "ಹೆಚ್ಚಿನ ತೇವಾಂಶದಲ್ಲಿ ಎಲೆಯ ಕೆಳಭಾಗದಲ್ಲಿ ಬಿಳಿ ಬೂಸ್ಟಿನಂತಹ ಪದರ.",
        "ಕಾಂಡ ಕೊಳೆಯುವುದು ಮತ್ತು ಇಡೀ ಸಸ್ಯವು ತಕ್ಷಣವೇ ಕುಸಿಯುವುದು.",
        "ಆಲೂಗಡ್ಡೆ ಗೆಡ್ಡೆಗಳು ಮತ್ತು ಹಣ್ಣುಗಳ ಒಳಗೆ ಕಂದು ಬಣ್ಣದ ಕೊಳೆತ."
      ],
      chemical_overview: "ಅತ್ಯಂತ ವೇಗವಾಗಿ ಹರಡುವ ಊಮೈಸೀಟ್ ಜಲ-ಶಿಲೀಂಧ್ರ ರೋಗ. ಹಾನಿಯನ್ನು ತಡೆಯಲು ಮೆಟಲಾಕ್ಸಿಲ್-ಎಂ ಅಥವಾ ಸೈಮೋಕ್ಸಾನಿಲ್‌ನಂತಹ ತುರ್ತು ವ್ಯವಸ್ಥಿತ ರಸಾಯನಶಾಸ್ತ್ರದ ಅಗತ್ಯವಿದೆ.",
      tank_mix: "ಮೆಟಲಾಕ್ಸಿಲ್-ಎಂ + ಮ್ಯಾಂಕೋಜೆಬ್ (ರೆಡೋಮಿಲ್ ಗೋಲ್ಡ್ 2.5 ಗ್ರಾಂ/ಲೀ) ಅಥವಾ ಸೈಮೋಕ್ಸಾನಿಲ್ + ಫೆಮೊಕ್ಸಾಡೋನ್ (0.5 ಗ್ರಾಂ/ಲೀ) ಸಿಂಪಡಿಸಿ.",
      organic_remedy: "ಸೋಂಕಿತ ಗಿಡಗಳನ್ನು ತಕ್ಷಣ ಪ್ರತ್ಯೇಕಿಸಿ ನಾಶಪಡಿಸಿ. ಸುತ್ತಮುತ್ತಲಿನ ಆರೋಗ್ಯಕರ ವಲಯಕ್ಕೆ ತಡೆಗೋಡೆಯಾಗಿ ಬೋರ್ಡೊ ಮಿಶ್ರಣವನ್ನು ಸಿಂಪಡಿಸಿ.",
      cultural_remedy: "ಸೋಂಕಿತ ಆಲೂಗಡ್ಡೆ ರಾಶಿಗಳನ್ನು ನಾಶಮಾಡಿ; 3 ವರ್ಷಗಳ ಬೆಳೆ ಪರಿವರ್ತನೆ ಅನುಸರಿಸಿ; ಪ್ರಮಾಣೀಕೃತ ರೋಗಮುಕ್ತ ಬಿತ್ತನೆ ಬೀಜಗಳನ್ನು ಬಳಸಿ.",
      spraying_schedule: {
        frequency: "ತುರ್ತು ಪರಿಸ್ಥಿತಿ: ತಂಪಾದ, ಮೋಡ ಕವಿದ ಮತ್ತು ತೇವ ವಾತಾವರಣದಲ್ಲಿ ಪ್ರತಿ 5 ರಿಂದ 7 ದಿನಗಳಿಗೊಮ್ಮೆ ಸಿಂಪಡಿಸಿ.",
        resistance_stewardship: "ಪ್ರತಿ ಋತುವಿನಲ್ಲಿ ಫಿನೈಲಾಮೈಡ್ (ಗ್ರೂಪ್ 4) ಸಿಂಪಡಣೆಯನ್ನು ಗರಿಷ್ಠ 2 ಬಾರಿಗೆ ಸೀಮಿತಗೊಳಿಸಿ."
      }
    },
    hi: {
      disease: "पछेती झुलसा (Late Blight)",
      scientific_name: "Phytophthora infestans",
      status: "संक्रमित (Infected)",
      severity: "अति गंभीर (Critical)",
      confidence: 96.2,
      affected_area_pct: 32.5,
      crop: "आलू / टमाटर",
      symptoms: [
        "पत्तियों पर पानी से भीगे हुए बड़े, अनियमित हल्के हरे से गहरे भूरे रंग के धब्बे।",
        "उच्च आर्द्रता (>90%) में पत्ती की निचली सतह पर सफेद मखमली फफूंद।",
        "तनों का तेजी से काला पड़ना और पूरी बेल का अचानक मुरझाना।",
        "टमाटर के फलों और आलू के कंदों पर कठोर, भूरा चमड़े जैसा सड़ांध।"
      ],
      chemical_overview: "अति तीव्र ओमीसीट जल-फफूंद रोग। फसल को नष्ट होने से बचाने के लिए मेटालैक्सिल-एम या साइमोक्सानिल जैसे आपातकालीन प्रणालीगत रसायनों की आवश्यकता होती है।",
      tank_mix: "मेटालैक्सिल-एम + मैंकोज़ेब (रिडोमिल गोल्ड 2.5 ग्राम/लीटर) या साइमोक्सानिल + फैमोक्साडोन (0.5 ग्राम/लीटर)।",
      organic_remedy: "संक्रमित पौधों को तुरंत उखाड़कर नष्ट करें। आसपास के स्वस्थ पौधों पर बोर्डो मिश्रण (कॉपर सल्फेट + चूना) का छिड़काव करें।",
      cultural_remedy: "संक्रमित मलबे को नष्ट करें; 3 साल का फसल चक्र अपनाएं; प्रमाणित रोगमुक्त बीज आलू का ही उपयोग करें।",
      spraying_schedule: {
        frequency: "आपातकालीन छिड़काव: ठंडे, आर्द्र मौसम में हर 5 से 7 दिनों में छिड़काव करें।",
        resistance_stewardship: "प्रति फसल सीजन में फिनाइलमाइड स्प्रे को अधिकतम 2 बार तक सीमित रखें।"
      }
    }
  },

  Bacterial_Spot: {
    en: {
      disease: "Bacterial Spot",
      scientific_name: "Xanthomonas perforans",
      status: "Infected",
      severity: "Moderate",
      confidence: 91.5,
      affected_area_pct: 12.4,
      crop: "Pepper / Tomato",
      symptoms: [
        "Small, angular, greasy water-soaked specks (1–3mm) on foliage.",
        "Centers tear and drop out, creating a characteristic shot-hole pattern.",
        "Premature leaf drop and blossom blight leading to sunscald on fruit.",
        "Rough, scabby raised lesions with brown halos on fruit surfaces."
      ],
      chemical_overview: "Bacterial pathogen not managed by synthetic fungal QoI/DMI inhibitors. Requires fixed copper bactericide formulations synergized with Mancozeb to release free cupric ions.",
      tank_mix: "Copper Hydroxide (Kocide 3000) 1.5–2.0 g/L tank-mixed with Mancozeb (Dithane M-45) 1.5 g/L.",
      organic_remedy: "Sanitize crop debris thoroughly; apply Bacillus amyloliquefaciens bio-bactericide every 7 days.",
      cultural_remedy: "Avoid working in fields when foliage is wet; switch to drip irrigation; plant certified resistant cultivars.",
      spraying_schedule: {
        frequency: "Apply every 5 to 7 days during warm rainy conditions; extend to 10 days in dry weather.",
        resistance_stewardship: "Do not rely on copper alone in regions with copper-resistant Xanthomonas strains."
      }
    },
    kn: {
      disease: "ಬ್ಯಾಕ್ಟೀರಿಯಾದ ಚುಕ್ಕೆ ರೋಗ (Bacterial Spot)",
      scientific_name: "Xanthomonas perforans",
      status: "ಸೋಂಕಿತ (Infected)",
      severity: "ಮಧ್ಯಮ (Moderate)",
      confidence: 91.5,
      affected_area_pct: 12.4,
      crop: "ಮೆಣಸಿನಕಾಯಿ / ಟೊಮ್ಯಾಟೊ",
      symptoms: [
        "ಎಲೆಗಳ ಮೇಲೆ ಸಣ್ಣ, ಕೋನೀಯ, ಜಿಡ್ಡಿನಂತಹ ನೀರಿನ ಚುಕ್ಕೆಗಳು (1–3 ಮಿ.ಮೀ).",
        "ಕಲೆಗಳ ಕೇಂದ್ರ ಭಾಗವು ಒಡೆದು ರಂಧ್ರಗಳಾಗುವುದು (ಶಾಟ್-ಹೋಲ್ ಮಾದರಿ).",
        "ಎಲೆಗಳು ಅಕಾಲಿಕವಾಗಿ ಹಳದಿಯಾಗಿ ಉದುರುವುದು ಮತ್ತು ಹೂವುಗಳು ಉದುರುವುದು.",
        "ಹಣ್ಣಿನ ಮೇಲೆ ಗಾಯಗಳು ಮತ್ತು ಒರಟಾದ ಕಂದು ಬಣ್ಣದ ಚುಕ್ಕೆಗಳು."
      ],
      chemical_overview: "ಬ್ಯಾಕ್ಟೀರಿಯಾದ ರೋಗಕಾರಕ. ತಾಮ್ರದ ಹೈಡ್ರಾಕ್ಸೈಡ್ ಜೊತೆಗೆ ಮ್ಯಾಂಕೋಜೆಬ್ ಮಿಶ್ರಣವು ಮುಕ್ತ ತಾಮ್ರದ ಅಯಾನುಗಳನ್ನು ಬಿಡುಗಡೆ ಮಾಡಿ ರೋಗಾಣುಗಳನ್ನು ನಿಯಂತ್ರಿಸುತ್ತದೆ.",
      tank_mix: "ಕಾಪರ್ ಹೈಡ್ರಾಕ್ಸೈಡ್ (2.0 ಗ್ರಾಂ/ಲೀ) + ಮ್ಯಾಂಕೋಜೆಬ್ (1.5 ಗ್ರಾಂ/ಲೀ) ನೀರಿನೊಂದಿಗೆ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ.",
      organic_remedy: "ಬೆಳೆ ಅವಶೇಷಗಳನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಸ್ವಚ್ಛಗೊಳಿಸಿ; ಪ್ರತಿ 7 ದಿನಗಳಿಗೊಮ್ಮೆ ಬ್ಯಾಸಿಲಸ್ ಜೈವಿಕ ಬ್ಯಾಕ್ಟೀರಿಯಾನಾಶಕ ಸಿಂಪಡಿಸಿ.",
      cultural_remedy: "ಎಲೆಗಳು ತೇವವಾಗಿರುವಾಗ ಹೊಲದಲ್ಲಿ ಕೆಲಸ ಮಾಡಬೇಡಿ; ಹನಿ ನೀರಾವರಿ ಬಳಸಿ; ರೋಗ ಪ್ರತಿರೋಧಕ ತಳಿಗಳನ್ನು ಬೆಳೆಯಿರಿ.",
      spraying_schedule: {
        frequency: "ಬೆಚ್ಚನೆಯ ಮಳೆಯ ವಾತಾವರಣದಲ್ಲಿ ಪ್ರತಿ 5 ರಿಂದ 7 ದಿನಗಳಿಗೊಮ್ಮೆ ಸಿಂಪಡಿಸಿ; ಒಣ ಹವೆಯಲ್ಲಿ 10 ದಿನಗಳಿಗೆ ವಿಸ್ತರಿಸಿ.",
        resistance_stewardship: "ಪ್ರತಿರೋಧ ಬೆಳೆದಿರುವ ಪ್ರದೇಶಗಳಲ್ಲಿ ಕೇವಲ ತಾಮ್ರದ ಮೇಲೆ ಮಾತ್ರ ಅವಲಂಬಿತರಾಗಬೇಡಿ."
      }
    },
    hi: {
      disease: "जीवाणु धब्बा रोग (Bacterial Spot)",
      scientific_name: "Xanthomonas perforans",
      status: "संक्रमित (Infected)",
      severity: "मध्यम (Moderate)",
      confidence: 91.5,
      affected_area_pct: 12.4,
      crop: "मिर्च / टमाटर",
      symptoms: [
        "पत्तियों पर छोटे, कोणीय, तैलीय पानी से भीगे धब्बे (1-3 मिमी)।",
        "धब्बों का केंद्र सूखकर गिरना जिससे पत्तियों में छर्रे जैसे छेद (शॉट-होल) बन जाते हैं।",
        "पत्तियों और फूलों का समय से पहले झड़ना, जिससे फलों पर धूप की क्षति होती है।",
        "फलों पर खुरदुरे, उभरे हुए पपड़ीदार भूरे धब्बे।"
      ],
      chemical_overview: "जीवाणु रोगज़नक़। कॉपर हाइड्रॉक्साइड को मैंकोज़ेब के साथ मिलाने से मुक्त तांबे के आयन निकलते हैं जो जीवाणु झिल्ली को प्रभावी ढंग से नष्ट करते हैं।",
      tank_mix: "कॉपर हाइड्रॉक्साइड (2.0 ग्राम/लीटर) + मैंकोज़ेब (1.5 ग्राम/लीटर)।",
      organic_remedy: "खेत से फसल अवशेषों को पूरी तरह हटाएं; हर 7 दिनों में बैसिलस जैव-जीवाणुनाशक का छिड़काव करें।",
      cultural_remedy: "पत्तियां गीली होने पर खेत में काम न करें; ड्रिप सिंचाई अपनाएं; रोग प्रतिरोधी किस्मों की बुवाई करें।",
      spraying_schedule: {
        frequency: "गर्म और बरसात के मौसम में हर 5 से 7 दिनों में छिड़काव करें।",
        resistance_stewardship: "तांबे के प्रति प्रतिरोधी क्षेत्रों में केवल तांबे पर निर्भर न रहें।"
      }
    }
  },

  Rose_Black_Spot: {
    en: {
      disease: "Rose Black Spot",
      scientific_name: "Diplocarpon rosae",
      status: "Infected",
      severity: "Moderate",
      confidence: 93.4,
      affected_area_pct: 14.8,
      crop: "Rose / Ornamental",
      symptoms: [
        "Circular dark purple-brown to pitch-black spots with feathery fringed margins.",
        "Yellow chlorotic halos coalesce, leading to severe premature leaflet drop.",
        "Infections progress strictly upwards from lower shaded canopy leaves.",
        "Weakened canes produce significantly fewer and smaller blooms."
      ],
      chemical_overview: "Foliar fungal pathogen Diplocarpon rosae. Apply curative systemic triazoles (FRAC 3) or strobilurins (FRAC 11) rotated with multi-site contact protectants.",
      tank_mix: "Myclobutanil 1.0 ml/L or Tebuconazole 1.0 ml/L tank-mixed with Mancozeb 2.0 g/L.",
      organic_remedy: "Potassium bicarbonate (3g/L) + horticultural neem oil (5ml/L) or Bacillus subtilis spray every 7 days.",
      cultural_remedy: "Water at the base using drip irrigation; prune center to open vase shape; rake and destroy all fallen leaves.",
      spraying_schedule: {
        frequency: "Spray every 7 to 10 days during warm humid weather; repeat after overhead rains.",
        resistance_stewardship: "Rotate between FRAC 3 and FRAC 11 classes to prevent fungicide resistance."
      }
    },
    kn: {
      disease: "ಗುಲಾಬಿ ಕಪ್ಪು ಚುಕ್ಕೆ ರೋಗ (Rose Black Spot)",
      scientific_name: "Diplocarpon rosae",
      status: "ಸೋಂಕಿತ (Infected)",
      severity: "ಮಧ್ಯಮ (Moderate)",
      confidence: 93.4,
      affected_area_pct: 14.8,
      crop: "ಗುಲಾಬಿ (Rose)",
      symptoms: [
        "ಗರಿಗಳಂತಹ ನಾರಿನ ಅಂಚುಗಳಿರುವ ಕಡು ಕಪ್ಪು ಬಣ್ಣದ ವೃತ್ತಾಕಾರದ ಚುಕ್ಕೆಗಳು.",
        "ಕಪ್ಪು ಚುಕ್ಕೆಗಳ ಸುತ್ತಲೂ ಹಳದಿ ವಲಯ ಮತ್ತು ಎಲೆಗಳ ಶೀಘ್ರ ಪತನ.",
        "ಕೆಳಗಿನಿಂದ ಮೇಲಕ್ಕೆ ಹರಡುವ ಎಲೆ ಉದುರುವಿಕೆ.",
        "ಗಿಡವು ಬಲಹೀನವಾಗಿ ಕಡಿಮೆ ಹೂವುಗಳು ಬಿಡುವುದು."
      ],
      chemical_overview: "ಗುಲಾಬಿಯ ಸಾಮಾನ್ಯ ಶಿಲೀಂಧ್ರ ರೋಗ. ಮೈಕ್ಲೋಬುಟಾನಿಲ್ ಅಥವಾ ಟೆಬುಕೊನಜೋಲ್ ನಂತಹ ಶಿಲೀಂಧ್ರನಾಶಕಗಳನ್ನು ಮ್ಯಾಂಕೋಜೆಬ್ ಜೊತೆ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ.",
      tank_mix: "ಮೈಕ್ಲೋಬುಟಾನಿಲ್ (1.0 ಮಿಲಿ/ಲೀ) ಅಥವಾ ಟೆಬುಕೊನಜೋಲ್ (1.0 ಮಿಲಿ/ಲೀ) ಜೊತೆಗೆ ಮ್ಯಾಂಕೋಜೆಬ್ (2.0 ಗ್ರಾಂ/ಲೀ).",
      organic_remedy: "ಪೊಟ್ಯಾಸಿಯಮ್ ಬೈಕಾರ್ಬನೇಟ್ (3 ಗ್ರಾಂ/ಲೀ) + ತೋಟಗಾರಿಕಾ ಬೇವಿನ ಎಣ್ಣೆ (5 ಮಿಲಿ/ಲೀ) ಅನ್ನು ಪ್ರತಿ 7 ದಿನಗಳಿಗೊಮ್ಮೆ ಸಿಂಪಡಿಸಿ.",
      cultural_remedy: "ಗಿಡದ ಬುಡಕ್ಕೆ ಮಾತ್ರ ನೀರುಣಿಸಿ; ಒಣಗಿದ ಮತ್ತು ಬಿದ್ದ ಎಲೆಗಳನ್ನು ತೆಗೆದು ಸುಟ್ಟುಹಾಕಿ; ಗಿಡಕ್ಕೆ ಗಾಳಿ-ಬೆಳಕು ಸಿಗುವಂತೆ ಕತ್ತರಿಸಿ.",
      spraying_schedule: {
        frequency: "ಬೆಚ್ಚನೆಯ ಆರ್ದ್ರ ವಾತಾವರಣದಲ್ಲಿ ಪ್ರತಿ 7 ರಿಂದ 10 ದಿನಗಳಿಗೊಮ್ಮೆ ಸಿಂಪಡಿಸಿ; ಮಳೆಯ ನಂತರ ಪುನರಾವರ್ತಿಸಿ.",
        resistance_stewardship: "ಶಿಲೀಂಧ್ರನಾಶಕ ಪ್ರತಿರೋಧವನ್ನು ತಡೆಯಲು FRAC 3 ಮತ್ತು FRAC 11 ಗುಂಪುಗಳನ್ನು ಪರ್ಯಾಯವಾಗಿ ಬಳಸಿ."
      }
    },
    hi: {
      disease: "गुलाब काला धब्बा रोग (Rose Black Spot)",
      scientific_name: "Diplocarpon rosae",
      status: "संक्रमित (Infected)",
      severity: "मध्यम (Moderate)",
      confidence: 93.4,
      affected_area_pct: 14.8,
      crop: "गुलाब (Rose)",
      symptoms: [
        "पंखदार, रेशेदार किनारों वाले गोल गहरे बैंगनी-भूरे से काले धब्बे।",
        "काले धब्बों के चारों ओर पीले घेरे मिलकर पत्तियों का गंभीर रूप से झड़ना।",
        "पौधे के निचले पत्तों से ऊपर की ओर संक्रमण का प्रसार।",
        "कमजोर टहनियों पर फूलों की संख्या और आकार में भारी कमी।"
      ],
      chemical_overview: "गुलाब का आम कवक रोग। माइक्लोबुटानिल (FRAC 3) या टेबुकोनाज़ोल को बहु-साइट संपर्क कवकनाशी के साथ मिलाकर छिड़काव करें।",
      tank_mix: "माइक्लोबुटानिल (1.0 मिली/लीटर) या टेबुकोनाज़ोल (1.0 मिली/लीटर) + मैंकोज़ेब (2.0 ग्राम/लीटर)।",
      organic_remedy: "पोटेशियम बाइकार्बोनेट (3 ग्राम/लीटर) + नीम का तेल (5 मिली/लीटर) हर 7 दिनों में छिड़कें।",
      cultural_remedy: "केवल पौधे की जड़ में पानी दें; गिरी हुई पत्तियों को इकट्ठा करके जला दें; हवा और धूप के लिए छंटाई करें।",
      spraying_schedule: {
        frequency: "गर्म और आर्द्र मौसम में हर 7 से 10 दिनों में छिड़काव करें।",
        resistance_stewardship: "कवकनाशी प्रतिरोध को रोकने के लिए FRAC 3 और FRAC 11 वर्गों को बारी-बारी से उपयोग करें।"
      }
    }
  },

  Healthy: {
    en: {
      disease: "Healthy Leaf (No Pathology Detected)",
      scientific_name: "Optimal Foliar Homeostasis",
      status: "Healthy",
      severity: "Optimal",
      confidence: 98.7,
      affected_area_pct: 0.0,
      crop: "Plant",
      symptoms: [
        "Uniform rich chlorophyll coloration across entire leaf lamina.",
        "Zero necrotic lesions, chlorotic yellowing, or fungal sporulation.",
        "Intact leaf margins and healthy vascular vein structure.",
        "Normal transpiration and photosynthetic vitality."
      ],
      chemical_overview: "No synthetic chemical fungicides required. Plant foliage exhibits optimal photosynthetic health and robust natural immunity.",
      tank_mix: "No spray required. Maintain routine balanced foliar micro-nutrients or seaweed extract.",
      organic_remedy: "Maintain beneficial soil biology via compost tea or vermicompost top-dressing. Prophylactic neem spray every 14 days if needed.",
      cultural_remedy: "Continue balanced deep drip irrigation; ensure 6+ hours of full sunlight; maintain good airflow around plants.",
      spraying_schedule: {
        frequency: "Routine weekly scouting; no chemical sprays warranted.",
        resistance_stewardship: "Avoid prophylactic fungicide applications on verified healthy foliage."
      }
    },
    kn: {
      disease: "ಆರೋಗ್ಯಕರ ಎಲೆ (ಯಾವುದೇ ರೋಗವಿಲ್ಲ)",
      scientific_name: "Optimal Foliar Homeostasis",
      status: "ಆರೋಗ್ಯಕರ (Healthy)",
      severity: "ಉತ್ತಮ (Optimal)",
      confidence: 98.7,
      affected_area_pct: 0.0,
      crop: "ಸಸ್ಯ (Plant)",
      symptoms: [
        "ಇಡೀ ಎಲೆಯ ಮೇಲೆ ಏಕರೂಪದ ಹಸಿರು ಕ್ಲೋರೊಫಿಲ್ ವರ್ಣದ್ರವ್ಯ.",
        "ಯಾವುದೇ ನೆಕ್ರೋಟಿಕ್ ಗಾಯಗಳು, ಹಳದಿ ಕಲೆಗಳು ಅಥವಾ ಶಿಲೀಂಧ್ರ ಲಕ್ಷಣಗಳಿಲ್ಲ.",
        "ಆರೋಗ್ಯಕರ ಎಲೆಯ ಅಂಚುಗಳು ಮತ್ತು ಬಲಿಷ್ಠ ನರಗಳ ರಚನೆ.",
        "ಉತ್ತಮ ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ ಮತ್ತು ಸಸ್ಯ ಚೈತನ್ಯ."
      ],
      chemical_overview: "ಯಾವುದೇ ರಾಸಾಯನಿಕ ಶಿಲೀಂಧ್ರನಾಶಕಗಳ ಅಗತ್ಯವಿಲ್ಲ. ಗಿಡದ ಎಲೆಗಳು ಅತ್ಯುತ್ತಮ ನೈಸರ್ಗಿಕ ರೋಗನಿರೋಧಕ ಶಕ್ತಿಯನ್ನು ಹೊಂದಿವೆ.",
      tank_mix: "ಯಾವುದೇ ಸಿಂಪಡಣೆಯ ಅಗತ್ಯವಿಲ್ಲ. ನಿಯಮಿತ ಸಮತೋಲಿತ ಪೋಷಕಾಂಶ ಅಥವಾ ಸಮುದ್ರ ಪಾಚಿ ಸಾರವನ್ನು ಮುಂದುವರಿಸಿ.",
      organic_remedy: "ಜೀವಂತ ಮಣ್ಣಿನ ಪೋಷಣೆಗಾಗಿ ಜೀವಾಮೃತ ಅಥವಾ ಎರೆಹುಳು ಗೊಬ್ಬರವನ್ನು ಬಳಸಿ. ಅಗತ್ಯವಿದ್ದರೆ ಪ್ರತಿ 14 ದಿನಗಳಿಗೊಮ್ಮೆ ಲಘು ಬೇವಿನ ಎಣ್ಣೆ ಸಿಂಪಡಿಸಿ.",
      cultural_remedy: "ನಿಯಮಿತ ಹನಿ ನೀರಾವರಿ ಮುಂದುವರಿಸಿ; ದಿನಕ್ಕೆ 6+ ಗಂಟೆಗಳ ಸೂರ್ಯನ ಬೆಳಕು ಒದಗಿಸಿ; ಗಿಡಗಳ ಸುತ್ತಲೂ ಉತ್ತಮ ಗಾಳಿಯಾಡುವಂತೆ ನೋಡಿಕೊಳ್ಳಿ.",
      spraying_schedule: {
        frequency: "ಸಾಪ್ತಾಹಿಕ ನಿಗಾ ಇರಿಸಿ; ಯಾವುದೇ ರಾಸಾಯನಿಕ ಸಿಂಪಡಣೆ ಅಗತ್ಯವಿಲ್ಲ.",
        resistance_stewardship: "ಆರೋಗ್ಯಕರ ಬೆಳೆಗಳಿಗೆ ಅನಗತ್ಯವಾಗಿ ರಾಸಾಯನಿಕಗಳನ್ನು ಸಿಂಪಡಿಸಬೇಡಿ."
      }
    },
    hi: {
      disease: "स्वस्थ पत्ती (कोई रोग नहीं मिला)",
      scientific_name: "Optimal Foliar Homeostasis",
      status: "स्वस्थ (Healthy)",
      severity: "उत्तम (Optimal)",
      confidence: 98.7,
      affected_area_pct: 0.0,
      crop: "पौधा (Plant)",
      symptoms: [
        "पूरी पत्ती पर एकसमान समृद्ध हरा क्लोरोफिल रंग।",
        "कोई नेक्रोटिक घाव, पीलापन या फफूंददार धब्बे मौजूद नहीं हैं।",
        "पत्ती के किनारे और शिरा संरचना पूरी तरह स्वस्थ हैं।",
        "उत्कृष्ट प्रकाश संश्लेषण और सामान्य श्वसन प्रक्रिया।"
      ],
      chemical_overview: "किसी रासायनिक कवकनाशी की आवश्यकता नहीं है। पौधे की पत्तियां प्राकृतिक रोग प्रतिरोधक क्षमता से परिपूर्ण हैं।",
      tank_mix: "किसी रासायनिक छिड़काव की आवश्यकता नहीं है। संतुलित सूक्ष्म पोषक तत्व या सीवीड एक्सट्रैक्ट दें।",
      organic_remedy: "मिट्टी के स्वास्थ्य के लिए जीवामृत या वर्मीकम्पोस्ट का प्रयोग करें। आवश्यकतानुसार 14 दिनों में हल्का नीम तेल स्प्रे करें।",
      cultural_remedy: "संतुलित ड्रिप सिंचाई जारी रखें; 6+ घंटे की सीधी धूप सुनिश्चित करें; पौधों के चारों ओर पर्याप्त हवा रखें।",
      spraying_schedule: {
        frequency: "नियमित साप्ताहिक निरीक्षण; रासायनिक स्प्रे की कोई आवश्यकता नहीं है।",
        resistance_stewardship: "स्वस्थ पत्तियों पर अनावश्यक कवकनाशी छिड़काव से बचें।"
      }
    }
  }
};

/**
 * Get localized preset sample data
 */
export function getLocalizedSample(presetKey, lang = 'en') {
  const normLang = ['en', 'kn', 'hi'].includes(lang) ? lang : 'en';
  const preset = LOCALIZED_PRESETS[presetKey];
  if (!preset) return null;
  return preset[normLang] || preset.en;
}

/**
 * Helper to localize a disease name
 */
export function getLocalizedDiseaseName(diseaseName, lang = 'en') {
  if (!diseaseName) return '';
  const normLang = ['en', 'kn', 'hi'].includes(lang) ? lang : 'en';

  const map = {
    'Early Blight': {
      en: 'Early Blight',
      kn: 'ಆರಂಭಿಕ ರೋಗ (Early Blight)',
      hi: 'अगेती झुलसा (Early Blight)'
    },
    'Late Blight': {
      en: 'Late Blight',
      kn: 'ತಡವಾದ ಅಂಗಮಾರಿ ರೋಗ (Late Blight)',
      hi: 'पछेती झुलसा (Late Blight)'
    },
    'Bacterial Spot': {
      en: 'Bacterial Spot',
      kn: 'ಬ್ಯಾಕ್ಟೀರಿಯಾದ ಚುಕ್ಕೆ ರೋಗ (Bacterial Spot)',
      hi: 'जीवाणु धब्बा रोग (Bacterial Spot)'
    },
    'Rose Black Spot': {
      en: 'Rose Black Spot',
      kn: 'ಗುಲಾಬಿ ಕಪ್ಪು ಚುಕ್ಕೆ ರೋಗ (Rose Black Spot)',
      hi: 'गुलाब काला धब्बा रोग (Rose Black Spot)'
    },
    'Apple Scab': {
      en: 'Apple Scab',
      kn: 'ಸೇಬು ಸ್ಕ್ಯಾಬ್ ರೋಗ (Apple Scab)',
      hi: 'सेब का स्कैब रोग (Apple Scab)'
    },
    'Healthy': {
      en: 'Healthy Leaf',
      kn: 'ಆರೋಗ್ಯಕರ ಎಲೆ (Healthy Leaf)',
      hi: 'स्वस्थ पत्ती (Healthy Leaf)'
    }
  };

  for (const [key, trans] of Object.entries(map)) {
    if (diseaseName.toLowerCase().includes(key.toLowerCase())) {
      return trans[normLang] || trans.en;
    }
  }

  return diseaseName;
}

/**
 * Helper to localize crop names
 */
export function getLocalizedCropName(crop, lang = 'en') {
  if (!crop) return '';
  const normLang = ['en', 'kn', 'hi'].includes(lang) ? lang : 'en';

  const map = {
    'Tomato': { en: 'Tomato', kn: 'ಟೊಮ್ಯಾಟೊ (Tomato)', hi: 'टमाटर (Tomato)' },
    'Potato': { en: 'Potato', kn: 'ಆಲೂಗಡ್ಡೆ (Potato)', hi: 'आलू (Potato)' },
    'Rose': { en: 'Rose', kn: 'ಗುಲಾಬಿ (Rose)', hi: 'गुलाब (Rose)' },
    'Pepper': { en: 'Pepper', kn: 'ಮೆಣಸಿನಕಾಯಿ (Pepper)', hi: 'मिर्च (Pepper)' },
    'Cucumber': { en: 'Cucumber', kn: 'ಸೌತೆಕಾಯಿ (Cucumber)', hi: 'खीरा (Cucumber)' },
    'Citrus': { en: 'Citrus', kn: 'ನಿಂಬೆ / ಸಿಟ್ರಸ್', hi: 'नींबू वर्गीय (Citrus)' },
    'Apple': { en: 'Apple', kn: 'ಸೇಬು (Apple)', hi: 'सेब (Apple)' },
    'Fruit Tree': { en: 'Fruit Tree', kn: 'ಹಣ್ಣಿನ ಮರಗಳು', hi: 'फलदार वृक्ष' },
    'Plant': { en: 'Plant', kn: 'ಸಸ್ಯ (Plant)', hi: 'पौधा (Plant)' },
    'All': { en: 'All Plants', kn: 'ಎಲ್ಲಾ ಸಸ್ಯಗಳು', hi: 'सभी पौधे' }
  };

  for (const [key, trans] of Object.entries(map)) {
    if (crop.toLowerCase().includes(key.toLowerCase())) {
      return trans[normLang] || trans.en;
    }
  }

  return crop;
}

/**
 * Helper to localize severity
 */
export function getLocalizedSeverity(sev, lang = 'en') {
  if (!sev) return '';
  const normLang = ['en', 'kn', 'hi'].includes(lang) ? lang : 'en';

  const map = {
    'Critical': { en: 'Critical', kn: 'ತೀವ್ರ ತುರ್ತು (Critical)', hi: 'अति गंभीर (Critical)' },
    'Moderate': { en: 'Moderate', kn: 'ಮಧ್ಯಮ (Moderate)', hi: 'मध्यम (Moderate)' },
    'Mild': { en: 'Mild', kn: 'ಕಡಿಮೆ (Mild)', hi: 'हल्का (Mild)' },
    'Low': { en: 'Low', kn: 'ಕಡಿಮೆ (Low)', hi: 'कम (Low)' },
    'Optimal': { en: 'Optimal', kn: 'ಉತ್ತಮ (Optimal)', hi: 'उत्तम (Optimal)' }
  };

  return map[sev]?.[normLang] || map[sev]?.en || sev;
}

/**
 * Helper to localize health status
 */
export function getLocalizedStatus(status, lang = 'en') {
  if (!status) return '';
  const normLang = ['en', 'kn', 'hi'].includes(lang) ? lang : 'en';

  const map = {
    'Healthy': { en: 'Healthy', kn: 'ಆರೋಗ್ಯಕರ (Healthy)', hi: 'स्वस्थ (Healthy)' },
    'Infected': { en: 'Infected', kn: 'ಸೋಂಕಿತ (Infected)', hi: 'संक्रमित (Infected)' },
    'confirmed': { en: 'Confirmed', kn: 'ದೃಢಪಟ್ಟಿದೆ', hi: 'पुष्ट' },
    'likely': { en: 'Likely', kn: 'ಸಾಧ್ಯತೆ ಇದೆ', hi: 'संभावित' }
  };

  return map[status]?.[normLang] || map[status]?.en || status;
}
