/**
 * ARPAN ROY — PORTFOLIO JAVASCRIPT
 * ─────────────────────────────────────────────────────────────
 * Modules:
 *  1. Loader
 *  2. Custom Cursor
 *  3. Navigation (scroll behaviour + mobile menu)
 *  4. Starfield Canvas (stars + shooting stars)
 *  5. Typewriter Effect
 *  6. Scroll Reveal
 *  7. Animated Counters
 *  8. Skill Bar Animation
 *  9. GitHub-style Contribution Heatmap
 * 10. Theme Toggle (dark / light)
 * 11. Contact Form Validation
 * 12. Back-to-Top Button
 * ─────────────────────────────────────────────────────────────
 */

'use strict';

/* ══════════════════════════════════════════════════════════════
   1. LOADER
══════════════════════════════════════════════════════════════ */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Remove loader after CSS animation (1.8s) + small buffer
  setTimeout(() => {
    loader.classList.add('hide');
    setTimeout(() => loader.remove(), 600);
  }, 2000);
}

/* ══════════════════════════════════════════════════════════════
   2. CUSTOM CURSOR
══════════════════════════════════════════════════════════════ */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  if (!cursor || !trail) return;

  // Detect touch-only devices and bail
  if (window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;
  let rafId;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Smooth trail with rAF
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    trail.style.left = trailX + 'px';
    trail.style.top = trailY + 'px';
    rafId = requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Scale on hover
  const interactives = document.querySelectorAll('a, button, [role="button"], input, textarea, .glass-card, .skill-pill');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; trail.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; trail.style.opacity = '1'; });
}

/* ══════════════════════════════════════════════════════════════
   3. NAVIGATION
══════════════════════════════════════════════════════════════ */
function initNav() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll behaviour: add .scrolled class
  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link based on scroll position
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });

    // Store scroll position for data attribute (used by CSS)
    document.body.setAttribute('data-scroll', Math.floor(window.scrollY));
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });

    // Close on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }
}

/* ══════════════════════════════════════════════════════════════
   4. STARFIELD CANVAS
   Renders: stars (twinkle) + shooting stars + subtle grid
══════════════════════════════════════════════════════════════ */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, stars = [], shootingStars = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    generateStars();
  }

  // Star class
  function Star() {
    this.reset();
  }
  Star.prototype.reset = function() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.3 + 0.2;
    this.opacity = Math.random() * 0.6 + 0.1;
    this.speed = Math.random() * 0.4 + 0.05;
    this.dir = Math.random() > 0.5 ? 1 : -1;
    this.drift = (Math.random() - 0.5) * 0.08; // slow parallax drift
    // Colour: mostly white, some cyan/violet tints
    const roll = Math.random();
    if (roll < 0.08) this.color = '#00d4ff';
    else if (roll < 0.14) this.color = '#a259ff';
    else this.color = '#e8eaf6';
  };
  Star.prototype.update = function() {
    this.opacity += this.speed * this.dir * 0.015;
    if (this.opacity > 0.9) { this.dir = -1; this.opacity = 0.9; }
    if (this.opacity < 0.05) { this.dir = 1; this.opacity = 0.05; }
    this.x += this.drift;
    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
  };
  Star.prototype.draw = function() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // Shooting star class
  function ShootingStar() {
    this.reset();
  }
  ShootingStar.prototype.reset = function() {
    this.active = false;
  };
  ShootingStar.prototype.spawn = function() {
    this.active = true;
    this.x = Math.random() * W * 0.7;
    this.y = Math.random() * H * 0.4;
    this.len = Math.random() * 120 + 60;
    this.speed = Math.random() * 5 + 6;
    this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
    this.opacity = 1;
    this.life = 1;
    this.tail = [];
  };
  ShootingStar.prototype.update = function() {
    if (!this.active) return;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.life -= 0.018;
    this.opacity = this.life;
    this.tail.push({ x: this.x, y: this.y });
    if (this.tail.length > 22) this.tail.shift();
    if (this.life <= 0) this.active = false;
  };
  ShootingStar.prototype.draw = function() {
    if (!this.active || this.tail.length < 2) return;
    ctx.save();
    for (let i = 1; i < this.tail.length; i++) {
      const progress = i / this.tail.length;
      ctx.globalAlpha = progress * this.opacity * 0.7;
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = progress * 2;
      ctx.beginPath();
      ctx.moveTo(this.tail[i - 1].x, this.tail[i - 1].y);
      ctx.lineTo(this.tail[i].x, this.tail[i].y);
      ctx.stroke();
    }
    // Bright head
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  function generateStars() {
    const count = Math.floor((W * H) / 3200);
    stars = Array.from({ length: count }, () => new Star());
    shootingStars = Array.from({ length: 4 }, () => new ShootingStar());
  }

  // Periodically spawn shooting stars
  function maybeSpawnShooting() {
    const inactive = shootingStars.filter(s => !s.active);
    if (inactive.length && Math.random() < 0.006) {
      inactive[0].spawn();
    }
  }

  let rafId;
  function animate() {
    ctx.clearRect(0, 0, W, H);
    maybeSpawnShooting();
    stars.forEach(s => { s.update(); s.draw(); });
    shootingStars.forEach(s => { s.update(); s.draw(); });
    rafId = requestAnimationFrame(animate);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);
  resize();
  animate();
}

