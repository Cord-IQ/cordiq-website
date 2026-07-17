gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
const gallery = document.querySelector('[data-gallery]');
const desktopLayout = window.matchMedia('(min-width: 901px)');

function setMenu(open) {
  document.body.classList.toggle('menu-open', open);
  mobileNav.classList.toggle('open', open);
  mobileNav.setAttribute('aria-hidden', String(!open));
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setMenu(false);
});
desktopLayout.addEventListener('change', event => {
  if (event.matches) setMenu(false);
});

const headerTrigger = ScrollTrigger.create({
  start: 20,
  end: 'max',
  onUpdate(self) { header.classList.toggle('scrolled', self.scroll() > 20); },
});

document.querySelector('[data-gallery-prev]').addEventListener('click', () => {
  gallery.scrollBy({ left: -gallery.clientWidth * .78, behavior: reducedMotion ? 'auto' : 'smooth' });
});
document.querySelector('[data-gallery-next]').addEventListener('click', () => {
  gallery.scrollBy({ left: gallery.clientWidth * .78, behavior: reducedMotion ? 'auto' : 'smooth' });
});

document.querySelectorAll('.faq details').forEach(details => {
  details.addEventListener('toggle', () => {
    if (!details.open) return;
    document.querySelectorAll('.faq details[open]').forEach(openDetails => {
      if (openDetails !== details) openDetails.open = false;
    });
  });
});

if (!reducedMotion) {
  gsap.fromTo('.hero-copy > *',
    { y: 28, opacity: 0 },
    { y: 0, opacity: 1, duration: .85, stagger: .09, ease: 'power3.out', delay: .15 });

  gsap.fromTo('.hero-visual',
    { x: 50, opacity: 0, scale: .98 },
    { x: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out', delay: .28 });

  document.querySelectorAll('.reveal:not(.hero-copy):not(.hero-visual)').forEach(element => {
    gsap.fromTo(element,
      { y: 30 },
      {
        y: 0,
        duration: .75,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true },
      });
  });

  gsap.to('[data-parallax] img', {
    yPercent: 5,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 },
  });
}

const capabilityItems = [...document.querySelectorAll('[data-capability]')];
const capabilityMarkers = [...document.querySelectorAll('.capability-index span')];
capabilityItems.forEach((item, index) => {
  ScrollTrigger.create({
    trigger: item,
    start: 'top 48%',
    end: 'bottom 48%',
    onToggle(self) {
      if (!self.isActive) return;
      capabilityMarkers.forEach((marker, markerIndex) => marker.classList.toggle('active', markerIndex === index));
    },
  });
});

window.addEventListener('pagehide', () => {
  headerTrigger.kill();
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
}, { once: true });
