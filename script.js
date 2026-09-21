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
$$('#about .about-grid, #portfolio .filter-bar, #portfolio .gallery-grid, #gear .gear-studio, #clients .clients-grid, #contact .contact-grid, #about .about-text, #about .about-image-wrap')
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



/* ─────────────────────────────────────────────────────────────
   3D CAMERA STUDIO — SONY α6400 & INTERCHANGEABLE LENSES
   • Interactive 360° WebGL 3D Model with Three.js
   • Realistic Sony α6400 Mirrorless Camera Body
   • Tamron 17-70mm F/2.8 Di III-A VC RXD
   • Viltrox AF 56mm F/1.7 Air Prime
   • Bayonet mount/unmount animation & sound/pulse feedback
   • Angle Presets, Auto-Rotation & Dynamic Specs HUD
   • Custom .GLB / .gltf 3D Model Loader support
───────────────────────────────────────────────────────────── */

(function init3DCameraStudio(retryCount = 0) {
  const container = document.getElementById('gear-3d-canvas-container');
  if (!container) return;

  // Check if Three.js is loaded, retry up to 10 times (3 seconds) if scripts are still downloading
  if (typeof THREE === 'undefined') {
    if (retryCount < 15) {
      setTimeout(() => init3DCameraStudio(retryCount + 1), 200);
      return;
    }
    container.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#8888aa;text-align:center;padding:24px;">
        <i class="fa-solid fa-camera" style="font-size:3rem;color:#a78bfa;margin-bottom:12px;"></i>
        <h4 style="font-family:'Cormorant Garamond',serif;font-size:1.6rem;color:#1a1a2e;margin-bottom:8px;">Sony α6400 Camera Studio</h4>
        <p style="font-size:0.9rem;max-width:400px;">Loading 3D WebGL camera model... Please ensure internet access to load Three.js libraries.</p>
      </div>`;
    return;
  }

  // ── 1. Scene, Camera, Renderer ───────────────────────────
  const scene = new THREE.Scene();

  const width = container.clientWidth || container.parentElement.clientWidth || 800;
  const height = container.clientHeight || 560;

  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
  camera.position.set(16, 9, 22);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // ── 2. Built-in OrbitControls Fallback ───────────────────
  function createBuiltinControls(cam, dom) {
    const ctrl = {
      enableDamping: true,
      dampingFactor: 0.08,
      minDistance: 8,
      maxDistance: 45,
      maxPolarAngle: Math.PI / 2 + 0.2,
      minPolarAngle: 0.1,
      autoRotate: true,
      autoRotateSpeed: 1.0,
      target: new THREE.Vector3(0, 0, 0),
      listeners: {},
      addEventListener(type, fn) {
        if (!this.listeners[type]) this.listeners[type] = [];
        this.listeners[type].push(fn);
      },
      dispatchEvent(e) {
        if (this.listeners[e.type]) this.listeners[e.type].forEach(fn => fn(e));
      }
    };

    let isDragging = false;
    let prevX = 0, prevY = 0;
    const spherical = new THREE.Spherical().setFromVector3(cam.position.clone().sub(ctrl.target));
    const targetSpherical = spherical.clone();

    dom.addEventListener('pointerdown', e => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      ctrl.dispatchEvent({ type: 'start' });
    });

    window.addEventListener('pointermove', e => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;

      targetSpherical.theta -= dx * 0.007;
      targetSpherical.phi -= dy * 0.007;
      targetSpherical.phi = Math.max(ctrl.minPolarAngle, Math.min(ctrl.maxPolarAngle, targetSpherical.phi));
    });

    window.addEventListener('pointerup', () => {
      if (isDragging) {
        isDragging = false;
        ctrl.dispatchEvent({ type: 'end' });
      }
    });

    dom.addEventListener('wheel', e => {
      e.preventDefault();
      targetSpherical.radius += e.deltaY * 0.02;
      targetSpherical.radius = Math.max(ctrl.minDistance, Math.min(ctrl.maxDistance, targetSpherical.radius));
    }, { passive: false });

    ctrl.update = function () {
      if (ctrl.autoRotate && !isDragging) {
        targetSpherical.theta += 0.004 * ctrl.autoRotateSpeed;
      }
      spherical.theta += (targetSpherical.theta - spherical.theta) * ctrl.dampingFactor;
      spherical.phi += (targetSpherical.phi - spherical.phi) * ctrl.dampingFactor;
      spherical.radius += (targetSpherical.radius - spherical.radius) * ctrl.dampingFactor;

      cam.position.setFromSpherical(spherical).add(ctrl.target);
      cam.lookAt(ctrl.target);
    };

    return ctrl;
  }

  // Use official OrbitControls if loaded, otherwise seamlessly use built-in controller
  let controls;
  if (typeof THREE.OrbitControls === 'function') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 9;
    controls.maxDistance = 45;
    controls.maxPolarAngle = Math.PI / 2 + 0.18;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;
    controls.target.set(0, 0, 0);
  } else {
    controls = createBuiltinControls(camera, renderer.domElement);
  }

  // Fade out interaction hint on first user interaction
  const hintEl = document.getElementById('interaction-hint');
  let hasInteracted = false;
  controls.addEventListener('start', () => {
    if (!hasInteracted && hintEl) {
      hintEl.style.opacity = '0';
      hasInteracted = true;
      setTimeout(() => hintEl.remove(), 700);
    }
  });

  // ── 3. Lighting ──────────────────────────────────────────
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  // Key light (soft warm white)
  const keyLight = new THREE.DirectionalLight(0xfff6ec, 1.4);
  keyLight.position.set(18, 22, 20);
  scene.add(keyLight);

  // Fill light (subtle cool blue, matching glass theme)
  const fillLight = new THREE.DirectionalLight(0xdceaff, 0.85);
  fillLight.position.set(-20, 14, 15);
  scene.add(fillLight);

  // Rim / edge light (soft violet backlight for edge definition)
  const rimLight = new THREE.DirectionalLight(0xe5d8ff, 1.3);
  rimLight.position.set(-12, 18, -20);
  scene.add(rimLight);

  // Front soft fill
  const frontLight = new THREE.DirectionalLight(0xffffff, 0.5);
  frontLight.position.set(0, -6, 18);
  scene.add(frontLight);

  // Soft Studio Ground Shadow Plane
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const sCtx = shadowCanvas.getContext('2d');
  const gradient = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
  gradient.addColorStop(0, 'rgba(30, 20, 50, 0.38)');
  gradient.addColorStop(0.5, 'rgba(40, 30, 70, 0.15)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  sCtx.fillStyle = gradient;
  sCtx.fillRect(0, 0, 256, 256);

  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const shadowGeo = new THREE.PlaneGeometry(24, 24);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    depthWrite: false
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = -3.45;
  scene.add(shadowMesh);

  // ── 4. Texture Generation Helpers ────────────────────────
  function createTextTexture(width, height, drawCallback) {
    const cvs = document.createElement('canvas');
    cvs.width = width;
    cvs.height = height;
    const ctx = cvs.getContext('2d');
    drawCallback(ctx, width, height);
    const tex = new THREE.CanvasTexture(cvs);
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    return tex;
  }

  // Sony White Logo
  const sonyLogoTex = createTextTexture(256, 64, (ctx, w, h) => {
    ctx.fillStyle = '#161618';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Inter", "Helvetica", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '5px';
    ctx.fillText('SONY', w / 2, h / 2);
  });

  // α6400 Badge
  const alphaBadgeTex = createTextTexture(128, 64, (ctx, w, h) => {
    ctx.fillStyle = '#161618';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px "Inter", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('α6400', w / 2, h / 2);
  });

  // Camera Live Viewfinder LCD Screen
  function createScreenTexture(lensMode) {
    return createTextTexture(512, 340, (ctx, w, h) => {
      // Dark photo background simulating live sensor feed
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#101624');
      grad.addColorStop(0.5, '#182438');
      grad.addColorStop(1, '#0e141e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Rule of thirds subtle grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w / 3, 0); ctx.lineTo(w / 3, h);
      ctx.moveTo(2 * w / 3, 0); ctx.lineTo(2 * w / 3, h);
      ctx.moveTo(0, h / 3); ctx.lineTo(w, h / 3);
      ctx.moveTo(0, 2 * h / 3); ctx.lineTo(w, 2 * h / 3);
      ctx.stroke();

      // Green Eye AF / Phase Focus Bracket in center
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      const bw = 50, bh = 42, cx = w / 2, cy = h / 2;
      ctx.strokeRect(cx - bw / 2, cy - bh / 2, bw, bh);

      // Small AF lock dot
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      // Top Status Bar
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '14px "Inter", Arial, sans-serif';
      ctx.fillText('RAW + X.FINE', 20, 26);
      ctx.fillText('4K 24p 100M', 130, 26);
      ctx.fillText('AF-C [Wide]', 240, 26);
      ctx.fillStyle = '#10b981';
      ctx.fillText('● REC READY', 360, 26);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('🔋 98%', w - 65, 26);

      // Bottom Exposure HUD Bar
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fillRect(0, h - 44, w, 44);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px "Inter", monospace';
      ctx.fillText('1/250', 25, h - 17);

      // Aperture changes depending on mounted lens
      const fNum = lensMode === 'viltrox' ? 'F1.7' : 'F2.8';
      ctx.fillStyle = '#60a5fa';
      ctx.fillText(fNum, 110, h - 17);

      ctx.fillStyle = '#ffffff';
      ctx.fillText('±0.0', 185, h - 17);
      ctx.fillText('ISO 400', 260, h - 17);

      const focalTxt = lensMode === 'viltrox' ? '56mm' : '35mm';
      ctx.fillStyle = '#a78bfa';
      ctx.fillText(focalTxt, 365, h - 17);
      ctx.fillText('[Standard]', w - 100, h - 17);
    });
  }

  // Mode Dial Top Decal
  const modeDialTex = createTextTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#1f1f23';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    const modes = ['AUTO', 'P', 'A', 'S', 'M', '1', '2', 'SCN', 'MR'];
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Inter", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    modes.forEach((m, idx) => {
      const angle = (idx / modes.length) * Math.PI * 2;
      const rx = w / 2 + Math.cos(angle) * (w / 2 - 28);
      const ry = h / 2 + Math.sin(angle) * (h / 2 - 28);
      ctx.save();
      ctx.translate(rx, ry);
      ctx.rotate(angle + Math.PI / 2);
      if (m === 'AUTO') ctx.fillStyle = '#10b981';
      else if (m === 'P' || m === 'A' || m === 'S' || m === 'M') ctx.fillStyle = '#f59e0b';
      else ctx.fillStyle = '#e2e8f0';
      ctx.fillText(m, 0, 0);
      ctx.restore();
    });
  });

  // Tamron 17-70mm Zoom Ring Markings
  const tamronZoomTex = createTextTexture(512, 128, (ctx, w, h) => {
    ctx.fillStyle = '#111113';
    ctx.fillRect(0, 0, w, h);

    // Rubber ribbed vertical texture
    ctx.strokeStyle = '#1d1d21';
    ctx.lineWidth = 3;
    for (let x = 0; x < w; x += 8) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Focal length indicator text on smooth band
    ctx.fillStyle = 'rgba(18, 18, 20, 0.95)';
    ctx.fillRect(0, 10, w, 38);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Inter", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const numbers = [
      { t: '17', x: 0.12 },
      { t: '24', x: 0.28 },
      { t: '35', x: 0.48 },
      { t: '50', x: 0.70 },
      { t: '70', x: 0.90 }
    ];
    numbers.forEach(item => {
      ctx.fillText(item.t, item.x * w, 28);
      ctx.fillStyle = '#a78bfa';
      ctx.fillRect(item.x * w - 1.5, 42, 3, 6);
      ctx.fillStyle = '#ffffff';
    });
  });

  // Tamron Front Bezel Text
  const tamronBezelTex = createTextTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#121214';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 19px "Inter", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const text = 'TAMRON  17-70mm  F/2.8  Di III-A  VC  RXD  Ø67  ·  MADE IN JAPAN  ·  ';
    const radius = w / 2 - 28;
    const chars = text.split('');
    const step = (Math.PI * 2) / chars.length;

    chars.forEach((c, i) => {
      const angle = i * step - Math.PI / 2;
      const x = w / 2 + Math.cos(angle) * radius;
      const y = h / 2 + Math.sin(angle) * radius;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillText(c, 0, 0);
      ctx.restore();
    });
  });

  // Viltrox Red "Air" Badge
  const viltroxBadgeTex = createTextTexture(256, 128, (ctx, w, h) => {
    ctx.fillStyle = '#141416';
    ctx.fillRect(0, 0, w, h);

    // Viltrox laser text
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 20px "Inter", Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Viltrox AF 56/1.7 E', 106, 46);
  });

  // Viltrox Front Bezel Text
  const viltroxBezelTex = createTextTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#141416';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 20px "Inter", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const text = 'VILTROX  AF  56mm  F/1.7  E  Ø52  STM  ED  IF  ·  ';
    const radius = w / 2 - 28;
    const chars = text.split('');
    const step = (Math.PI * 2) / chars.length;

    chars.forEach((c, i) => {
      const angle = i * step - Math.PI / 2;
      const x = w / 2 + Math.cos(angle) * radius;
      const y = h / 2 + Math.sin(angle) * radius;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillText(c, 0, 0);
      ctx.restore();
    });
  });

  // ── 5. Standard Materials ────────────────────────────────
  const matBody = new THREE.MeshStandardMaterial({
    color: 0x161619,
    roughness: 0.65,
    metalness: 0.25
  });

  const matGrip = new THREE.MeshStandardMaterial({
    color: 0x101012,
    roughness: 0.92,
    metalness: 0.05
  });

  const matMetal = new THREE.MeshStandardMaterial({
    color: 0x2c2c32,
    roughness: 0.35,
    metalness: 0.82
  });

  const matChrome = new THREE.MeshStandardMaterial({
    color: 0xe5e7eb,
    roughness: 0.15,
    metalness: 0.95
  });

  // The iconic Sony Alpha Electric Orange Bayonet Mount Ring
  const matSonyOrange = new THREE.MeshStandardMaterial({
    color: 0xff4600,
    roughness: 0.28,
    metalness: 0.72,
    emissive: 0x441100
  });

  const matGlassFront = new THREE.MeshPhysicalMaterial({
    color: 0x051e18,
    roughness: 0.04,
    metalness: 0.12,
    transmission: 0.35,
    transparent: true,
    opacity: 0.92,
    reflectivity: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05
  });

  const matGlassViltrox = new THREE.MeshPhysicalMaterial({
    color: 0x160824,
    roughness: 0.04,
    metalness: 0.12,
    transmission: 0.4,
    transparent: true,
    opacity: 0.92,
    reflectivity: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05
  });

  let screenTexture = createScreenTexture('tamron');
  const matScreen = new THREE.MeshBasicMaterial({ map: screenTexture });

  // ── 6. Build Sony a6400 Camera Body ──────────────────────
  function buildSonyA6400() {
    const bodyGroup = new THREE.Group();

    // Main Chassis Block
    const mainBox = new THREE.Mesh(new THREE.BoxGeometry(8.2, 6.2, 3.6), matBody);
    mainBox.position.set(0, 0, 0);
    bodyGroup.add(mainBox);

    // Front Right Ergonomic Hand Grip
    const gripGeo = new THREE.BoxGeometry(3.6, 6.0, 2.4);
    const grip = new THREE.Mesh(gripGeo, matGrip);
    grip.position.set(-4.1, -0.1, 0.95);
    bodyGroup.add(grip);

    // Grip angled top chamfer
    const gripChamfer = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 3.4, 16), matGrip);
    gripChamfer.rotation.x = Math.PI / 2;
    gripChamfer.position.set(-5.1, 0.4, 1.3);
    bodyGroup.add(gripChamfer);

    // Rear Thumb Rest
    const thumbRest = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 0.8), matGrip);
    thumbRest.position.set(-4.5, 1.6, -1.8);
    bodyGroup.add(thumbRest);

    // Red Movie Record Button on thumb rest
    const recBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.2, 16), new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
    recBtn.rotation.x = Math.PI / 2;
    recBtn.position.set(-4.8, 2.0, -2.15);
    bodyGroup.add(recBtn);

    // ── Mount Assembly (Front Center, offset slightly right of grip) ──
    const mountCollar = new THREE.Mesh(new THREE.CylinderGeometry(2.7, 2.7, 0.4, 32), matMetal);
    mountCollar.rotation.x = Math.PI / 2;
    mountCollar.position.set(0.6, 0.1, 1.9);
    bodyGroup.add(mountCollar);

    // Iconic Sony Alpha Orange Mount Ring
    const orangeRingGeo = new THREE.TorusGeometry(2.48, 0.09, 16, 48);
    const orangeRing = new THREE.Mesh(orangeRingGeo, matSonyOrange);
    orangeRing.position.set(0.6, 0.1, 2.05);
    bodyGroup.add(orangeRing);

    // Stainless Steel Bayonet Ring
    const bayonetRing = new THREE.Mesh(new THREE.CylinderGeometry(2.35, 2.35, 0.18, 32), matChrome);
    bayonetRing.rotation.x = Math.PI / 2;
    bayonetRing.position.set(0.6, 0.1, 2.1);
    bodyGroup.add(bayonetRing);

    // Inner Mount Cavity (Black Box)
    const cavity = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 0.6, 32), new THREE.MeshBasicMaterial({ color: 0x070709 }));
    cavity.rotation.x = Math.PI / 2;
    cavity.position.set(0.6, 0.1, 1.85);
    bodyGroup.add(cavity);

    // APS-C CMOS Sensor (Teal/Green Iridescent Glass)
    const sensorGeo = new THREE.PlaneGeometry(2.35, 1.56);
    const sensorMat = new THREE.MeshStandardMaterial({
      color: 0x0d3830,
      metalness: 0.85,
      roughness: 0.12,
      emissive: 0x041814
    });
    const sensor = new THREE.Mesh(sensorGeo, sensorMat);
    sensor.position.set(0.6, 0.1, 1.6);
    bodyGroup.add(sensor);

    // Lens Release Button (Front Lower Left of mount)
    const releaseBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.3, 16), matMetal);
    releaseBtn.rotation.x = Math.PI / 2;
    releaseBtn.position.set(2.4, -0.9, 1.9);
    bodyGroup.add(releaseBtn);

    // ── EVF (Electronic Viewfinder on Top Left Corner) ───────
    const evfHousing = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.7, 2.6), matBody);
    evfHousing.position.set(3.2, 3.2, -0.3);
    bodyGroup.add(evfHousing);

    // Rubber Eyecup on EVF rear
    const eyecup = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.4, 0.5), matGrip);
    eyecup.position.set(3.2, 3.2, -1.8);
    bodyGroup.add(eyecup);

    // Diopter Dial on side of EVF
    const diopter = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.3, 16), matMetal);
    diopter.rotation.z = Math.PI / 2;
    diopter.position.set(4.35, 3.2, -1.3);
    bodyGroup.add(diopter);

    // ── Pop-up Flash (Top Center with SONY logo) ─────────────
    const flashHousing = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.9, 2.5), matBody);
    flashHousing.position.set(0.6, 3.35, 0.1);
    bodyGroup.add(flashHousing);

    // SONY Logo Decal Plane
    const logoPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 0.55),
      new THREE.MeshBasicMaterial({ map: sonyLogoTex, transparent: true })
    );
    logoPlane.position.set(0.6, 3.35, 1.82);
    bodyGroup.add(logoPlane);

    // α6400 Badge Decal on Front
    const alphaPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 0.6),
      new THREE.MeshBasicMaterial({ map: alphaBadgeTex, transparent: true })
    );
    alphaPlane.position.set(3.3, 2.0, 1.82);
    bodyGroup.add(alphaPlane);

    // Multi-Interface Hot Shoe
    const hotShoe = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 1.8), matMetal);
    hotShoe.position.set(0.6, 3.85, -0.2);
    bodyGroup.add(hotShoe);

    // ── Top Controls & Dials ─────────────────────────────────
    // Mode Dial
    const modeDial = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.7, 32), matMetal);
    modeDial.position.set(-1.8, 3.35, -0.7);
    bodyGroup.add(modeDial);

    const modeDecal = new THREE.Mesh(
      new THREE.CircleGeometry(1.05, 32),
      new THREE.MeshBasicMaterial({ map: modeDialTex })
    );
    modeDecal.rotation.x = -Math.PI / 2;
    modeDecal.position.set(-1.8, 3.72, -0.7);
    bodyGroup.add(modeDecal);

    // Control Dial (Thumb Wheel)
    const ctrlDial = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.65, 32), matMetal);
    ctrlDial.position.set(-4.0, 3.35, -0.7);
    bodyGroup.add(ctrlDial);

    // Shutter Button & Power Switch Assembly
    const shutterCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.45, 24), matMetal);
    shutterCollar.position.set(-4.0, 3.35, 1.1);
    bodyGroup.add(shutterCollar);

    const shutterBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.55, 24), matChrome);
    shutterBtn.position.set(-4.0, 3.5, 1.1);
    bodyGroup.add(shutterBtn);

    // Power switch lever tab
    const pwrTab = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.25, 0.5), matMetal);
    pwrTab.position.set(-4.5, 3.35, 1.3);
    bodyGroup.add(pwrTab);

    // C1 Custom Button
    const c1Btn = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.25, 16), matMetal);
    c1Btn.position.set(-2.6, 3.3, 0.7);
    bodyGroup.add(c1Btn);

    // ── Rear LCD Monitor & Controls ──────────────────────────
    // Screen Frame
    const screenFrame = new THREE.Mesh(new THREE.BoxGeometry(6.2, 4.4, 0.35), matMetal);
    screenFrame.position.set(0.6, 0.0, -1.9);
    bodyGroup.add(screenFrame);

    // Live Viewfinder HUD Screen
    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 4.0), matScreen);
    screenMesh.rotation.y = Math.PI;
    screenMesh.position.set(0.6, 0.0, -2.1);
    bodyGroup.add(screenMesh);

    // Rear Rotary Control Wheel
    const dpadWheel = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.18, 32), matMetal);
    dpadWheel.rotation.x = Math.PI / 2;
    dpadWheel.position.set(-4.4, -0.6, -1.9);
    bodyGroup.add(dpadWheel);

    const dpadCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.22, 24), matBody);
    dpadCenter.rotation.x = Math.PI / 2;
    dpadCenter.position.set(-4.4, -0.6, -1.92);
    bodyGroup.add(dpadCenter);

    // Rear Fn, Menu, Playback Buttons
    const btnPositions = [
      [-4.4, 0.6, -1.9],  // Fn
      [3.0, 1.9, -1.9],   // Menu
      [-4.4, -1.8, -1.9], // Playback
      [-3.3, -1.8, -1.9]  // Trash / C2
    ];
    btnPositions.forEach(pos => {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.18, 16), matMetal);
      b.rotation.x = Math.PI / 2;
      b.position.set(pos[0], pos[1], pos[2]);
      bodyGroup.add(b);
    });

    // ── Strap Lugs (Left & Right Sides) ──────────────────────
    const lugMat = matChrome;
    const leftLug = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.09, 8, 16), lugMat);
    leftLug.position.set(4.15, 1.5, 0);
    leftLug.rotation.y = Math.PI / 2;
    bodyGroup.add(leftLug);

    const rightLug = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.09, 8, 16), lugMat);
    rightLug.position.set(-5.9, 1.5, 0.8);
    rightLug.rotation.y = Math.PI / 2;
    bodyGroup.add(rightLug);

    return bodyGroup;
  }

  // ── 7. Build Tamron 17-70mm F/2.8 Di III-A VC RXD ───────
  function buildTamron1770() {
    const lensGroup = new THREE.Group();

    // Lens cylinders naturally align to Y. We group them and rotate to point toward +Z
    const barrel = new THREE.Group();

    let curY = 0;

    // 1. Chrome Bayonet Mount
    const mount = new THREE.Mesh(new THREE.CylinderGeometry(2.45, 2.45, 0.4, 32), matChrome);
    mount.position.y = curY + 0.2;
    barrel.add(mount);
    curY += 0.4;

    // 2. Base Fixed Barrel
    const base = new THREE.Mesh(new THREE.CylinderGeometry(2.9, 2.85, 1.6, 32), matBody);
    base.position.y = curY + 0.8;
    barrel.add(base);
    curY += 1.6;

    // 3. Signature Tamron Platinum-Silver Brand Ring
    const tamronRingMat = new THREE.MeshStandardMaterial({
      color: 0xc4c7cc,
      metalness: 0.88,
      roughness: 0.22
    });
    const brandRing = new THREE.Mesh(new THREE.CylinderGeometry(2.93, 2.93, 0.35, 32), tamronRingMat);
    brandRing.position.y = curY + 0.175;
    barrel.add(brandRing);
    curY += 0.35;

    // 4. Wide Rubber Zoom Ring with Markings
    const zoomMat = new THREE.MeshStandardMaterial({
      map: tamronZoomTex,
      roughness: 0.85,
      metalness: 0.1
    });
    const zoomRing = new THREE.Mesh(new THREE.CylinderGeometry(3.1, 3.1, 3.2, 32), zoomMat);
    zoomRing.position.y = curY + 1.6;
    barrel.add(zoomRing);
    curY += 3.2;

    // 5. Middle Fixed Barrel (VC & AF section)
    const midBarrel = new THREE.Mesh(new THREE.CylinderGeometry(2.98, 3.05, 1.4, 32), matBody);
    midBarrel.position.y = curY + 0.7;
    barrel.add(midBarrel);
    curY += 1.4;

    // 6. Manual Focus Ring (Ribbed)
    const focusMat = new THREE.MeshStandardMaterial({
      color: 0x141416,
      roughness: 0.9,
      metalness: 0.05
    });
    const focusRing = new THREE.Mesh(new THREE.CylinderGeometry(3.06, 3.06, 2.0, 32), focusMat);
    focusRing.position.y = curY + 1.0;
    barrel.add(focusRing);
    curY += 2.0;

    // 7. Flared Front Bell Housing
    const frontBell = new THREE.Mesh(new THREE.CylinderGeometry(3.32, 3.06, 1.6, 32), matBody);
    frontBell.position.y = curY + 0.8;
    barrel.add(frontBell);
    curY += 1.6;

    // 8. Front Bezel with Ø67mm Laser Etchings
    const bezelMesh = new THREE.Mesh(
      new THREE.CircleGeometry(3.3, 32),
      new THREE.MeshBasicMaterial({ map: tamronBezelTex })
    );
    bezelMesh.rotation.x = -Math.PI / 2;
    bezelMesh.position.y = curY + 0.02;
    barrel.add(bezelMesh);

    // 9. Convex Multicoated Front Optical Glass Element
    const glassGeo = new THREE.SphereGeometry(2.6, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.32);
    const frontGlass = new THREE.Mesh(glassGeo, matGlassFront);
    frontGlass.rotation.x = Math.PI;
    frontGlass.position.y = curY - 0.2;
    barrel.add(frontGlass);

    // 10. Lens Hood Notches on front edge
    for (let i = 0; i < 4; i++) {
      const notch = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.2), matMetal);
      const angle = (i * Math.PI) / 2;
      notch.position.set(Math.cos(angle) * 3.25, curY - 0.1, Math.sin(angle) * 3.25);
      barrel.add(notch);
    }

    // Orient barrel so base is at mount and lens points forward along +Z
    barrel.rotation.x = Math.PI / 2;
    lensGroup.add(barrel);

    lensGroup.userData = {
      name: 'tamron',
      length: curY
    };

    return lensGroup;
  }

  // ── 8. Build Viltrox AF 56mm F/1.7 Air Prime ────────────
  function buildViltrox56() {
    const lensGroup = new THREE.Group();
    const barrel = new THREE.Group();

    let curY = 0;

    // 1. Chrome Bayonet Mount
    const mount = new THREE.Mesh(new THREE.CylinderGeometry(2.45, 2.45, 0.4, 32), matChrome);
    mount.position.y = curY + 0.2;
    barrel.add(mount);
    curY += 0.4;

    // 2. Base Anodized Metal Barrel
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x18181c,
      roughness: 0.42,
      metalness: 0.65
    });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(2.78, 2.75, 1.0, 32), baseMat);
    base.position.y = curY + 0.5;
    barrel.add(base);
    curY += 1.0;

    // 3. Wide Knurled Metal Focus Ring
    const knurledMat = new THREE.MeshStandardMaterial({
      color: 0x141417,
      roughness: 0.6,
      metalness: 0.5
    });
    const focusRing = new THREE.Mesh(new THREE.CylinderGeometry(2.88, 2.88, 2.4, 32), knurledMat);
    focusRing.position.y = curY + 1.2;
    barrel.add(focusRing);

    curY += 2.4;

    // 5. Front Tapered Barrel
    const frontBarrel = new THREE.Mesh(new THREE.CylinderGeometry(2.74, 2.88, 1.2, 32), baseMat);
    frontBarrel.position.y = curY + 0.6;
    barrel.add(frontBarrel);
    curY += 1.2;

    // 6. Front Bezel with Ø52mm Markings
    const bezelMesh = new THREE.Mesh(
      new THREE.CircleGeometry(2.72, 32),
      new THREE.MeshBasicMaterial({ map: viltroxBezelTex })
    );
    bezelMesh.rotation.x = -Math.PI / 2;
    bezelMesh.position.y = curY + 0.02;
    barrel.add(bezelMesh);

    // 7. Large Aperture F/1.7 Recessed Optical Glass
    const glassGeo = new THREE.SphereGeometry(2.2, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.35);
    const frontGlass = new THREE.Mesh(glassGeo, matGlassViltrox);
    frontGlass.rotation.x = Math.PI;
    frontGlass.position.y = curY - 0.35;
    barrel.add(frontGlass);

    // Orient barrel toward +Z
    barrel.rotation.x = Math.PI / 2;
    lensGroup.add(barrel);

    lensGroup.userData = {
      name: 'viltrox',
      length: curY
    };

    return lensGroup;
  }

  // ── 9. Scene Hierarchy Assembly ──────────────────────────
  const studioRoot = new THREE.Group();
  scene.add(studioRoot);

  const sonyCamera = buildSonyA6400();
  studioRoot.add(sonyCamera);

  // Group anchored exactly at the camera's lens mount face
  const lensMountGroup = new THREE.Group();
  lensMountGroup.position.set(0.6, 0.1, 2.05);
  studioRoot.add(lensMountGroup);

  const tamronLens = buildTamron1770();
  const viltroxLens = buildViltrox56();

  lensMountGroup.add(tamronLens);
  lensMountGroup.add(viltroxLens);

  // Initially show Tamron lens
  viltroxLens.visible = false;
  let activeLens = tamronLens;
  let activeLensKey = 'tamron';

  // ── 10. Dynamic Specs Data & UI Update ───────────────────
  const lensSpecsData = {
    tamron: {
      statusText: 'Tamron 17-70mm F/2.8 Mounted'
    },
    viltrox: {
      statusText: 'Viltrox 56mm F/1.7 Air Mounted'
    }
  };


  const elStatus   = document.getElementById('mount-status-text');


  function updateSpecsUI(key) {
    const data = lensSpecsData[key];
    if (!data) return;

    if (elStatus) elStatus.textContent = data.statusText;

    // Update camera rear screen texture to reflect aperture & focal length
    matScreen.map = createScreenTexture(key);
    matScreen.needsUpdate = true;
  }

  // ── 11. Lens Swapping Animation ──────────────────────────
  let isSwitching = false;

  function switchLens(targetKey) {
    if (isSwitching || targetKey === activeLensKey) return;
    isSwitching = true;

    const oldLens = activeLensKey === 'tamron' ? tamronLens : viltroxLens;
    const newLens = targetKey === 'tamron' ? tamronLens : viltroxLens;

    // Update switcher buttons UI
    document.querySelectorAll('.lens-btn').forEach(btn => {
      const match = btn.dataset.lens === targetKey;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-pressed', match ? 'true' : 'false');
    });

    const startTime = performance.now();
    const detachDuration = 320;
    const attachDuration = 380;

    // Step 1: Detach current lens (unclock rotate 18° & slide forward along +Z)
    function animateDetach(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / detachDuration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // Ease out

      oldLens.position.z = ease * 4.2;
      oldLens.rotation.z = ease * 0.32; // Bayonet rotation unlock

      if (progress < 1) {
        requestAnimationFrame(animateDetach);
      } else {
        oldLens.visible = false;
        oldLens.position.z = 0;
        oldLens.rotation.z = 0;

        // Step 2: Bring in new lens (start forward + unclocked, slide in & lock)
        newLens.visible = true;
        newLens.position.z = 4.2;
        newLens.rotation.z = 0.32;

        const attachStart = performance.now();
        function animateAttach(now2) {
          const elapsed2 = now2 - attachStart;
          const progress2 = Math.min(elapsed2 / attachDuration, 1);
          const ease2 = Math.pow(progress2, 3); // Ease in
          const easeOut = 1 - Math.pow(1 - progress2, 3);

          newLens.position.z = 4.2 * (1 - easeOut);
          newLens.rotation.z = 0.32 * (1 - easeOut);

          if (progress2 < 1) {
            requestAnimationFrame(animateAttach);
          } else {
            newLens.position.z = 0;
            newLens.rotation.z = 0;
            activeLens = newLens;
            activeLensKey = targetKey;
            isSwitching = false;
            updateSpecsUI(targetKey);

            // Subtle glow pulse on orange mount ring to confirm lock
            matSonyOrange.emissive.setHex(0xff7722);
            setTimeout(() => {
              matSonyOrange.emissive.setHex(0x441100);
            }, 300);
          }
        }
        requestAnimationFrame(animateAttach);
      }
    }

    requestAnimationFrame(animateDetach);
  }

  // Bind Lens Switcher Buttons
  const btnTamron = document.getElementById('btn-lens-tamron');
  const btnViltrox = document.getElementById('btn-lens-viltrox');

  if (btnTamron) btnTamron.addEventListener('click', () => switchLens('tamron'));
  if (btnViltrox) btnViltrox.addEventListener('click', () => switchLens('viltrox'));

  // ── 12. Camera Angle Presets & Tweens ────────────────────
  const presetAngles = {
    hero:  { x: 16,  y: 9,   z: 22,  tx: 0,   ty: 0,   tz: 0 },
    front: { x: 0.6, y: 0.2, z: 24,  tx: 0.6, ty: 0.2, tz: 0 },
    top:   { x: 0,   y: 26,  z: 1.5, tx: 0,   ty: 0,   tz: 0 },
    back:  { x: 0.6, y: 0.0, z: -22, tx: 0.6, ty: 0.0, tz: 0 }
  };

  let tweenAnim = null;

  function moveToPreset(key) {
    const target = presetAngles[key];
    if (!target) return;

    if (tweenAnim) cancelAnimationFrame(tweenAnim);

    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();
    const endPos = new THREE.Vector3(target.x, target.y, target.z);
    const endTarget = new THREE.Vector3(target.tx, target.ty, target.tz);

    const duration = 850;
    const startTime = performance.now();

    function tweenLoop(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      // Smooth cubic ease-in-out
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      camera.position.lerpVectors(startPos, endPos, ease);
      controls.target.lerpVectors(startTarget, endTarget, ease);

      if (progress < 1) {
        tweenAnim = requestAnimationFrame(tweenLoop);
      } else {
        tweenAnim = null;
      }
    }
    tweenAnim = requestAnimationFrame(tweenLoop);
  }

  // Bind Preset Buttons
  document.querySelectorAll('.preset-btn[data-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preset-btn[data-preset]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      moveToPreset(btn.dataset.preset);
    });
  });

  // Auto-Orbit Toggle Button
  const orbitBtn = document.getElementById('btn-orbit-toggle');
  if (orbitBtn) {
    orbitBtn.addEventListener('click', () => {
      controls.autoRotate = !controls.autoRotate;
      orbitBtn.classList.toggle('active', controls.autoRotate);
    });
  }

  // ── 13. Custom .GLB File Loader (User File Upload) ───────
  const glbInput = document.getElementById('custom-glb-input');
  if (glbInput) {
    glbInput.addEventListener('change', e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (typeof THREE.GLTFLoader === 'undefined') {
        alert('GLTFLoader is loading. Please try again in a moment.');
        return;
      }

      const reader = new FileReader();
      reader.onload = function (evt) {
        const contents = evt.target.result;
        const loader = new THREE.GLTFLoader();
        loader.parse(contents, '', gltf => {
          // Hide procedural models and mount custom imported model
          sonyCamera.visible = false;
          lensMountGroup.visible = false;

          const customModel = gltf.scene;

          // Normalize bounding box & scale
          const box = new THREE.Box3().setFromObject(customModel);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 0) {
            const scale = 14 / maxDim;
            customModel.scale.set(scale, scale, scale);
          }

          const center = box.getCenter(new THREE.Vector3());
          customModel.position.sub(center.multiplyScalar(customModel.scale.x));
          studioRoot.add(customModel);

          if (elStatus) elStatus.textContent = `Custom Model: ${file.name}`;
          if (elName) elName.textContent = file.name;
          if (elBadge) elBadge.textContent = 'Custom 3D Asset';
          if (elTagline) elTagline.textContent = 'Loaded from local .glb file.';
        }, error => {
          console.error('Error loading custom GLB:', error);
          alert('Could not parse GLB file. Please make sure it is a valid .glb or .gltf file.');
        });
      };
      reader.readAsArrayBuffer(file);
    });
  }

  // ── 14. Responsive Resize Observer ───────────────────────
  function onResize() {
    const w = container.clientWidth || 800;
    const h = container.clientHeight || 560;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  // ── 15. Main Animation Loop ──────────────────────────────
  let animId;
  function animate() {
    animId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
  setTimeout(onResize, 100);
  setTimeout(onResize, 400);

})();
