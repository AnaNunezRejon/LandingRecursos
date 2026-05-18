/* ============================================
   WIT Creativo — Optimized JavaScript
   ============================================ */

gsap.registerPlugin(ScrollTrigger);

/* ========== LENIS ========== */
let lenis;
function initLenis() {
  lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 1.4, smoothWheel: true });
  gsap.ticker.lagSmoothing(0);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
}

/* ========== SCROLL TO TOP ========== */
function initScrollToTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;
  ScrollTrigger.create({
    start: 400,
    onUpdate: (self) => {
      btn.classList.toggle('visible', self.scroll() > 400);
    }
  });
  btn.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ========== CUSTOM CURSOR ========== */
function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;
  if (window.matchMedia('(pointer: coarse)').matches) {
    cursor.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }
  let cx = 0, cy = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  function updateCursor() {
    cx += (tx - cx) * 0.35;
    cy += (ty - cy) * 0.35;
    cursor.style.transform = `translate(${cx - cursor.offsetWidth / 2}px, ${cy - cursor.offsetHeight / 2}px)`;
    requestAnimationFrame(updateCursor);
  }
  requestAnimationFrame(updateCursor);
  function addHover() {
    document.querySelectorAll('a, button, .carousel-btn, .carousel-card, .flip-card, .scroll-top, .form-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (!cursor.classList.contains('hero-hover') && !cursor.classList.contains('title-hover')) cursor.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }
  addHover();
  new MutationObserver(() => addHover()).observe(document.body, { childList: true, subtree: true });
}

/* ========== TITLE CURSOR ========== */
function initTitleCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;
  document.querySelectorAll('[data-title], .problem-title, .hero-title, .section-title').forEach(title => {
    title.addEventListener('mouseenter', () => { cursor.classList.remove('hover'); cursor.classList.add('title-hover'); });
    title.addEventListener('mouseleave', () => cursor.classList.remove('title-hover'));
  });
}

/* ========== HERO RED LETTERS ========== */
function initHeroRedLetters() {
  const cursor = document.getElementById('cursor');
  const heroTitle = document.getElementById('heroTitle');
  if (!cursor || !heroTitle) return;
  const R = 300;
  heroTitle.addEventListener('mouseenter', () => { cursor.classList.remove('hover'); cursor.classList.add('hero-hover'); });
  heroTitle.addEventListener('mouseleave', () => { cursor.classList.remove('hero-hover'); heroTitle.querySelectorAll('.letter').forEach(l => l.classList.remove('in-circle')); });
  heroTitle.addEventListener('mousemove', (e) => {
    heroTitle.querySelectorAll('.letter').forEach(letter => {
      const rect = letter.getBoundingClientRect();
      const dist = Math.sqrt(Math.pow(e.clientX - (rect.left + rect.width / 2), 2) + Math.pow(e.clientY - (rect.top + rect.height / 2), 2));
      letter.classList.toggle('in-circle', dist < R);
    });
  }, { passive: true });
}

/* ========== MOBILE NAV ========== */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');
  if (!toggle || !mobile) return;
  toggle.addEventListener('click', () => { mobile.classList.toggle('active'); toggle.classList.toggle('active'); });
  document.querySelectorAll('.nav-mobile-link, .nav-mobile-cta').forEach(link => {
    link.addEventListener('click', () => { mobile.classList.remove('active'); toggle.classList.remove('active'); });
  });
}

