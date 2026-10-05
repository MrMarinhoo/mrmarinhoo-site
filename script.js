document.getElementById('year').textContent = new Date().getFullYear();

(() => {
  const layer = document.createElement('div');
  layer.className = 'scroll-notes';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  const updateNotesStart = () => {
    const actions = document.querySelector('.hero .actions');
    if (!actions) return;
    const bottom = actions.getBoundingClientRect().bottom + (window.innerWidth <= 780 ? 12 : 18);
    layer.style.setProperty('--notes-top', Math.max(0, bottom) + 'px');
  };
  updateNotesStart();
  window.addEventListener('resize', updateNotesStart, {passive:true});

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
    updateNotesStart();
    const delta = y - lastY;
    lastY = y;
    if (delta) wake(delta);
  }, {passive:true});
})();

(() => {
  const audio = document.getElementById('featured-audio');
  const toggle = document.querySelector('.player-toggle');
  const progress = document.querySelector('.player-progress');
  const current = document.querySelector('.player-current');
  const duration = document.querySelector('.player-duration');
  const volume = document.querySelector('.player-volume');
  if (!audio || !toggle || !progress) return;

  const time = s => {
    if (!Number.isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    return m + ':' + String(Math.floor(s % 60)).padStart(2,'0');
  };

  toggle.addEventListener('click', async () => {
    if (audio.paused) {
      try { await audio.play(); } catch (_) { return; }
    } else audio.pause();
  });
  audio.addEventListener('play', () => { toggle.textContent = '❚❚'; toggle.setAttribute('aria-label','Pausar Vê Se Me Esquece'); });
  audio.addEventListener('pause', () => { toggle.textContent = '▶'; toggle.setAttribute('aria-label','Tocar Vê Se Me Esquece'); });
  audio.addEventListener('loadedmetadata', () => { duration.textContent = time(audio.duration); });
  audio.addEventListener('timeupdate', () => {
    current.textContent = time(audio.currentTime);
    if (audio.duration) progress.value = (audio.currentTime / audio.duration) * 100;
  });
  progress.addEventListener('input', () => {
    if (audio.duration) audio.currentTime = (progress.value / 100) * audio.duration;
  });
  volume.addEventListener('click', () => {
    audio.muted = !audio.muted;
    volume.textContent = audio.muted ? '×' : '◖))';
  });
})();