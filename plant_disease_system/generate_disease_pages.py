import os

diseases = [
  {
    'slug': 'early-blight',
    'title': 'Early Blight',
    'scientific': 'Alternaria solani',
    'crop': 'Tomato, Potato, Eggplant',
    'type': 'Fungal Pathogen',
    'summary': 'A pervasive fungal disease characterized by concentric bullseye target rings on mature lower leaves, rapidly escalating up the plant canopy under warm, alternating wet and dry conditions.',
    'symptoms': [
      'Circular to oval brown-black spots displaying distinct concentric target rings (bullseye pattern).',
      'Chlorotic yellow halos surrounding expanding leaf lesions, leading to leaf senescence and drop.',
      'Defoliation starting from older, shaded lower leaves and progressing upwards.',
      'Dark, sunken, leathery lesions near fruit stems causing severe fruit drop.'
    ],
    'markers': 'Concentric circular rings with yellow halos. Lacks the feathery margins of Rose Black Spot and greasy rot of Late Blight.',
    'causes': 'Ascomycete fungus Alternaria solani. Conidia spores overwinter in diseased crop debris and volunteer solanaceous weeds.',
    'prevention': [
      '3-year crop rotation away from solanaceous crops.',
      'Drip irrigation to keep foliar canopy completely dry.',
      'Mulch soil to prevent rain-splash spore transmission.',
      'Prune lower foliage 30 cm above ground for air ventilation.'
    ],
    'organic': 'Bacillus subtilis bio-fungicide, copper octanoate, and potassium bicarbonate washes.',
    'chemical': 'Chlorothalonil (FRAC M05), Azoxystrobin (FRAC 11), Difenoconazole (FRAC 3). Rotate FRAC modes to prevent resistance.',
    'advice': 'Always rotate single-site systemic fungicides with multi-site contact protectants to avoid fungal resistance.'
  },
  {
    'slug': 'late-blight',
    'title': 'Late Blight',
    'scientific': 'Phytophthora infestans',
    'crop': 'Tomato, Potato',
    'type': 'Oomycete Water-Mold',
    'summary': 'The devastating water-mold responsible for the Irish Potato Famine. Produces aggressive water-soaked canopy rot, blackened stems, and white sporulation under cool, saturated humidity.',
    'symptoms': [
      'Large, irregular, water-soaked pale green lesions turning dark brown to greasy purplish-black.',
      'Delicate white fungal down emerging on leaf undersides during cool, saturated humidity.',
      'Dark brown to black stem lesions causing complete canopy collapse within days.',
      'Firm, brown, leathery surface rot on tomato fruit and tuber rot in potatoes.'
    ],
    'markers': 'Aggressive, greasy, irregular dark brown lesions with pale green borders and white sporulation on undersides.',
    'causes': 'Oomycete Phytophthora infestans. Overwinters in infected potato tubers and cull piles; spreads over miles on wind-borne sporangia.',
    'prevention': [
      'Plant certified disease-free seed potatoes.',
      'Destroy all cull piles and volunteer potatoes in early spring.',
      'Orient rows parallel to prevailing winds for rapid canopy drying.'
    ],
    'organic': 'Immediate plant quarantine and disposal; preventive Bordeaux mixture (copper sulfate + lime).',
    'chemical': 'Metalaxyl-M + Mancozeb (FRAC 4 + M03), Cymoxanil + Famoxadone (FRAC 27 + 11), Dimethomorph (FRAC 40).',
    'advice': 'Emergency pathogen: apply systemic anti-oomycete chemistries at first sign of disease alerts.'
  },
  {
    'slug': 'bacterial-spot',
    'title': 'Bacterial Spot',
    'scientific': 'Xanthomonas perforans',
    'crop': 'Tomato, Bell Pepper',
    'type': 'Bacterial Pathogen',
    'summary': 'A bacterial disease that thrives in warm, rainy weather, creating numerous small, water-soaked angular spots that tear into a distinctive shot-hole pattern.',
    'symptoms': [
      'Numerous small (1–3 mm), angular, dark brown to black water-soaked specks.',
      'Brittle lesion centers that dry and fall out, creating a characteristic shot-hole effect.',
      'Widespread leaf chlorosis and severe defoliation.',
      'Raised, blistered scab spots with dark margins on immature fruit.'
    ],
    'markers': 'Angular, greasy water-soaked specks bounded by small leaf veins. Does not respond to fungal fungicides.',
    'causes': 'Bacterium Xanthomonas species. Survives on crop residues and commercial seed lots; spread by rain-splash.',
    'prevention': [
      'Hot-water seed treatment at 50°C for 25 minutes.',
      'Never work in fields when foliage is wet with morning dew.',
      'Drip irrigation only; eliminate overhead sprinklers.'
    ],
    'organic': 'Certified bacteriophages, copper octanoate soap, and microbial antagonists.',
    'chemical': 'Copper Hydroxide + Mancozeb tank mix, Acibenzolar-S-methyl (Actigard) plant defense SAR activator.',
    'advice': 'Synthetic fungal QoI/DMI inhibitors are ineffective against bacterial pathogens.'
  },
  {
    'slug': 'rose-black-spot',
    'title': 'Rose Black Spot',
    'scientific': 'Diplocarpon rosae',
    'crop': 'Rose (Rosa spp.)',
    'type': 'Ornamental Fungal Disease',
    'summary': 'The primary foliar disease of garden roses. Characterized by dark circular spots with distinct feathery, fibrillose edges, progressing to yellowing and severe defoliation.',
    'symptoms': [
      'Circular to irregular dark purple-brown to pitch-black spots on upper leaf surfaces.',
      'Distinctive feathery, fibrillose, fringed spreading margins radiating outward.',
      'Yellow chlorotic halos surrounding the black spots, causing premature leaflet drop.',
      'Raised reddish-purple cankers on immature canes.'
    ],
    'markers': 'Feathery, fibrillose margins with radiating fungal strands. Never exhibits concentric circular rings.',
    'causes': 'Ascomycete fungus Diplocarpon rosae. Conidia survive winter in fallen rose leaf litter.',
    'prevention': [
      'Water garden roses at the ground base; avoid wetting foliage.',
      'Prune canes into an open vase shape to maximize airflow.',
      'Mandatory sanitation: rake and burn all fallen rose leaves before winter.'
    ],
    'organic': 'Potassium bicarbonate (3 g/L) + horticultural oil (5 ml/L), Bacillus amyloliquefaciens.',
    'chemical': 'Tebuconazole (FRAC 3), Trifloxystrobin + Tebuconazole (Nativo). Non-edible ornamental shrubs.',
    'advice': 'CRITICAL PETAL SAFETY: Never spray fungicides directly onto open rose blooms or colored flower buds.'
  },
  {
    'slug': 'apple-scab',
    'title': 'Apple Scab',
    'scientific': 'Venturia inaequalis',
    'crop': 'Apple, Crabapple',
    'type': 'Tree Fruit Fungal Pathogen',
    'summary': 'The most economically significant apple disease worldwide, causing velvety olive-green to black scabby lesions on leaves and corky cracks on mature fruit.',
    'symptoms': [
      'Dull olive-green to brown velvety spots on leaf surfaces with blurred margins.',
      'Lesions turn dark brown to black, puckering and distorting the leaf blade.',
      'Premature mid-summer orchard defoliation.',
      'Corky, cracked, scabby patches on mature apples.'
    ],
    'markers': 'Velvety olive-green spots with indistinct feathered borders, turning into corky raised fruit lesions.',
    'causes': 'Ascomycete Venturia inaequalis. Overwinters in fallen orchard floor leaves; releases spring ascospores.',
    'prevention': [
      'Mow and shred orchard floor leaves in autumn to accelerate decomposition.',
      'Prune trees in winter to open the canopy for rapid air drying.',
      'Plant scab-resistant cultivars (Liberty, GoldRush, Enterprise).'
    ],
    'organic': 'Lime sulfur and wettable sulfur during green-tip bud emergence; Bacillus bio-fungicides.',
    'chemical': 'Captan 80 WDG (FRAC M04), Difenoconazole + Cyprodinil (Inspire Super FRAC 3 + 9).',
    'advice': 'Use Mills leaf-wetness tables to calculate exact infection events following spring rainstorms.'
  },
  {
    'slug': 'black-rot',
    'title': 'Apple Black Rot',
    'scientific': 'Botryosphaeria obtusa',
    'crop': 'Apple, Pear',
    'type': 'Tree Fruit Canker & Rot',
    'summary': 'A triple-threat orchard pathogen that causes frogeye leaf spots, sunken wood cankers on branches, and firm black mummified fruit rot.',
    'symptoms': [
      'Frogeye circular foliar spots with tan centers and dark purple margins.',
      'Sunken reddish-brown cankers girdling limbs and killing upper branches.',
      'Concentric light and dark brown bands on fruit expanding until apples turn completely black and mummified.'
    ],
    'markers': 'Frogeye foliar rings with tan centers and purple edges; firm concentric fruit rot turning jet black.',
    'causes': 'Fungus Botryosphaeria obtusa. Overwinters in dead wood, cankers, and mummified apples.',
    'prevention': [
      'Prune out dead wood, cankers, and mummified fruit during dormant pruning.',
      'Burn or chip pruning wood; do not leave brush piles near orchards.',
      'Prevent physical fruit and bark injuries.'
    ],
    'organic': 'Copper sulfate during late dormancy; sulfur during cover spray periods.',
    'chemical': 'Thiophanate-methyl (FRAC 1), Mancozeb (FRAC M03 early season protectant).',
    'advice': 'Removing cankers and mummies from trees eliminates 90% of primary orchard inoculum.'
  },
  {
    'slug': 'citrus-greening',
    'title': 'Citrus Greening (HLB)',
    'scientific': 'Candidatus Liberibacter asiaticus',
    'crop': 'Orange, Lemon, Lime, Grapefruit',
    'type': 'Vascular Bacterial Disease',
    'summary': 'Huanglongbing (HLB), the most destructive disease of citrus worldwide. A phloem-limited bacterium vectored by psyllid insects, causing asymmetric leaf mottling and bitter fruit.',
    'symptoms': [
      'Asymmetric blotchy yellow mottle on leaves crossing veins irregularly.',
      'Yellowing of individual branches while remainder of canopy stays green (yellow shoot).',
      'Small, lopsided fruit that stays green at the stylar end and tastes bitter.',
      'Feeder root dieback and progressive tree mortality.'
    ],
    'markers': 'Asymmetric blotchy mottle crossing veins unevenly. Lopsided fruit with green stylar ends and dark aborted seeds.',
    'causes': 'Phloem-restricted bacterium CLas, vectored from tree to tree by the Asian Citrus Psyllid (Diaphorina citri).',
    'prevention': [
      'Plant certified disease-free nursery trees grown in screened structures.',
      'Scout bi-weekly for Asian citrus psyllid nymphs and adults.',
      'Immediately remove and destroy confirmed HLB-infected trees.'
    ],
    'organic': 'Horticultural mineral oils; Tamarixia radiata parasitoid wasp biological control.',
    'chemical': 'Systemic neonicotinoids (Imidacloprid) soil drench on young trees; foliar pyrethroid flushes.',
    'advice': 'No cure exists once infected. Management relies on psyllid insect vector control and tree sanitation.'
  },
  {
    'slug': 'powdery-mildew',
    'title': 'Powdery Mildew',
    'scientific': 'Podosphaera xanthii',
    'crop': 'Cucumber, Squash, Melon, Zucchini',
    'type': 'Ectoparasitic Fungal Disease',
    'summary': 'A widespread fungal disease that coats leaf surfaces in white, talcum-powder-like patches, leading to leaf chlorosis, premature drying, and reduced photosynthesis.',
    'symptoms': [
      'Circular, white, powdery talcum-like spots on upper and lower leaf surfaces.',
      'White fungal patches expand and coalesce to cover the entire leaf blade.',
      'Infected leaves turn yellow, then brown, and become dry, brittle, and paper-thin.',
      'Severe defoliation exposes developing fruit to sunscald.'
    ],
    'markers': 'Superficial white powdery talcum coating easily rubbed off with a finger. Does not require free standing water to infect.',
    'causes': 'Obligate biotrophic fungus Podosphaera xanthii. Conidia germinate under humid air without liquid water.',
    'prevention': [
      'Plant powdery mildew-resistant cucurbit varieties.',
      'Space plants 60-90 cm apart for generous air circulation.',
      'Trellis cucumber vines vertically to lift foliage off moist soil.'
    ],
    'organic': 'Potassium bicarbonate (3-4 g/L) + horticultural oil (5 ml/L); diluted milk spray (40/60); sulfur.',
    'chemical': 'Myclobutanil (FRAC 3), Pyraclostrobin (FRAC 11). Rotate FRAC groups.',
    'advice': 'Spray both upper and lower leaf surfaces thoroughly; powdery mildew often begins in shaded leaf undersides.'
  },
  {
    'slug': 'downy-mildew',
    'title': 'Downy Mildew',
    'scientific': 'Pseudoperonospora cubensis',
    'crop': 'Cucumber, Cantaloupe, Watermelon',
    'type': 'Vascular Oomycete Water-Mold',
    'summary': 'A fast-moving oomycete disease causing distinct angular, vein-bounded yellow chlorotic patches on upper leaf surfaces, with purplish-gray down underneath.',
    'symptoms': [
      'Angular, blocky yellow patches on upper leaf surfaces strictly bounded by leaf veins.',
      'Purplish-brown to charcoal downy mold on the undersides of yellow patches.',
      'Rapid necrotic leaf death and complete canopy collapse within days under rainy conditions.'
    ],
    'markers': 'Angular mosaic patches strictly bounded by leaf veins; purplish down on undersides. Lacks white talcum.',
    'causes': 'Oomycete Pseudoperonospora cubensis. Airborne sporangia travel hundreds of miles on storm fronts.',
    'prevention': [
      'Plant early-maturing, tolerant cucumber varieties.',
      'Irrigate with drip lines only; never run overhead sprinklers in the evening.',
      'Monitor national downy mildew forecasting networks.'
    ],
    'organic': 'Copper hydroxide soaps applied prior to rain events; bio-fungicides.',
    'chemical': 'Fluopicolide (FRAC 43), Cyazofamid (FRAC 21). Emergency protectants.',
    'advice': 'Downy Mildew moves with extraordinary speed. Apply protectants immediately when regional alerts trigger.'
  }
]

