document.getElementById('year').textContent = new Date().getFullYear();

(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layer = document.createElement('div');
  layer.className = 'scroll-notes';
  layer.setAttribute('aria-hidden', 'true');

  const notes = [
    ['♪', '12%', '18%', '4.8rem', '-12deg', '0.72'],
    ['♫', '82%', '32%', '6.2rem', '9deg', '1'],
    ['♩', '24%', '61%', '3.8rem', '14deg', '0.86'],
    ['♪', '73%', '78%', '5.2rem', '-8deg', '0.62']
  ];

  notes.forEach(([symbol, left, top, size, rotate, speed]) => {
    const el = document.createElement('span');
    el.textContent = symbol;
    el.style.setProperty('--left', left);
    el.style.setProperty('--top', top);
    el.style.setProperty('--size', size);
    el.style.setProperty('--rotate', rotate);
    el.dataset.speed = speed;
    layer.appendChild(el);
  });

  document.body.appendChild(layer);

  let lastY = window.scrollY;
  let velocity = 0;
  let offset = 0;
  let fadeTimer;
  let raf;

  const animate = () => {
    offset += velocity;
    velocity *= 0.86;

    layer.querySelectorAll('span').forEach(note => {
      const move = offset * Number(note.dataset.speed);
      note.style.transform = `translate3d(0, ${move}px, 0) rotate(var(--rotate))`;
    });

    if (Math.abs(velocity) > 0.03) raf = requestAnimationFrame(animate);
    else raf = null;
  };

  const wake = delta => {
    velocity = Math.max(-5, Math.min(5, velocity - delta * 0.055));
    layer.classList.add('is-visible');
    clearTimeout(fadeTimer);
    fadeTimer = setTimeout(() => layer.classList.remove('is-visible'), 170);
    if (!raf) raf = requestAnimationFrame(animate);
  };

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const delta = y - lastY;
    lastY = y;
    if (delta) wake(delta);
  }, { passive: true });
})();