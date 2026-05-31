/* =====================================================
   Imam Hasan — Portfolio
   Interactions & scroll animations
===================================================== */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------- Auto year -------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------- Theme toggle (dark / light) -------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const setTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f5f7fa' : '#0a0a0a');
  };
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      setTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  /* -------- Sticky nav scroll state -------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* -------- Mobile burger -------- */
  const burger = document.getElementById('navBurger');
  const navLinksEl = document.querySelector('.nav-links');
  let mobilePanel = null;

  function buildMobilePanel() {
    if (mobilePanel) return mobilePanel;
    mobilePanel = document.createElement('div');
    mobilePanel.className = 'nav-mobile';
    mobilePanel.innerHTML = navLinksEl.innerHTML +
      '<a href="#contact" style="color: var(--accent);">Get in touch →</a>';
    document.body.appendChild(mobilePanel);
    mobilePanel.addEventListener('click', e => {
      if (e.target.tagName === 'A') closeMobile();
    });
    return mobilePanel;
  }
  function closeMobile() {
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    if (mobilePanel) mobilePanel.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (burger) {
    burger.addEventListener('click', () => {
      const panel = buildMobilePanel();
      const opened = burger.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(opened));
      panel.classList.toggle('open', opened);
      document.body.style.overflow = opened ? 'hidden' : '';
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burger?.classList.contains('open')) closeMobile();
  });
  document.addEventListener('click', (e) => {
    if (!burger?.classList.contains('open') || !mobilePanel) return;
    const clickedInsidePanel = mobilePanel.contains(e.target);
    const clickedBurger = burger.contains(e.target);
    if (!clickedInsidePanel && !clickedBurger) closeMobile();
  });

  /* -------- Reveal on scroll -------- */
  const revealTargets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* -------- Number counter -------- */
  const counters = document.querySelectorAll('.stat-num[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1400;
      const start = performance.now();
      const initial = 0;

      const ease = t => 1 - Math.pow(1 - t, 3);
      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const value = Math.round(initial + (target - initial) * ease(t));
        el.textContent = value;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  if (!prefersReducedMotion) {
    counters.forEach(el => counterObserver.observe(el));
  } else {
    counters.forEach(el => { el.textContent = el.dataset.target; });
  }

  /* -------- Magnetic buttons -------- */
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const magnets = document.querySelectorAll('.magnetic');
    magnets.forEach(el => {
      const strength = el.classList.contains('contact-link') ? 6 : 14;
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* -------- Cursor-tracking glow on work cards -------- */
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const cards = document.querySelectorAll('.work-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', `${x}%`);
        card.style.setProperty('--my', `${y}%`);
      });
    });
  }

  /* -------- Subtle parallax on hero orbs -------- */
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const orbs = document.querySelectorAll('.orb');
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    window.addEventListener('mousemove', (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 30;
      targetY = (e.clientY / window.innerHeight - 0.5) * 30;
    });

    function loop() {
      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;
      orbs.forEach((orb, i) => {
        const factor = (i + 1) * 0.5;
        orb.style.translate = `${mouseX * factor}px ${mouseY * factor}px`;
      });
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* -------- Active nav link based on scroll -------- */
  const sections = ['about', 'stack', 'work', 'oss', 'experience'].map(id => document.getElementById(id)).filter(Boolean);
  const navAnchors = document.querySelectorAll('.nav-links a');

  if (sections.length && navAnchors.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach(a => {
            const matches = a.getAttribute('href') === `#${id}`;
            a.style.color = matches ? 'var(--text)' : '';
            a.style.background = matches ? 'var(--raise)' : '';
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach(s => navObserver.observe(s));
  }

  /* -------- Disable empty live links visually -------- */
  document.querySelectorAll('.work-link').forEach(link => {
    if (link.getAttribute('href') === '#' || !link.getAttribute('href')) {
      link.classList.add('disabled');
      link.classList.add('pending');
      link.setAttribute('aria-disabled', 'true');
      link.setAttribute('title', 'Live URL coming soon');
    }
  });

  /* -------- Inject project website logos -------- */
  /* Drop a logo file named after the project's data-domain into
     assets/images/projects/ (e.g. proboxs.png). Cards without a
     matching file simply render without a logo panel. */
  const LOGO_DIR = 'assets/images/projects/';
  const LOGO_EXTS = ['svg', 'png', 'webp', 'jpg'];

  document.querySelectorAll('.work-card').forEach(card => {
    const link = card.querySelector('.work-link[data-domain]');
    if (!link || card.querySelector('.work-logo')) return;

    const domain = link.dataset.domain;
    const title = card.querySelector('h3')?.textContent?.trim() || 'Project';

    const figure = document.createElement('figure');
    figure.className = 'work-logo';

    const img = document.createElement('img');
    img.alt = `${title} logo`;
    img.loading = 'lazy';
    img.decoding = 'async';

    // Try each extension in order; remove the panel if none load.
    let attempt = 0;
    const tryNext = () => {
      if (attempt >= LOGO_EXTS.length) {
        figure.remove();
        return;
      }
      img.src = `${LOGO_DIR}${domain}.${LOGO_EXTS[attempt++]}`;
    };
    img.addEventListener('error', tryNext);

    figure.appendChild(img);
    card.prepend(figure);
    tryNext();
  });

  /* -------- Contact form (Web3Forms) -------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const status = document.getElementById('contactStatus');
    const submitBtn = contactForm.querySelector('.contact-submit');
    const btnLabel = contactForm.querySelector('.contact-submit-label');
    const setStatus = (msg, state) => {
      if (!status) return;
      status.textContent = msg;
      status.classList.remove('is-success', 'is-error');
      if (state) status.classList.add(state);
    };

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      // Honeypot: bail silently if filled by a bot.
      if (contactForm.querySelector('[name="botcheck"]')?.checked) return;

      const originalLabel = btnLabel ? btnLabel.textContent : '';
      if (submitBtn) submitBtn.disabled = true;
      if (btnLabel) btnLabel.textContent = 'Sending…';
      setStatus('Sending your message…');

      try {
        const data = Object.fromEntries(new FormData(contactForm).entries());
        const res = await fetch(contactForm.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (res.ok && json.success) {
          contactForm.reset();
          setStatus('Thanks — your message is on its way. I\'ll reply soon.', 'is-success');
        } else {
          setStatus(json.message || 'Something went wrong. Please email me directly.', 'is-error');
        }
      } catch (err) {
        setStatus('Network error. Please email me directly at imamhsn195@gmail.com.', 'is-error');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (btnLabel) btnLabel.textContent = originalLabel;
      }
    });
  }

})();
