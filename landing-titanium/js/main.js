// =================================================================
// CAMINO A NOVA 30 — Landing JS
// Scroll animations + parallax
// =================================================================

(function() {
  'use strict';

  // ===============================================================
  // 1. NAV: cambia estilo al hacer scroll
  // ===============================================================
  const nav = document.querySelector('.nav');
  let lastScrollY = 0;

  function updateNav() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }

  // ===============================================================
  // 2. PARALLAX SUAVE: solo movimiento vertical leve, sin rotaciones
  // ===============================================================
  const parallaxElements = [
    { el: document.querySelector('.personalizado-orb'), speed: 0.12, baseTransform: 'translate(0, -50%)' },
    { el: document.querySelector('.cierre-orb'), speed: 0.15, baseTransform: 'translateY(-50%)' },
  ];
  // NOTA: El hero-orb queda completamente estático (sin parallax ni rotación)

  function updateParallax() {
    const viewportHeight = window.innerHeight;

    parallaxElements.forEach(item => {
      if (!item.el) return;
      const rect = item.el.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const distanceFromCenter = elementCenter - viewportHeight / 2;

      // Solo animar si está cerca del viewport
      if (Math.abs(distanceFromCenter) < viewportHeight * 1.5) {
        const translateY = distanceFromCenter * item.speed * -1;
        // Respeta el transform base de cada elemento y le suma el offset Y
        if (item.baseTransform.includes('translate(')) {
          item.el.style.transform = `translate(0, calc(-50% + ${translateY}px))`;
        } else {
          item.el.style.transform = `translateY(calc(-50% + ${translateY}px))`;
        }
      }
    });
  }

  // ===============================================================
  // 3. REVEAL: elementos aparecen al hacer scroll
  // ===============================================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Pequeño delay basado en el orden para efecto cascada
        const delay = parseInt(entry.target.dataset.revealDelay) || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===============================================================
  // 4. SCROLL LISTENER (throttled con rAF)
  // ===============================================================
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateNav();
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateParallax, { passive: true });

  // ===============================================================
  // 5. SMOOTH SCROLL para anclas
  // ===============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===============================================================
  // 6. INIT
  // ===============================================================
  updateNav();
  updateParallax();

})();
