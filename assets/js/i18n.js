/* ============================================================
   i18n.js — Bilingual Translation Engine (EN / ES)
   HGUGM Surgical Residency Course
   ============================================================ */

'use strict';

const I18N = {
  _locale:  'en',
  _strings: {},

  /* ── Boot ────────────────────────────────────────────────── */
  async init() {
    const saved = localStorage.getItem('surgres_locale') || 'en';
    await this.setLocale(saved, false);   // false = suppress DOM apply on first load
  },

  /* ── Set locale and update DOM ───────────────────────────── */
  async setLocale(locale, applyDOM = true) {
    if (!['en', 'es'].includes(locale)) locale = 'en';

    try {
      const res  = await fetch(`content/i18n/${locale}.json`);
      const data = await res.json();
      this._strings = data;
      this._locale  = locale;
    } catch {
      // Fallback: keep current strings if fetch fails
      console.warn(`[i18n] Failed to load locale "${locale}". Keeping "${this._locale}".`);
      return;
    }

    localStorage.setItem('surgres_locale', locale);
    document.documentElement.setAttribute('lang', locale);

    // Update the toggle flag icon
    const flagEl = document.getElementById('langFlag');
    const codeEl = document.getElementById('langCode');
    if (flagEl) flagEl.textContent = locale === 'es' ? '🇪🇸' : '🇬🇧';
    if (codeEl) codeEl.textContent = locale === 'es' ? 'ES' : 'EN';

    if (applyDOM) {
      this.applyToDOM();
      window.dispatchEvent(new CustomEvent('locale-changed', { detail: { locale } }));
    }
  },

  /* ── Translate a key (dot-notation) ─────────────────────── */
  t(key, vars = {}) {
    const str = key.split('.').reduce((obj, k) => obj?.[k], this._strings);
    if (!str) return key;
    return str.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] !== undefined ? vars[k] : '');
  },

  /* ── Apply data-i18n attributes to DOM ──────────────────── */
  applyToDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.getAttribute('data-i18n-placeholder'));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.title = this.t(el.getAttribute('data-i18n-title'));
    });
  },

  /* ── Toggle EN ↔ ES ──────────────────────────────────────── */
  toggle() {
    const next = this._locale === 'en' ? 'es' : 'en';
    this.setLocale(next, true);
  },

  getCurrentLocale() { return this._locale; },
};
