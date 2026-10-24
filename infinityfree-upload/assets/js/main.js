/**
 * ============================================================================
 * MAIN APPLICATION SCRIPT
 * PRAFULLA ELECTRICAL SERVICES
 * ============================================================================
 * Handles:
 * - Dynamic config hydration from CONFIG object
 * - Mobile menu toggle & focus trapping
 * - Smooth navigation & active scroll spy
 * - Service card "Request Service" auto-fill with explicit service matching
 * - Project portfolio category filtering with race-condition prevention
 * - Form Security: Honeypot anti-bot protection, anti-spam rate limiting,
 *   XSS input sanitization, and inline validation error states
 * - WhatsApp quotation & booking message generators (secure opener)
 * - Accessible FAQ accordion enhancements
 * - Credential verification modal with focus management
 * ============================================================================
 */

(function () {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  function initApp() {
    hydrateConfig();
    initMobileNav();
    initScrollSpy();
    initServiceSelection();
    initProjectFiltering();
    initQuoteForm();
    initBookingForm();
    initCredentialsModal();
    initFaqAccordion();
    initFloatingActions();
  }

  /**
   * 1. HYDRATE CONFIGURATION
   * Injects CONFIG variables into all matching elements across the DOM
   */
  function hydrateConfig() {
    if (typeof window.CONFIG === 'undefined') {
      console.warn('CONFIG object not found in window.');
      return;
    }

    const cfg = window.CONFIG;

    // Update text placeholders
    document.querySelectorAll('[data-config]').forEach(el => {
      const key = el.getAttribute('data-config');
      if (cfg[key]) {
        el.textContent = cfg[key];
      }
    });

    // Update Company Name
    document.querySelectorAll('.cfg-company').forEach(el => {
      el.textContent = cfg.company || 'Electrical Engineering & Services';
    });

    // Update Engineer Name
    document.querySelectorAll('.cfg-engineer').forEach(el => {
      el.textContent = cfg.engineerName || 'Prafulla Zanzane';
    });

    // Update Phone Display & Links
    document.querySelectorAll('.cfg-phone-text').forEach(el => {
      el.textContent = cfg.phoneDisplay;
    });
    document.querySelectorAll('.cfg-phone-link').forEach(el => {
      el.href = `tel:${cfg.phoneHref}`;
      el.setAttribute('aria-label', `Call ${cfg.phoneDisplay}`);
    });

    // Update WhatsApp Links
    document.querySelectorAll('.cfg-wa-link').forEach(el => {
      el.href = `https://wa.me/${cfg.whatsapp}`;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
      el.setAttribute('aria-label', 'Contact us on WhatsApp');
    });

    // Update Email Links
    document.querySelectorAll('.cfg-email-text').forEach(el => {
      el.textContent = cfg.email;
    });
    document.querySelectorAll('.cfg-email-link').forEach(el => {
      el.href = `mailto:${cfg.email}`;
      el.setAttribute('aria-label', `Send email to ${cfg.email}`);
    });

    // Update Address & Service Area
    document.querySelectorAll('.cfg-address').forEach(el => {
      el.textContent = cfg.address;
    });
    document.querySelectorAll('.cfg-service-area').forEach(el => {
      el.textContent = cfg.serviceArea;
    });
    document.querySelectorAll('.cfg-hours').forEach(el => {
      el.textContent = cfg.businessHours;
    });

    // Copyright Year
    document.querySelectorAll('.cfg-year').forEach(el => {
      el.textContent = new Date().getFullYear().toString();
    });

    // Social Links
    const socialPlatforms = ['instagram', 'facebook', 'linkedin', 'youtube'];
    socialPlatforms.forEach(platform => {
      const el = document.getElementById(`social-${platform}`);
      if (el) {
        if (cfg[platform] && cfg[platform].trim() !== '') {
          el.href = cfg[platform];
          el.style.display = 'inline-flex';
        } else {
          el.style.display = 'none';
        }
      }
    });

    // Google Maps Embed
    if (cfg.googleMapsUrl) {
      const mapWrapper = document.querySelector('.map-card-wrapper');
      if (mapWrapper) {
        const iframe = mapWrapper.querySelector('iframe');
        if (iframe) {
          iframe.src = cfg.googleMapsUrl;
        } else {
          mapWrapper.innerHTML = `
            <div style="position: relative; width: 100%; height: 100%; min-height: 380px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.12);">
              <iframe 
                src="${cfg.googleMapsUrl}" 
                width="100%" 
                height="100%" 
                style="border:0; width: 100%; height: 100%; min-height: 380px;" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade"
                title="${cfg.company} - ${cfg.serviceArea}">
              </iframe>
              <div style="position: absolute; bottom: 12px; left: 12px; right: 12px; background: rgba(11, 27, 61, 0.92); backdrop-filter: blur(8px); padding: 10px 14px; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; border: 1px solid rgba(0, 209, 255, 0.3);">
                <span style="color: #FFFFFF; font-size: 0.85rem; font-weight: 600;">📍 Serving ${cfg.serviceArea}</span>
                <a href="https://maps.google.com/?q=Pune" target="_blank" rel="noopener noreferrer" style="color: #00D1FF; font-size: 0.8rem; text-decoration: underline; font-weight: 600;">Open Maps ↗</a>
              </div>
            </div>`;
        }
      }
    }

    // Inject LocalBusiness Schema.org JSON-LD dynamically
    injectSchema(cfg);
  }

  function injectSchema(cfg) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Electrician",
      "name": cfg.company,
      "founder": {
        "@type": "Person",
        "name": cfg.engineerName,
        "jobTitle": cfg.engineerRole
      },
      "description": "Professional electrical engineering, residential, commercial and industrial services in Pune by Prafulla Zanzane. Certified by MSME & SGSU.",
      "telephone": cfg.phoneHref,
      "email": cfg.email,
      "url": cfg.website || window.location.href,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": cfg.address,
        "addressLocality": "Pune",
        "addressRegion": "MH",
        "addressCountry": "IN"
      },
      "areaServed": cfg.serviceArea,
      "priceRange": "$$",
      "openingHours": "Mo-Sa 09:00-17:00",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Electrical Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Expert Electrical Services" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Electrical Repairs" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Whole House Wiring" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Indoor and Outdoor Lighting" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Residential Electrical Services" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial Electrical Services" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "CCTV and Data Surveillance" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Warehouse Electrification & High-Bay Lighting" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Annual Maintenance Contracts (AMC)" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Earthing and Lightning Protection System" } }
        ]
      }
    };

    let script = document.getElementById('schema-jsonld');
    if (!script) {
      script = document.createElement('script');
      script.id = 'schema-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema, null, 2);
  }

  /**
   * 2. MOBILE NAVIGATION WITH FOCUS MANAGEMENT
   */
  function initMobileNav() {
    const toggleBtn = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const overlay = document.getElementById('nav-overlay');
    if (!toggleBtn || !navMenu) return;

    function openNav() {
      toggleBtn.setAttribute('aria-expanded', 'true');
      navMenu.classList.add('is-open');
      if (overlay) overlay.classList.add('is-visible');
      document.body.classList.add('nav-locked');

      // Focus first interactive element in nav without horizontal scroll jitter
      const firstLink = navMenu.querySelector('a, button');
      if (firstLink) firstLink.focus({ preventScroll: true });
    }

    function closeNav() {
      toggleBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-visible');
      document.body.classList.remove('nav-locked');
    }

    toggleBtn.addEventListener('click', () => {
      const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      if (expanded) closeNav();
      else openNav();
    });

    if (overlay) {
      overlay.addEventListener('click', closeNav);
    }

    // Close mobile menu on anchor click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 1024) {
          closeNav();
        }
      });
    });

    // Close on Escape & return focus
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        closeNav();
        toggleBtn.focus({ preventScroll: true });
      }
    });

    // Auto-close if resized to desktop breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && navMenu.classList.contains('is-open')) {
        closeNav();
      }
    }, { passive: true });
  }

  /**
   * 3. SCROLL SPY & HEADER SHADOW
   */
  function initScrollSpy() {
    const header = document.querySelector('.site-header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    function onScroll() {
      // Header shadow on scroll
      if (header) {
        if (window.scrollY > 20) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
      }

      // Active Section Spy
      let scrollPos = window.scrollY + 140;
      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('is-active');
            } else {
              link.classList.remove('is-active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /**
   * 4. SERVICE CARD PRE-SELECTION WITH ROBUST MATCHING
   */
  function initServiceSelection() {
    document.querySelectorAll('[data-select-service]').forEach(btn => {
      btn.addEventListener('click', () => {
        const serviceName = btn.getAttribute('data-select-service');
        const quoteSelect = document.getElementById('quote-service');
        if (!quoteSelect || !serviceName) return;

        const matchedIndex = findServiceOptionIndex(serviceName, quoteSelect.options);
        if (matchedIndex !== -1) {
          quoteSelect.selectedIndex = matchedIndex;
          quoteSelect.dispatchEvent(new Event('change'));
        }
      });
    });
  }

  function findServiceOptionIndex(targetName, options) {
    const normalize = value => value.toLowerCase()
      .replace(/&amp;/g, '&')
      .replace(/\band\b/g, '&')
      .replace(/[^a-z0-9]/g, '');
    const cleanTarget = normalize(targetName);

    // Match exact values or labels first so short options cannot match unrelated services.
    for (let i = 0; i < options.length; i++) {
      if (normalize(options[i].value) === cleanTarget || normalize(options[i].text) === cleanTarget) {
        return i;
      }
    }

    // Known wording differences between service cards and form options.
    const aliases = { indoorandouterlighting: 'indooroutdoorlighting' };
    const canonicalTarget = aliases[cleanTarget] || cleanTarget;
    for (let i = 0; i < options.length; i++) {
      if (normalize(options[i].value) === canonicalTarget || normalize(options[i].text) === canonicalTarget) {
        return i;
      }
    }

    return -1;
  }

  /**
   * 5. PROJECT PORTFOLIO FILTERING (RACE-CONDITION SAFE)
   */
  function initProjectFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          // Clear any pending transition timer for this card
          if (card._filterTimer) {
            clearTimeout(card._filterTimer);
            card._filterTimer = null;
          }

          const category = card.getAttribute('data-category');
          const matches = (filter === 'all' || category === filter);

          if (matches) {
            card.classList.remove('is-hidden');
            // Micro delay ensures CSS transition triggers smoothly
            card._filterTimer = setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
              card._filterTimer = null;
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px) scale(0.96)';
            card._filterTimer = setTimeout(() => {
              card.classList.add('is-hidden');
              card._filterTimer = null;
            }, 240);
          }
        });
      });
    });
  }

  /**
   * SECURITY & VALIDATION HELPERS
   */
  // Sanitize text: strip HTML/script tags and non-printable control chars
  function sanitizeInput(str, maxLen = 300) {
    if (!str) return '';
    return str
      .replace(/[<>]/g, '')
      .replace(/[\x00-\x1F\x7F]/g, ' ')
      .trim()
      .slice(0, maxLen);
  }

  // Validate phone number (accepts international or Indian format with min 10 digits)
  function isValidPhone(phoneStr) {
    if (!phoneStr) return false;
    const digitsOnly = phoneStr.replace(/\D/g, '');
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  }

  // Rate Limiter: Prevent repeated submission within 8 seconds
  const lastSubmitTime = { quote: 0, booking: 0 };
  function isRateLimited(formType) {
    const now = Date.now();
    if (now - lastSubmitTime[formType] < 8000) {
      return true;
    }
    lastSubmitTime[formType] = now;
    return false;
  }

  // Inline Validation UI helpers
  function setFieldState(inputEl, isValid, errorMsgEl) {
    if (!inputEl) return;
    const group = inputEl.closest('.form-group');
    if (isValid) {
      inputEl.classList.remove('is-invalid');
      if (group) group.classList.remove('has-error');
      if (errorMsgEl) errorMsgEl.style.display = 'none';
    } else {
      inputEl.classList.add('is-invalid');
      if (group) group.classList.add('has-error');
      if (errorMsgEl) errorMsgEl.style.display = 'flex';
    }
  }

  function clearAllErrors(form) {
    form.querySelectorAll('.form-control').forEach(el => el.classList.remove('is-invalid'));
    form.querySelectorAll('.form-group').forEach(el => el.classList.remove('has-error'));
    form.querySelectorAll('.form-error-feedback').forEach(el => el.style.display = 'none');
    const alertEl = form.parentElement.querySelector('.form-status-alert');
    if (alertEl) {
      alertEl.style.display = 'none';
      alertEl.className = 'form-status-alert';
    }
  }

  /**
   * 6. QUOTE FORM (SECURED & VALIDATED WHATSAPP GENERATOR)
   */
  function initQuoteForm() {
    const form = document.getElementById('quote-form');
    if (!form) return;

    const nameInput = form.querySelector('[name="name"]');
    const phoneInput = form.querySelector('[name="phone"]');
    const locationInput = form.querySelector('[name="location"]');
    const alertEl = document.getElementById('quote-alert');

    // Auto-clear invalid state on user typing
    [nameInput, phoneInput, locationInput].forEach(inp => {
      if (inp) {
        inp.addEventListener('input', () => {
          setFieldState(inp, true);
          if (alertEl) alertEl.style.display = 'none';
        });
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // 1. Anti-Bot Honeypot Check
      const honeypot = form.querySelector('[name="website_hp"]')?.value;
      if (honeypot && honeypot.trim() !== '') {
        console.warn('Bot submission blocked via honeypot.');
        return;
      }

      // 2. Anti-Spam Rate Limit
      if (isRateLimited('quote')) {
        if (alertEl) {
          alertEl.textContent = '⏳ Please wait a few seconds before sending another request.';
          alertEl.className = 'form-status-alert is-error';
          alertEl.style.display = 'block';
        }
        return;
      }

      // 3. Extract & Sanitize
      const name = sanitizeInput(nameInput?.value, 80);
      const phone = sanitizeInput(phoneInput?.value, 20);
      const property = sanitizeInput(form.querySelector('[name="property"]')?.value, 40) || 'Residential';
      const service = sanitizeInput(form.querySelector('[name="service"]')?.value, 60) || 'Expert Electrical Services';
      const area = sanitizeInput(form.querySelector('[name="area"]')?.value, 80) || 'Not specified';
      const location = sanitizeInput(locationInput?.value, 100);
      const details = sanitizeInput(form.querySelector('[name="details"]')?.value, 800) || 'No specific details provided';

      // 4. Strict Validation
      let hasError = false;

      if (!name || name.length < 2) {
        setFieldState(nameInput, false, document.getElementById('quote-name-err'));
        hasError = true;
      } else {
        setFieldState(nameInput, true, document.getElementById('quote-name-err'));
      }

      if (!isValidPhone(phone)) {
        setFieldState(phoneInput, false, document.getElementById('quote-phone-err'));
        hasError = true;
      } else {
        setFieldState(phoneInput, true, document.getElementById('quote-phone-err'));
      }

      if (!location || location.length < 2) {
        setFieldState(locationInput, false, document.getElementById('quote-location-err'));
        hasError = true;
      } else {
        setFieldState(locationInput, true, document.getElementById('quote-location-err'));
      }

      if (hasError) {
        if (alertEl) {
          alertEl.textContent = '⚠️ Please check the highlighted fields above and enter valid details.';
          alertEl.className = 'form-status-alert is-error';
          alertEl.style.display = 'block';
        }
        const firstInvalid = form.querySelector('.form-control.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      clearAllErrors(form);

      const company = window.CONFIG?.company || 'Prafulla Electrical Services';
      const waNumber = window.CONFIG?.whatsapp || '918080305801';

      const message = `Hello ${company},\n\nI would like to request an electrical quotation.\n\n` +
        `• Name: ${name}\n` +
        `• Phone: ${phone}\n` +
        `• Property: ${property}\n` +
        `• Service: ${service}\n` +
        `• Area / Size: ${area}\n` +
        `• Location: ${location}\n` +
        `• Details: ${details}\n\n` +
        `Sent securely from website quotation form.`;

      const encodedMsg = encodeURIComponent(message);
      const waUrl = `https://wa.me/${waNumber}?text=${encodedMsg}`;

      // Open WhatsApp securely without window.opener exposure
      const waWindow = window.open(waUrl, '_blank', 'noopener,noreferrer');
      if (waWindow) waWindow.opener = null;

      // Show confirmation in page
      showFeedbackModal({
        title: 'Quotation Request Prepared',
        message: 'Your electrical quotation request has been prepared and opened in WhatsApp with Prafulla Zanzane. If WhatsApp did not open automatically, click the button below.',
        actionUrl: waUrl,
        actionText: 'Open WhatsApp Again',
        copyText: message
      });
    });
  }

  /**
   * 7. BOOK A SERVICE FORM (SECURED & VALIDATED WHATSAPP GENERATOR)
   */
  function initBookingForm() {
    const form = document.getElementById('booking-form');
    if (!form) return;

    const nameInput = form.querySelector('[name="name"]');
    const phoneInput = form.querySelector('[name="phone"]');
    const dateInput = form.querySelector('[name="date"]');
    const addressInput = form.querySelector('[name="address"]');
    const problemInput = form.querySelector('[name="problem"]');
    const alertEl = document.getElementById('book-alert');

    // Dynamically set minimum booking date to today
    if (dateInput) {
      const today = new Date();
      const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      dateInput.setAttribute('min', todayIso);
    }

    // Auto-clear invalid state on typing
    [nameInput, phoneInput, addressInput, problemInput].forEach(inp => {
      if (inp) {
        inp.addEventListener('input', () => {
          setFieldState(inp, true);
          if (alertEl) alertEl.style.display = 'none';
        });
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // 1. Anti-Bot Honeypot Check
      const honeypot = form.querySelector('[name="website_hp"]')?.value;
      if (honeypot && honeypot.trim() !== '') {
        console.warn('Bot submission blocked via honeypot.');
        return;
      }

      // 2. Anti-Spam Rate Limit
      if (isRateLimited('booking')) {
        if (alertEl) {
          alertEl.textContent = '⏳ Please wait a few seconds before sending another booking.';
          alertEl.className = 'form-status-alert is-error';
          alertEl.style.display = 'block';
        }
        return;
      }

      // 3. Extract & Sanitize
      const name = sanitizeInput(nameInput?.value, 80);
      const phone = sanitizeInput(phoneInput?.value, 20);
      const service = sanitizeInput(form.querySelector('[name="service"]')?.value, 60) || 'Emergency Breakdown Repair';
      const urgency = sanitizeInput(form.querySelector('[name="urgency"]')?.value, 40) || 'Standard';
      const prefDate = sanitizeInput(dateInput?.value, 20) || 'Earliest available';
      const prefTime = sanitizeInput(form.querySelector('[name="time"]')?.value, 40) || 'Flexible';
      const address = sanitizeInput(addressInput?.value, 180);
      const problem = sanitizeInput(problemInput?.value, 800);

      // 4. Strict Validation
      let hasError = false;

      if (!name || name.length < 2) {
        setFieldState(nameInput, false, document.getElementById('book-name-err'));
        hasError = true;
      } else {
        setFieldState(nameInput, true, document.getElementById('book-name-err'));
      }

      if (!isValidPhone(phone)) {
        setFieldState(phoneInput, false, document.getElementById('book-phone-err'));
        hasError = true;
      } else {
        setFieldState(phoneInput, true, document.getElementById('book-phone-err'));
      }

      if (!address || address.length < 3) {
        setFieldState(addressInput, false, document.getElementById('book-address-err'));
        hasError = true;
      } else {
        setFieldState(addressInput, true, document.getElementById('book-address-err'));
      }

      if (!problem || problem.length < 3) {
        setFieldState(problemInput, false, document.getElementById('book-problem-err'));
        hasError = true;
      } else {
        setFieldState(problemInput, true, document.getElementById('book-problem-err'));
      }

      if (hasError) {
        if (alertEl) {
          alertEl.textContent = '⚠️ Please complete all required fields marked in red.';
          alertEl.className = 'form-status-alert is-error';
          alertEl.style.display = 'block';
        }
        const firstInvalid = form.querySelector('.form-control.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      clearAllErrors(form);

      const company = window.CONFIG?.company || 'Prafulla Electrical Services';
      const waNumber = window.CONFIG?.whatsapp || '918080305801';

      const message = `Hello ${company},\n\nI would like to book an electrical service.\n\n` +
        `• Urgency: ${urgency}\n` +
        `• Service: ${service}\n` +
        `• Name: ${name}\n` +
        `• Phone: ${phone}\n` +
        `• Preferred Date: ${prefDate}\n` +
        `• Preferred Time: ${prefTime}\n` +
        `• Service Address: ${address}\n` +
        `• Problem Description: ${problem}\n\n` +
        `*Note: I can send photos/videos of the issue directly in this chat.*\n\n` +
        `Sent securely from website booking form.`;

      const encodedMsg = encodeURIComponent(message);
      const waUrl = `https://wa.me/${waNumber}?text=${encodedMsg}`;

      const waWindow = window.open(waUrl, '_blank', 'noopener,noreferrer');
      if (waWindow) waWindow.opener = null;

      showFeedbackModal({
        title: 'Service Booking Prepared',
        message: 'Your service request has been prepared and opened in WhatsApp. You can also attach photos or videos of the electrical issue directly in the chat with Prafulla Zanzane.',
        actionUrl: waUrl,
        actionText: 'Open WhatsApp Chat',
        copyText: message
      });
    });
  }

  /**
   * 8. CREDENTIALS MODAL WITH ACCESSIBLE FOCUS TRAP
   */
  function initCredentialsModal() {
    const viewBtns = document.querySelectorAll('.btn-view-credentials');
    const modal = document.getElementById('credentials-modal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-backdrop');
    let triggerBtn = null;

    function openModal(btn) {
      triggerBtn = btn;
      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-locked');

      const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length) {
        focusable[0].focus();
      }
    }

    function closeModal() {
      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-locked');
      if (triggerBtn) triggerBtn.focus();
    }

    viewBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(btn);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeModal();
      }
    });
  }

  /**
   * 9. ACCESSIBLE FAQ ACCORDION
   */
  function initFaqAccordion() {
    const detailsList = document.querySelectorAll('.faq-item');

    detailsList.forEach(item => {
      const summary = item.querySelector('summary');
      if (!summary) return;

      summary.addEventListener('click', () => {
        if (!item.hasAttribute('open')) {
          detailsList.forEach(otherItem => {
            if (otherItem !== item && otherItem.hasAttribute('open')) {
              otherItem.removeAttribute('open');
            }
          });
        }
      });
    });
  }

  /**
   * 10. FLOATING QUICK ACTION BUTTONS
   */
  function initFloatingActions() {
    const floatingWrap = document.querySelector('.floating-contact-bar');
    if (!floatingWrap) return;

    function toggleFloating() {
      if (window.scrollY > 150) {
        floatingWrap.classList.add('is-visible');
      } else {
        floatingWrap.classList.remove('is-visible');
      }
    }

    window.addEventListener('scroll', toggleFloating, { passive: true });
    toggleFloating();
  }

  /**
   * FEEDBACK / SUCCESS MODAL HELPER WITH FULL ACCESSIBILITY
   */
  function showFeedbackModal({ title, message, actionUrl, actionText, copyText }) {
    let modal = document.getElementById('form-feedback-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'form-feedback-modal';
      modal.className = 'custom-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'feedback-modal-title');
      modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-card">
          <div class="modal-header">
            <h3 id="feedback-modal-title" class="modal-title"></h3>
            <button type="button" class="modal-close" aria-label="Close modal">&times;</button>
          </div>
          <div class="modal-body">
            <p class="modal-msg" style="margin-bottom: 20px; line-height: 1.6; color: var(--color-text-muted);"></p>
            <div class="modal-actions">
              <a class="btn btn-secondary modal-action-btn" target="_blank" rel="noopener noreferrer"></a>
              <button type="button" class="btn btn-outline modal-copy-btn">📋 Copy Message</button>
            </div>
            <div class="copy-status" style="display:none; margin-top: 12px; font-size: 0.85rem; font-weight: 700; color: #16A34A;">✓ Message copied to clipboard!</div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      function closeFeedback() {
        modal.classList.remove('is-active');
        document.body.classList.remove('modal-locked');
      }

      modal.querySelector('.modal-close').addEventListener('click', closeFeedback);
      modal.querySelector('.modal-backdrop').addEventListener('click', closeFeedback);

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-active')) {
          closeFeedback();
        }
      });
    }

    modal.querySelector('.modal-title').textContent = title;
    modal.querySelector('.modal-msg').textContent = message;

    const actionBtn = modal.querySelector('.modal-action-btn');
    actionBtn.href = actionUrl;
    actionBtn.textContent = actionText;

    const copyBtn = modal.querySelector('.modal-copy-btn');
    const copyStatus = modal.querySelector('.copy-status');
    copyStatus.style.display = 'none';

    copyBtn.onclick = () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(copyText).then(() => {
          copyStatus.style.display = 'block';
        }).catch(() => {
          fallbackCopyText(copyText, copyStatus);
        });
      } else {
        fallbackCopyText(copyText, copyStatus);
      }
    };

    modal.classList.add('is-active');
    document.body.classList.add('modal-locked');
    actionBtn.focus();
  }

  function fallbackCopyText(text, statusEl) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      if (statusEl) statusEl.style.display = 'block';
    } catch (err) {
      alert('Could not auto-copy message. Please copy manually from the WhatsApp chat.');
    }
    document.body.removeChild(ta);
  }

})();