/* ========== NAVBAR SCROLL ========== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  ScrollTrigger.create({
    start: 100,
    onUpdate: (self) => { navbar.classList.toggle('scrolled', self.scroll() > 100); }
  });
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target && lenis) lenis.scrollTo(target);
    });
  });
}

/* ========== THREE.JS BACKGROUND (particles) - OPTIMIZED ========== */
function initThreeBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const count = 120; // Reduced from 400
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const gray = new THREE.Color(0xCCCCCC);
  const yellow = new THREE.Color(0xFFD700);
  const white = new THREE.Color(0xEEEEEE);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const r = 20 + Math.random() * 25;
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    positions[i3] = r * Math.sin(p) * Math.cos(t);
    positions[i3 + 1] = r * Math.sin(p) * Math.sin(t);
    positions[i3 + 2] = r * Math.cos(p);
    const rc = Math.random();
    const c = rc < 0.7 ? gray.clone().lerp(white, Math.random()) : yellow.clone();
    colors[i3] = c.r; colors[i3 + 1] = c.g; colors[i3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({ size: 0.12, vertexColors: true, transparent: true, opacity: 0.5, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false });
  const particles = new THREE.Points(geo, mat);
  scene.add(particles);
  camera.position.z = 35;

  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => { mx = (e.clientX / window.innerWidth - 0.5) * 2; my = (e.clientY / window.innerHeight - 0.5) * 2; }, { passive: true });

  function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += 0.0004 + mx * 0.0005;
    particles.rotation.x += 0.0002 + my * 0.0003;
    renderer.render(scene, camera);
  }
  animate();

  const ro = new ResizeObserver(() => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  ro.observe(document.body);
}

