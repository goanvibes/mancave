const WHATSAPP_NUMBER = '917020153602';
const BOOKING_PERSON = 'Aslam Khan';

const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  siteNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}

const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(item => revealObserver.observe(item));

const dateInput = document.querySelector('input[name="date"]');
if (dateInput) {
  const today = new Date();
  dateInput.min = today.toISOString().split('T')[0];
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value + 'T00:00:00');
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

const bookingForm = document.getElementById('bookingForm');
const bookingPreview = document.getElementById('bookingPreview');
const whatsappDirect = document.querySelector('.whatsapp-direct');
let bookingMessage = '';

function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

if (bookingForm && bookingPreview) {
  bookingForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(bookingForm);
    const name = data.get('name')?.trim();
    const people = data.get('people');
    const date = formatDate(data.get('date'));
    const time = data.get('time');
    const activity = data.get('activity');
    const note = data.get('note')?.trim();

    bookingMessage = `Hi ${BOOKING_PERSON}, I want to book a slot at Man Cave Gaming Cafe.\n\nName: ${name}\nPeople: ${people}\nDate: ${date}\nTime: ${time}\nBooking type: ${activity}${note ? `\nNote: ${note}` : ''}\n\nPlease confirm availability.`;
    bookingPreview.textContent = bookingMessage;
    const url = buildWhatsAppUrl(bookingMessage);
    if (whatsappDirect) whatsappDirect.href = url;
    window.open(url, '_blank', 'noopener');
  });
}

const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) marqueeTrack.innerHTML += marqueeTrack.innerHTML;

const galleryGrid = document.getElementById('galleryGrid');
const filters = document.querySelectorAll('[data-filter]');
const lightbox = document.getElementById('lightbox');

function renderGallery(filter = 'All') {
  if (!galleryGrid || !window.MAN_CAVE_GALLERY) return;
  const photos = window.MAN_CAVE_GALLERY.filter(item => filter === 'All' || item.category === filter);
  galleryGrid.innerHTML = photos.map(item => `
    <article class="gallery-item reveal visible" data-src="${item.file}" data-title="${item.title}" tabindex="0">
      <img loading="lazy" src="${item.file}" alt="${item.title} at Man Cave Gaming Cafe Taleigao">
      <div class="gallery-caption"><span>${item.category}</span><strong>${item.title}</strong></div>
    </article>
  `).join('');
}

if (galleryGrid) {
  renderGallery();
  filters.forEach(button => {
    button.addEventListener('click', () => {
      filters.forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      renderGallery(button.dataset.filter);
    });
  });

  galleryGrid.addEventListener('click', event => {
    const item = event.target.closest('.gallery-item');
    if (!item || !lightbox) return;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.querySelector('img').src = item.dataset.src;
    lightbox.querySelector('img').alt = item.dataset.title;
    lightbox.querySelector('p').textContent = item.dataset.title;
  });
}

if (lightbox) {
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.querySelector('img').src = '';
  };
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeLightbox();
  });
}
