/* ============================================================
   reader.js — Chapter Renderer
   HGUGM Surgical Residency Course
   ============================================================ */

'use strict';

const Reader = {

  /* ── Main Entry Point ────────────────────────────────────── */
  renderChapter(chapter) {
    const headerHtml = this.renderHeader(chapter);
    const breadcrumbHtml = this.renderBreadcrumb(chapter, null);
    const totalSections = (chapter.sections || []).length;
    const hasConsolidation = !!chapter.consolidation;
    const sectionsHtml = (chapter.sections || []).map((sec, idx) =>
      this.renderSection(sec, idx, chapter.id, totalSections, hasConsolidation)
    ).join('');
    const consolidationHtml = hasConsolidation
      ? this.renderConsolidationIntro(chapter.consolidation)
      : '';

    return `
      ${breadcrumbHtml}
      <div class="reader-layout">
        <aside class="reader-toc" id="readerToc" aria-label="Table of contents">
          <div class="toc-title">Contents</div>
          <ul class="toc-list" id="tocList"></ul>
        </aside>
        <div class="reader-main">
          <div class="reading-container">
            <div class="chapter-breadcrumb">
              <a href="#/curriculum" class="btn btn-ghost btn-sm">← Curriculum</a>
              <span class="chapter-section-counter" id="sectionCounter"></span>
            </div>
            ${headerHtml}
            <div class="reading-text" id="chapterContent">
              ${sectionsHtml}
              ${consolidationHtml}
            </div>
          </div>
        </div>
      </div>
      <button class="toc-fab" id="tocFab" onclick="Reader.toggleMobileTOC()" aria-label="Open chapter index" title="Chapter contents">≡</button>
      <div class="toc-overlay" id="tocOverlay" onclick="Reader.closeMobileTOC()"></div>
      <div class="toc-drawer" id="tocDrawer" role="dialog" aria-label="Chapter contents">
        <div class="toc-drawer-header">
          <span class="toc-drawer-title">Chapter Contents</span>
          <button class="toc-drawer-close" onclick="Reader.closeMobileTOC()" aria-label="Close">✕</button>
        </div>
        <ul class="toc-list toc-drawer-list" id="tocListMobile"></ul>
      </div>
      ${renderFooter()}
    `;
  },

  /* ── Mobile TOC Controls ─────────────────────────────────── */
  toggleMobileTOC() {
    document.getElementById('tocDrawer')?.classList.contains('open')
      ? this.closeMobileTOC()
      : this.openMobileTOC();
  },

  openMobileTOC() {
    document.getElementById('tocDrawer')?.classList.add('open');
    document.getElementById('tocOverlay')?.classList.add('open');
    document.getElementById('tocFab')?.classList.add('fab-open');
    document.body.style.overflow = 'hidden';
  },

  closeMobileTOC() {
    document.getElementById('tocDrawer')?.classList.remove('open');
    document.getElementById('tocOverlay')?.classList.remove('open');
    document.getElementById('tocFab')?.classList.remove('fab-open');
    document.body.style.overflow = '';
  },

  /* ── Chapter Header ──────────────────────────────────────── */
  renderHeader(chapter) {
    const refs = (chapter.textbook_refs || [])
      .map(r => `<span style="font-size:0.78rem; color:var(--muted);">📖 ${r}</span>`)
      .join('<br>');

    const objectives = (chapter.learning_objectives || [])
      .map(o => `<li>${o}</li>`).join('');

    return `
      <div class="chapter-header">
        <div class="chapter-header-top">
          <div class="chapter-block-badge">Block ${chapter.block} — ${chapter.block_name || ''}</div>
          <div class="text-size-control" aria-label="Text size">
            <button class="text-size-btn" onclick="Reader.setTextSize('small')"  aria-label="Small text">A−</button>
            <button class="text-size-btn active" onclick="Reader.setTextSize('medium')" aria-label="Default text">A</button>
            <button class="text-size-btn" onclick="Reader.setTextSize('large')"  aria-label="Large text">A+</button>
          </div>
        </div>
        <h1 class="chapter-title">${chapter.title}</h1>
        ${chapter.subtitle ? `<div class="chapter-subtitle">${chapter.subtitle}</div>` : ''}
        <div class="chapter-meta">
          <span>🎓 ${chapter.level || ''}</span>
          <span>⏱ ${chapter.reading_time_min || ''} min read</span>
          ${chapter.guidelines_version ? `<span>📋 ${chapter.guidelines_version}</span>` : ''}
        </div>
        ${refs ? `<div style="margin-bottom:16px; line-height:1.8;">${refs}</div>` : ''}
        ${objectives ? `
          <div class="learning-objectives">
            <h4>Learning Objectives</h4>
            <ul>${objectives}</ul>
          </div>` : ''}
        <div class="chapter-footer-links">
          <a href="#/abbreviations" class="abbr-glossary-link">📖 Abbreviations Glossary</a>
        </div>
      </div>
    `;
  },

  /* ── Section Renderer ────────────────────────────────────── */
  renderSection(section, idx, chapterId, totalSections, hasConsolidation) {
    const blocks    = section.blocks || section.content || [];
    const blocksHtml = blocks.map(b => this.renderBlock(b)).join('');

    // Estimate reading time for this section (230 wpm medical reading speed)
    const wordCount  = blocks.reduce((n, b) => n + ((b.content || '') + ' ' + (b.rows ? b.rows.flat().join(' ') : '')).split(/\s+/).length, 0);
    const secMinutes = Math.max(1, Math.ceil(wordCount / 230));

    const progress = Progress.getProgress();
    const isDone   = progress.chapters_read &&
      progress.chapters_read[chapterId] &&
      (progress.chapters_read[chapterId].sections_done || []).includes(idx);

    const isLast  = idx === (totalSections || 1) - 1;
    const nextHref = isLast
      ? (hasConsolidation ? '#squiz' : null)
      : `#s${idx + 1}`;

    return `
      <section id="section-${idx}" data-section-idx="${idx}" data-chapter-id="${chapterId}">
        <div class="section-title-row">
          <h2 id="s${idx}">${section.title}</h2>
          <span class="section-reading-time">~${secMinutes} min</span>
        </div>
        ${blocksHtml}
        <div class="section-nav">
          <button class="mark-read-btn ${isDone ? 'done' : ''}"
            onclick="Reader.markSectionRead('${chapterId}', ${idx}, this)"
            ${isDone ? 'disabled' : ''}>
            ${isDone ? '✓ Section Read' : '✓ Mark as Read'}
          </button>
          <div style="display:flex; gap:8px;">
            ${idx > 0 ? `<a href="#s${idx-1}" class="btn btn-ghost btn-sm">← Prev</a>` : ''}
            ${nextHref ? `<a href="${nextHref}" class="btn btn-secondary btn-sm">Next →</a>` : '<span class="btn btn-ghost btn-sm" style="opacity:0.4;">End</span>'}
          </div>
        </div>
      </section>
    `;
  },

  /* ── Block Dispatcher ────────────────────────────────────── */
  renderBlock(block) {
    switch (block.type) {
      case 'text':         return this.renderText(block);
      case 'heading':      return this.renderHeading(block);
      case 'figure':       return this.renderFigure(block);
      case 'table':        return this.renderTable(block);
      case 'callout':      return this.renderCallout(block);
      case 'case':         return this.renderCase(block);
      case 'case_opener':  return this.renderCaseOpener(block);
      case 'list':         return this.renderList(block);
      case 'key_points':   return this.renderKeyPoints(block);
      case 'landmark_trial': return this.renderLandmarkTrial(block);
      default:             return '';
    }
  },

  /* ── Text Block ──────────────────────────────────────────── */
  renderText(block) {
    const html = this.parseInline(block.content || '');
    return `<p>${html}</p>`;
  },

  /* ── Heading Block ───────────────────────────────────────── */
  renderHeading(block) {
    const level = block.level || 3;
    const id = (block.content || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `<h${level} id="${id}">${block.content}</h${level}>`;
  },

  /* ── Figure Block ────────────────────────────────────────── */
  renderFigure(block) {
    const src = block.src || '';
    let imgHtml;

    if (src.endsWith('.svg') || src.startsWith('data:image/svg')) {
      imgHtml = `<img src="${src}" alt="${block.alt || ''}" loading="lazy" style="max-height:480px; width:auto; max-width:100%;" />`;
    } else {
      imgHtml = `<img src="${src}" alt="${block.alt || ''}" loading="lazy" />`;
    }

    return `
      <figure class="chapter-figure">
        ${imgHtml}
        ${block.caption ? `<figcaption>${this.parseInline(block.caption)}</figcaption>` : ''}
      </figure>
    `;
  },

  /* ── Table Block ─────────────────────────────────────────── */
  renderTable(block) {
    const headers = (block.headers || []).map(h => `<th>${h}</th>`).join('');
    const rows = (block.rows || []).map(row =>
      `<tr>${row.map(cell => `<td>${this.parseInline(String(cell))}</td>`).join('')}</tr>`
    ).join('');

    return `
      ${block.title ? `<h4 style="margin-bottom:8px;">${block.title}</h4>` : ''}
      <div class="table-wrapper">
        <table class="evidence-table">
          ${headers ? `<thead><tr>${headers}</tr></thead>` : ''}
          <tbody>${rows}</tbody>
        </table>
      </div>
      ${block.caption ? `<p class="table-caption">${block.caption}</p>` : ''}
    `;
  },

  /* ── Callout Block ───────────────────────────────────────── */
  renderCallout(block) {
    const iconMap = {
      pearl:     { icon: '🔑', label: 'Board Pearl' },
      warning:   { icon: '⚠️', label: 'Common Pitfall' },
      clinical:  { icon: '🎯', label: 'Clinical Application' },
      guideline: { icon: '📋', label: 'NCCN / ESMO' },
      trial:     { icon: '🔬', label: 'Landmark Trial' },
    };

    const variant = block.variant || 'pearl';
    const meta = iconMap[variant] || iconMap.pearl;
    const label = block.title || meta.label;

    return `
      <div class="callout callout-${variant}">
        <div class="callout-icon-wrap" aria-hidden="true">${meta.icon}</div>
        <div class="callout-body">
          <div class="callout-label">${label}</div>
          <div class="callout-content">${this.parseInline(block.content || '')}</div>
        </div>
      </div>
    `;
  },

  /* ── Case Opener (Harvard-style vignette before theory) ─── */
  renderCaseOpener(block) {
    const resolution = block.resolution_label
      ? `<div class="case-resolution-link">→ ${block.resolution_label}</div>`
      : '';
    return `
      <div class="case-opener-block callout callout-clinical">
        <div class="callout-icon-wrap" aria-hidden="true">📋</div>
        <div class="callout-body">
          <div class="callout-label">Clinical Scenario</div>
          <div class="callout-content">${this.parseInline(block.content || '')}</div>
          ${resolution}
          <div class="case-opener-hint">Consider this scenario as you read this section.</div>
        </div>
      </div>
    `;
  },

  /* ── Key Points Summary Card ─────────────────────────────── */
  renderKeyPoints(block) {
    const points = (block.points || [])
      .map((p, i) => `<li><span class="kp-num">${i + 1}</span><span>${this.parseInline(p)}</span></li>`)
      .join('');
    return `
      <div class="key-points-card">
        <div class="kp-header">
          <span class="kp-icon">✦</span>
          <span class="kp-title">${block.title || 'Key Points'}</span>
        </div>
        <ol class="kp-list">${points}</ol>
      </div>
    `;
  },

  /* ── Case Block ──────────────────────────────────────────── */
  renderCase(block) {
    return `
      <div class="case-block">
        <div class="case-label">🎯 Clinical Case</div>
        <div class="case-content">${this.parseInline(block.content || '')}</div>
        ${block.discussion ? `
          <div style="margin-top:14px; padding-top:14px; border-top:1px solid rgba(13,110,110,0.2);">
            <strong style="font-family:var(--font-sans); font-size:0.85rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--teal);">Discussion</strong>
            <div class="case-content" style="margin-top:8px;">${this.parseInline(block.discussion)}</div>
          </div>` : ''}
      </div>
    `;
  },

  /* ── List Block ──────────────────────────────────────────── */
  renderList(block) {
    const tag = block.ordered ? 'ol' : 'ul';
    const items = (block.items || []).map(item => `<li>${this.parseInline(item)}</li>`).join('');
    const style = block.ordered ? 'style="list-style:decimal;"' : 'style="list-style:disc;"';
    return `<${tag} ${style} style="padding-left:1.8em; margin-bottom:1.25em;">${items}</${tag}>`;
  },

  /* ── Landmark Trial Block ────────────────────────────────── */
  renderLandmarkTrial(block) {
    return `
      <div class="trial-card">
        <div class="trial-name">${block.name || ''}</div>
        <div class="trial-meta">${[block.year, block.journal].filter(Boolean).join(' · ')}</div>
        <div class="trial-fields">
          ${block.population ? `<div class="trial-field"><span class="trial-field-label">Population</span><span class="trial-field-value">${block.population}</span></div>` : ''}
          ${block.result ? `<div class="trial-field"><span class="trial-field-label">Key Finding</span><span class="trial-field-value">${this.parseInline(block.result)}</span></div>` : ''}
          ${block.practice_change ? `<div class="trial-field"><span class="trial-field-label">Practice Change</span><span class="trial-field-value">${this.parseInline(block.practice_change)}</span></div>` : ''}
        </div>
      </div>
    `;
  },

  /* ── Consolidation Intro ─────────────────────────────────── */
  renderConsolidationIntro(consolidation) {
    return `
      <section id="consolidation" data-section-idx="quiz">
        <h2 id="squiz">Consolidation Questions</h2>
        <div class="callout callout-clinical">
          <div class="callout-header"><span class="callout-icon">🎯</span><span>Test Your Knowledge</span></div>
          <div class="callout-content">${consolidation.intro || 'Test your understanding with clinical questions.'}</div>
        </div>
        <div id="quizMount"></div>
      </section>
    `;
  },

  /* ── Breadcrumb Navigation ───────────────────────────────── */
  renderBreadcrumb(chapter, currentSectionTitle) {
    const blockLabel = `Block ${chapter.block}: ${chapter.block_name || ''}`;
    const chapterLabel = `${chapter.id}: ${chapter.title}`;
    const sectionPart = currentSectionTitle
      ? `<span class="bc-sep">›</span><span class="bc-current" id="bcSection">${currentSectionTitle}</span>`
      : `<span class="bc-current bc-chapter" id="bcSection"></span>`;

    return `
      <nav class="breadcrumb-bar" id="chapterBreadcrumb" aria-label="Breadcrumb">
        <a href="#/curriculum">Curriculum</a>
        <span class="bc-sep">›</span>
        <a href="#/curriculum">${blockLabel}</a>
        <span class="bc-sep">›</span>
        <span class="bc-current">${chapterLabel}</span>
        ${sectionPart}
      </nav>
    `;
  },

  /* ── Update breadcrumb active section ───────────────────── */
  updateBreadcrumbSection(sectionTitle) {
    const el = document.getElementById('bcSection');
    if (!el) return;
    if (sectionTitle) {
      el.textContent = sectionTitle;
      el.style.display = '';
    } else {
      el.textContent = '';
    }
  },

  /* ── Scroll Position Memory ──────────────────────────────── */
  saveScrollPosition(chapterId, sectionId, scrollY) {
    const key = `surgres_scroll_${chapterId}_${sectionId}`;
    try {
      localStorage.setItem(key, String(scrollY));
    } catch (_) { /* storage full or unavailable */ }
  },

  restoreScrollPosition(chapterId) {
    const sectionId = this._currentSectionIdx || 0;
    const key = `surgres_scroll_${chapterId}_${sectionId}`;
    const saved = localStorage.getItem(key);
    if (!saved) return;
    const scrollY = parseInt(saved, 10);
    if (isNaN(scrollY) || scrollY <= 0) return;
    setTimeout(() => { window.scrollTo({ top: scrollY, behavior: 'instant' }); }, 100);
  },

  clearScrollPosition(chapterId) {
    // Clear all section scroll entries for this chapter
    const prefix = `surgres_scroll_${chapterId}_`;
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) keysToRemove.push(k);
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  },

  /* ── Inline Markdown Parser ──────────────────────────────── */
  parseInline(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  },

  /* ── TOC Builder ─────────────────────────────────────────── */
  buildTOC(chapter) {
    const list = document.getElementById('tocList');
    const mobileList = document.getElementById('tocListMobile');
    if (!list && !mobileList) return;

    const items = (chapter.sections || []).map((sec, idx) => {
      const subHeadings = (sec.blocks || sec.content || [])
        .filter(b => b.type === 'heading' && b.level >= 3)
        .map(b => {
          const subId = (b.content || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          return `<li class="toc-subsection"><a href="#${subId}">${b.content}</a></li>`;
        }).join('');
      return `<li><a href="#s${idx}" data-toc-idx="${idx}">${sec.title}</a></li>${subHeadings}`;
    });

    if (chapter.consolidation) {
      items.push(`<li><a href="#squiz" data-toc-idx="quiz">📝 Consolidation Questions</a></li>`);
    }

    const html = items.join('');
    if (list) list.innerHTML = html;
    if (mobileList) {
      mobileList.innerHTML = html;
      mobileList.querySelectorAll('a').forEach(a =>
        a.addEventListener('click', () => this.closeMobileTOC())
      );
    }
  },

  /* ── Scroll Progress + TOC Active ────────────────────────── */
  initScrollTracking(chapter) {
    const fill = document.getElementById('readingProgressFill');
    const bar = document.getElementById('readingProgressBar');
    if (bar) bar.style.display = 'block';

    const sections = document.querySelectorAll('[data-section-idx]');
    const tocLinks = document.querySelectorAll('[data-toc-idx]');
    const counter = document.getElementById('sectionCounter');
    const totalReal = (chapter.sections || []).length;
    const fab = document.getElementById('tocFab');

    /* Reading progress bar — scroll-based */
    let _scrollSaveTimer = null;
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (fill) fill.style.width = `${Math.min(pct, 100)}%`;
      if (fab) fab.style.display = scrollTop > 200 ? 'flex' : 'none';

      // Debounced scroll position save (500ms)
      clearTimeout(_scrollSaveTimer);
      _scrollSaveTimer = setTimeout(() => {
        const sectionId = this._currentSectionIdx || 0;
        this.saveScrollPosition(chapter.id, sectionId, scrollTop);
      }, 500);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    this._scrollHandler = onScroll;

    /* TOC active section — IntersectionObserver (threshold 0.4) */
    let currentIdx = null;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          currentIdx = entry.target.dataset.sectionIdx;

          tocLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.tocIdx === String(currentIdx));
          });

          if (counter) {
            if (currentIdx === 'quiz') {
              counter.textContent = 'Consolidation';
              counter.style.display = 'inline-block';
            } else if (currentIdx !== null) {
              counter.textContent = `${parseInt(currentIdx) + 1} / ${totalReal}`;
              counter.style.display = 'inline-block';
            } else {
              counter.style.display = 'none';
            }
          }
        }
      });
    }, {
      rootMargin: '-60px 0px -40% 0px',
      threshold: 0
    });

    // Track current section index for keyboard navigation + breadcrumb + scroll save
    const sectionObs2 = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = entry.target.dataset.sectionIdx;
          if (idx !== 'quiz') {
            this._currentSectionIdx = parseInt(idx) || 0;
            const sec = chapter.sections && chapter.sections[this._currentSectionIdx];
            if (sec) this.updateBreadcrumbSection(sec.title);
          } else {
            this.updateBreadcrumbSection('Consolidation Questions');
          }
        }
      });
    }, { rootMargin: '-60px 0px -60% 0px', threshold: 0 });
    sections.forEach(sec => sectionObs2.observe(sec));

    sections.forEach(sec => obs.observe(sec));
    this._sectionObserver = obs;

    // Apply abbreviation tooltips to chapter content
    if (typeof applyAbbreviationTooltips === 'function') {
      const content = document.getElementById('chapterContent');
      if (content) applyAbbreviationTooltips(content);
    }

    // Figure lightbox on tap/click
    this.initFigureLightbox();

    // Keyboard shortcuts
    this.initKeyboardShortcuts(chapter);

    // Restore saved text size preference
    this.restoreTextSize();

    // Restore saved scroll position for this chapter
    this.restoreScrollPosition(chapter.id);
  },

  /* ── Text Size Control ───────────────────────────────────── */
  setTextSize(size) {
    const sizes = { small: '15px', medium: '17px', large: '19.5px' };
    document.documentElement.style.setProperty('--text-base', sizes[size] || sizes.medium);
    localStorage.setItem('surgres_text_size', size);

    // Update active button
    document.querySelectorAll('.text-size-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.includes(
        size === 'small' ? 'A−' : size === 'large' ? 'A+' : 'A'
      ) && !btn.textContent.includes('A−') || (size === 'small' && btn.textContent === 'A−') || (size === 'large' && btn.textContent === 'A+') || (size === 'medium' && btn.textContent === 'A')
      );
    });

    // Simpler active state management
    document.querySelectorAll('.text-size-btn').forEach((btn, i) => {
      const sizeMap = ['small', 'medium', 'large'];
      btn.classList.toggle('active', sizeMap[i] === size);
    });
  },

  /* ── Restore saved text size ─────────────────────────────── */
  restoreTextSize() {
    const saved = localStorage.getItem('surgres_text_size') || 'medium';
    const sizes = { small: '15px', medium: '17px', large: '19.5px' };
    document.documentElement.style.setProperty('--text-base', sizes[saved]);
  },

  /* ── Figure Lightbox ─────────────────────────────────────── */
  initFigureLightbox() {
    document.querySelectorAll('.chapter-figure').forEach(fig => {
      fig.style.cursor = 'zoom-in';
      fig.addEventListener('click', () => {
        const lb = document.createElement('div');
        lb.className = 'lightbox-overlay';
        lb.setAttribute('role', 'dialog');
        lb.setAttribute('aria-label', 'Figure enlarged');
        lb.innerHTML = `
          <button class="lightbox-close" aria-label="Close enlarged figure">✕</button>
          <div class="lightbox-content">${fig.innerHTML}</div>
        `;
        document.body.appendChild(lb);

        // Close handlers
        lb.addEventListener('click', (e) => {
          if (e.target === lb || e.target.classList.contains('lightbox-close')) {
            lb.remove();
          }
        });
        document.addEventListener('keydown', function escHandler(e) {
          if (e.key === 'Escape') { lb.remove(); document.removeEventListener('keydown', escHandler); }
        });
      });
    });
  },

  /* ── Keyboard Shortcuts (chapter reader) ────────────────── */
  initKeyboardShortcuts(chapter) {
    if (this._keyHandler) {
      document.removeEventListener('keydown', this._keyHandler);
    }

    this._keyHandler = (e) => {
      // Don't fire when typing in inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const sections     = document.querySelectorAll('[data-section-idx]');
      const sectionCount = chapter.sections.length;

      switch (e.key) {
        case 'ArrowRight': {
          // Navigate to next section anchor
          const current = this._currentSectionIdx || 0;
          if (current < sectionCount - 1) {
            document.getElementById(`s${current + 1}`)?.scrollIntoView({ behavior: 'smooth' });
          }
          break;
        }
        case 'ArrowLeft': {
          const current = this._currentSectionIdx || 0;
          if (current > 0) {
            document.getElementById(`s${current - 1}`)?.scrollIntoView({ behavior: 'smooth' });
          }
          break;
        }
        case 'm':
        case 'M': {
          // Mark current section as read
          const btn = document.querySelector(`#section-${this._currentSectionIdx || 0} .mark-read-btn:not([disabled])`);
          btn?.click();
          break;
        }
        case '/': {
          e.preventDefault();
          window.location.hash = '#/search';
          break;
        }
        case '?': {
          this._showShortcutsHelp();
          break;
        }
        case 'Escape': {
          // Close any open modal or drawer
          const lb = document.querySelector('.lightbox-overlay');
          if (lb) { lb.remove(); break; }
          this.closeMobileTOC();
          break;
        }
      }
    };

    document.addEventListener('keydown', this._keyHandler);
  },

  /* ── Track current section for keyboard nav ──────────────── */
  _currentSectionIdx: 0,

  /* ── Keyboard shortcuts help modal ──────────────────────── */
  _showShortcutsHelp() {
    if (document.querySelector('.shortcuts-modal')) return;
    const modal = document.createElement('div');
    modal.className = 'shortcuts-modal lightbox-overlay';
    modal.setAttribute('role', 'dialog');
    modal.innerHTML = `
      <div class="shortcuts-panel">
        <div class="shortcuts-header">
          <span>⌨️ Keyboard Shortcuts</span>
          <button class="lightbox-close" aria-label="Close">✕</button>
        </div>
        <table class="shortcuts-table">
          <tr><td><kbd>→</kbd></td><td>Next section</td></tr>
          <tr><td><kbd>←</kbd></td><td>Previous section</td></tr>
          <tr><td><kbd>M</kbd></td><td>Mark section as read</td></tr>
          <tr><td><kbd>/</kbd></td><td>Search</td></tr>
          <tr><td><kbd>?</kbd></td><td>Show this help</td></tr>
          <tr><td><kbd>Esc</kbd></td><td>Close modal / drawer</td></tr>
        </table>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('lightbox-close')) modal.remove();
    });
  },

  /* ── Mark Section Read ───────────────────────────────────── */
  markSectionRead(chapterId, sectionIdx, btn) {
    Progress.markSectionRead(chapterId, sectionIdx);
    btn.textContent = '✓ Section Read';
    btn.classList.add('done');
    btn.disabled = true;

    const chapter = ALL_CHAPTERS.find(c => c.id === chapterId);
    const allSections = document.querySelectorAll('[data-section-idx]');
    const totalSections = allSections.length - 1; // exclude quiz section
    const progress = Progress.getProgress();
    const doneSections = (progress.chapters_read[chapterId] || {}).sections_done || [];

    if (doneSections.length >= totalSections) {
      Progress.markChapterComplete(chapterId);
      this.clearScrollPosition(chapterId);
    }
  }
};
