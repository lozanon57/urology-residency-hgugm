/* ============================================================
   search.js — Full-text Search (Lunr.js)
   HGUGM Surgical Residency Course
   ============================================================ */

'use strict';

const SearchEngine = {
  _index: null,
  _docs: {},
  _debounceTimer: null,

  /* ── Build Index from Curriculum Manifest ────────────────── */
  buildIndex(curriculum) {
    const docs = {};

    curriculum.forEach(block => {
      block.chapters.forEach(ch => {
        const docId = ch.id;
        docs[docId] = {
          id: docId,
          title: ch.title,
          block: block.blockName,
          blockIcon: block.icon,
          level: ch.level,
          content: `${ch.title} ${ch.level} ${block.blockName}`,
          url: `#/chapter/${ch.id}`
        };
      });
    });

    this._docs = docs;

    this._index = lunr(function () {
      this.ref('id');
      this.field('title', { boost: 10 });
      this.field('block', { boost: 3 });
      this.field('content');

      Object.values(docs).forEach(doc => this.add(doc));
    });
  },

  /* ── Augment with Loaded Chapter Data ───────────────────── */
  augmentWithChapter(chapter) {
    if (!this._index || !chapter) return;

    const sectionTexts = (chapter.sections || []).map(s => {
      const blockText = (s.blocks || [])
        .filter(b => b.type === 'text' || b.type === 'callout' || b.type === 'case')
        .map(b => b.content || '')
        .join(' ');
      return `${s.title} ${blockText}`;
    }).join(' ');

    const docId = chapter.id;
    if (this._docs[docId]) {
      this._docs[docId].content += ' ' + sectionTexts;
    }
  },

  /* ── Search ─────────────────────────────────────────────── */
  search(query) {
    if (!this._index || !query.trim()) return [];

    try {
      const safeQuery = query.trim().replace(/[+\-^*~:]/g, '').toLowerCase();
      const results = this._index.search(`${safeQuery}*`);

      return results.map(r => {
        const doc = this._docs[r.ref];
        return {
          ...doc,
          snippet: this._makeSnippet(doc, safeQuery)
        };
      });
    } catch {
      return [];
    }
  },

  /* ── Snippet Generator ───────────────────────────────────── */
  _makeSnippet(doc, query) {
    const text = doc.content || doc.title;
    const qLow = query.toLowerCase();
    const idx = text.toLowerCase().indexOf(qLow);

    if (idx === -1) return text.slice(0, 120) + '…';

    const start = Math.max(0, idx - 40);
    const end = Math.min(text.length, idx + query.length + 80);
    let snippet = text.slice(start, end);
    if (start > 0) snippet = '…' + snippet;
    if (end < text.length) snippet += '…';

    return snippet.replace(
      new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
      m => `<mark class="search-highlight">${m}</mark>`
    );
  },

  /* ── Init View ───────────────────────────────────────────── */
  initView() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    input.focus();

    input.addEventListener('input', () => {
      clearTimeout(this._debounceTimer);
      this._debounceTimer = setTimeout(() => {
        this.renderResults(input.value);
      }, 300);
    });
  },

  /* ── Render Results ──────────────────────────────────────── */
  renderResults(query) {
    const container = document.getElementById('searchResults');
    if (!container) return;

    if (!query.trim()) {
      container.innerHTML = `<div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>Start typing to search</h3>
        <p>Search across all chapter content, clinical pearls, and landmark trials</p>
      </div>`;
      return;
    }

    const results = this.search(query);

    if (!results.length) {
      container.innerHTML = `<div class="empty-state">
        <div class="empty-icon">😕</div>
        <h3>No results found</h3>
        <p>Try different keywords or browse the <a href="#/curriculum" style="color:var(--teal);">curriculum</a></p>
      </div>`;
      return;
    }

    // Group by block
    const grouped = {};
    results.forEach(r => {
      const key = r.block || 'Other';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(r);
    });

    const html = Object.entries(grouped).map(([block, items]) => `
      <div class="search-results-group">
        <h3>${items[0].blockIcon || ''} ${block}</h3>
        ${items.map(item => `
          <a href="${item.url}" class="search-result-item">
            <div class="search-result-title">${item.id} · ${item.title}</div>
            <div class="search-result-snippet">${item.snippet}</div>
          </a>`).join('')}
      </div>
    `).join('');

    container.innerHTML = `
      <p style="font-size:0.82rem; color:var(--muted); margin-bottom:16px;">${results.length} result${results.length !== 1 ? 's' : ''} for "<strong>${query}</strong>"</p>
      ${html}
    `;
  }
};
