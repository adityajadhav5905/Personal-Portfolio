/**
 * ADITYA JADHAV - REALISTIC DEEP SPACE ATMOSPHERE ENGINE
 * Features: Three.js Subtle Realistic Dyson Megastructure, Cosmic Dust Field,
 * Interactive Purple Halo Particle Canvas, Lenis Smooth Scroll,
 * & Stacked Capabilities Card Deck ScrollTrigger Animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  const lenis = initSmoothScroll(isReducedMotion);
  initRealisticSpaceBackground(isReducedMotion, isTouchDevice);
  initHeroTypewriter();
  initInteractivePurpleHalo();
  initScrollStack(lenis);               // pass lenis for smooth scroll hook
  initReversibleGSAPAnimations(isReducedMotion);
  initStudioNav();
  initBackToTop(lenis);
});

/* ----------------------------------------------------
   1. Lenis Smooth Scrolling Engine
------------------------------------------------------- */
function initSmoothScroll(isReducedMotion) {
  if (isReducedMotion || typeof Lenis === 'undefined') return null;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.8,
  });

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Progress Bar
  const progressBar = document.querySelector('.scroll-progress-bar');
  lenis.on('scroll', ({ progress }) => {
    if (progressBar) {
      progressBar.style.width = `${progress * 100}%`;
    }
  });

  return lenis;
}

