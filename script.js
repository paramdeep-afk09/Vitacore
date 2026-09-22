/* ==========================================================================
   VITACORE — interaction layer
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Scroll progress + nav background ---------- */
  const progress = document.getElementById('scroll-progress');
  const nav = document.getElementById('nav');

  function onScroll(){
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    if (progress) progress.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + '%';
    if (nav) nav.classList.toggle('scrolled', scrolled > 40);
  }
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  /* ---------- Active nav link on scroll ---------- */
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  const sections = [...navLinks].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = '#' + entry.target.id;
      const link = document.querySelector(`.nav__links a[href="${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => navObserver.observe(s));

  /* ---------- Mobile nav ---------- */
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobile-nav');
  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* ---------- Generic reveal-on-scroll ---------- */
  const revealTargets = document.querySelectorAll('.reveal, .pillar');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Gallery scattered wall: assign rotations + staggered reveal ---------- */
  const galleryFigures = document.querySelectorAll('.gallery-wall figure');
  const rotations = [-4, 3, -2, 5, -5, 2, -3, 4, -6, 1, 6, -1];
  galleryFigures.forEach((fig, i) => {
    fig.style.setProperty('--r', rotations[i % rotations.length] + 'deg');
  });
  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = [...galleryFigures].indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('in-view'), (idx % 12) * 60);
        galleryObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  galleryFigures.forEach(fig => galleryObserver.observe(fig));

  /* ---------- Message-to-juniors sequential reveal ---------- */
  const messageLines = document.querySelectorAll('.message__lines span');
  const messageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        messageLines.forEach((line, i) => {
          setTimeout(() => line.classList.add('in-view'), i * 260);
        });
        messageObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });
  if (messageLines.length) messageObserver.observe(messageLines[0].closest('.message__lines'));

  /* ---------- Team accordion tiers ---------- */
  document.querySelectorAll('.team-tier__head').forEach(head => {
    head.addEventListener('click', () => {
      const panel = head.nextElementSibling;
      const expanded = head.getAttribute('aria-expanded') === 'true';
      head.setAttribute('aria-expanded', String(!expanded));
      panel.classList.toggle('open', !expanded);
    });
  });
  // Open the first tier by default
  const firstHead = document.querySelector('.team-tier__head');
  if (firstHead) {
    firstHead.setAttribute('aria-expanded', 'true');
    firstHead.nextElementSibling.classList.add('open');
  }

  /* ---------- Modal system (faculty + events) ---------- */
  const overlay = document.getElementById('modal-overlay');
  const modalBody = document.getElementById('modal-body');

  function openModal(html){
    modalBody.innerHTML = html;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (overlay) {
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  }

  document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const template = document.getElementById(trigger.getAttribute('data-modal-trigger'));
      if (template) openModal(template.innerHTML);
    });
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('.modal__close')) closeModal();
  });

  /* ---------- Smooth-scroll for in-page anchors (Join button etc.) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});