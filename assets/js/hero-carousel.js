/* HERO PROJECT CAROUSEL */
  const projectCarousel = document.querySelector('.project-carousel:not(.project-stack)');
  if (projectCarousel) {
    const projectStage = projectCarousel.querySelector('.project-stage');
    const projectSlides = [...projectCarousel.querySelectorAll('.project-slide')];
    const projectDots = [...projectCarousel.querySelectorAll('.project-dot')];
    const projectStatus = document.getElementById('project-carousel-status');
    const projectMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const projectInitialAutoplayDelay = 3000;
    const projectRecurringAutoplayDelay = 4000;
    const requestedInitialProject = Number.parseInt(projectCarousel.dataset.initialProject || '0', 10);
    let activeProject = Number.isInteger(requestedInitialProject)
      && requestedInitialProject >= 0
      && requestedInitialProject < projectSlides.length
      ? requestedInitialProject
      : 0;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerOffset = 0;
    let activeProjectPointer = null;
    let isProjectDragging = false;
    let suppressProjectClick = false;
    let projectAutoplayTimer = null;
    let projectCarouselHovered = false;
    let projectCarouselFocused = false;
    let projectCarouselVisible = false;
    let projectCarouselLoaded = false;
    let projectAutoplayDelay = projectInitialAutoplayDelay;
    let projectTransitionTimer = null;
    let projectTransitioning = false;

    function canAutoplayProjects() {
      return projectCarouselLoaded
        && projectCarouselVisible
        && !projectMotionQuery.matches
        && !document.hidden
        && !projectCarouselHovered
        && !projectCarouselFocused
        && activeProjectPointer === null
        && !isProjectDragging;
    }

    function stopProjectAutoplay() {
      if (projectAutoplayTimer !== null) {
        clearTimeout(projectAutoplayTimer);
        projectAutoplayTimer = null;
      }
    }

    function scheduleProjectAutoplay() {
      stopProjectAutoplay();
      if (!canAutoplayProjects()) return;
      projectAutoplayTimer = window.setTimeout(() => {
        projectAutoplayTimer = null;
        if (!canAutoplayProjects()) return;
        showProject(activeProject + 1, false);
        projectAutoplayDelay = projectRecurringAutoplayDelay;
        scheduleProjectAutoplay();
      }, projectAutoplayDelay);
    }

    function showProjectManually(index) {
      if (!showProject(index, true)) return;
      projectAutoplayDelay = projectRecurringAutoplayDelay;
      scheduleProjectAutoplay();
    }

    function showProject(index, announce = true, force = false) {
      const nextProject = (index + projectSlides.length) % projectSlides.length;
      if (!force && (projectTransitioning || nextProject === activeProject)) return false;
      activeProject = nextProject;
      projectTransitioning = !projectMotionQuery.matches;
      clearTimeout(projectTransitionTimer);
      projectTransitionTimer = window.setTimeout(() => {
        projectTransitioning = false;
      }, projectMotionQuery.matches ? 0 : 480);

      projectSlides.forEach((slide, slideIndex) => {
        const relative = (slideIndex - activeProject + projectSlides.length) % projectSlides.length;
        slide.classList.remove('is-active', 'is-prev', 'is-next', 'is-hidden');
        if (relative === 0) slide.classList.add('is-active');
        else if (relative === 1) slide.classList.add('is-next');
        else if (relative === projectSlides.length - 1) slide.classList.add('is-prev');
        else slide.classList.add('is-hidden');
        slide.setAttribute('aria-hidden', String(relative !== 0));
      });

      projectDots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeProject;
        dot.classList.toggle('active', isActive);
        if (isActive) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });

      if (announce) {
        const title = projectSlides[activeProject].dataset.projectTitle;
        projectStatus.textContent = `Project ${activeProject + 1} of ${projectSlides.length}: ${title}`;
      }
      return true;
    }

    projectCarousel.querySelector('.project-prev').addEventListener('click', () => showProjectManually(activeProject - 1));
    projectCarousel.querySelector('.project-next').addEventListener('click', () => showProjectManually(activeProject + 1));
    projectDots.forEach((dot, index) => dot.addEventListener('click', () => showProjectManually(index)));

    projectSlides.forEach(slide => {
      slide.addEventListener('click', () => {
        if (suppressProjectClick) return;
        if (slide.classList.contains('is-prev')) showProjectManually(activeProject - 1);
        else if (slide.classList.contains('is-next')) showProjectManually(activeProject + 1);
      });
    });

    projectCarousel.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showProjectManually(activeProject - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        showProjectManually(activeProject + 1);
      }
    });

    projectStage.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      stopProjectAutoplay();
      projectAutoplayDelay = projectRecurringAutoplayDelay;
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      pointerOffset = 0;
      activeProjectPointer = event.pointerId;
      isProjectDragging = false;
      if (projectStage.setPointerCapture) projectStage.setPointerCapture(event.pointerId);
    });

    projectStage.addEventListener('pointermove', event => {
      if (event.pointerId !== activeProjectPointer) return;
      const deltaX = event.clientX - pointerStartX;
      const deltaY = event.clientY - pointerStartY;
      if (!isProjectDragging && Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
        isProjectDragging = true;
        projectCarousel.classList.add('dragging');
      }
      if (!isProjectDragging) return;
      event.preventDefault();
      pointerOffset = Math.max(-72, Math.min(72, deltaX));
      projectCarousel.style.setProperty('--drag-offset', `${pointerOffset}px`);
    });

    function finishProjectDrag(event, cancelled = false) {
      if (event.pointerId !== activeProjectPointer) return;
      if (projectStage.hasPointerCapture && projectStage.hasPointerCapture(event.pointerId)) {
        projectStage.releasePointerCapture(event.pointerId);
      }
      projectCarousel.classList.remove('dragging');
      projectCarousel.style.setProperty('--drag-offset', '0px');
      if (isProjectDragging) {
        suppressProjectClick = true;
        setTimeout(() => { suppressProjectClick = false; }, 0);
        if (!cancelled && Math.abs(pointerOffset) > 42) {
          showProjectManually(activeProject + (pointerOffset < 0 ? 1 : -1));
        }
      }
      activeProjectPointer = null;
      isProjectDragging = false;
      pointerOffset = 0;
      scheduleProjectAutoplay();
    }

    projectStage.addEventListener('pointerup', event => finishProjectDrag(event));
    projectStage.addEventListener('pointercancel', event => finishProjectDrag(event, true));
    projectCarousel.addEventListener('mouseenter', () => {
      projectCarouselHovered = true;
      stopProjectAutoplay();
    });
    projectCarousel.addEventListener('mouseleave', () => {
      projectCarouselHovered = false;
      scheduleProjectAutoplay();
    });
    projectCarousel.addEventListener('focusin', () => {
      projectCarouselFocused = true;
      stopProjectAutoplay();
    });
    projectCarousel.addEventListener('focusout', () => {
      requestAnimationFrame(() => {
        projectCarouselFocused = projectCarousel.contains(document.activeElement);
        scheduleProjectAutoplay();
      });
    });

    const projectVisibilityObserver = new IntersectionObserver(entries => {
      projectCarouselVisible = entries[0].isIntersecting && entries[0].intersectionRatio >= .25;
      scheduleProjectAutoplay();
    }, { threshold: [0, .25] });
    projectVisibilityObserver.observe(projectCarousel);

    document.addEventListener('visibilitychange', scheduleProjectAutoplay);
    projectMotionQuery.addEventListener('change', scheduleProjectAutoplay);
    const enableProjectAutoplay = () => {
      projectCarouselLoaded = true;
      scheduleProjectAutoplay();
    };
    if (document.readyState === 'complete') enableProjectAutoplay();
    else window.addEventListener('load', enableProjectAutoplay, { once: true });
    window.addEventListener('pagehide', () => {
      stopProjectAutoplay();
      clearTimeout(projectTransitionTimer);
      projectVisibilityObserver.disconnect();
    }, { once: true });
    showProject(activeProject, false, true);
  }