os.makedirs('public/diseases', exist_ok=True)

for d in diseases:
    slug = d['slug']
    path = f'public/diseases/{slug}.html'
    
    symptoms_html = ''.join(f'<li>{s}</li>' for s in d['symptoms'])
    prevention_html = ''.join(f'<li>{p}</li>' for p in d['prevention'])
    
    html = f"""<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{d['title']} ({d['scientific']}) – Symptoms & Treatment | FloraScan AI</title>
  <meta name="description" content="Identify {d['title']} ({d['scientific']}) on {d['crop']}. Symptoms, visual characteristics, prevention, FRAC fungicides, organic remedies, and AI leaf diagnostics." />
  <link rel="canonical" href="https://florascan.ai/diseases/{slug}" />
  <meta property="og:title" content="{d['title']} ({d['scientific']}) – Plant Disease Guide | FloraScan AI" />
  <meta property="og:description" content="{d['summary']}" />
  <meta property="og:image" content="https://florascan.ai/og-image.png" />
  <meta property="og:url" content="https://florascan.ai/diseases/{slug}" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #090d16; color: #e2e8f0; margin: 0; padding: 0; line-height: 1.6; }}
    h1, h2, h3 {{ color: #fff; }}
    .container {{ max-width: 900px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }}
    .nav {{ display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1e293b; padding-bottom: 1rem; margin-bottom: 2rem; }}
    .brand {{ font-size: 1.25rem; font-weight: 800; color: #34d399; text-decoration: none; }}
    .badge {{ background: #064e3b; color: #6ee7b7; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; border: 1px solid #059669; }}
    .card {{ background: #0f172a; border: 1px solid #1e293b; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.5rem; }}
    .btn {{ display: inline-flex; align-items: center; gap: 0.5rem; background: #10b981; color: #022c22; font-weight: 800; padding: 0.75rem 1.5rem; border-radius: 0.75rem; text-decoration: none; margin-top: 1rem; }}
    ul {{ padding-left: 1.25rem; }}
    li {{ margin-bottom: 0.5rem; }}
    .footer-links {{ margin-top: 3rem; border-top: 1px solid #1e293b; padding-top: 1.5rem; font-size: 0.85rem; color: #94a3b8; }}
    .footer-links a {{ color: #34d399; text-decoration: none; margin-right: 1rem; }}
  </style>
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "ItemPage",
    "name": "{d['title']} ({d['scientific']}) Agricultural Pathology Guide",
    "url": "https://florascan.ai/diseases/{slug}",
    "description": "{d['summary']}",
    "breadcrumb": {{
      "@type": "BreadcrumbList",
      "itemListElement": [
        {{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://florascan.ai/" }},
        {{ "@type": "ListItem", "position": 2, "name": "Plant Diseases", "item": "https://florascan.ai/diseases/" }},
        {{ "@type": "ListItem", "position": 3, "name": "{d['title']}", "item": "https://florascan.ai/diseases/{slug}" }}
      ]
    }}
  }}
  </script>
</head>
<body>
  <div class="container">
    <nav class="nav">
      <a href="/" class="brand">🌿 FloraScan AI</a>
      <a href="/diseases/" style="color: #94a3b8; text-decoration: none; font-size: 0.875rem;">← All Diseases</a>
    </nav>

    <header style="margin-bottom: 2rem;">
      <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
        <span class="badge">{d['type']}</span>
        <span class="badge" style="background: #1e293b; border-color: #334155; color: #94a3b8;">Crops: {d['crop']}</span>
      </div>
      <h1 style="font-size: 2.5rem; margin: 0.25rem 0;">{d['title']}</h1>
      <p style="font-style: italic; color: #34d399; margin: 0;">{d['scientific']}</p>
      <p style="font-size: 1.1rem; color: #cbd5e1; margin-top: 1rem;">{d['summary']}</p>
      <a href="/#diagnosticStudio" class="btn">🔬 Test Leaf Specimen in AI Studio</a>
    </header>

    <div class="card">
      <h2 style="font-size: 1.25rem; margin-top: 0;">🔍 Diagnostic Symptoms & Visual Markers</h2>
      <ul>{symptoms_html}</ul>
      <p style="background: #1e293b; padding: 0.75rem 1rem; border-radius: 0.5rem; font-size: 0.9rem; margin-top: 1rem;">
        <strong>Visual Morphology Rule:</strong> {d['markers']}
      </p>
    </div>

    <div class="card">
      <h2 style="font-size: 1.25rem; margin-top: 0;">🧬 Causes & Biology</h2>
      <p>{d['causes']}</p>
    </div>

    <div class="card">
      <h2 style="font-size: 1.25rem; margin-top: 0;">🚜 Cultural Prevention & Sanitation</h2>
      <ul>{prevention_html}</ul>
    </div>

    <div class="card">
      <h2 style="font-size: 1.25rem; margin-top: 0;">🌱 Certified Organic Remedies</h2>
      <p>{d['organic']}</p>
    </div>

    <div class="card">
      <h2 style="font-size: 1.25rem; margin-top: 0;">🧪 Chemical Protocols & FRAC Fungicides</h2>
      <p>{d['chemical']}</p>
      <p style="font-size: 0.85rem; color: #f59e0b; margin-top: 0.5rem;">⚠️ <strong>Stewardship:</strong> {d['advice']}</p>
    </div>

    <div class="footer-links">
      <p>FloraScan AI — Precision Agricultural Disease Intelligence Platform.</p>
      <a href="/">Home Diagnostic Studio</a>
      <a href="/diseases/">Plant Disease Directory</a>
      <a href="/sitemap.xml">XML Sitemap</a>
      <a href="/robots.txt">Robots.txt</a>
    </div>
  </div>
</body>
</html>
"""
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)

