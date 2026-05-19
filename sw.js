/* ─────────────────────────────────────────────────────────────────────────────
   HGUGM Urología — Curso de Residentes MIR — Service Worker
   Hospital General Universitario Gregorio Marañón · Madrid
   HGUGM · Residentes
───────────────────────────────────────────────────────────────────────────── */

const CACHE_NAME = 'urology-hgugm-v1';

const PRECACHE_ASSETS = [
  './', './index.html', './manifest.json',
  './assets/css/main.css', './assets/js/app.js', './assets/js/reader.js',
  './assets/js/quiz.js', './assets/js/progress.js', './assets/js/search.js',
  './assets/js/knowledge.js', './assets/js/abbreviations.js', './assets/js/i18n.js',
  './content/i18n/en.json', './content/i18n/es.json', './assets/img/logo.svg',
  './content/pearls/daily_pearls.json',
  './content/chapters/a1_prostate_staging.json',
  './content/chapters/a2_prostate_treatment.json',
  './content/chapters/a3_renal_cell_carcinoma.json',
  './content/chapters/a4_bladder_cancer.json',
  './content/chapters/a5_radical_cystectomy.json',
  './content/chapters/a6_testicular_cancer.json',
  './content/chapters/a7_upper_tract_urothelial.json',
  './content/chapters/b1_bph_management.json',
  './content/chapters/b2_male_luts.json',
  './content/chapters/b3_urinary_incontinence.json',
  './content/chapters/c1_urolithiasis_medical.json',
  './content/chapters/c2_stone_surgery.json',
  './content/chapters/c3_ureterorenoscopy.json',
  './content/chapters/c4_pcnl.json',
  './content/chapters/d1_female_sui.json',
  './content/chapters/d2_pelvic_organ_prolapse.json',
  './content/chapters/d3_neurogenic_bladder.json',
  './content/chapters/e1_urinary_tract_infections.json',
  './content/chapters/e2_sti_urology.json',
  './content/chapters/e3_male_infertility.json',
  './content/chapters/f1_laparoscopic_robotic.json',
  './content/chapters/f2_urethral_stricture.json',
  './content/chapters/f3_genitourinary_trauma.json',
  './content/chapters/g1_clinical_trial_design.json',
  './content/chapters/g2_biostatistics_urology.json',
  './content/chapters/g3_evidence_based_urology.json',
  './content/chapters/g4_scientific_writing_urology.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        const toCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
        return response;
      }).catch(() => {
        if (event.request.mode === 'navigate') return caches.match('./index.html');
        return new Response('Sin conexión', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});
