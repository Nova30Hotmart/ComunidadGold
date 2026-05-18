// =================================================================
// CAMINO A NOVA 30 — Landing JS
// Scroll animations + parallax + Brevo form
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
  // 5. FORMULARIO BREVO
  // ===============================================================
  const form = document.getElementById('hero-form');
  const errorBox = document.querySelector('.form-error');
  const successBox = document.querySelector('.form-success');

  // ====== CONFIGURACIÓN BREVO ======
  // Edgar: reemplaza esto con tu URL embed de Brevo
  // Lo obtienes en: Brevo → Contacts → Forms → tu form → Share → Embed URL
  const BREVO_FORM_URL = 'PLACEHOLDER_BREVO_URL';

  // O si usas API directa de Brevo:
  // 1. Crea API key en: Brevo → SMTP & API → API Keys
  // 2. Crea una lista en: Brevo → Contacts → Lists, copia el ID
  // 3. Backend recomendado (NO pongas la API key en este JS público):
  //    Crea un endpoint en tu servidor que reciba el form y reenvíe a Brevo
  // ==================================

  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const nameInput = form.querySelector('[name="name"]');
      const emailInput = form.querySelector('[name="email"]');
      const submitBtn = form.querySelector('button[type="submit"]');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();

      // Validación básica
      if (!name || !email) {
        showMessage('error', 'Por favor completa todos los campos.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showMessage('error', 'Por favor ingresa un correo válido.');
        return;
      }

      // Estado de carga
      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Enviando...';

      try {
        // ===== INTEGRACIÓN BREVO =====
        // Opción A: si tienes el form embed URL de Brevo:
        // const response = await fetch(BREVO_FORM_URL, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        //   body: new URLSearchParams({
        //     NOMBRE: name,
        //     EMAIL: email,
        //   }),
        // });

        // Opción B: tu propio endpoint que conecta a Brevo:
        // const response = await fetch('/api/subscribe', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ name, email }),
        // });

        // PLACEHOLDER mientras tanto: simulación de éxito
        await new Promise(resolve => setTimeout(resolve, 800));
        const success = true;

        if (success) {
          // Guardar datos en localStorage por si la página de gracias los necesita
          try {
            sessionStorage.setItem('nova30_name', name);
            sessionStorage.setItem('nova30_email', email);
          } catch (e) { /* sessionStorage puede no estar disponible */ }

          // Redirigir a página de gracias
          window.location.href = 'gracias.html';
        } else {
          throw new Error('Error al enviar');
        }
      } catch (err) {
        console.error('Form error:', err);
        showMessage('error', 'Ocurrió un error. Por favor intenta de nuevo.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  function showMessage(type, message) {
    const box = type === 'error' ? errorBox : successBox;
    const other = type === 'error' ? successBox : errorBox;
    if (other) other.classList.remove('show');
    if (box) {
      box.textContent = message;
      box.classList.add('show');
    }
  }

  // ===============================================================
  // 6. SMOOTH SCROLL para anclas
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
  // 7. INIT
  // ===============================================================
  updateNav();
  updateParallax();

})();
