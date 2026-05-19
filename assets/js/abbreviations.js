/* ============================================================
   abbreviations.js — Medical Abbreviation Tooltip System
   HGUGM Surgical Residency Course
   ============================================================ */

'use strict';

const ABBREVIATIONS = {
  // ── Surgical Oncology ────────────────────────────────────────
  "TME":    "Total Mesorectal Excision — surgical technique for rectal cancer removing the entire mesorectal envelope with intact fascia propria",
  "CRM":    "Circumferential Resection Margin — closest distance between tumour and the mesorectal fascia on MRI or pathology; <1 mm = threatened",
  "R0":     "R0 resection — microscopically clear surgical margins (no tumour cells at the resection edge)",
  "R1":     "R1 resection — microscopically involved margin (tumour cells present at ≤1 mm from the resection edge)",
  "R2":     "R2 resection — macroscopically involved margin (visible residual tumour left in situ)",
  "LAR":    "Low Anterior Resection — sphincter-preserving surgery for mid/upper rectal cancer via abdominal approach",
  "APR":    "Abdominoperineal Resection — surgery removing the rectum and anus entirely, requiring permanent end colostomy",
  "ELAPE":  "Extralevator Abdominoperineal Excision — extended APR with en-bloc levator ani resection to reduce CRM positivity",
  "taTME":  "Transanal Total Mesorectal Excision — TME dissection performed from below via a transanal approach",
  "CRS":    "Cytoreductive Surgery — surgical removal of all visible peritoneal tumour deposits (peritonectomy procedures)",
  "HIPEC":  "Hyperthermic Intraperitoneal Chemotherapy — heated chemotherapy perfused into the abdominal cavity at 41–43°C during surgery",
  "PCI":    "Peritoneal Cancer Index — scoring system (0–39) quantifying peritoneal tumour burden by anatomical region and nodule size",
  "MDT":    "Multidisciplinary Team — tumour board comprising surgery, oncology, radiology, pathology, and allied health",
  "MDM":    "Multidisciplinary Meeting — the MDT meeting for case discussion and treatment planning",
  "SLNB":   "Sentinel Lymph Node Biopsy — sampling the first draining lymph node to assess axillary status in breast cancer",
  "DCIS":   "Ductal Carcinoma In Situ — non-invasive breast cancer confined within the ductal epithelium, no basement membrane invasion",
  "BRCA":   "BRCA1/BRCA2 — tumour suppressor genes; germline mutations confer high lifetime risk of breast and ovarian cancer",
  "D1":     "D1 lymphadenectomy (gastric) — removal of perigastric lymph nodes (stations 1–6)",
  "D2":     "D2 lymphadenectomy (gastric) — D1 plus removal of lymph nodes along coeliac axis branches (stations 7–12); standard for curative-intent gastric surgery",
  "HPB":    "Hepatopancreatobiliary — surgical subspecialty covering liver, pancreas, and biliary tree surgery",
  "HCC":    "Hepatocellular Carcinoma — primary liver cancer arising from hepatocytes; most common primary liver malignancy worldwide",
  "IPMN":   "Intraductal Papillary Mucinous Neoplasm — pancreatic cystic lesion with malignant potential; main-duct IPMN has highest risk",
  "NEN":    "Neuroendocrine Neoplasm — tumour arising from neuroendocrine cells; includes well-differentiated NETs and poorly-differentiated NECs",
  "GIST":   "Gastrointestinal Stromal Tumour — mesenchymal tumour driven by KIT or PDGFRA mutations; treated with imatinib",
  "STS":    "Soft Tissue Sarcoma — malignant tumour of mesenchymal origin; graded by FNCLCC system",
  "RPS":    "Retroperitoneal Sarcoma — sarcoma arising in the retroperitoneal space; most commonly liposarcoma or leiomyosarcoma",
  "PSOGI":  "Peritoneal Surface Oncology Group International — international consensus body for peritoneal malignancy management",
  "CME":    "Complete Mesocolic Excision — oncological colonic resection maintaining the intact mesocolon with high vascular tie",
  "CVL":    "Central Vascular Ligation — ligation of the feeding vessel at its origin during CME colectomy",
  "CC":     "Completeness of Cytoreduction — CC-0: no residual disease; CC-1: ≤2.5 mm; CC-2: 2.5–25 mm; CC-3: >25 mm",
  "PMP":    "Pseudomyxoma Peritonei — clinical syndrome of mucinous peritoneal dissemination, almost invariably from appendiceal origin",
  "WDLPS":  "Well-Differentiated Liposarcoma — low-grade fat-containing sarcoma; MDM2-amplified; does not metastasise",
  "DDLPS":  "Dedifferentiated Liposarcoma — high-grade component arising from WDLPS; MDM2-amplified; can metastasise",
  "LMS":    "Leiomyosarcoma — smooth muscle sarcoma; retroperitoneal LMS has dominant distant recurrence pattern (lung, liver)",
  // ── Neoadjuvant / Treatment ──────────────────────────────────
  "CRT":    "Chemoradiotherapy — concurrent chemotherapy and radiotherapy; used in rectal, oesophageal, and cervical cancer",
  "LCRT":   "Long-course Chemoradiotherapy — 45–50.4 Gy in 25–28 fractions + concurrent fluoropyrimidine; allows tumour downsizing before surgery",
  "SCRT":   "Short-course Radiotherapy — 5×5 Gy in 5 fractions; used for resectable rectal cancer or rapid palliation",
  "TNT":    "Total Neoadjuvant Therapy — delivering all systemic therapy and radiotherapy before surgery to improve pCR and compliance",
  "pCR":    "Pathological Complete Response — no viable tumour in the surgical specimen after neoadjuvant therapy",
  "NaC":    "Neoadjuvant Chemotherapy — chemotherapy administered before the definitive surgical procedure",
  "W&W":    "Watch and Wait — non-operative management protocol after clinical complete response to CRT; requires strict endoscopic/MRI surveillance",
  "FOLFOX": "Folinic acid + 5-Fluorouracil + Oxaliplatin — standard chemotherapy regimen for colorectal cancer",
  "FOLFIRI": "Folinic acid + 5-Fluorouracil + Irinotecan — second-line colorectal cancer chemotherapy regimen",
  "FLOT":   "5-Fluorouracil + Leucovorin + Oxaliplatin + Docetaxel — perioperative chemotherapy regimen for gastric cancer (FLOT4 trial)",
  "CAPOX":  "Capecitabine + Oxaliplatin — oral-based doublet chemotherapy for colorectal and gastric cancer",
  // ── Staging / Scoring ────────────────────────────────────────
  "TNM":    "Tumour-Node-Metastasis — the international cancer staging system published by AJCC and UICC",
  "AJCC":   "American Joint Committee on Cancer — publishes the TNM staging system; 8th Edition is current",
  "UICC":   "Union for International Cancer Control — international body co-publishing TNM staging with AJCC",
  "ECOG":   "Eastern Cooperative Oncology Group performance status — 0 (fully active) to 5 (dead); used for treatment eligibility",
  "ASA":    "American Society of Anesthesiologists physical status classification — I (healthy) to VI (brain-dead); guides anaesthetic risk",
  "MPI":    "Mannheim Peritonitis Index — validated scoring system for risk stratification in secondary peritonitis",
  "APACHE": "Acute Physiology and Chronic Health Evaluation — ICU severity scoring system",
  "POSSUM": "Physiological and Operative Severity Score for the enUmeration of Mortality and Morbidity — surgical risk scoring",
  "FNCLCC": "Fédération Nationale des Centres de Lutte contre le Cancer — grading system for soft tissue sarcomas (differentiation + mitosis + necrosis)",
  // ── Research / Statistics ────────────────────────────────────
  "RCT":    "Randomised Controlled Trial — highest level of interventional evidence; gold standard for treatment comparison",
  "OR":     "Odds Ratio — measure of association; OR >1 indicates increased odds in the exposed group",
  "HR":     "Hazard Ratio — ratio of hazard rates between two groups in survival analysis; HR <1 favours the treatment group",
  "CI":     "Confidence Interval — range of values within which the true population parameter lies with a given probability (usually 95%)",
  "NNT":    "Number Needed to Treat — number of patients who must receive treatment for one additional patient to benefit",
  "NNH":    "Number Needed to Harm — number of patients who must receive treatment for one additional patient to be harmed",
  "OS":     "Overall Survival — time from diagnosis or treatment to death from any cause",
  "DFS":    "Disease-Free Survival — time from treatment to recurrence or death from any cause",
  "PFS":    "Progression-Free Survival — time from treatment to disease progression or death from any cause",
  "RFS":    "Recurrence-Free Survival — time from surgery to first recurrence or death",
  "ROC":    "Receiver Operating Characteristic curve — plots sensitivity vs (1–specificity) across thresholds to evaluate diagnostic tests",
  "AUC":    "Area Under the Curve — summary statistic of ROC curve; 1.0 = perfect discrimination, 0.5 = no discrimination",
  "SD":     "Standard Deviation — measure of data dispersion around the mean; 1 SD contains 68% of normally distributed data",
  "IQR":    "Interquartile Range — range between 25th and 75th percentiles; robust measure of dispersion for skewed data",
  "PICO":   "Population, Intervention, Comparison, Outcome — framework for structuring clinical research questions",
  "CONSORT": "Consolidated Standards of Reporting Trials — reporting guideline for randomised controlled trials",
  "STROBE": "Strengthening the Reporting of Observational Studies in Epidemiology — reporting guideline for observational studies",
  "PRISMA": "Preferred Reporting Items for Systematic Reviews and Meta-Analyses — reporting guideline for systematic reviews",
  "GRADE":  "Grading of Recommendations Assessment, Development and Evaluation — framework for rating evidence quality and recommendation strength",
  "ITT":    "Intention-to-Treat — analysis including all randomised patients regardless of protocol adherence; gold standard for RCT analysis",
  "PP":     "Per-Protocol — analysis including only patients who adhered to the protocol; secondary analysis in RCTs",
  // ── Anatomy ──────────────────────────────────────────────────
  "IVC":    "Inferior Vena Cava — major vein draining the lower body; involvement in RPS and HCC requires vascular planning",
  "SMA":    "Superior Mesenteric Artery — supplies the midgut; key landmark in pancreatic and right colon surgery",
  "SMV":    "Superior Mesenteric Vein — joins the splenic vein to form the portal vein; key landmark in pancreaticoduodenectomy",
  "IMA":    "Inferior Mesenteric Artery — supplies the hindgut; ligated in left colectomy and rectal surgery",
  "IMV":    "Inferior Mesenteric Vein — drains the hindgut to the splenic vein",
  "CBD":    "Common Bile Duct — the duct draining bile from the liver and gallbladder into the duodenum",
  "PHT":    "Portal Hypertension — increased pressure in the portal venous system; complication of cirrhosis",
  "PD":     "Pancreaticoduodenectomy (Whipple procedure) — surgical removal of the pancreatic head, duodenum, and bile duct",
  "DP":     "Distal Pancreatectomy — removal of the body and tail of the pancreas, usually with splenectomy",
  // ── Procedures ───────────────────────────────────────────────
  "ERCP":   "Endoscopic Retrograde Cholangiopancreatography — endoscopic procedure for biliary and pancreatic duct imaging and intervention",
  "EUS":    "Endoscopic Ultrasound — combines endoscopy with ultrasound; used for staging and biopsy of GI tumours",
  "PET":    "Positron Emission Tomography — functional imaging using radiotracer (usually FDG) to detect metabolically active tissue",
  "FDG":    "Fluorodeoxyglucose — radiotracer used in PET imaging; taken up by metabolically active (including malignant) cells",
  "CT":     "Computed Tomography — cross-sectional X-ray imaging; primary modality for staging and surveillance in surgical oncology",
  "MRI":    "Magnetic Resonance Imaging — soft tissue imaging; essential for rectal cancer staging (CRM assessment) and liver lesion characterisation",
  "CEUS":   "Contrast-Enhanced Ultrasound — ultrasound with microbubble contrast; used for liver lesion characterisation",
  "ICG":    "Indocyanine Green — fluorescent dye used intraoperatively for SLNB, liver segment delineation, and bile leak detection",
  "PIPAC":  "Pressurised Intraperitoneal Aerosol Chemotherapy — laparoscopic delivery of aerosolised chemotherapy under pressure for palliative treatment of peritoneal malignancy",
  "EPIC":   "Early Postoperative Intraperitoneal Chemotherapy — chemotherapy instilled through drains in POD 1–5 after CRS",
  // ── Guidelines / Institutions ────────────────────────────────
  "NCCN":   "National Comprehensive Cancer Network — US guidelines body; publishes annually updated clinical practice guidelines",
  "ESMO":   "European Society for Medical Oncology — European clinical practice guidelines for oncological conditions",
  "JGCA":   "Japanese Gastric Cancer Association — publishes gastric cancer treatment guidelines; D2 lymphadenectomy is standard",
  "ASCO":   "American Society of Clinical Oncology — US oncology professional society",
  "SSO":    "Society of Surgical Oncology — US surgical oncology society",
  "SAGES":  "Society of American Gastrointestinal and Endoscopic Surgeons",
  "EAES":   "European Association for Endoscopic Surgery",
  "WSES":   "World Society of Emergency Surgery — publishes evidence-based guidelines for emergency surgery",
  "EASL":   "European Association for the Study of the Liver — publishes guidelines for HCC, cirrhosis, and biliary disease",
  "TARPSWG": "Trans-Atlantic RPS Working Group — international consensus body for retroperitoneal sarcoma management",
  "HGUGM":  "Hospital General Universitario Gregorio Marañón — tertiary referral centre in Madrid, Spain",
  "IiSGM":  "Instituto de Investigación Sanitaria Gregorio Marañón — the research institute affiliated with HGUGM",
  "UCM":    "Universidad Complutense de Madrid — largest university in Spain",
  "EBPSM":  "European Board of Peritoneal Surface Malignancy — subspecialty board certification for peritoneal oncology surgeons",
  "PGY":    "Postgraduate Year — level of residency training (PGY1 = first year, PGY4 = fourth/final year in most programmes)",
  // ── Drugs / Regimens ─────────────────────────────────────────
  "CDK4":   "Cyclin-Dependent Kinase 4 — cell cycle regulator; amplified in WDLPS/DDLPS; target of CDK4/6 inhibitors",
  "MDM2":   "Mouse Double Minute 2 — p53 regulator; amplified in WDLPS and DDLPS; diagnostic marker detected by FISH or IHC",
  "VEGF":   "Vascular Endothelial Growth Factor — angiogenesis driver; targeted by bevacizumab",
  "KIT":    "KIT proto-oncogene — tyrosine kinase receptor; mutated in most GISTs; target of imatinib",
  "BRAF":   "B-Raf proto-oncogene — serine/threonine kinase; V600E mutation in ~50% of melanomas; target of vemurafenib/dabrafenib",
  "IHC":    "Immunohistochemistry — laboratory technique using antibodies to detect specific proteins in tissue sections",
  "FISH":   "Fluorescence In Situ Hybridisation — molecular cytogenetics technique detecting gene amplification or rearrangement",
  "BAP1":   "BRCA1-Associated Protein 1 — tumour suppressor gene; germline mutations confer BAP1 tumour predisposition syndrome (mesothelioma, uveal melanoma, ccRCC)",
  "ccRCC":  "Clear Cell Renal Cell Carcinoma — most common subtype of renal cell carcinoma; associated with VHL mutation and BAP1 syndrome"
};

