const mobileContentQuery = window.matchMedia('(max-width: 760px)');

document.querySelectorAll('.capability-toggle').forEach((button) => {
  const card = button.closest('.service-card');
  button.addEventListener('click', () => {
    const willOpen = !card.classList.contains('capabilities-open');
    card.classList.toggle('capabilities-open', willOpen);
    button.setAttribute('aria-expanded', String(willOpen));
    button.textContent = willOpen ? 'Show fewer capabilities' : 'Show all capabilities';
  });
});

const reviewsGrid = document.querySelector('.rev-grid');
const reviewsButton = document.querySelector('.reviews-more-button');
if (reviewsGrid && reviewsButton) {
  reviewsButton.addEventListener('click', () => {
    const willOpen = !reviewsGrid.classList.contains('reviews-open');
    reviewsGrid.classList.toggle('reviews-open', willOpen);
    reviewsButton.setAttribute('aria-expanded', String(willOpen));
    reviewsButton.textContent = willOpen ? 'Show fewer reviews' : 'Show more reviews';
  });
}

function resetMobileDisclosures(event) {
  if (event.matches) return;
  document.querySelectorAll('.service-card.capabilities-open').forEach((card) => {
    card.classList.remove('capabilities-open');
    const button = card.querySelector('.capability-toggle');
    button.setAttribute('aria-expanded', 'false');
    button.textContent = 'Show all capabilities';
  });
  if (reviewsGrid && reviewsButton) {
    reviewsGrid.classList.remove('reviews-open');
    reviewsButton.setAttribute('aria-expanded', 'false');
    reviewsButton.textContent = 'Show more reviews';
  }
}

mobileContentQuery.addEventListener('change', resetMobileDisclosures);
