/* FAQ ACCORDION */
  const faqItems = [...document.querySelectorAll('.faq-item')];
  function setFaqOpen(item, isOpen) {
    const button = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    item.classList.toggle('open', isOpen);
    button.setAttribute('aria-expanded', String(isOpen));
    answer.setAttribute('aria-hidden', String(!isOpen));
    answer.style.maxHeight = isOpen ? `${answer.scrollHeight}px` : '0px';
  }
  faqItems.forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const shouldOpen = !item.classList.contains('open');
      faqItems.forEach(other => setFaqOpen(other, false));
      if (shouldOpen) setFaqOpen(item, true);
    });
  });
  window.addEventListener('resize', () => {
    const openAnswer = document.querySelector('.faq-item.open .faq-a');
    if (openAnswer) openAnswer.style.maxHeight = `${openAnswer.scrollHeight}px`;
  });