/* ══════════════════════════════════════════════════════════════
   5. TYPEWRITER EFFECT
══════════════════════════════════════════════════════════════ */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const strings = [
    'Full-Stack Developer',
    'Comunity Builder',
    'Open Source contributor',
    'Web3 enthusiast',
    
  ];

  let stringIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pauseFrames = 0;

  const PAUSE_AFTER_TYPE = 55;  // frames to pause at end of string
  const PAUSE_BEFORE_DEL = 15;  // frames to pause before deleting
  const TYPE_SPEED = 65;        // ms per char when typing
  const DEL_SPEED = 30;         // ms per char when deleting

  function type() {
    const current = strings[stringIdx];

    if (pauseFrames > 0) {
      pauseFrames--;
      setTimeout(type, TYPE_SPEED);
      return;
    }

    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        pauseFrames = PAUSE_AFTER_TYPE;
      }
      setTimeout(type, TYPE_SPEED);
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        stringIdx = (stringIdx + 1) % strings.length;
        pauseFrames = PAUSE_BEFORE_DEL;
      }
      setTimeout(type, DEL_SPEED);
    }
  }

  // Start after loader
  setTimeout(type, 2200);
}

/* ══════════════════════════════════════════════════════════════
   6. SCROLL REVEAL
   IntersectionObserver-based; respects reduced-motion
══════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  // Immediately reveal everything if reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
      el.classList.add('revealed');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

/* ══════════════════════════════════════════════════════════════
   7. ANIMATED COUNTERS
══════════════════════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1600;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ══════════════════════════════════════════════════════════════
   8. SKILL BAR ANIMATION
══════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
    // --- Canvas Background Engine ---
    const canvas = document.getElementById('pixel-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Data structures for background elements
    const stars = Array.from({ length: 80 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 0.7,
        size: Math.random() > 0.8 ? 4 : 2,
        blinkSpeed: Math.random() * 0.05 + 0.01,
        opacity: Math.random()
    }));

    const clouds = Array.from({ length: 4 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 0.4,
        speed: Math.random() * 0.5 + 0.2
    }));

    let gridOffset = 0;

    // The Cyberpunk Pixel Cat (Minimal Matrix representation)
    const catState = {
        x: -50,
        y: height - 60,
        frame: 0,
        tick: 0,
        speed: 1.5,
        color: '#ff00ff' // Cyber pink
    };

    // 8x8 blocks representing 2 animation frames
    const catFrames = [
        [
            [0,0,0,0,0,0,0,0],
            [1,0,0,1,0,0,0,0],
            [1,1,1,1,1,0,0,0],
            [1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1],
            [0,1,1,1,1,1,1,0],
            [0,1,0,1,0,1,0,0],
            [0,1,0,1,0,1,0,0]
        ],
        [
            [0,0,0,0,0,0,0,0],
            [1,0,0,1,0,0,0,0],
            [1,1,1,1,1,0,0,0],
            [1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1],
            [0,1,1,1,1,1,1,0],
            [0,0,1,0,1,0,1,0],
            [0,0,1,0,1,0,1,0]
        ]
    ];

    function drawPixelGrid() {
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.15)'; // Neon cyan dark
        ctx.lineWidth = 2;
        const gridSize = 40;
        
        // Draw perspective lines (Retro Outrun style ground)
        ctx.beginPath();
        const horizon = height * 0.6;
        for (let i = -width; i < width * 2; i += gridSize * 2) {
            ctx.moveTo(i, horizon);
            ctx.lineTo(i + (i - width / 2) * 2, height);
        }
        
        // Horizontal moving lines
        gridOffset = (gridOffset + 1) % gridSize;
        for (let y = horizon; y < height; y += gridSize) {
            // Apply a simple pseudo-3D compression based on Y axis
            let adjustedY = y + (y - horizon) * 0.5 + gridOffset * ((y - horizon) / height);
            if (adjustedY < height) {
                ctx.moveTo(0, adjustedY);
                ctx.lineTo(width, adjustedY);
            }
        }
        ctx.stroke();
    }

    function drawCat() {
        catState.tick++;
        if (catState.tick > 15) {
            catState.frame = catState.frame === 0 ? 1 : 0;
            catState.tick = 0;
        }
        catState.x += catState.speed;
        catState.y = height - 80; // Keep attached to bottom

        if (catState.x > width + 50) catState.x = -100;

        const frame = catFrames[catState.frame];
        const pixelSize = 6;
        ctx.fillStyle = catState.color;

        for (let row = 0; row < frame.length; row++) {
            for (let col = 0; col < frame[row].length; col++) {
                if (frame[row][col] === 1) {
                    ctx.fillRect(catState.x + col * pixelSize, catState.y + row * pixelSize, pixelSize, pixelSize);
                }
            }
        }
    }

    function render() {
        ctx.clearRect(0, 0, width, height);

        // Draw Moon
        ctx.fillStyle = '#fcee0a';
        // Blocky pixel moon
        ctx.fillRect(width - 150, 80, 60, 60);
        ctx.fillStyle = 'rgba(252, 238, 10, 0.2)'; // Glow
        ctx.fillRect(width - 160, 70, 80, 80);

        // Draw Stars
        stars.forEach(star => {
            star.opacity += star.blinkSpeed;
            if (star.opacity > 1 || star.opacity < 0) star.blinkSpeed *= -1;
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.opacity)})`;
            ctx.fillRect(star.x, star.y, star.size, star.size);
        });

        // Draw Pixel Clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        clouds.forEach(cloud => {
            cloud.x += cloud.speed;
            if (cloud.x > width) cloud.x = -100;
            ctx.fillRect(cloud.x, cloud.y, 80, 20);
            ctx.fillRect(cloud.x + 20, cloud.y - 20, 60, 20);
            ctx.fillRect(cloud.x + 40, cloud.y + 20, 50, 20);
        });

        drawPixelGrid();
        drawCat();

        requestAnimationFrame(render);
    }
    render();

    // --- DOM Interactions (Hover Sparkles) ---
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            createParticles(e.target);
        });
    });

    function createParticles(element) {
        const rect = element.getBoundingClientRect();
        const colors = ['#00f3ff', '#ff00ff', '#fcee0a'];
        
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.classList.add('pixel-particle');
            
            // Random start position within the element
            const startX = rect.left + Math.random() * rect.width;
            const startY = rect.top + Math.random() * rect.height;
            
            // Random trajectory
            const dx = (Math.random() - 0.5) * 60 + 'px';
            const dy = (Math.random() * -60 - 20) + 'px';
            
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            // Pass trajectory variables to CSS
            particle.style.setProperty('--dx', dx);
            particle.style.setProperty('--dy', dy);
            
            document.body.appendChild(particle);
            
            // Cleanup
            setTimeout(() => {
                particle.remove();
            }, 800);
        }
    }
});

/* ══════════════════════════════════════════════════════════════
   9. GITHUB-STYLE CONTRIBUTION HEATMAP
   Generates a random but realistic contribution grid (52 weeks × 7 days)
══════════════════════════════════════════════════════════════ */
function initContributionGrid() {
  const grid = document.getElementById('contribution-grid');
  if (!grid) return;

  const weeks = 36; // visible weeks
  const days = 7;
  const totalCells = weeks * days;

  // Generate realistic-looking contribution data
  // Higher probability of contribution on weekdays, lower on weekends
  function getLevel() {
    const rand = Math.random();
    if (rand < 0.30) return 0;  // no contribution
    if (rand < 0.50) return 1;
    if (rand < 0.70) return 2;
    if (rand < 0.88) return 3;
    return 4;
  }

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < totalCells; i++) {
    const dayOfWeek = i % days;
    // Weekends (0=Sun, 6=Sat in our grid) have lower activity
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    let level = getLevel();
    if (isWeekend && level > 2) level = Math.floor(Math.random() * 2);

    const cell = document.createElement('div');
    cell.className = 'contrib-cell';
    cell.dataset.level = level;
    // Tooltip via title
    cell.title = level === 0 ? 'No contributions' : `${level * 2 + Math.floor(Math.random() * 3)} contributions`;
    fragment.appendChild(cell);
  }
  grid.appendChild(fragment);
}