/* ========== THREE.JS CONNECTION NODES - OPTIMIZED ========== */
function initConnectionNodes() {
  const canvas = document.getElementById('connectionNodesCanvas');
  if (!canvas) return;

  const section = document.getElementById('solution');
  let w = section.offsetWidth;
  let h = section.offsetHeight;

  const scene = new THREE.Scene();

  let aspect = w / h;
  let frustum = 6;
  let halfW = frustum * aspect / 2;
  let halfH = frustum / 2;

  const camera = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, 0.1, 1000);
  camera.position.z = 10;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const nodeCount = 30; // Reduced from 80
  const nodePositions = [];
  const nodeGeo = new THREE.SphereGeometry(0.08, 8, 8);
  const nodeMat = new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.4 });

  for (let i = 0; i < nodeCount; i++) {
    const mesh = new THREE.Mesh(nodeGeo, nodeMat.clone());
    mesh.position.set((Math.random() - 0.5) * halfW * 2, (Math.random() - 0.5) * halfH * 2, 0);
    mesh.userData = { vx: (Math.random() - 0.5) * 0.01, vy: (Math.random() - 0.5) * 0.01, baseOp: 0.2 + Math.random() * 0.35 };
    scene.add(mesh);
    nodePositions.push(mesh);
  }

  const lineMat = new THREE.LineBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.08 });
  const lines = [];

  const pulseGeo = new THREE.RingGeometry(0.06, 0.08, 16);
  const pulseMat = new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0, side: THREE.DoubleSide });
  const pulses = [];
  for (let i = 0; i < 4; i++) { // Reduced from 6
    const pulse = new THREE.Mesh(pulseGeo, pulseMat.clone());
    scene.add(pulse);
    pulses.push(pulse);
  }

  let running = true;

  function animate() {
    if (!running) return;
    requestAnimationFrame(animate);

    nodePositions.forEach(node => {
      node.position.x += node.userData.vx;
      node.position.y += node.userData.vy;
      if (Math.abs(node.position.x) > halfW) node.userData.vx *= -1;
      if (Math.abs(node.position.y) > halfH) node.userData.vy *= -1;
      node.material.opacity = node.userData.baseOp + Math.sin(performance.now() * 0.001 + node.position.x * 3) * 0.08;
    });

    lines.forEach(l => scene.remove(l));
    lines.length = 0;

    const connectionDist = 2.2;
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const dx = nodePositions[i].position.x - nodePositions[j].position.x;
        const dy = nodePositions[i].position.y - nodePositions[j].position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < connectionDist) {
          const lineGeo = new THREE.BufferGeometry().setFromPoints([nodePositions[i].position, nodePositions[j].position]);
          const lm = lineMat.clone();
          lm.opacity = 0.1 * (1 - dist / connectionDist);
          const line = new THREE.Line(lineGeo, lm);
          scene.add(line);
          lines.push(line);
        }
      }
    }

    const now = performance.now();
    pulses.forEach((pulse, i) => {
      const elapsed = (now + i * 2500) % 6000;
      if (elapsed < 3000) {
        const progress = elapsed / 3000;
        pulse.scale.setScalar(1 + progress * 15);
        pulse.material.opacity = 0.1 * (1 - progress);
        const anchor = nodePositions[i % nodePositions.length];
        pulse.position.set(anchor.position.x, anchor.position.y, 0.01);
      } else {
        pulse.material.opacity = 0;
      }
    });

    renderer.render(scene, camera);
  }
  animate();

  const resizeObserver = new ResizeObserver(() => {
    w = section.offsetWidth;
    h = section.offsetHeight;
    aspect = w / h;
    halfW = frustum * aspect / 2;
    halfH = frustum / 2;
    camera.left = -halfW;
    camera.right = halfW;
    camera.top = halfH;
    camera.bottom = -halfH;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  resizeObserver.observe(section);
}

/* ========== TYPEWRITER — Hero ========== */
function initTypewriter() {
  const isMobile = window.innerWidth <= 768;

  const lines = isMobile ? [
    { el: document.getElementById('typeLine1'), text: 'CONVIERTE' },
    { el: document.getElementById('typeLine2'), text: 'TU WEB EN' },
    { el: document.getElementById('typeLine3'), text: 'UN SISTEMA' },
    { el: document.getElementById('typeLine4'), text: 'QUE GENERA' },
    { el: document.getElementById('typeLine5'), text: 'CLIENTES' }
  ] : [
    { el: document.getElementById('typeLine1'), text: 'CONVIERTE TU' },
    { el: document.getElementById('typeLine2'), text: 'WEB EN UN' },
    { el: document.getElementById('typeLine3'), text: 'SISTEMA QUE' },
    { el: document.getElementById('typeLine4'), text: 'GENERA CLIENTES' }
  ];

  const cursor = document.getElementById('typeCursor');
  const hero3d = document.getElementById('hero3d');
  const scrollInd = document.getElementById('scrollInd');
  const floatingCta = document.getElementById('heroFloatingCta');

  if (!lines[0].el) return;

  let lineIndex = 0;
  let charIndex = 0;
  const speed = 40;

  if (cursor) cursor.style.display = 'inline-block';

  function typeNext() {
    if (lineIndex >= lines.length) {
      if (cursor) { cursor.style.animation = 'blink 0.7s ease-in-out 4'; setTimeout(() => cursor.style.display = 'none', 2800); }
      return;
    }
    const current = lines[lineIndex];
    if (charIndex < current.text.length) {
      const text = current.el.textContent + current.text.charAt(charIndex);
      current.el.innerHTML = '';
      for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
        current.el.appendChild(span);
      }
      charIndex++;
      setTimeout(typeNext, speed + Math.random() * 60);
    } else {
      lineIndex++;
      charIndex = 0;
      setTimeout(typeNext, 100);
    }
  }

  // Ocultar línea 5 en desktop
  if (!isMobile) {
    const line5 = document.getElementById('typeLine5');
    if (line5) line5.style.display = 'none';
  }

  setTimeout(typeNext, 300);
  setTimeout(() => {
    if (hero3d) hero3d.classList.add('visible');
    gsap.fromTo(scrollInd, { opacity: 0 }, { opacity: 1, delay: 0.6, duration: 0.8 });
  }, 1000);
  setTimeout(() => { if (floatingCta) floatingCta.classList.add('visible'); }, 2500);
}

