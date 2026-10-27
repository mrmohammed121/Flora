// src/data/diseasesData.js
// Structured Agronomic Knowledge Base for FloraScan AI Supported Diseases

export const SUPPORTED_DISEASES = [
  {
    slug: 'early-blight',
    title: 'Early Blight',
    scientificName: 'Alternaria solani',
    category: 'Foliar Fungal Pathogen',
    typeBadge: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/60',
    icon: '🎯',
    crops: ['Tomato', 'Potato', 'Eggplant (Solanaceae)'],
    presetKey: 'Early_Blight',
    summary: 'A pervasive fungal disease characterized by concentric bullseye target rings on mature lower leaves, rapidly escalating up the plant canopy under warm, alternating wet and dry conditions.',
    symptoms: [
      'Circular to oval brown-black spots (1–2 cm) displaying distinct concentric target rings ("bullseye" pattern).',
      'Chlorotic yellow halos surrounding expanding leaf lesions, leading to leaf senescence and premature drop.',
      'Defoliation starting strictly from older, shaded lower leaves and progressing upwards.',
      'Sunscald on exposed fruit resulting from canopy defoliation; dark, leathery, sunken lesions near the fruit stem.'
    ],
    visualMarkers: 'Distinct concentric circular rings with yellow perimeter halos. Lacks the feathery/fringed edges of Rose Black Spot and the water-soaked mold of Late Blight.',
    causes: 'Infection by the ascomycete fungus Alternaria solani. Conidia spores overwinter in diseased crop debris, solanaceous weeds, and volunteer potatoes. Disseminated by wind, rain splashes, and field equipment.',
    weatherTriggers: 'Warm temperatures (24–29°C / 75–85°F) combined with alternating periods of high humidity (>80% RH) and dry spells that promote spore release.',
    culturalPrevention: [
      'Rotate crops for at least 3 seasons away from solanaceous species (tomatoes, potatoes, eggplants, peppers).',
      'Employ drip or soaker hose irrigation to keep foliage completely dry; avoid overhead sprinkler watering.',
      'Apply clean straw or plastic mulch around the plant base to create a physical barrier against soil rain-splash.',
      'Prune lower leaves up to 30 cm (12 inches) above the ground once plants are established to maximize ventilation.',
      'Rake, bag, and incinerate all crop residues post-harvest; never compost blighted foliar debris.'
    ],
    organicRemedies: [
      'Apply prophylactic bio-fungicides containing Bacillus subtilis or Bacillus amyloliquefaciens every 7–10 days.',
      'Spray copper octanoate (copper soap) or fixed Bordeaux mixture as a protective surface barrier.',
      'Foliar applications of certified neem oil or potassium bicarbonate to retard early spore germination.'
    ],
    chemicalProtocols: [
      {
        name: 'Chlorothalonil (e.g., Bravo Weather Stik, Daconil)',
        fracGroup: 'FRAC M05 (Multi-site Contact)',
        dosage: '2.0 – 2.5 g per 1 L water (1.8 – 2.2 kg/ha broadcast)',
        phi: '0 Days (Tomato) / 7 Days (Potato)',
        rei: '12 Hours',
        role: 'Forms a wash-resistant protective film; broad multi-site enzyme inhibitor.'
      },
      {
        name: 'Azoxystrobin (e.g., Quadris, Amistar)',
        fracGroup: 'FRAC 11 (QoI / Strobilurin)',
        dosage: '0.8 – 1.0 ml per 1 L water (400 – 500 ml/ha)',
        phi: '0 – 1 Day',
        rei: '4 Hours',
        role: 'Translaminar curative systemic; halts mitochondrial respiration in germinating spores.'
      },
      {
        name: 'Difenoconazole (e.g., Score 250 EC)',
        fracGroup: 'FRAC 3 (DMI / Triazole)',
        dosage: '0.5 ml per 1 L water (250 – 300 ml/ha)',
        phi: '7 Days',
        rei: '12 Hours',
        role: 'Acropetal systemic; arrests expanding mycelium inside leaf vascular bundles.'
      }
    ],
    expertAdvice: 'Always alternate single-site systemic fungicides (FRAC 11 or FRAC 3) with multi-site contact protectants (FRAC M05 or M01) to forestall fungicide resistance development.',
    relatedDiseases: ['Late Blight', 'Bacterial Spot', 'Septoria Leaf Spot'],
    faqs: [
      {
        q: 'Can plants recover from Early Blight once infected?',
        a: 'Existing lesions cannot turn green again, but timely pruning of diseased lower leaves and application of curative systemic fungicides can halt upward spread and protect healthy top foliage and fruit.'
      },
      {
        q: 'How does Early Blight differ from Late Blight?',
        a: 'Early Blight produces dry, concentric circular bullseye rings on older leaves during warm weather. Late Blight causes large, irregular, water-soaked dark brown rots with white fluffy down on leaf undersides during cool, fog-saturated conditions.'
      }
    ]
  },
  {
    slug: 'late-blight',
    title: 'Late Blight',
    scientificName: 'Phytophthora infestans',
    category: 'Destructive Oomycete Pathogen',
    typeBadge: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700/60',
    icon: '🥀',
    crops: ['Tomato', 'Potato'],
    presetKey: 'Late_Blight',
    summary: 'The devastating water-mold responsible for the Irish Potato Famine. Produces aggressive, water-soaked canopy rot, blackened stems, and white fungal sporulation under cool, saturated humidity.',
    symptoms: [
      'Large, irregular, water-soaked pale green lesions rapidly turning dark brown to greasy purplish-black.',
      'Delicate white velvet-like fungal down (sporangiophores) appearing on leaf undersides under high humidity (>90% RH).',
      'Dark brown to black stem lesions causing rapid wilting and total collapse of the vine canopy.',
      'Firm, brown, leathery surface rot on green and ripe tomato fruit; granular dry rot inside potato tubers.'
    ],
    visualMarkers: 'Aggressive, greasy, irregular dark brown lesions with pale green borders and white sporulation on undersides. Never shows circular concentric rings.',
    causes: 'Oomycete pathogen Phytophthora infestans. Overwinters primarily in infected potato tubers (cull piles, volunteer tubers, seed tubers). Spreads rapidly over tens of miles via wind-blown airborne sporangia.',
    weatherTriggers: 'Cool, wet, cloudy, and foggy conditions (15–20°C / 60–70°F) with prolonged relative humidity (>90%) or continuous rainfall.',
    culturalPrevention: [
      'Plant only certified disease-free seed potatoes and verified pathogen-free greenhouse seedlings.',
      'Destroy all cull piles and volunteer potato plants early in the spring before commercial planting.',
      'Ensure wide row spacing (at least 75 cm) and orient rows parallel to prevailing winds for rapid canopy drying.',
      'Monitor regional agricultural extension disease forecast alerts (e.g. Blitecast / USABlight).'
    ],
    organicRemedies: [
      'Emergency containment: remove and double-bag severely infected plants immediately; do not leave in field.',
      'Preventive sprays of copper hydroxide or fixed copper formulations prior to rain events.',
      'Spray bio-fungicides (Bacillus subtilis) only as preventative buffer zone management.'
    ],
    chemicalProtocols: [
      {
        name: 'Metalaxyl-M + Mancozeb (e.g., Ridomil Gold MZ 68 WG)',
        fracGroup: 'FRAC 4 + M03 (Acropetal Systemic + Contact)',
        dosage: '2.5 g per 1 L water (2.0 – 2.5 kg/ha)',
        phi: '7 Days',
        rei: '24 Hours',
        role: 'Dual anti-oomycete chemistry; inhibits RNA polymerase synthesis and protects new growth.'
      },
      {
        name: 'Cymoxanil + Famoxadone (e.g., Equation Pro)',
        fracGroup: 'FRAC 27 + 11 (Translaminar Curative)',
        dosage: '0.4 – 0.5 g per 1 L water (400 g/ha)',
        phi: '3 Days',
        rei: '12 Hours',
        role: 'Rapid translaminar penetration arresting incubating mycelium within 48 hours of infection.'
      },
      {
        name: 'Dimethomorph (e.g., Acrobat 50 WP)',
        fracGroup: 'FRAC 40 (Cell Wall Biosynthesis)',
        dosage: '1.0 g per 1 L water (800 – 1000 g/ha)',
        phi: '4 Days',
        rei: '12 Hours',
        role: 'Inhibits oomycete phospholipid and cell wall synthesis; excellent resistance-rotation partner.'
      }
    ],
    expertAdvice: 'Late Blight is an emergency community pathogen. When symptoms appear in your region, apply curative systemic chemistries immediately. Do not delay.',
    relatedDiseases: ['Early Blight', 'Bacterial Spot', 'Gray Mold (Botrytis)'],
    faqs: [
      {
        q: 'Can Late Blight destroy an entire crop quickly?',
        a: 'Yes. Under saturated, cool weather conditions, Late Blight can devastate an entire tomato or potato field in 7 to 10 days if left untreated.'
      },
      {
        q: 'Is fruit from Late Blight infected plants safe to eat?',
        a: 'While the pathogen is not toxic to humans, infected tomatoes rot rapidly, taste bitter, and decay during storage. Diseased fruits should be discarded.'
      }
    ]
  },
  {
    slug: 'bacterial-spot',
    title: 'Bacterial Spot',
    scientificName: 'Xanthomonas perforans / X. campestris',
    category: 'Bacterial Foliar Pathogen',
    typeBadge: 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700/60',
    icon: '🍂',
    crops: ['Tomato', 'Bell Pepper (Capsicum)'],
    presetKey: 'Bacterial_Spot',
    summary: 'A bacterial disease that thrives in warm, rainy weather, creating numerous small, water-soaked angular spots that tear into a distinctive "shot-hole" pattern.',
    symptoms: [
      'Numerous small (1–3 mm), angular, dark brown to black water-soaked specks on leaves and stems.',
      'Lesion centers dry out and become brittle, frequently cracking and dropping out to form a "shot-hole" effect.',
      'Severe foliar infection causes widespread leaf yellowing, scorched appearance, and extensive leaf drop.',
      'Raised, scab-like, blistered spots with dark margins on immature fruit.'
    ],
    visualMarkers: 'Angular, greasy water-soaked specks bounded by small leaf veins. Does NOT respond to synthetic fungal fungicides (QoI/DMI).',
    causes: 'Bacterium Xanthomonas species. Survives on volunteer plants, infected crop debris, and contaminated commercial seed lots. Spread rapidly by wind-driven rain, sprinkler irrigation, and wet worker traffic.',
    weatherTriggers: 'Warm temperatures (24–30°C / 75–86°F) combined with frequent rain, heavy morning dew, and high relative humidity.',
    culturalPrevention: [
      'Use only certified disease-free, hot-water-treated seed (soak at 50°C for 25 minutes).',
      'Never work in fields, cultivate, or prune vines when leaves are wet with rain or morning dew.',
      'Adopt drip irrigation exclusively; eliminate all overhead sprinkler systems.',
      'Control volunteer solanaceous weeds (especially black nightshade) which harbor bacterial colonies.'
    ],
    organicRemedies: [
      'Apply preventive copper octanoate (soap) or fixed copper combined with organic bio-control agents.',
      'Use certified bacteriophage sprays targeted specifically against Xanthomonas strains.',
      'Apply compost tea amendments to cultivate diverse phyllosphere microflora that compete with pathogens.'
    ],
    chemicalProtocols: [
      {
        name: 'Copper Hydroxide + Mancozeb Tank Mix (e.g., Kocide 3000 + Dithane M-45)',
        fracGroup: 'FRAC M01 + M03',
        dosage: '1.5 – 2.0 g Copper + 1.5 g Mancozeb per 1 L water',
        phi: '0 – 5 Days',
        rei: '24 Hours',
        role: 'Mancozeb enhances copper solubility, releasing high levels of free toxic cupric ions that denature bacterial proteins.'
      },
      {
        name: 'Acibenzolar-S-methyl (e.g., Actigard 50 WG)',
        fracGroup: 'FRAC P01 (Systemic Acquired Resistance)',
        dosage: '0.2 g per 1 L water (25 – 35 g/ha)',
        phi: '7 Days',
        rei: '12 Hours',
        role: 'Plant defense activator; primes the host crop immune system against bacterial penetration.'
      }
    ],
    expertAdvice: 'Standard fungal fungicides (such as azoxystrobin or difenoconazole) are completely ineffective against Bacterial Spot because bacteria lack the fungal sterol and ergosterol pathways.',
    relatedDiseases: ['Bacterial Canker', 'Bacterial Speck', 'Early Blight'],
    faqs: [
      {
        q: 'Why mix Mancozeb with Copper for bacterial control?',
        a: 'Xanthomonas bacteria have developed high tolerance to standalone copper in many agricultural regions. Adding Mancozeb releases free cupric ions in the spray solution, dramatically boosting bactericidal potency.'
      }
    ]
  },
  {
    slug: 'rose-black-spot',
    title: 'Rose Black Spot',
    scientificName: 'Diplocarpon rosae',
    category: 'Ornamental Fungal Disease',
    typeBadge: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700/60',
    icon: '🌹',
    crops: ['Rose (Rosa spp.) — Ornamental Gardens'],
    presetKey: 'Rose_Black_Spot',
    summary: 'The primary foliar disease of garden roses. Characterized by dark circular spots with distinct feathery, fibrillose edges, progressing to yellowing and severe defoliation.',
    symptoms: [
      'Circular to irregular dark purple-brown to pitch-black spots (2–12 mm) on upper leaf surfaces.',
      'Distinctive feathery, fibrillose, fringed spreading margins radiating outward.',
      'Yellow chlorotic halos surrounding the black spots, causing leaflets to turn completely yellow and drop.',
      'Defoliation beginning on lower shrub canes and advancing upwards, leaving bare thorny branches.',
      'Raised, reddish-purple blisters on immature green canes.'
    ],
    visualMarkers: 'Feathery, fibrillose margins with radiating fungal strands. Never exhibits the smooth, concentric target rings of Early Blight.',
    causes: 'Ascomycete fungus Diplocarpon rosae. Conidia and ascospores survive winter in fallen rose leaf litter and stem lesions. Conidia require at least 6–7 hours of continuous leaf wetness to germinate.',
    weatherTriggers: 'Moderate temperatures (18–24°C / 64–75°F) with frequent rain or overhead garden watering.',
    culturalPrevention: [
      'Water garden roses strictly at the ground base using drip or soaker hoses; avoid wetting foliage.',
      'Prune canes into an open vase shape to maximize airflow and encourage rapid leaf drying.',
      'Mandatory sanitation: rake, bag, and discard all fallen rose leaves before winter; do not compost.',
      'Sterilize pruning shears between bushes with 70% isopropyl alcohol to avoid spreading spores.'
    ],
    organicRemedies: [
      'Potassium bicarbonate foliar wash (3 g/L) + horticultural mineral oil (5 ml/L) applied weekly.',
      'Foliar spray with biological antagonist Bacillus amyloliquefaciens.',
      'Wettable sulfur spray (avoid applying above 29°C/85°F to prevent leaf and petal phytotoxicity).'
    ],
    chemicalProtocols: [
      {
        name: 'Tebuconazole (e.g., Folicur / Bayer Disease Control)',
        fracGroup: 'FRAC 3 (DMI Triazole)',
        dosage: '1.0 – 1.5 ml per 1 L water',
        phi: 'Not Applicable (Non-Edible Ornamental)',
        rei: '12 Hours (Until dry)',
        role: 'Systemic triazole; arrests expanding mycelium inside leaf tissue.'
      },
      {
        name: 'Trifloxystrobin + Tebuconazole (e.g., Nativo)',
        fracGroup: 'FRAC 11 + FRAC 3',
        dosage: '0.8 – 1.0 g per 1 L water',
        phi: 'Not Applicable (Non-Edible Ornamental)',
        rei: '12 Hours',
        role: 'Curative systemic plus protective barrier against newly landing airborne conidia.'
      }
    ],
    expertAdvice: 'CRITICAL PETAL SAFETY: Never spray fungicides directly onto open rose blooms or colored flower buds. Chemical contact will cause petal scorch, discoloration, and flower distortion.',
    relatedDiseases: ['Rose Powdery Mildew', 'Rose Rust', 'Downy Mildew'],
    faqs: [
      {
        q: 'Does Rose Black Spot have a Pre-Harvest Interval (PHI)?',
        a: 'No. Because roses are non-edible ornamental shrubs, Pre-Harvest Intervals do not apply. However, safety intervals (REI) and petal safety protocols must always be respected.'
      }
    ]
  },
  {
    slug: 'apple-scab',
    title: 'Apple Scab',
    scientificName: 'Venturia inaequalis',
    category: 'Tree Fruit Fungal Pathogen',
    typeBadge: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60',
    icon: '🍏',
    crops: ['Apple (Malus domestica)', 'Crabapple'],
    presetKey: 'Apple_Scab',
    summary: 'The most economically significant apple disease worldwide, causing velvety olive-green to black scabby lesions on leaves and corky cracks on mature fruit.',
    symptoms: [
      'Dull olive-green to brown velvety spots on leaf surfaces with indefinite, blurred margins.',
      'Older lesions turn dark brown to black, puckering and distorting the leaf surface.',
      'Severe infections lead to premature mid-summer orchard defoliation.',
      'Fruit develops dark, olive-brown scabby spots that harden, become corky, and crack deeply.'
    ],
    visualMarkers: 'Velvety olive-green spots with indistinct feathered borders, turning into corky raised fruit lesions.',
    causes: 'Ascomycete fungus Venturia inaequalis. Ascospores overwinter in fallen orchard leaves and release during spring rains to infect emerging green buds.',
    weatherTriggers: 'Cool, wet spring weather (12–20°C / 54–68°F) with extended leaf wetness (6–18 hours based on the Mills Infection Table).',
    culturalPrevention: [
      'Shred or remove fallen leaves in autumn using a flail mower to accelerate decomposition of overwintering fungal bodies.',
      'Apply 5% urea spray to orchard floor leaves in late autumn to speed leaf breakdown.',
      'Prune orchard trees during winter to maintain an open canopy structure for optimal sun penetration and rapid drying.',
      'Plant scab-resistant cultivars (e.g., Liberty, Enterprise, GoldRush, Pristine).'
    ],
    organicRemedies: [
      'Preventative applications of liquid lime sulfur or micronized wettable sulfur during spring green-tip stages.',
      'Bio-fungicide sprays containing Bacillus subtilis or Aureobasidium pullulans.'
    ],
    chemicalProtocols: [
      {
        name: 'Captan 80 WDG (Multi-site Contact)',
        fracGroup: 'FRAC M04',
        dosage: '1.5 – 2.0 kg/ha',
        phi: '0 Days',
        rei: '24 Hours',
        role: 'Standard protective multi-site contact fungicide; low resistance risk.'
      },
      {
        name: 'Difenoconazole + Cyprodinil (e.g., Inspire Super)',
        fracGroup: 'FRAC 3 + 9',
        dosage: '0.8 – 1.0 L/ha',
        phi: '14 Days',
        rei: '12 Hours',
        role: 'Dual systemic with excellent kick-back curative activity within 72 hours of infection.'
      }
    ],
    expertAdvice: 'Utilize Mills period leaf-wetness tables to calculate exact infection events after spring rains before deciding on curative spray timing.',
    relatedDiseases: ['Apple Black Rot', 'Cedar Apple Rust', 'Powdery Mildew'],
    faqs: [
      {
        q: 'Are apples with scab lesions safe to eat?',
        a: 'Yes. Apple scab is a superficial fungal skin blemish. The peel can be removed, and the flesh is safe for consumption or processing into cider and applesauce.'
      }
    ]
  },
  {
    slug: 'black-rot',
    title: 'Apple Black Rot',
    scientificName: 'Botryosphaeria obtusa',
    category: 'Tree Fruit Canker & Rot',
    typeBadge: 'bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-300 border-stone-300 dark:border-stone-700/60',
    icon: '🍎',
    crops: ['Apple', 'Pear'],
    presetKey: 'Black_Rot',
    summary: 'A triple-threat orchard pathogen that causes "frogeye" leaf spots, sunken wood cankers on branches, and firm black mummified fruit rot.',
    symptoms: [
      'Small purple flecks on leaves expanding into circular spots with light tan centers and purple margins ("frogeye" leaf spot).',
      'Fruit infection begins near the calyx as a brown spot, expanding into concentric light and dark brown bands.',
      'Infected apples eventually turn completely black, shrivel into hard mummies, and hang on branches throughout winter.',
      'Sunken reddish-brown cankers on branches that girdle wood and kill upper limbs.'
    ],
    visualMarkers: 'Frogeye foliar rings with tan centers and purple edges; firm concentric fruit rot turning jet black.',
    causes: 'Fungus Botryosphaeria obtusa. Overwinters in dead wood, branch cankers, fire-blight killed twigs, and mummified fruit.',
    weatherTriggers: 'Warm, humid weather (20–27°C / 68–80°F) with rain events that splash spores from cankers onto leaves and fruit.',
    culturalPrevention: [
      'Prune out all dead or diseased wood, cankers, and mummified apples during dormant winter pruning.',
      'Burn or chip all pruned wood immediately; never leave pruning brush piles near orchards.',
      'Prevent physical fruit and bark injuries from pruning shears, hail, and mechanical equipment.'
    ],
    organicRemedies: [
      'Copper sulfate sprays during late dormancy before bud break.',
      'Fixed sulfur sprays during petal fall and cover spray periods.'
    ],
    chemicalProtocols: [
      {
        name: 'Thiophanate-methyl (e.g., Topsin-M 70 WDG)',
        fracGroup: 'FRAC 1',
        dosage: '1.0 – 1.2 kg/ha',
        phi: '1 Day',
        rei: '24 Hours',
        role: 'Systemic curative; inhibits fungal tubulin polymerization.'
      },
      {
        name: 'Mancozeb (e.g., Manzate Pro-Stick)',
        fracGroup: 'FRAC M03',
        dosage: '2.2 – 3.0 kg/ha',
        phi: '77 Days (Early season only)',
        rei: '24 Hours',
        role: 'Broad-spectrum protective barrier applied from green-tip through second cover.'
      }
    ],
    expertAdvice: 'Sanitation is the single most effective control measure for Black Rot. Removing cankers and mummies from trees eliminates 90% of primary inoculum.',
    relatedDiseases: ['Apple Scab', 'Bitter Rot', 'White Rot'],
    faqs: [
      {
        q: 'Why are mummified apples on the tree dangerous?',
        a: 'Mummified apples act as massive reservoirs of fungal spores that release millions of conidia during warm spring rains directly onto young leaves and fruit.'
      }
    ]
  },
  {
    slug: 'citrus-greening',
    title: 'Citrus Greening (HLB)',
    scientificName: 'Candidatus Liberibacter asiaticus',
    category: 'Vascular Bacterial / Vector-Borne',
    typeBadge: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700/60',
    icon: '🍊',
    crops: ['Orange', 'Lemon', 'Lime', 'Grapefruit (Citrus spp.)'],
    presetKey: 'Citrus_Greening',
    summary: 'Huanglongbing (HLB), the most destructive disease of citrus worldwide. A phloem-limited bacterium vectored by psyllid insects, causing asymmetric leaf mottling, stunted bitter fruit, and tree decline.',
    symptoms: [
      'Asymmetric blotchy yellow mottle on leaves crossing veins unevenly (unlike nutritional deficiencies which are symmetric).',
      'Yellowing of individual shoots or branches while the rest of the canopy remains green ("yellow shoot" symptom).',
      'Small, lopsided, asymmetric fruit that fails to color properly, remaining green at the stylar end ("greening").',
      'Fruit tastes bitter, sour, and unpalatable with dark, aborted, aborted seeds inside.',
      'Dieback of feeder roots, progressive canopy thinning, and tree death over 3–5 years.'
    ],
    visualMarkers: 'Asymmetric blotchy mottle crossing veins irregularly. Lopsided fruit with green stylar ends and dark aborted seeds.',
    causes: 'Phloem-restricted unculturable bacterium Candidatus Liberibacter asiaticus (CLas), transmitted from tree to tree by the Asian Citrus Psyllid (Diaphorina citri).',
    weatherTriggers: 'Subtropical and tropical citrus climates where temperatures allow continuous psyllid reproduction and flight (20–30°C / 68–86°F).',
    culturalPrevention: [
      'Plant exclusively certified disease-free nursery trees grown in bug-proof, screened greenhouse structures.',
      'Scout groves bi-weekly for Asian citrus psyllid eggs, nymphs, and feeding adults (45-degree angle posture).',
      'Immediately remove and destroy confirmed HLB-infected trees to eliminate bacterial reservoirs.',
      'Install yellow sticky cards to monitor psyllid populations along grove perimeters.'
    ],
    organicRemedies: [
      'High-frequency horticultural mineral oil sprays to suffocate psyllid nymphs and deter egg-laying.',
      'Release beneficial predatory insects (Tamarixia radiata parasitoid wasps) for biological psyllid suppression.',
      'Intensive foliar micronutrient sprays (zinc, manganese, iron) to support root and phloem vitality.'
    ],
    chemicalProtocols: [
      {
        name: 'Imidacloprid (Systemic Neonicotinoid)',
        fracGroup: 'IRAC 4A (Insect Vector Suppression)',
        dosage: 'Soil drench for young trees (up to 3 years)',
        phi: 'N/A (Non-bearing stages)',
        rei: '12 Hours',
        role: 'Provides prolonged systemic control against Asian citrus psyllid feeding.'
      },
      {
        name: 'Foliar Pyrethroids / Organophosphates (e.g., Fenpropathrin)',
        fracGroup: 'IRAC 3A / 1B',
        dosage: 'Refer to local citrus pest management guidelines',
        phi: 'Check local label',
        rei: '24 Hours',
        role: 'Knockdown spray during active flush periods when psyllids reproduce.'
      }
    ],
    expertAdvice: 'There is currently no cure for CLas once an orchard tree is systemically infected. Management relies strictly on aggressive psyllid insect vector control and rapid tree removal.',
    relatedDiseases: ['Citrus Canker', 'Citrus Tristeza Virus', 'Citrus Scab'],
    faqs: [
      {
        q: 'How do I distinguish Citrus Greening from Zinc or Iron deficiency?',
        a: 'Zinc and iron deficiencies produce symmetric yellow patterns identical on both sides of the central leaf vein. Citrus Greening mottle is completely asymmetric, irregular, and crosses leaf veins unevenly.'
      }
    ]
  },
  {
    slug: 'powdery-mildew',
    title: 'Powdery Mildew',
    scientificName: 'Podosphaera xanthii / Erysiphe spp.',
    category: 'Ectoparasitic Fungal Disease',
    typeBadge: 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-700/60',
    icon: '🥒',
    crops: ['Cucumber', 'Squash', 'Melon', 'Zucchini (Cucurbits)'],
    presetKey: 'Cucumber_Powdery_Mildew',
    summary: 'A widespread fungal disease that coats leaf surfaces in white, talcum-powder-like patches, leading to leaf chlorosis, premature drying, and reduced photosynthesis.',
    symptoms: [
      'Circular, white, powdery talcum-like spots on upper and lower leaf surfaces, petioles, and young stems.',
      'White fungal patches expand and coalesce to completely cover the leaf lamina.',
      'Infected leaves turn yellow, then brown, and become dry, brittle, and paper-thin.',
      'Severe defoliation exposes developing fruit to sunscald and drastically lowers sugar content in melons and cucumbers.'
    ],
    visualMarkers: 'Superficial white powdery talcum coating easily rubbed off with a finger. Does NOT require free standing water to infect.',
    causes: 'Obligate biotrophic fungus Podosphaera xanthii. Conidia germinate under high relative humidity without needing free liquid water on the leaf surface.',
    weatherTriggers: 'Dry, warm climates with high relative humidity at night (20–27°C / 68–80°F) and low light / dense canopy conditions.',
    culturalPrevention: [
      'Select and plant powdery mildew-resistant cucurbit varieties.',
      'Space plants generously (at least 60–90 cm) to maximize air movement and reduce humidity pockets.',
      'Trellis cucumber and squash vines vertically to keep foliage off moist soil and improve spray coverage.',
      'Avoid excessive nitrogen fertilization, which stimulates succulent, highly susceptible foliage.'
    ],
    organicRemedies: [
      'Potassium bicarbonate spray (3–4 g/L) + non-ionic horticultural oil (5 ml/L) as a curative foliar wash.',
      'Diluted milk spray (40% whole milk, 60% water) applied in full sun (antiseptic lactoferrin action).',
      'Sulfur dust or wettable sulfur (do not apply when temperatures exceed 30°C/86°F).'
    ],
    chemicalProtocols: [
      {
        name: 'Myclobutanil (e.g., Rally 40 WSP)',
        fracGroup: 'FRAC 3 (DMI Triazole)',
        dosage: '120 – 180 g/ha',
        phi: '0 – 3 Days',
        rei: '24 Hours',
        role: 'Locally systemic curative; arrests active powdery fungal mycelium.'
      },
      {
        name: 'Pyraclostrobin (e.g., Cabrio EG)',
        fracGroup: 'FRAC 11 (QoI)',
        dosage: '500 – 700 g/ha',
        phi: '0 Days',
        rei: '12 Hours',
        role: 'Translaminar protective barrier; prevents spore germination.'
      }
    ],
    expertAdvice: 'Spray both upper and lower leaf surfaces thoroughly. Powdery mildew often establishes first in dense, shaded lower foliage on the undersides of leaves.',
    relatedDiseases: ['Downy Mildew', 'Anthracnose', 'Gummy Stem Blight'],
    faqs: [
      {
        q: 'Does Powdery Mildew need rain to spread?',
        a: 'No. Unlike Late Blight or Downy Mildew, Powdery Mildew spores germinate in humid air without free standing liquid water. In fact, heavy rain can wash spores off leaves.'
      }
    ]
  },
  {
    slug: 'downy-mildew',
    title: 'Downy Mildew',
    scientificName: 'Pseudoperonospora cubensis',
    category: 'Vascular Oomycete Water-Mold',
    typeBadge: 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700/60',
    icon: '🍈',
    crops: ['Cucumber', 'Cantaloupe', 'Watermelon', 'Pumpkin'],
    presetKey: 'Cucumber_Downy_Mildew',
    summary: 'A fast-moving oomycete disease causing distinct angular, vein-bounded yellow chlorotic patches on upper leaf surfaces, with purplish-gray down underneath.',
    symptoms: [
      'Angular, blocky yellow patches on the upper leaf surface, strictly delimited by major leaf veins.',
      'Under high humidity, purplish-brown to charcoal downy mold develops on the underside of corresponding yellow patches.',
      'Yellow patches rapidly turn necrotic brown, curl upward, and cause entire leaves to die and scorch ("wildfire" effect).',
      'Rapid canopy collapse occurs within days under warm, overcast, rainy conditions.'
    ],
    visualMarkers: 'Angular, mosaic-like patches strictly bounded by leaf veins; purplish down on undersides. Lacks the white powdery talcum of Powdery Mildew.',
    causes: 'Oomycete Pseudoperonospora cubensis. Airborne sporangia travel hundreds of miles on storm fronts from southern greenhouse regions.',
    weatherTriggers: 'Warm, overcast, humid days (15–24°C / 60–75°F) with prolonged morning dew or persistent rain.',
    culturalPrevention: [
      'Plant early-maturing and downy-mildew tolerant hybrid cucumber varieties.',
      'Irrigate exclusively with drip lines; never run overhead sprinklers in the evening.',
      'Space plants generously to promote rapid canopy drying each morning.',
      'Monitor national forecasting networks (e.g., Cucurbit Downy Mildew IPM PIPE).'
    ],
    organicRemedies: [
      'Copper hydroxide or fixed copper soaps applied prior to rain events.',
      'Bio-fungicide sprays containing Bacillus or Streptomyces formulations.'
    ],
    chemicalProtocols: [
      {
        name: 'Fluopicolide (e.g., Presidio)',
        fracGroup: 'FRAC 43',
        dosage: '250 – 300 ml/ha',
        phi: '2 Days',
        rei: '12 Hours',
        role: 'Translaminar and systemic anti-oomycete chemistry; disrupts spectrin-like protein.'
      },
      {
        name: 'Cyazofamid (e.g., Ranman 400 SC)',
        fracGroup: 'FRAC 21',
        dosage: '150 – 200 ml/ha',
        phi: '0 Days',
        rei: '12 Hours',
        role: 'Inhibits QiI fungal complex III; outstanding protectant activity.'
      }
    ],
    expertAdvice: 'Downy Mildew moves with extraordinary speed. When regional alerts trigger, apply preventive protectants before rainy fronts arrive.',
    relatedDiseases: ['Powdery Mildew', 'Angular Leaf Spot', 'Anthracnose'],
    faqs: [
      {
        q: 'How can I easily distinguish Downy Mildew from Powdery Mildew on Cucumbers?',
        a: 'Downy Mildew forms angular, vein-bounded yellow patches on the upper surface with purplish down underneath. Powdery Mildew forms circular, white, talcum-like powder everywhere across leaf surfaces.'
      }
    ]
  }
];

export const getDiseaseBySlug = (slug) => {
  return SUPPORTED_DISEASES.find((d) => d.slug === slug);
};