# Index page
cards_html = "".join([f"""<a href="/diseases/{d['slug']}.html" class="card">
  <span class="crop">{d['crop']}</span>
  <h3>{d['title']}</h3>
  <div class="sci">{d['scientific']}</div>
  <p class="desc">{d['summary']}</p>
</a>""" for d in diseases])

index_html = f"""<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Plant Disease Directory – Comprehensive Crop Pathology Guides | FloraScan AI</title>
  <meta name="description" content="Browse comprehensive plant disease identification guides supported by FloraScan AI. Symptoms, visual markers, organic remedies, and FRAC-aligned treatment plans for food crops and ornamentals." />
  <link rel="canonical" href="https://florascan.ai/diseases/" />
  <meta property="og:title" content="Plant Disease Directory – Crop Pathology Guides | FloraScan AI" />
  <meta property="og:description" content="Scientific foliar pathology guides for tomato, potato, rose, apple, citrus, and cucurbit diseases." />
  <meta property="og:image" content="https://florascan.ai/og-image.png" />
  <meta property="og:url" content="https://florascan.ai/diseases/" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #090d16; color: #e2e8f0; margin: 0; padding: 2rem 1.25rem 4rem; line-height: 1.6; }}
    .container {{ max-width: 1000px; margin: 0 auto; }}
    .nav {{ display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1e293b; padding-bottom: 1rem; margin-bottom: 2rem; }}
    .brand {{ font-size: 1.5rem; font-weight: 800; color: #34d399; text-decoration: none; }}
    .grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; margin-top: 2rem; }}
    .card {{ background: #0f172a; border: 1px solid #1e293b; border-radius: 1rem; padding: 1.25rem; transition: transform 0.2s, border-color 0.2s; text-decoration: none; color: inherit; display: block; }}
    .card:hover {{ transform: translateY(-3px); border-color: #10b981; }}
    .card h3 {{ margin: 0.25rem 0; color: #fff; font-size: 1.2rem; }}
    .sci {{ color: #34d399; font-style: italic; font-size: 0.85rem; margin-bottom: 0.5rem; }}
    .crop {{ font-size: 0.75rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; }}
    .desc {{ font-size: 0.85rem; color: #94a3b8; margin-top: 0.5rem; }}
  </style>
</head>
<body>
  <div class="container">
    <nav class="nav">
      <a href="/" class="brand">🌿 FloraScan AI</a>
      <a href="/#diagnosticStudio" style="color: #34d399; text-decoration: none; font-weight: 700;">Open Diagnostic Studio →</a>
    </nav>
    <header>
      <h1 style="font-size: 2.5rem; color: #fff; margin-bottom: 0.5rem;">Plant Disease Identification Directory</h1>
      <p style="color: #94a3b8; font-size: 1.1rem; max-width: 700px;">Explore scientific agronomic guides for common crop pathologies. Learn visual symptoms, causes, organic solutions, and chemical treatment protocols.</p>
    </header>
    <div class="grid">
      {cards_html}
    </div>
  </div>
</body>
</html>
"""

with open('public/diseases/index.html', 'w', encoding='utf-8') as f:
    f.write(index_html)

print("Generated all 9 static disease pages + 1 directory index in public/diseases/ successfully!")