/* ========== CONNECTION LINE DRAW ========== */
function initConnectionLineDraw() {
  const bar = document.getElementById('conectaLine');
  const textEl = document.getElementById('conectaText');
  if (!bar || !textEl) return;

  const tl = gsap.timeline({
    scrollTrigger: { trigger: '#solution', start: 'top 60%', toggleActions: 'play reverse play reverse' }
  });

  tl.fromTo(bar, { xPercent: -100 }, { xPercent: 0, duration: 1.0, ease: 'power2.inOut' });
  tl.to(textEl, { clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'power2.out' }, 0.4);
  tl.to(bar, { xPercent: 100, duration: 1.5, ease: 'power2.inOut' }, 1.2);
}

/* ========== IS FOR YOU ========== */
function initIsForYou() {
  const titleSpan = document.getElementById('isForYouTypeText');
  const cursor = document.getElementById('isForYouCursor');
  const checkList = document.getElementById('checkList');
  if (!titleSpan || !checkList) return;

  const fullTitle = 'Esto es para ti si...';
  const typeObj = { chars: 0 };
  const items = checkList.querySelectorAll('li');

  gsap.set(items, { opacity: 0, y: 20 });
  items.forEach(item => {
    const icon = item.querySelector('.check-icon');
    if (icon) gsap.set(icon, { opacity: 0, scale: 0 });
  });

  const masterTl = gsap.timeline({
    scrollTrigger: { trigger: '#is-for-you', start: 'top 75%', toggleActions: 'play reverse play reverse' }
  });

  masterTl.to(typeObj, {
    chars: fullTitle.length,
    duration: 1.5,
    ease: 'none',
    onUpdate: () => {
      const count = Math.round(typeObj.chars);
      titleSpan.textContent = fullTitle.substring(0, count);
      if (cursor) {
        if (count < fullTitle.length) {
          cursor.style.display = 'inline-block';
          cursor.style.animation = 'none';
        } else {
          cursor.style.animation = 'blink 0.7s ease-in-out infinite';
          setTimeout(() => { cursor.style.display = 'none'; }, 2800);
        }
      }
    }
  });

  items.forEach((item, i) => {
    masterTl.to(item, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }, 1.6 + i * 0.12);
    const icon = item.querySelector('.check-icon');
    if (icon) {
      masterTl.to(icon, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 1.7 + i * 0.12);
    }
  });
}

/* ========== WIT 360 TITLE ========== */
function initWIT360Title() {
  const sistema = document.getElementById('sistemaWord');
  const wit = document.getElementById('witWord');
  const num360 = document.getElementById('num360');
  if (!sistema || !wit || !num360) return;

  const st = { trigger: '#process', start: 'top 80%', toggleActions: 'play reverse play reverse' };

  gsap.fromTo(sistema, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'bounce.out', scrollTrigger: st });
  gsap.fromTo(wit, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', delay: 0.3, scrollTrigger: st });
  gsap.fromTo(num360, { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'expo.out', delay: 0.6, scrollTrigger: st });
}

/* ========== PROBLEM BG + PARALLAX ========== */
function initProblemBg() {
  const bg = document.getElementById('problemBg');
  if (!bg) return;

  // Parallax effect on background image
  /*
  gsap.to(bg.querySelector('img'), {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '#problem',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
*/
  ScrollTrigger.create({
    trigger: '#problem', start: 'top 80%',
    onEnter: () => bg.classList.add('visible'),
    onLeaveBack: () => bg.classList.remove('visible'),
  });
}

