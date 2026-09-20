/* ─────────────────────────────────────────────
   PHOTOGRAPHY PORTFOLIO — JavaScript
   • Sticky nav shadow on scroll
   • Mobile hamburger menu
   • Gallery filter with animation
   • Lightbox with keyboard + swipe support
   • Reveal-on-scroll (IntersectionObserver)
   • Footer year
───────────────────────────────────────────── */

// ── Utilities ──────────────────────────────────────────────────────────────
const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];


// ── Navbar scroll shadow ────────────────────────────────────────────────────
const navbar = $('#navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });


// ── Mobile hamburger ────────────────────────────────────────────────────────
const hamburger = $('#hamburger');
const navLinks  = $('.nav-links');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  hamburger.querySelectorAll('span').forEach((s, i) => {
    if (open) {
      if (i === 0) s.style.transform = 'rotate(45deg) translate(5px, 5px)';
      if (i === 1) s.style.opacity = '0';
      if (i === 2) s.style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      s.style.transform = '';
      s.style.opacity   = '';
    }
  });
});

// Close mobile menu when a link is clicked
$$('.nav-links a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}));


// ── Gallery filter ──────────────────────────────────────────────────────────
const filterBtns = $$('.filter-btn');
const galleryItems = $$('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      if (match) {
        item.classList.remove('hidden');
        // Staggered fade-in
        item.style.animation = 'none';
        requestAnimationFrame(() => {
          item.style.animation = 'fadeInUp 0.4s ease both';
        });
      } else {
        item.classList.add('hidden');
      }
    });
  });
});


// ── Lightbox ────────────────────────────────────────────────────────────────
const lightbox = $('#lightbox');
const lbImg    = $('#lb-img');
const lbTitle  = $('#lb-title');
const lbDesc   = $('#lb-desc');
const lbClose  = $('#lb-close');
const lbPrev   = $('#lb-prev');
const lbNext   = $('#lb-next');

let currentItems = [];  // filtered visible items
let currentIndex = 0;

function getVisibleItems() {
  return $$('.gallery-item:not(.hidden)');
}

function openLightbox(index) {
  currentItems = getVisibleItems();
  currentIndex = index;
  displayLightboxItem(currentIndex);
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function displayLightboxItem(index) {
  const item  = currentItems[index];
  const img   = item.querySelector('img');
  const title = item.dataset.title || '';
  const desc  = item.dataset.desc  || '';

  lbImg.src   = img.src;
  lbImg.alt   = img.alt;
  lbTitle.textContent = title;
  lbDesc.textContent  = desc;
}

function showPrev() {
  currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
  displayLightboxItem(currentIndex);
}
function showNext() {
  currentIndex = (currentIndex + 1) % currentItems.length;
  displayLightboxItem(currentIndex);
}

galleryItems.forEach((item, _) => {
  item.addEventListener('click', () => {
    const visibles = getVisibleItems();
    const idx = visibles.indexOf(item);
    openLightbox(idx);
  });
});

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', showPrev);
lbNext.addEventListener('click', showNext);

// Click outside inner box to close
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard support
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')       closeLightbox();
  if (e.key === 'ArrowLeft')    showPrev();
  if (e.key === 'ArrowRight')   showNext();
});

// Touch/swipe support
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend',   e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) dx < 0 ? showNext() : showPrev();
});


// ── Scroll reveal ───────────────────────────────────────────────────────────
const revealStyle = document.createElement('style');
revealStyle.textContent = `
  .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .reveal.visible { opacity: 1; transform: none; }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
`;
document.head.appendChild(revealStyle);

// Add reveal class to appropriate elements
$$('#about .about-grid, #portfolio .filter-bar, #portfolio .gallery-grid, #clients .clients-grid, #contact .contact-grid, #about .about-text, #about .about-image-wrap')
  .forEach(el => el.classList.add('reveal'));

$$('.client-card, .contact-card, .gallery-item:not(.hidden)').forEach((el, i) => {
  el.style.transitionDelay = `${i * 60}ms`;
  el.classList.add('reveal');
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

$$('.reveal').forEach(el => observer.observe(el));


// ── Footer year ─────────────────────────────────────────────────────────────
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


// ── Profile image fallback (if no real photo exists yet) ────────────────────
const profileImg = $('#profile-img');
if (profileImg) {
  profileImg.addEventListener('error', () => {
    profileImg.style.display = 'none';
    const parent = profileImg.parentElement;
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      width:100%; height:100%;
      background: linear-gradient(135deg, #e0d7ff 0%, #fce7f3 50%, #dbeafe 100%);
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-size: 4rem; color: rgba(167,139,250,0.5);
    `;
    placeholder.innerHTML = '<i class="fa-solid fa-camera"></i>';
    parent.insertBefore(placeholder, profileImg);
  });
}

// Photo placeholder for gallery items with missing images
$$('.gallery-item img').forEach(img => {
  img.addEventListener('error', () => {
    img.style.visibility = 'hidden';
    img.parentElement.style.background = '';
  });
});
