document.getElementById('year').textContent = new Date().getFullYear();


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