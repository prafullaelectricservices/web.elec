/**
 * ============================================================================
 * 3D CARD INTERACTIONS ENGINE (HERO CARD & SERVICE CARDS)
 * PRAFULLA ELECTRICAL SERVICES
 * ============================================================================
 *
 * Features:
 * - Smooth cursor-driven 3D tilt for hero glassmorphic engineer card
 * - Specular reflection glare tracking
 * - Smooth cursor-driven 3D tilt for service cards
 * - Multi-layer 3D parallax depth
 * - Touch-safe & reduced-motion safe
 * ============================================================================
 */

(function init3DInteractions() {

  // Guard for server environments
  if (typeof window === 'undefined') return;

  const isFinePointer =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const prefersReduced =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isFinePointer || prefersReduced) return;


  document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================================
       1. HERO 3D GLASSMORPHIC ENGINEER CARD INTERACTION
       ======================================================================== */

    const heroCard = document.getElementById('engineerCard3D') || document.getElementById('engineerGlassCard');
    const heroScene = heroCard || document.getElementById('heroVisualWrapper');

    if (heroScene && heroCard) {
      const maxHeroTilt = 15;
      let heroRaf = null;
      let targetX = 0;
      let targetY = 0;
      let glareX = 50;
      let glareY = 50;

      function renderHeroCard() {
        heroCard.style.transform = `rotateX(${targetX.toFixed(2)}deg) rotateY(${targetY.toFixed(2)}deg)`;
        heroCard.style.setProperty('--mouse-x', `${glareX.toFixed(1)}%`);
        heroCard.style.setProperty('--mouse-y', `${glareY.toFixed(1)}%`);
        heroRaf = null;
      }

      heroScene.addEventListener('mousemove', (e) => {
        const rect = heroScene.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        targetX = ((y - centerY) / centerY) * -maxHeroTilt;
        targetY = ((x - centerX) / centerX) * maxHeroTilt;

        const cardRect = heroCard.getBoundingClientRect();
        glareX = ((e.clientX - cardRect.left) / cardRect.width) * 100;
        glareY = ((e.clientY - cardRect.top) / cardRect.height) * 100;

        if (!heroRaf) {
          heroRaf = requestAnimationFrame(renderHeroCard);
        }
      }, { passive: true });

      heroScene.addEventListener('mouseleave', () => {
        if (heroRaf) {
          cancelAnimationFrame(heroRaf);
          heroRaf = null;
        }
        heroCard.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
        heroCard.style.transform = 'rotateX(0deg) rotateY(0deg)';

        setTimeout(() => {
          heroCard.style.transition = 'transform 0.12s ease-out';
        }, 450);
      });
    }


    /* ========================================================================
       2. 3D SERVICE CARDS TILT & SPECULAR HIGHLIGHT
       ======================================================================== */

    const cardWrappers = document.querySelectorAll('.card-3d-wrap');

    cardWrappers.forEach(wrap => {
      const card = wrap.querySelector('.service-card-3d');
      if (!card) return;

      let rafId = null;
      let targetRx = 0;
      let targetRy = 0;
      let targetTy = 0;
      let targetTz = 0;

      let currentRx = 0;
      let currentRy = 0;
      let currentTy = 0;
      let currentTz = 0;

      let isHovered = false;

      function updateCardTransform() {
        if (!isHovered) {
          currentRx += (0 - currentRx) * 0.15;
          currentRy += (0 - currentRy) * 0.15;
          currentTy += (0 - currentTy) * 0.15;
          currentTz += (0 - currentTz) * 0.15;

          if (
            Math.abs(currentRx) < 0.05 &&
            Math.abs(currentRy) < 0.05 &&
            Math.abs(currentTy) < 0.05 &&
            Math.abs(currentTz) < 0.05
          ) {
            card.style.setProperty('--rx', '0deg');
            card.style.setProperty('--ry', '0deg');
            card.style.setProperty('--ty', '0px');
            card.style.setProperty('--tz', '0px');

            cancelAnimationFrame(rafId);
            rafId = null;
            return;
          }
        } else {
          currentRx += (targetRx - currentRx) * 0.2;
          currentRy += (targetRy - currentRy) * 0.2;
          currentTy += (targetTy - currentTy) * 0.2;
          currentTz += (targetTz - currentTz) * 0.2;
        }

        card.style.setProperty('--rx', `${currentRx.toFixed(2)}deg`);
        card.style.setProperty('--ry', `${currentRy.toFixed(2)}deg`);
        card.style.setProperty('--ty', `${currentTy.toFixed(2)}px`);
        card.style.setProperty('--tz', `${currentTz.toFixed(2)}px`);

        rafId = requestAnimationFrame(updateCardTransform);
      }

      wrap.addEventListener('mousemove', (e) => {
        const rect = wrap.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        targetRx = (0.5 - y) * 14;
        targetRy = (x - 0.5) * 14;
        targetTy = -6;
        targetTz = 10;

        card.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);

        if (!isHovered) {
          isHovered = true;
          if (!rafId) {
            rafId = requestAnimationFrame(updateCardTransform);
          }
        }
      });

      wrap.addEventListener('mouseleave', () => {
        isHovered = false;
        targetRx = 0;
        targetRy = 0;
        targetTy = 0;
        targetTz = 0;

        if (!rafId) {
          rafId = requestAnimationFrame(updateCardTransform);
        }
      });
    });

  });

})();