/* ----------------------------------------------------
   2. Three.js Realistic Deep Space & Subtle Dyson Model
------------------------------------------------------- */
function initRealisticSpaceBackground(isReducedMotion, isTouchDevice) {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030305, 0.028);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 24;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: !isTouchDevice,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Cosmic Megastructure Group
  const spaceGroup = new THREE.Group();
  scene.add(spaceGroup);

  // 1. Subtle Dark Stellar Core
  const coreGeo = new THREE.SphereGeometry(2.4, 32, 32);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a10,
    roughness: 0.7,
    metalness: 0.9,
    emissive: 0x241608,
    emissiveIntensity: 0.5
  });
  const coreStar = new THREE.Mesh(coreGeo, coreMat);
  spaceGroup.add(coreStar);

  // 2. Geodesic Dyson Outer Lattice Framework
  const shellGeo = new THREE.IcosahedronGeometry(7.6, 2);
  const shellMat = new THREE.MeshBasicMaterial({
    color: 0x64748b,
    wireframe: true,
    transparent: true,
    opacity: 0.12
  });
  const dysonShell = new THREE.Mesh(shellGeo, shellMat);
  spaceGroup.add(dysonShell);

  // Inner Geodesic Core Lattice
  const innerShellGeo = new THREE.OctahedronGeometry(4.8, 2);
  const innerShellMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    wireframe: true,
    transparent: true,
    opacity: 0.08
  });
  const innerShell = new THREE.Mesh(innerShellGeo, innerShellMat);
  spaceGroup.add(innerShell);

  // 3. Realistic Titanium & Dark Alloy Concentric Orbiting Rings (4 Multi-Axis Rings)
  const ringMat1 = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.35,
    metalness: 0.85,
    transparent: true,
    opacity: 0.4
  });

  const ringMat2 = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.4,
    metalness: 0.9,
    transparent: true,
    opacity: 0.32
  });

  const ringMat3 = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.5,
    metalness: 0.7,
    transparent: true,
    opacity: 0.25
  });

  const ringMat4 = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.3,
    metalness: 0.8,
    transparent: true,
    opacity: 0.2
  });

  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(8.8, 0.035, 16, 120), ringMat1);
  ring1.rotation.x = Math.PI / 3;
  spaceGroup.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(10.2, 0.035, 16, 120), ringMat2);
  ring2.rotation.y = Math.PI / 4;
  ring2.rotation.z = Math.PI / 6;
  spaceGroup.add(ring2);

  const ring3 = new THREE.Mesh(new THREE.TorusGeometry(11.8, 0.03, 16, 120), ringMat3);
  ring3.rotation.x = -Math.PI / 4;
  ring3.rotation.y = Math.PI / 3;
  spaceGroup.add(ring3);

  const ring4 = new THREE.Mesh(new THREE.TorusGeometry(13.4, 0.025, 16, 120), ringMat4);
  ring4.rotation.x = Math.PI / 6;
  ring4.rotation.z = -Math.PI / 4;
  spaceGroup.add(ring4);

  // 4. Modular Solar Collector Satellite Arrays
  const collectorGroup = new THREE.Group();
  spaceGroup.add(collectorGroup);

  const collectorCount = isTouchDevice ? 16 : 32;
  const panelGeo = new THREE.BoxGeometry(0.5, 0.25, 0.04);
  const panelMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.4,
    metalness: 0.9,
    transparent: true,
    opacity: 0.55
  });

  for (let i = 0; i < collectorCount; i++) {
    const panel = new THREE.Mesh(panelGeo, panelMat);
    const angle = (i / collectorCount) * Math.PI * 2;
    const radius = 8.8;
    panel.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.5, Math.sin(angle) * radius * 0.8);
    panel.rotation.z = angle;
    collectorGroup.add(panel);
  }

  // 5. Deep Space Dust & Star Particles
  const particleCount = isTouchDevice ? 250 : 550;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 60;
    particlePositions[i + 1] = (Math.random() - 0.5) * 60;
    particlePositions[i + 2] = (Math.random() - 0.5) * 50;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    size: 0.11,
    color: 0xcbd5e1,
    transparent: true,
    opacity: 0.5
  });
  const spaceDust = new THREE.Points(particleGeo, particleMat);
  scene.add(spaceDust);

  // Cosmic Lighting
  const warmKeyLight = new THREE.PointLight(0xf59e0b, 1.8, 45);
  warmKeyLight.position.set(14, 12, 12);
  scene.add(warmKeyLight);

  const coolRimLight = new THREE.PointLight(0x94a3b8, 1.2, 45);
  coolRimLight.position.set(-16, -14, -10);
  scene.add(coolRimLight);

  const ambientCosmic = new THREE.AmbientLight(0x0f172a, 0.75);
  scene.add(ambientCosmic);

  // Mouse Parallax Physics
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Scroll Progression
  let scrollProgress = 0;
  let scrollVelocity = 0;
  let lastScrollY = window.pageYOffset;

  window.addEventListener('scroll', () => {
    const currentY = window.pageYOffset;
    scrollVelocity = (currentY - lastScrollY) * 0.002;
    lastScrollY = currentY;
    scrollProgress = currentY / (document.documentElement.scrollHeight - window.innerHeight || 1);
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Render Loop
  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;

    scrollVelocity *= 0.95;

    if (!isReducedMotion) {
      ring1.rotation.z += 0.12 * delta;
      ring2.rotation.x += 0.09 * delta;
      ring3.rotation.y += 0.08 * delta;
      ring4.rotation.z -= 0.07 * delta;

      collectorGroup.rotation.z += 0.14 * delta;
      dysonShell.rotation.y += 0.04 * delta;
      innerShell.rotation.y -= 0.06 * delta;
      spaceDust.rotation.y = elapsedTime * 0.015;

      spaceGroup.rotation.y = mouse.x * 0.3 + scrollProgress * Math.PI * 2.0;
      spaceGroup.rotation.x = mouse.y * 0.25 + scrollVelocity * 2;

      if (window.innerWidth > 1024) {
        spaceGroup.position.x = 4.5 + mouse.x * 1.0;
        spaceGroup.position.y = mouse.y * 1.0;
      } else {
        spaceGroup.position.x = mouse.x * 0.5;
        spaceGroup.position.y = mouse.y * 0.5;
      }
    }

    renderer.render(scene, camera);
  }

  animate();
}

