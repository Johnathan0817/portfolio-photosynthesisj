# 📸 Photography Portfolio — Customisation Guide

## Getting Started
Open `index.html` in your browser — no build tools needed, it's pure HTML/CSS/JS.

---

## ✏️ What to Personalise

### 1. Your Name & Branding
In `index.html`, replace **all** occurrences of:
- `YourName` → your real name (navbar + footer)
- `Visual Storyteller` → your own tagline
- `Your City` → your city

---

### 2. Profile Photo
Place your portrait photo at:
```
assets/profile.jpg
```
Any JPEG/PNG/WebP works — ideal aspect ratio is **3:4** (portrait).

---

### 3. Gallery Photos
Place your photos in:
```
assets/photos/
```

Then update the `src` attribute for each `<img>` inside `.gallery-item` in `index.html`:
```html
<img src="assets/photos/your-photo.jpg" alt="Your Caption" />
```

You can also **change the category** for filtering:
```html
<div class="gallery-item" data-category="portrait" data-title="Photo Title" data-desc="Short description.">
```
Available categories: `portrait`, `editorial`, `landscape`, `commercial`

To **add more photos**, copy and paste a `.gallery-item` block and fill in your own details.

---

### 4. Client / Brand Cards
Find the `#clients` section in `index.html`. For each `<div class="client-card glass">`:
- Change the icon (FontAwesome class, e.g. `fa-camera-retro`)
- Update the `<h3>` (company name)
- Update `.client-type` (category)
- Update `.client-desc` (description text)

To add more cards, copy a full `<div class="client-card glass">` block.

---

### 5. Social / Contact Links
Find the `#contact` section in `index.html`:

**Instagram:**
```html
<a href="https://www.instagram.com/yourusername" ...>
  ...
  <p class="social-handle">@yourusername</p>
```

**RedNote (小红书):**
```html
<a href="https://www.xiaohongshu.com/user/profile/YOUR_PROFILE_ID" ...>
  ...
  <p class="social-handle">@yourusername</p>
```

**Email:**
```html
<a href="mailto:hello@yourdomain.com" ...>hello@yourdomain.com</a>
```

---

### 6. 3D Camera Studio (Sony α6400 & Lenses)
The interactive 3D studio is located at `#gear` in `index.html`.
- **Live 3D Camera Model**: Fully interactive 360° model of your Sony α6400 mirrorless camera with realistic grip, controls, dials, and signature orange Alpha mount ring.
- **Two Interchangeable Lenses**:
  1. **Tamron 17-70mm F/2.8 Di III-A VC RXD** (Standard All-Round Fast Zoom)
  2. **Viltrox AF 56mm F/1.7 Air** (Featherweight Portrait Prime)
- **Interactive Switcher Buttons**: Users can click either button to smoothly unmount and mount the lenses in 3D, complete with bayonet rotation animation and dynamic HUD specs card updates.
- **View Presets**: Quick angle buttons for 3D Hero, Front, Top Dials, and Rear LCD Screen, plus an Auto-Rotate showroom toggle.
- **Custom .GLB Model Loading**: Visitors or you can optionally click *"Load Custom .GLB"* to load any 3D model generated from Meshy, CGTrader, Sketchfab, or any 3D generator directly into the viewport!

---

### 7. Colour Accent
The default accent is a soft **violet (#a78bfa)**. To change it, edit `style.css`:
```css
:root {
  --accent:  #a78bfa;   /* main accent colour */
  --accent2: #f0abfc;   /* secondary (pink) */
  --accent3: #93c5fd;   /* tertiary (sky blue) */
}
```

---

## 📁 File Structure
```
photography-portfolio/
├── index.html        ← Main page
├── style.css         ← All styles (glassmorphism theme)
├── placeholders.css  ← Gradient placeholders (can delete after adding real photos)
├── script.js         ← Interactivity (filter, lightbox, scroll reveal)
├── README.md         ← This file
└── assets/
    ├── profile.jpg   ← Your portrait photo
    └── photos/
        ├── photo1.jpg
        ├── photo2.jpg
        └── ...       ← Your portfolio photos
```

---

## 🌐 Deployment
Upload the entire folder to any static host:
- **GitHub Pages** — free & fast
- **Netlify** — drag & drop the folder
- **Vercel** — CLI or dashboard
- **Cloudflare Pages** — free tier available
