/* RECENT PROJECTS CAROUSEL */
  const portfolioCarousel = document.querySelector('.portfolio-carousel');
  if (portfolioCarousel) {
    const portfolioViewport = portfolioCarousel.querySelector('.portfolio-viewport');
    const portfolioTrack = portfolioCarousel.querySelector('.portfolio-track');
    const portfolioCards = [...portfolioTrack.querySelectorAll('.port-card')];
    const portfolioPrev = portfolioCarousel.querySelector('.portfolio-prev');
    const portfolioNext = portfolioCarousel.querySelector('.portfolio-next');
    const portfolioCurrent = portfolioCarousel.querySelector('.portfolio-current');
    const portfolioTotal = portfolioCarousel.querySelector('.portfolio-total');
    const portfolioStatus = portfolioCarousel.querySelector('.portfolio-status');
    const portfolioDigits = Math.max(2, String(portfolioCards.length).length);
    let portfolioIndex = 0;
    let portfolioVisible = 1;
    let portfolioMaxIndex = 0;
    let portfolioStep = 0;
    let portfolioPointer = null;
    let portfolioStartX = 0;
    let portfolioStartY = 0;
    let portfolioDrag = 0;
    let portfolioDragging = false;
    let suppressPortfolioClick = false;
    let portfolioWheelLocked = false;

    portfolioTotal.textContent = String(portfolioCards.length).padStart(portfolioDigits, '0');

    function setPortfolioPosition(dragOffset = 0) {
      portfolioCarousel.style.setProperty('--portfolio-offset', `${-portfolioIndex * portfolioStep}px`);
      portfolioCarousel.style.setProperty('--portfolio-drag', `${dragOffset}px`);
    }

    function updatePortfolio(announce = false) {
      portfolioPrev.disabled = portfolioIndex === 0;
      portfolioNext.disabled = portfolioIndex === portfolioMaxIndex;
      portfolioCurrent.textContent = String(portfolioIndex + 1).padStart(portfolioDigits, '0');
      portfolioCards.forEach((card, index) => {
        const isVisible = index >= portfolioIndex && index < portfolioIndex + portfolioVisible;
        card.setAttribute('aria-hidden', String(!isVisible));
        card.inert = !isVisible;
      });
      setPortfolioPosition();

      if (announce) {
        const title = portfolioCards[portfolioIndex].querySelector('h3').textContent.trim();
        portfolioStatus.textContent = `Project ${portfolioIndex + 1} of ${portfolioCards.length}: ${title}`;
      }
    }

    function measurePortfolio() {
      const firstCard = portfolioCards[0];
      if (!firstCard) return;
      const trackStyles = getComputedStyle(portfolioTrack);
      const gap = parseFloat(trackStyles.columnGap) || 0;
      const cardWidth = firstCard.getBoundingClientRect().width;
      portfolioStep = cardWidth + gap;
      portfolioVisible = Math.max(1, Math.min(portfolioCards.length, Math.round((portfolioViewport.clientWidth + gap) / portfolioStep)));
      portfolioMaxIndex = Math.max(0, portfolioCards.length - portfolioVisible);
      portfolioIndex = Math.min(portfolioIndex, portfolioMaxIndex);
      updatePortfolio(false);
    }

    function goToPortfolio(index, announce = true) {
      const nextIndex = Math.max(0, Math.min(index, portfolioMaxIndex));
      portfolioIndex = nextIndex;
      updatePortfolio(announce);
    }

    portfolioPrev.addEventListener('click', () => goToPortfolio(portfolioIndex - 1));
    portfolioNext.addEventListener('click', () => goToPortfolio(portfolioIndex + 1));

    portfolioCarousel.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPortfolio(portfolioIndex - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToPortfolio(portfolioIndex + 1);
      }
    });

    portfolioViewport.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      portfolioPointer = event.pointerId;
      portfolioStartX = event.clientX;
      portfolioStartY = event.clientY;
      portfolioDrag = 0;
      portfolioDragging = false;
      portfolioViewport.setPointerCapture?.(event.pointerId);
    });

    portfolioViewport.addEventListener('pointermove', event => {
      if (event.pointerId !== portfolioPointer) return;
      const deltaX = event.clientX - portfolioStartX;
      const deltaY = event.clientY - portfolioStartY;
      if (!portfolioDragging && Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
        portfolioDragging = true;
        portfolioCarousel.classList.add('is-dragging');
      }
      if (!portfolioDragging) return;
      event.preventDefault();
      portfolioDrag = deltaX;
      if ((portfolioIndex === 0 && deltaX > 0) || (portfolioIndex === portfolioMaxIndex && deltaX < 0)) {
        portfolioDrag *= .24;
      }
      setPortfolioPosition(portfolioDrag);
    });

    function finishPortfolioDrag(event, cancelled = false) {
      if (event.pointerId !== portfolioPointer) return;
      if (portfolioViewport.hasPointerCapture?.(event.pointerId)) portfolioViewport.releasePointerCapture(event.pointerId);
      const wasDragging = portfolioDragging;
      const releaseOffset = portfolioDrag;
      portfolioPointer = null;
      portfolioDrag = 0;
      portfolioDragging = false;
      portfolioCarousel.classList.remove('is-dragging');

      if (wasDragging) {
        suppressPortfolioClick = true;
        setTimeout(() => { suppressPortfolioClick = false; }, 0);
      }

      const threshold = Math.min(48, portfolioStep * .16);
      if (!cancelled && wasDragging && Math.abs(releaseOffset) >= threshold) {
        goToPortfolio(portfolioIndex + (releaseOffset < 0 ? 1 : -1));
      } else {
        updatePortfolio(false);
      }
    }

    portfolioViewport.addEventListener('pointerup', event => finishPortfolioDrag(event));
    portfolioViewport.addEventListener('pointercancel', event => finishPortfolioDrag(event, true));
    portfolioViewport.addEventListener('click', event => {
      if (!suppressPortfolioClick) return;
      event.preventDefault();
      event.stopPropagation();
    }, true);

    portfolioViewport.addEventListener('wheel', event => {
      if (portfolioMaxIndex === 0 || Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < 12) return;
      event.preventDefault();
      if (portfolioWheelLocked) return;
      portfolioWheelLocked = true;
      goToPortfolio(portfolioIndex + (event.deltaX > 0 ? 1 : -1));
      setTimeout(() => { portfolioWheelLocked = false; }, 480);
    }, { passive: false });

    const portfolioResizeObserver = new ResizeObserver(measurePortfolio);
    portfolioResizeObserver.observe(portfolioViewport);
    window.addEventListener('pagehide', () => portfolioResizeObserver.disconnect(), { once: true });
    measurePortfolio();
  }