/* ══════════════════════════════════════════════════════════════
   10. THEME TOGGLE
══════════════════════════════════════════════════════════════ */
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  // Check saved preference
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.body.classList.replace('dark-mode', 'light-mode');
    btn.querySelector('.theme-icon').textContent = '🌙';
  }

  btn.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    if (isLight) {
      document.body.classList.replace('light-mode', 'dark-mode');
      btn.querySelector('.theme-icon').textContent = '☀';
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.replace('dark-mode', 'light-mode');
      btn.querySelector('.theme-icon').textContent = '🌙';
      localStorage.setItem('theme', 'light');
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   11. CONTACT FORM VALIDATION
══════════════════════════════════════════════════════════════ */
function initContactForm() {
  const submitBtn = document.getElementById('submit-btn');
  if (!submitBtn) return;

  function getField(id) { return document.getElementById(id); }
  function getError(id) { return document.getElementById(id + '-error'); }

  function setError(id, msg) {
    const field = getField(id);
    const error = getError(id);
    if (field) field.classList.toggle('error', !!msg);
    if (error) error.textContent = msg || '';
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validate() {
    let valid = true;

    const name = getField('name')?.value.trim() || '';
    const email = getField('email')?.value.trim() || '';
    const subject = getField('subject')?.value.trim() || '';
    const message = getField('message')?.value.trim() || '';

    if (!name) { setError('name', 'Name is required'); valid = false; }
    else setError('name', '');

    if (!email) { setError('email', 'Email is required'); valid = false; }
    else if (!validateEmail(email)) { setError('email', 'Enter a valid email'); valid = false; }
    else setError('email', '');

    if (!subject) { setError('subject', 'Subject is required'); valid = false; }
    else setError('subject', '');

    if (!message || message.length < 15) { setError('message', 'Message must be at least 15 characters'); valid = false; }
    else setError('message', '');

    return valid;
  }

  submitBtn.addEventListener('click', () => {
    if (!validate()) return;

    // Simulate submission
    const submitText = document.getElementById('submit-text');
    if (submitText) submitText.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      const formInner = document.getElementById('contact-form-inner');
      const successMsg = document.getElementById('form-success');
      if (formInner) formInner.style.display = 'none';
      if (successMsg) successMsg.hidden = false;
    }, 1400);
  });

  // Live validation on blur
  ['name', 'email', 'subject', 'message'].forEach(id => {
    const field = getField(id);
    if (field) field.addEventListener('blur', validate);
  });
}

/* ══════════════════════════════════════════════════════════════
   12. BACK TO TOP
══════════════════════════════════════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════════════════════════════
   INIT — wait for DOM ready
══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initNav();
  initStarfield();
  initTypewriter();
  initScrollReveal();
  initCounters();
  initSkillBars();
  initContributionGrid();
  initThemeToggle();
  initContactForm();
  initBackToTop();
});