/* ----------------------------------------------------
   3. Interactive Purple Halo Particle Canvas
------------------------------------------------------- */
function initInteractivePurpleHalo() {
  const canvas = document.getElementById('purple-halo-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.offsetWidth || 560);
  let height = (canvas.height = canvas.offsetHeight || 700);

  const particles = [];
  const spacing = 15;
  const radiusX = width * 0.42;
  const radiusY = height * 0.45;
  const centerX = width / 2;
  const centerY = height / 2;

  // Build elliptical grid
  for (let x = centerX - radiusX; x <= centerX + radiusX; x += spacing) {
    for (let y = centerY - radiusY; y <= centerY + radiusY; y += spacing) {
      const dx = (x - centerX) / radiusX;
      const dy = (y - centerY) / radiusY;
      const distSq = dx * dx + dy * dy;

      if (distSq <= 1.0) {
        const normalizedDist = Math.sqrt(distSq);
        const baseAlpha = Math.max(0, 1 - Math.pow(normalizedDist, 1.8)) * 0.9;
        particles.push({
          x: x,
          y: y,
          originX: x,
          originY: y,
          vx: 0,
          vy: 0,
          baseAlpha: baseAlpha,
          currentAlpha: baseAlpha,
          size: 1.6,
          currentSize: 1.6
        });
      }
    }
  }

  const mouse = { x: -1000, y: -1000, isHovering: false };

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.isHovering = (
      e.clientX >= rect.left - 40 &&
      e.clientX <= rect.right + 40 &&
      e.clientY >= rect.top - 40 &&
      e.clientY <= rect.bottom + 40
    );
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
    mouse.isHovering = false;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth || 560;
    height = canvas.height = canvas.offsetHeight || 700;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Physics: gentle repel from mouse (reduced intensity)
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 70;

      if (dist < maxDist && mouse.isHovering) {
        const force = (1 - dist / maxDist) * 4.5; // was 10, now 4.5
        const angle = Math.atan2(dy, dx);
        p.vx += Math.cos(angle) * force * 0.25; // was 0.35
        p.vy += Math.sin(angle) * force * 0.25;
        p.currentAlpha = Math.min(1, p.baseAlpha + 0.25); // was +0.5
        p.currentSize = 2.0; // was 2.4
      } else {
        p.currentAlpha += (p.baseAlpha - p.currentAlpha) * 0.08;
        p.currentSize += (1.6 - p.currentSize) * 0.08;
      }

      // Spring back to origin (slightly stiffer for snappier return)
      const returnForceX = (p.originX - p.x) * 0.14;
      const returnForceY = (p.originY - p.y) * 0.14;
      p.vx += returnForceX;
      p.vy += returnForceY;
      p.vx *= 0.82; // more damping = less wild movement
      p.vy *= 0.82;
      p.x += p.vx;
      p.y += p.vy;

      // Draw purple pixel dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.currentSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(192, 132, 252, ${p.currentAlpha})`;
      ctx.shadowColor = 'rgba(168, 85, 247, 0.4)';
      ctx.shadowBlur = p.currentSize > 1.8 ? 5 : 2; // was 8:4
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ----------------------------------------------------
   4. Hero Typewriter Role Rotator
------------------------------------------------------- */
function initHeroTypewriter() {
  const el = document.querySelector('.typewriter-text');
  if (!el) return;

  const roles = [
    'Full-Stack Developer (MERN)',
    'Data Analyst & ML Explorer',
    'PICT Pune | NTSE Scholar',
    'Software Engineer'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let speed = 85;

  function tick() {
    const role = roles[roleIdx];

    if (isDeleting) {
      el.textContent = role.substring(0, charIdx - 1);
      charIdx--;
      speed = 40;
    } else {
      el.textContent = role.substring(0, charIdx + 1);
      charIdx++;
      speed = 80;
    }

    if (!isDeleting && charIdx === role.length) {
      speed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      speed = 400;
    }

    setTimeout(tick, speed);
  }

  setTimeout(tick, 600);
}

/* ----------------------------------------------------
   5. Reversible GSAP ScrollTrigger Animations
------------------------------------------------------- */
function initReversibleGSAPAnimations(isReducedMotion) {
  if (isReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Hero Headline Entrance
  const heroLines = document.querySelectorAll('.hero-name-headline .mask-inner');
  if (heroLines.length) {
    gsap.from(heroLines, {
      yPercent: 120,
      opacity: 0,
      duration: 1.3,
      stagger: 0.15,
      ease: 'power4.out',
      delay: 0.15
    });
  }

  // Hero SVG Avatar Smooth Entrance
  const avatarCol = document.querySelector('.hero-avatar-svg-column');
  const avatarImg = document.getElementById('hero-avatar-img');
  if (avatarCol) {
    gsap.from(avatarCol, {
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.2
    });

    if (avatarImg) {
      window.addEventListener('mousemove', (e) => {
        const rect = avatarImg.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
        const y = (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);
        gsap.to(avatarImg, {
          rotateY: x * 8,
          rotateX: -y * 6,
          duration: 0.5,
          ease: 'power2.out'
        });
      });
    }
  }

  // Section Headers Reveal
  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach((header) => {
    const tag = header.querySelector('.section-index-tag');
    const title = header.querySelector('.section-title');
    const subtitle = header.querySelector('.section-subtitle');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        end: 'bottom 15%',
        toggleActions: 'play reverse play reverse'
      }
    });

    if (tag) tl.from(tag, { y: 15, opacity: 0, duration: 0.5, ease: 'power3.out' });
    if (title) tl.from(title, { y: 25, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.35');
    if (subtitle) tl.from(subtitle, { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.45');
  });

  // Education Timeline Items (Reversible)
  const eduNodes = document.querySelectorAll('.edu-timeline-item');
  eduNodes.forEach((node) => {
    gsap.from(node, {
      scrollTrigger: {
        trigger: node,
        start: 'top 85%',
        end: 'bottom 15%',
        toggleActions: 'play reverse play reverse'
      },
      y: 35,
      opacity: 0,
      duration: 0.75,
      ease: 'power3.out'
    });
  });

  // Skill Category Pods (Reversible)
  const skillPods = document.querySelectorAll('.skill-category-pod-card');
  if (skillPods.length) {
    gsap.from(skillPods, {
      scrollTrigger: {
        trigger: '.skills-pods-grid',
        start: 'top 80%',
        end: 'bottom 15%',
        toggleActions: 'play reverse play reverse'
      },
      y: 35,
      opacity: 0,
      duration: 0.75,
      stagger: 0.08,
      ease: 'power3.out'
    });
  }

  // Project Cards Parallax and Reversible Entrance
  const projectCards = document.querySelectorAll('.project-cinematic-card');
  projectCards.forEach((card) => {
    const img = card.querySelector('.project-image-parallax-wrap img');

    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        end: 'bottom 15%',
        toggleActions: 'play reverse play reverse'
      },
      y: 35,
      opacity: 0,
      duration: 0.75,
      ease: 'power3.out'
    });

    if (img) {
      gsap.to(img, {
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        yPercent: 6,
        ease: 'none'
      });
    }
  });
}

/* ----------------------------------------------------
   6. Scroll Stack — Buttery smooth sticky deck
   Hooked into Lenis for smooth virtual scroll position.
   Entry eased with easeOutCubic. Scale driven continuously
   by each subsequent card's entry progress (no hard jumps).
------------------------------------------------------- */
function initScrollStack(lenis) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const scrollArea = document.getElementById('caps-scroll-area');
  const cards = Array.from(document.querySelectorAll('#caps-deck .stacked-capability-card'));
  const N = cards.length;
  if (!scrollArea || !N) return;

  // ── Tuning ──────────────────────────────────────────────────────────────
  const STACK_PEEK_PX   = 14;    // px each buried card peeks below — small enough to stay below header
  const ENTRY_FRACTION  = 0.55;  // fraction of a card's scroll window used for entry
  const SCALE_PER_DEPTH = 0.04;  // scale reduction per card stacked above
  const ENTRY_START_VH  = 1.08;  // how many viewports below card starts

  // Assign z-indices and prepare will-change once
  cards.forEach((card, i) => {
    card.style.zIndex         = String(i + 1);
    card.style.willChange     = 'transform';
    card.style.transformOrigin = 'top center';
    card.style.backfaceVisibility = 'hidden';
  });

  // ── Easing ──────────────────────────────────────────────────────────────
  function easeOutCubic(t) {
    return 1 - (1 - t) * (1 - t) * (1 - t);
  }
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  // ── Pre-allocated typed arrays (avoids GC per frame) ────────────────────
  const entryProg = new Float64Array(N);

  // ── Core render function — receives smooth scroll Y ─────────────────────
  function render(scrollY) {
    const vh      = window.innerHeight;
    // getBoundingClientRect().top is relative to viewport top, convert to doc coords
    const areaTop  = scrollArea.getBoundingClientRect().top + scrollY;
    const areaH    = scrollArea.offsetHeight;

    // 0 = area top at viewport top; 1 = area bottom at viewport bottom
    const prog = clamp((scrollY - areaTop) / (areaH - vh), 0, 1);

    const step = 1 / N;

    // 1. Compute eased entry progress for each card
    for (let i = 0; i < N; i++) {
      const winStart = i * step;
      const winEnd   = winStart + step * ENTRY_FRACTION;
      entryProg[i]   = easeOutCubic(clamp((prog - winStart) / (winEnd - winStart), 0, 1));
    }

    // 2. Apply transforms
    for (let i = 0; i < N; i++) {
      const ep = entryProg[i];

      // translateY: starts below, arrives at its stack offset
      const startY = vh * ENTRY_START_VH;
      const finalY = -(N - 1 - i) * STACK_PEEK_PX;
      const ty = startY + (finalY - startY) * ep;

      // Scale: continuously reduced by each subsequent card's entry progress
      // This means scale eases smoothly as each card above enters — no snap
      let scale = 1.0;
      for (let j = i + 1; j < N; j++) {
        scale -= entryProg[j] * SCALE_PER_DEPTH;
      }
      scale = Math.max(0.75, scale);

      cards[i].style.transform =
        `translate3d(0,${ty.toFixed(2)}px,0) scale(${scale.toFixed(4)})`;
    }
  }

  // ── Scroll binding ───────────────────────────────────────────────────────
  // Primary: hook into Lenis's smooth virtual scroll position (no jitter)
  if (lenis) {
    lenis.on('scroll', ({ scroll }) => render(scroll));
  } else {
    // Fallback: native scroll + rAF double-buffer
    let pending = false;
    window.addEventListener('scroll', () => {
      if (!pending) {
        pending = true;
        requestAnimationFrame(() => {
          render(window.scrollY);
          pending = false;
        });
      }
    }, { passive: true });
  }

  window.addEventListener('resize', () => render(window.scrollY));

  // Initial paint
  requestAnimationFrame(() => render(window.scrollY));
}

/* ----------------------------------------------------
   6. Studio Navigation & Scrollspy
------------------------------------------------------- */
function initStudioNav() {
  const header = document.querySelector('.studio-header');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.studio-nav-menu');
  const navLinks = document.querySelectorAll('.nav-link-item');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const top = window.pageYOffset;

    if (top > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    let currentId = '';
    sections.forEach((sec) => {
      const secTop = sec.offsetTop - 150;
      const secHeight = sec.offsetHeight;
      if (top >= secTop && top < secTop + secHeight) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      document.body.classList.toggle('nav-open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.classList.remove('nav-open');
      });
    });
  }
}

/* ----------------------------------------------------
   7. Back to Top Button
------------------------------------------------------- */
function initBackToTop(lenis) {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}