/* ========== VINTAGE GALLERY ========== */
function initVintageGallery() {
  const gallery = document.getElementById('vintageGallery');
  if (!gallery) return;

  const images = gallery.querySelectorAll('.vintage-img');
  let lastHovered = null;

  images.forEach((img) => {
    img.addEventListener('mouseenter', () => {
      if (lastHovered === img) return;
      images.forEach((i) => { i.classList.remove('active'); i.classList.add('inactive'); });
      img.classList.remove('inactive'); img.classList.add('active');
      const infoId = img.dataset.info;
      document.querySelectorAll('.vintage-info').forEach((info) => info.classList.remove('visible'));
      const info = document.getElementById(infoId);
      if (info) info.classList.add('visible');
      lastHovered = img;
    });
  });

  gallery.addEventListener('mouseleave', () => {
    images.forEach((i) => { i.classList.remove('active', 'inactive'); });
    document.querySelectorAll('.vintage-info').forEach((info) => info.classList.remove('visible'));
    lastHovered = null;
  });

  // Mouse parallax on gallery images
  const section = document.getElementById('problem');
  if (section) {
    section.addEventListener('mousemove', (e) => {
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      images.forEach((img, i) => {
        const speed = 8 + (i % 4) * 4;
        img.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    }, { passive: true });
  }
}

/* ========== SERVICES TITLE ========== */
function initServicesTitleAnimation() {
  const seo = document.getElementById('seoWord');
  const estrategico = document.getElementById('estrategicoWord');
  const webs = document.getElementById('websWord');
  const venden = document.getElementById('vendenWord');
  if (!seo || !estrategico || !webs || !venden) return;

  const el = document.getElementById('servicesParallax');
  if (el) {
    gsap.to(el, { x: 300, ease: 'none', scrollTrigger: { trigger: '#services', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  const st = { trigger: '#services', start: 'top 75%', toggleActions: 'play reverse play reverse' };

  gsap.fromTo(seo, { y: -120, scale: 2.5, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.9, ease: 'bounce.out', scrollTrigger: st });
  gsap.fromTo(estrategico, { x: 150, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'expo.out', delay: 0.3, scrollTrigger: st });
  gsap.fromTo(webs, { y: 60, opacity: 0, filter: 'blur(12px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: 'expo.out', delay: 0.5, scrollTrigger: st });
  gsap.fromTo(venden, { y: 60, opacity: 0, filter: 'blur(12px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: 'expo.out', delay: 0.7, scrollTrigger: st });
}

/* ========== INTERACTIVE SHAPES ========== */
function initInteractiveShapes() {
  const container = document.getElementById('interactiveShapes');
  if (!container) return;
  const circles = container.querySelectorAll('.shape-circle');
  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#FFFFD2'];
  circles.forEach((circle) => {
    circle.addEventListener('click', () => {
      const rc = colors[Math.floor(Math.random() * colors.length)];
      circle.style.background = rc;
      circle.style.borderColor = rc;
      circle.style.transform = 'scale(1.2)';
      setTimeout(() => { circle.style.transform = ''; }, 300);
      spawnShapeParticle(circle, rc);
    });
  });
}

function spawnShapeParticle(target, color) {
  const container = document.getElementById('shapeParticles');
  if (!container) return;
  const rect = target.getBoundingClientRect();
  const cr = container.getBoundingClientRect();
  const p = document.createElement('div');
  p.className = 'shape-particle';
  p.style.cssText = `position:absolute;width:10px;height:10px;background:${color};border-radius:50%;left:${rect.left - cr.left + rect.width / 2 - 5}px;top:${rect.top - cr.top + rect.height / 2 - 5}px;pointer-events:none;animation:particleFloat 3s ease-out forwards;`;
  container.appendChild(p);
  setTimeout(() => p.remove(), 3000);
}

/* ========== HERO 3D SHAPE ========== */
function initHero3DShape() {
  const container = document.getElementById('hero3d');
  if (!container) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const geo = new THREE.IcosahedronGeometry(1.8, 0);
  const mat = new THREE.MeshBasicMaterial({ color: 0xFFD700, wireframe: true, transparent: true, opacity: 0.3 });
  const shape = new THREE.Mesh(geo, mat);
  scene.add(shape);
  const geo2 = new THREE.IcosahedronGeometry(1.2, 0);
  const mat2 = new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.06 });
  scene.add(new THREE.Mesh(geo2, mat2));
  const edges = new THREE.EdgesGeometry(geo);
  const edgeMat = new THREE.LineBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.2 });
  scene.add(new THREE.LineSegments(edges, edgeMat));
  camera.position.z = 5;

  let trx = 0, try_ = 0, crx = 0, cry_ = 0;
  document.addEventListener('mousemove', (e) => {
    trx = (e.clientY / window.innerHeight - 0.5) * 1.5;
    try_ = (e.clientX / window.innerWidth - 0.5) * 1.5;
  }, { passive: true });

  function animate() {
    requestAnimationFrame(animate);
    crx += (trx - crx) * 0.04;
    cry_ += (try_ - cry_) * 0.04;
    shape.rotation.x = crx + performance.now() * 0.0002;
    shape.rotation.y = cry_ + performance.now() * 0.0003;
    renderer.render(scene, camera);
  }
  animate();

  const ro = new ResizeObserver(() => {
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
  });
  ro.observe(container);
}

/* ========== RESULTS ========== */
function initResultsAnimation() {
  const visibilidad = document.getElementById('visibilidadLine');
  const conversiones = document.getElementById('conversionesLine');
  const ventas = document.getElementById('ventasLine');
  if (!visibilidad || !conversiones || !ventas) return;

  const st = { trigger: '#results', start: 'top 75%', toggleActions: 'play reverse play reverse' };

  gsap.fromTo(visibilidad, { y: -150, rotation: 8, opacity: 0, scale: 1.3 }, { y: 0, rotation: 3, opacity: 1, scale: 1, duration: 0.8, ease: 'bounce.out', scrollTrigger: st });
  gsap.fromTo(conversiones, { y: -150, rotation: -8, opacity: 0, scale: 1.3 }, { y: 0, rotation: -3, opacity: 1, scale: 1, duration: 0.8, ease: 'bounce.out', delay: 0.2, scrollTrigger: st });
  gsap.fromTo(ventas, { y: -150, rotation: 5, opacity: 0, scale: 1.2 }, { y: 0, rotation: 1.5, opacity: 1, scale: 1, duration: 0.8, ease: 'bounce.out', delay: 0.4, scrollTrigger: st });
}

/* ========== SECTION ENTRANCES ========== */
function initSectionAnimations() {
  gsap.utils.toArray('.section-body, .section-label').forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play reverse play reverse' }
    });
  });

  const problemContent = document.querySelector('.problem-content');
  if (problemContent) {
    gsap.fromTo(problemContent, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: problemContent, start: 'top 70%', toggleActions: 'play reverse play reverse' }
    });
  }

  const solutionImg = document.querySelector('.solution-image');
  if (solutionImg) {
    ScrollTrigger.create({ trigger: solutionImg, start: 'top 80%',
      onEnter: () => solutionImg.classList.add('revealed'),
      onLeaveBack: () => solutionImg.classList.remove('revealed'),
    });
  }

  const flipCards = document.querySelectorAll('.flip-card');
  gsap.fromTo(flipCards, { opacity: 0, y: 30, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'expo.out', stagger: 0.1,
      scrollTrigger: { trigger: '.services-grid', start: 'top 80%', toggleActions: 'play reverse play reverse' }
    }
  );

  const statCards = document.querySelectorAll('.stat-card');
  gsap.fromTo(statCards, { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.15,
      scrollTrigger: { trigger: '.stats-grid', start: 'top 80%', toggleActions: 'play reverse play reverse' }
    }
  );

  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.textContent.includes('%') ? '%' : 'x';
    const prefix = el.textContent.includes('+') ? '+' : '';
    const obj = { val: 0 };
    gsap.to(obj, { val: target, duration: 2, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play reverse play reverse' },
      onUpdate: () => { el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`; }
    });
  });

  gsap.utils.toArray('.shape-circle').forEach((shape, i) => {
    gsap.fromTo(shape, { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'expo.out', delay: i * 0.15,
        scrollTrigger: { trigger: '.isforyou-visual', start: 'top 80%', toggleActions: 'play reverse play reverse' }
      }
    );
  });
}

/* ========== CAROUSEL ========== */
function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const prev = document.getElementById('carouselPrev');
  const next = document.getElementById('carouselNext');
  if (!track || !prev || !next) return;

  const cards = track.querySelectorAll('.carousel-card');
  if (!cards.length) return;

  let currentIndex = 0;

  function getCardStep() {
    // Calculate actual card width + gap dynamically
    const style = getComputedStyle(cards[0]);
    const cardWidth = cards[0].offsetWidth;
    const gap = parseInt(getComputedStyle(track).gap) || 24;
    return cardWidth + gap;
  }

  function getMaxIndex() {
    const isMobile = window.innerWidth <= 768;
    return isMobile ? cards.length - 1 : cards.length - 4;
  }

  function updateActive() {
    cards.forEach((card, i) => card.classList.toggle('active', i === currentIndex));
  }

  function updatePosition() {
    const step = getCardStep();
    track.style.transform = `translateX(${-(currentIndex * step)}px)`;
  }

  prev.addEventListener('click', () => {
    currentIndex = Math.max(0, currentIndex - 1);
    updatePosition();
    updateActive();
  });

  next.addEventListener('click', () => {
    currentIndex = Math.min(getMaxIndex(), currentIndex + 1);
    updatePosition();
    updateActive();
  });

  window.addEventListener('resize', () => {
    currentIndex = Math.min(currentIndex, getMaxIndex());
    updatePosition();
  });

  updatePosition();
  updateActive();
}

/* ========== PARALLAX CONTINUOUS BG ========== */
function initContinuousParallax() {
  const wrapper = document.getElementById('parallaxWrapper');
  const bgLayer = document.getElementById('parallaxBgLayer');
  if (!wrapper || !bgLayer) return;

  gsap.to(bgLayer, {
    yPercent: -60,
    ease: 'none',
    scrollTrigger: {
      trigger: wrapper,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
}

/* ========== SCROLL-TO-DRAW SVG — CTA ========== */
function initScrollToDraw() {
  const ctaSection = document.getElementById('cta');
  if (!ctaSection) return;

  document.fonts.ready.then(() => {
    const drawStrokes = ctaSection.querySelectorAll('.draw-stroke');
    drawStrokes.forEach(path => {
      try {
        const length = path.getTotalLength ? path.getTotalLength() : 1000;
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
      } catch (e) {
        path.style.strokeDasharray = '1000';
        path.style.strokeDashoffset = '1000';
      }
    });

    gsap.to(drawStrokes, {
      strokeDashoffset: 0, stagger: 0.15, ease: 'none',
      scrollTrigger: { trigger: ctaSection, start: 'top 60%', end: 'bottom 40%', scrub: true }
    });

    const ctaButtons = document.getElementById('ctaButtons');
    if (ctaButtons) {
      ScrollTrigger.create({
        trigger: ctaSection, start: 'center center',
        onEnter: () => ctaButtons.classList.add('visible'),
        onLeaveBack: () => ctaButtons.classList.remove('visible'),
      });
    }
  });
}

/* ========== CONTACT FORM ========== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.reset();
  });
}

/* ========== INITIALIZATION ========== */
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initCursor();
  initTitleCursor();
  initScrollToTop();
  initMobileNav();
  initNavbar();
  initThreeBackground();
  initConnectionNodes();
  initTypewriter();
  initHeroRedLetters();
  initHero3DShape();
  initConnectionLineDraw();
  initContinuousParallax();
  initSectionAnimations();
  initCarousel();
  initScrollToDraw();
  initServicesTitleAnimation();
  initVintageGallery();
  initProblemBg();
  initIsForYou();
  initWIT360Title();
  initResultsAnimation();
  initInteractiveShapes();
  initContactForm();
});
