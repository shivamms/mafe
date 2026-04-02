/**
 * Regional OTC medicine brand knowledge base.
 * Injected into the system prompt so Claude can recommend
 * commonly available brands by region.
 *
 * Structure: category → generic → brands per region
 * Regions: north_america | latin_america | south_india
 *
 * Sources: Publicly available pharmacy data, WHO essential medicines list,
 * regional drug regulatory databases (FDA, CDSCO, ANVISA, COFEPRIS).
 *
 * NOTE: This will be replaced by a proper RAG database in Phase 2.
 * Brand availability can change — always instruct users to verify at their local pharmacy.
 */

export const OTC_KNOWLEDGE = `
## Regional OTC Medicine Knowledge Base

Use this to suggest commonly available brands when discussing OTC medicines.
Always infer the user's region from their language or stated location:
- Tamil / Telugu / Kannada / Malayalam → South India
- Spanish → Latin America (Mexico, Colombia, Argentina, etc.)
- Portuguese → Brazil
- English → show all relevant regions

### Pain & Fever

**Generic: Paracetamol (Acetaminophen)**
- South India: Crocin, Dolo-650, Paracip, Metacin, Pyrigesic
- Latin America: Panadol, Tempra, Mejoral, Termofren, Tafirol
- North America: Tylenol, Tempra, Panadol

**Generic: Ibuprofen**
- South India: Brufen, Combiflam (ibuprofen + paracetamol), Ibugesic, Advil
- Latin America: Advil, Motrin, Ibuprofeno (generic widely available), Temprafen
- North America: Advil, Motrin, Midol (for menstrual pain)

**Generic: Naproxen**
- South India: Naprosyn, Naxdom (less common OTC)
- Latin America: Flanax, Aleve, Apronax
- North America: Aleve, Naprosyn

**Generic: Aspirin**
- South India: Disprin, Aspro (note: not for children under 16)
- Latin America: Aspirina, Bayaspirina, Mejoral Aspirina
- North America: Bayer Aspirin, Bufferin, Ecotrin

---

### Antacids & Digestive

**Generic: Calcium carbonate / antacid**
- South India: Eno (effervescent), Gelusil, Digene, Mucaine, Kremil-S
- Latin America: Eno, Alka-Seltzer, Enterex Antiacido, Gaviscon
- North America: Tums, Rolaids, Pepto-Bismol, Gaviscon

**Generic: Omeprazole / PPIs (now OTC in many regions)**
- South India: Omez, Pan, Pantocid (some require prescription — check locally)
- Latin America: Omeprazol (generic), Losec, Prilosec
- North America: Prilosec OTC, Nexium 24HR, Zegerid OTC

**Generic: Loperamide (anti-diarrheal)**
- South India: Imodium, Eldoper, Lopamide
- Latin America: Imodium, Enterex, Loperamida (generic)
- North America: Imodium, Diamode

**Generic: ORS (Oral Rehydration Salts)**
- South India: Electral, ORS-L, Pedialyte, Enerzal
- Latin America: Pedialyte, Suero Oral, Hidral
- North America: Pedialyte, DripDrop, Nuun

---

### Allergies & Antihistamines

**Generic: Cetirizine (non-drowsy)**
- South India: Cetcip, Alerid, Cetzine, Zyrtec, Okacet
- Latin America: Zyrtec, Aleroff, Cetirizina (generic)
- North America: Zyrtec, Reactine (Canada)

**Generic: Loratadine (non-drowsy)**
- South India: Lorfast, Lorastine, Claritin
- Latin America: Claritin, Clarityne, Loratadina (generic)
- North America: Claritin, Alavert

**Generic: Fexofenadine (non-drowsy)**
- South India: Allegra, Fexo, Telekast-F
- Latin America: Allegra, Fexofenadin (generic)
- North America: Allegra

**Generic: Diphenhydramine (causes drowsiness)**
- South India: Benadryl (cough + allergy), Phenergan
- Latin America: Benadryl, Benadril
- North America: Benadryl, ZzzQuil (for sleep)

---

### Cough & Cold

**Generic: Dextromethorphan (dry cough suppressant)**
- South India: Alex, Kofarest, Rexcof
- Latin America: Robitussin DM, Dextrase, NyQuil (some markets)
- North America: Robitussin DM, Delsym, NyQuil

**Generic: Guaifenesin (expectorant — loosens mucus)**
- South India: Grilinctus, Phensedyl (some variants), Ascoril
- Latin America: Mucinex, Robitussin, Guaifenesina (generic)
- North America: Mucinex, Robitussin

**Generic: Oxymetazoline (nasal decongestant spray)**
- South India: Nasivion, Otrivin, Sinarest Nasal
- Latin America: Otrivin, Afrin, Nasivin
- North America: Afrin, Dristan, Zicam

---

### Skin & Topical

**Generic: Hydrocortisone (mild anti-inflammatory)**
- South India: Hycort, Locoid, Cortef (check OTC availability locally)
- Latin America: Cortaid, Hydrocortisona (generic), Locoid
- North America: Cortaid, Cortizone-10

**Generic: Antiseptic (povidone-iodine)**
- South India: Betadine, Wescodyne
- Latin America: Betadine, Isodine, Povidona (generic)
- North America: Betadine, Povidone-iodine (generic)

**Generic: Topical antibiotic (minor cuts)**
- South India: Soframycin, Neosporin, Fucidin
- Latin America: Neosporín, Bactroban (some require Rx), Fucidin
- North America: Neosporin, Polysporin, Bacitracin

---

### Important OTC Safety Rules (always apply these)
1. Never recommend a specific dose — always say "follow the package instructions"
2. Always mention key contraindications relevant to the category:
   - Ibuprofen/NSAIDs: avoid in pregnancy (especially 3rd trimester), kidney disease, stomach ulcers, blood thinners
   - Aspirin: never for children under 16 (Reye's syndrome risk)
   - Diphenhydramine: avoid when driving, elderly patients
   - Decongestants: avoid with high blood pressure, heart conditions
3. Always add: "A pharmacist at your local pharmacy can confirm availability and help you choose"
4. If user mentions any chronic condition, medications, or pregnancy: defer to pharmacist/doctor
5. Availability and brand names vary — user should verify locally
`;
