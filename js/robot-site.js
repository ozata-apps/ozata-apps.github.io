import('https://unpkg.com/@splinetool/viewer/build/spline-viewer.js').catch(() => {});

document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash');
  const video = document.getElementById('splashVideo');
  const startBtn = document.getElementById('splashStartBtn');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  const mobileStyle = document.createElement('style');
  mobileStyle.textContent = '.mobile-menu{display:none}.mobile-menu.open{display:flex;flex-direction:column;gap:14px;padding:16px;border-top:1px solid rgba(255,255,255,.07)}.mobile-menu a{color:#a9b0c6;font-size:14px}.mobile-menu .nav-btn{display:inline-block;width:max-content}@media(min-width:1001px){.mobile-menu{display:none!important}}';
  document.head.appendChild(mobileStyle);

  const hideSplash = () => {
    if (!splash) return;
    splash.style.opacity = '0';
    splash.style.pointerEvents = 'none';
    setTimeout(() => splash.remove(), 550);
  };

  if (video) {
    video.muted = true;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {});
    video.addEventListener('ended', hideSplash, { once: true });
  }
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (video) video.play().catch(() => {});
      hideSplash();
    });
  }
  if (splash) setTimeout(hideSplash, 10000);

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.innerHTML = open ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-bars"></i>';
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }));
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});
