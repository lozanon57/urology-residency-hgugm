/* ============================================================
   knowledge.js — Knowledge Base & Pearls Loader
   HGUGM Surgical Residency Course
   ============================================================ */

'use strict';

const Knowledge = {
  _pearls: [],
  _index: null,

  /* ── Load Pearls ─────────────────────────────────────────── */
  async loadPearls() {
    try {
      const res = await fetch('content/pearls/daily_pearls.json');
      if (res.ok) {
        const data = await res.json();
        this._pearls = data.pearls || [];
      }
    } catch {
      // Pearls optional — degrade gracefully
    }
  },

  /* ── Random Pearl (for home page) ───────────────────────── */
  getRandomPearl() {
    if (!this._pearls.length) return null;
    const dayOfYear = Math.floor(Date.now() / 86400000);
    const idx = dayOfYear % this._pearls.length;
    return this._pearls[idx];
  },

  /* ── Search Pearls ───────────────────────────────────────── */
  searchPearls(query) {
    const q = query.toLowerCase();
    return this._pearls.filter(p =>
      (p.text && p.text.toLowerCase().includes(q)) ||
      (p.source && p.source.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  },

  /* ── Knowledge Base Index ────────────────────────────────── */
  async loadIndex() {
    if (this._index !== null) return this._index;
    try {
      const res = await fetch('knowledge-base/index.json');
      if (res.ok) {
        this._index = await res.json();
      } else {
        this._index = { chunks: [] };
      }
    } catch {
      this._index = { chunks: [] };
    }
    return this._index;
  },

  /* ── Get Chunks for Topic ─────────────────────────────────── */
  async getChunksForTopic(topic, maxChunks = 6) {
    const index = await this.loadIndex();
    const chunks = index.chunks || [];
    const q = topic.toLowerCase();

    const relevant = chunks
      .filter(c => c.tags && c.tags.some(t => t.toLowerCase().includes(q)))
      .slice(0, maxChunks);

    const loaded = [];
    for (const chunk of relevant) {
      try {
        const res = await fetch(`knowledge-base/${chunk.file}`);
        if (res.ok) loaded.push(await res.text());
      } catch { /* skip missing chunks */ }
    }

    return loaded;
  }
};
