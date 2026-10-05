document.getElementById('year').textContent = new Date().getFullYear();

(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layer = document.createElement('div');
  layer.className = 'scroll-notes';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  const symbols = ['♪', '♫', '♩', '♬'];
  let notes = [];
  let lastY = window.scrollY;
  let velocity = 0;
  let offset = 0;
  let fadeTimer;
  let raf;
  let active = false;

  const random = (min, max) => Math.random() * (max - min) + min;

  function makeScene() {
    layer.replaceChildren();
    notes = [];
    offset = 0;

    const count = window.innerWidth <= 780
      ? 3 + Math.floor(Math.random() * 2)
      : 3 + Math.floor(Math.random() * 3);

    const spots = [];
    let attempts = 0;

    while (spots.length < count && attempts++ < 80) {
      const x = random(7, 88);
      const y = random(12, 88);
      if (spots.every(p => Math.hypot(x - p.x, y - p.y) > 24)) spots.push({x, y});
    }

    spots.forEach(({x, y}) => {
      const el = document.createElement('span');
      const symbol = Math.random() < 0.08 ? '𝄞' : symbols[Math.floor(Math.random() * symbols.length)];
      el.textContent = symbol;
      el.style.left = x + '%';
      el.style.top = y + '%';
      el.style.fontSize = random(window.innerWidth <= 780 ? 2.8 : 3.4, window.innerWidth <= 780 ? 5.1 : 7.2) + 'rem';
      el.style.opacity = random(window.innerWidth <= 780 ? .72 : .55, 1);
      el.style.setProperty('--rotate', random(-18, 18) + 'deg');
      el.dataset.speed = random(.55, 1.05);
      layer.appendChild(el);
      notes.push(el);
    });
  }

  const animate = () => {
    offset += velocity;
    velocity *= .86;
    notes.forEach(note => {
      const move = offset * Number(note.dataset.speed);
      note.style.transform = `translate3d(0,${move}px,0) rotate(var(--rotate))`;
    });
    if (Math.abs(velocity) > .03) raf = requestAnimationFrame(animate);
    else raf = null;
  };

  const wake = delta => {
    if (!active) {
      makeScene();
      active = true;
    }
    velocity = Math.max(-5, Math.min(5, velocity - delta * .055));
    layer.classList.add('is-visible');
    clearTimeout(fadeTimer);
    fadeTimer = setTimeout(() => {
      layer.classList.remove('is-visible');
      active = false;
    }, 190);
    if (!raf) raf = requestAnimationFrame(animate);
  };

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const delta = y - lastY;
    lastY = y;
    if (delta) wake(delta);
  }, {passive:true});
})();