/* ── Tooltip Application ─────────────────────────────────────── */

/**
 * Walk all text nodes in containerEl and wrap known abbreviations in
 * <abbr class="abbr-tooltip" title="…"> elements.
 * Call this after any content is injected into the DOM.
 *
 * @param {Element} containerEl
 */
function applyAbbreviationTooltips(containerEl) {
  if (!containerEl) return;

  // Build regex sorted longest-first to prevent partial matches (e.g. WDLPS before LPS)
  const keys = Object.keys(ABBREVIATIONS)
    .sort((a, b) => b.length - a.length)
    .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (!keys.length) return;

  const regex = new RegExp(`\\b(${keys.join('|')})\\b`, 'g');

  // TreeWalker visits only text nodes, skipping already-processed nodes
  const walker = document.createTreeWalker(
    containerEl,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        // Skip nodes inside elements we must not touch
        if (parent.closest('abbr, code, pre, script, style, .abbr-applied')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const nodesToReplace = [];
  let node;
  while ((node = walker.nextNode())) {
    regex.lastIndex = 0;
    if (regex.test(node.textContent)) {
      nodesToReplace.push(node);
    }
  }

  nodesToReplace.forEach(textNode => {
    regex.lastIndex = 0;
    if (!regex.test(textNode.textContent)) return;

    regex.lastIndex = 0;
    const html = textNode.textContent.replace(regex, (match) => {
      const def = ABBREVIATIONS[match];
      if (!def) return match;
      const safeTitle = def.replace(/"/g, '&quot;');
      return `<abbr class="abbr-tooltip" title="${safeTitle}">${match}</abbr>`;
    });

    const span = document.createElement('span');
    span.className = 'abbr-applied';
    span.innerHTML = html;
    textNode.parentNode.replaceChild(span, textNode);
  });
}

/* ── Mobile tap-to-show ──────────────────────────────────────── */
// On touch devices CSS :hover doesn't fire; add/remove a class on tap instead
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (e) => {
    // Close any open tooltip first
    document.querySelectorAll('.abbr-tooltip.tooltip-active').forEach(el => {
      if (el !== e.target) el.classList.remove('tooltip-active');
    });

    if (e.target.classList.contains('abbr-tooltip')) {
      e.target.classList.toggle('tooltip-active');
    }
  });
});
