gsap.registerPlugin(ScrollTrigger);

const reduceSiteMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lenis = new Lenis({
  duration: reduceSiteMotion ? 0.01 : 1.1,
  smoothWheel: !reduceSiteMotion,
  easing: (value) => Math.min(1, 1.001 - Math.pow(2, -10 * value)),
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

if (!reduceSiteMotion) {
  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTimeline
    .fromTo('.hero-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.72 })
    .fromTo('.hero-supporting', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52 }, '-=0.46')
    .fromTo('.hero-sub', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.58 }, '-=0.38')
    .fromTo('.hero-ctas', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54 }, '-=0.4')
    .fromTo('.project-carousel', { x: 28, opacity: 0 }, { x: 0, opacity: 1, duration: 0.76 }, '-=0.58');

  const revealElements = gsap.utils.toArray('[data-r]').filter((element) => !element.classList.contains('proof-card'));
  revealElements.forEach((element) => {
    const siblingIndex = [...element.parentElement.children].indexOf(element);
    gsap.fromTo(element,
      { y: 22, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.64,
        delay: Math.min(siblingIndex * 0.06, 0.18),
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 90%', once: true },
      });
  });

  gsap.fromTo('.proof-card',
    { y: 12, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.58,
      stagger: 0.07,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.stats', start: 'top 88%', once: true },
    });

  document.querySelectorAll('[data-count]').forEach((element) => {
    const target = Number(element.dataset.count);
    const suffix = element.textContent.includes('+') ? '+' : '';
    ScrollTrigger.create({
      trigger: element,
      start: 'top 86%',
      once: true,
      onEnter() {
        const counter = { value: 0 };
        gsap.to(counter, {
          value: target,
          duration: 0.76,
          ease: 'power2.out',
          onUpdate() { element.textContent = `${Math.floor(counter.value)}${suffix}`; },
        });
      },
    });
  });
}
