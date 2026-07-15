/* NAVIGATION */
  const nav = document.getElementById('nav');
  const menuToggle = nav.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const sectionLinks = [...nav.querySelectorAll('[data-section]')];
  const navSections = [...new Set(sectionLinks.map(link => link.dataset.section))]
    .map(id => document.getElementById(id))
    .filter(Boolean);
  let menuFocusTimer = null;

  function setMenuOpen(isOpen, returnFocus = false) {
    clearTimeout(menuFocusTimer);
    nav.classList.toggle('menu-open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    if (isOpen) {
      lenis.stop();
      menuFocusTimer = window.setTimeout(() => mobileMenu.querySelector('a').focus(), 220);
    } else {
      lenis.start();
      if (returnFocus) menuToggle.focus();
    }
  }

  menuToggle.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      setMenuOpen(false);
      lenis.scrollTo(target, { offset: -(nav.offsetHeight + 12) });
    });
  });

  nav.querySelector('.mobile-cta').addEventListener('click', () => setMenuOpen(false));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('menu-open')) {
      setMenuOpen(false, true);
      return;
    }

    if (event.key === 'Tab' && nav.classList.contains('menu-open')) {
      const focusable = [...mobileMenu.querySelectorAll('a[href]')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  document.addEventListener('click', event => {
    if (nav.classList.contains('menu-open') && !nav.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  function updateNavigation() {
    nav.classList.toggle('scrolled', window.scrollY > 24);
    const activeLine = window.scrollY + nav.offsetHeight + Math.min(window.innerHeight * .25, 180);
    let activeId = '';

    navSections.forEach(section => {
      if (section.offsetTop <= activeLine) activeId = section.id;
    });

    sectionLinks.forEach(link => {
      const isActive = link.dataset.section === activeId;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  let navFrame;
  window.addEventListener('scroll', () => {
    if (navFrame) return;
    navFrame = requestAnimationFrame(() => {
      updateNavigation();
      navFrame = null;
    });
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960 && nav.classList.contains('menu-open')) setMenuOpen(false);
    updateNavigation();
  });

  updateNavigation();
