document.addEventListener('DOMContentLoaded', () => {
  const loveBtn = document.getElementById('loveBtn');
  const modal = document.getElementById('loveModal');
  const closeModal = document.getElementById('closeModal');
  const okBtn = document.getElementById('okBtn');

  // new controls
  const surpriseBtn = document.getElementById('surpriseBtn');
  const confettiBtn = document.getElementById('confettiBtn');
  const musicBtn = document.getElementById('musicBtn');
  const bgAudio = document.getElementById('bgAudio');
  let isBgPlaying = false;
  const rainBtn = document.getElementById('rainBtn');
  const themeBtn = document.getElementById('themeBtn');
  const quoteBtn = document.getElementById('quoteBtn');
  const colorBtn = document.getElementById('colorBtn');
  const shareBtn = document.getElementById('shareBtn');
  const copyBtn = document.getElementById('copyBtn');
  const bigTitleBtn = document.getElementById('bigTitleBtn');
  const toast = document.getElementById('toast');
  const title = document.querySelector('.title');
  const isMobile = window.matchMedia('(max-width:520px)').matches || ('ontouchstart' in window && navigator.maxTouchPoints > 0); 

  function explodeAt(x, y, count = 20) {
    const colors = ['#ff5f7a', '#ff9fb3', '#ff4d6d', '#ffb3c6'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'exploding-heart';
      el.textContent = '❤';
      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 160;
      const tx = Math.cos(angle) * dist + 'px';
      const ty = Math.sin(angle) * dist + 'px';
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.setProperty('--tx', tx);
      el.style.setProperty('--ty', ty);
      el.style.fontSize = 12 + Math.random() * 26 + 'px';
      el.style.color = colors[Math.floor(Math.random() * colors.length)];
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }
  }

  function showModal() {
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    document.body.classList.add('no-scroll');
    const panel = modal.querySelector('.modal-panel');
    if (panel) {
      panel.scrollTop = 0; // start at top
      panel.focus({ preventScroll: true });
    }
  }
  function hideModal() {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');
    document.body.classList.remove('no-scroll');
    const panel = modal.querySelector('.modal-panel');
    if (panel) panel.blur();
  }

  /* layered button: each tap advances a layer and shows its "story" + effect */
  const layerStoryEl = document.getElementById('layerStory');
  const layerDots = document.querySelectorAll('.layer-indicator .dot');
  let currentLayer = 0;
const layers = [
    { 
        name: 'Hello',
        story: 'Aku ketemu kamu pertama kali di Instagram — cuma saling sapa, tapi dari situ semuanya mulai.',
        action: (cx,cy) => explodeAt(cx,cy,12)
    },
    { 
        name: 'Bloom',
        story: 'Sekarang Valentine. Meski belum genap beberapa bulan, rasa ini pelan-pelan tumbuh.',
        action: (cx,cy) => { confettiBurst(cx,cy,24); explodeAt(cx,cy,18); }
    },
    { 
        name: 'Promise',
        story: 'Makasih udah hadir di hidup aku. Aku emang keliatan cuek, tapi sebenernya aku care.',
        action: (cx,cy) => { playTune(); showToast('thank you for being here ♡'); }
    },
    { 
        name: 'Forever',
        story: 'Aku mungkin nggak banyak ngomong, tapi aku diem-diem selalu mantau — story kamu, hari kamu, semuanya.',
        action: (cx,cy) => { explodeAt(cx,cy,36); showModal(); }
    },
];

  function updateLayerUI(idx) {
    layerDots.forEach((d,i) => d.classList.toggle('active', i === idx));
    if (layerStoryEl) {
      layerStoryEl.textContent = layers[idx].story;
      layerStoryEl.classList.add('show');
      clearTimeout(layerStoryEl._t);
      layerStoryEl._t = setTimeout(() => layerStoryEl.classList.remove('show'), 2200);
    }
    const target = loveBtn.querySelector(`.layer[data-layer="${idx+1}"]`);
    if (target) {
      target.classList.add('pop');
      target.addEventListener('animationend', () => target.classList.remove('pop'), { once: true });
    }
  }

  updateLayerUI(currentLayer);

  loveBtn.addEventListener('click', (e) => {
    const r = loveBtn.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    currentLayer = (currentLayer + 1) % layers.length;
    layers[currentLayer].action(cx, cy);
    updateLayerUI(currentLayer);
  });

  // keyboard accessibility (Enter / Space)
  loveBtn.addEventListener('keydown', (ev) => {
    if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); loveBtn.click(); }
  });

  closeModal.addEventListener('click', hideModal);
  okBtn.addEventListener('click', async () => {
    hideModal();
    // read number + message from button dataset (fallback to provided number)
    const raw = okBtn.dataset.phone || '085117162287';
    const text = okBtn.dataset.waMsg || 'Hai! Kamu dapat pesan manis dariku 💌';
    // normalize (remove non-digits, convert leading 0 -> 62 for Indonesia)
    let phone = String(raw).replace(/\D/g, '');
    if (phone.startsWith('0')) phone = '62' + phone.slice(1);
    // build wa.me URL with encoded text
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    // try copy as fallback then open
    try { if (navigator.clipboard) await navigator.clipboard.writeText(text + '\n' + waUrl); } catch (e) {}
    showToast('Membuka WhatsApp...');
    window.open(waUrl, '_blank');
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') hideModal();
  });

  // floating hearts generator (reduced on small/touch devices)
  const floatArea = document.createElement('div');
  floatArea.className = 'float-area';
  if (isMobile) floatArea.classList.add('mobile');
  document.body.appendChild(floatArea);

  function makeFloating() {
    const h = document.createElement('span');
    h.className = 'floating-heart';
    h.textContent = '❤';
    h.style.left = Math.random() * 100 + 'vw';
    const size = isMobile ? (8 + Math.random() * 14) : (8 + Math.random() * 24);
    h.style.fontSize = size + 'px';
    h.style.animationDuration = (isMobile ? 7 : 6) + Math.random() * (isMobile ? 6 : 8) + 's';
    h.style.opacity = isMobile ? (0.25 + Math.random() * 0.5) : (0.35 + Math.random() * 0.7);
    floatArea.appendChild(h);
    h.addEventListener('animationend', () => h.remove());
  }
  const initialHearts = isMobile ? 4 : 12;
  for (let i = 0; i < initialHearts; i++) setTimeout(makeFloating, Math.random() * 1400);
  let floatInterval = setInterval(makeFloating, isMobile ? 1400 : 800);

  // spawn small pop-heart on click (except when clicking modal/ui)
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('.love-btn') || e.target.closest('.layered-btn') || e.target.closest('.modal-panel')) return;
    const h = document.createElement('span');
    h.className = 'click-heart';
    h.textContent = '❤';
    h.style.left = e.clientX + 'px';
    h.style.top = e.clientY + 'px';
    h.style.color = '#ff6b81';
    h.style.fontSize = 16 + Math.random() * 18 + 'px';
    document.body.appendChild(h);
    h.addEventListener('animationend', () => h.remove());
  });

  /* ----------------- additional interactions ----------------- */

  function confettiBurst(x = window.innerWidth/2, y = 120, count = 30) {
    if (isMobile) count = Math.max(6, Math.floor(count / 2));
    const colors = ['#ff5f7a','#ff9fb3','#ffd36b','#ffd1e6','#ff7aa2'];
    for (let i=0;i<count;i++){
      const c = document.createElement('span');
      c.className = 'confetti';
      c.style.left = (x + (Math.random()-0.5)*160) + 'px';
      c.style.top = (y + (Math.random()-0.5)*40) + 'px';
      c.style.width = 6 + Math.random()*10 + 'px';
      c.style.height = 6 + Math.random()*10 + 'px';
      c.style.background = colors[Math.floor(Math.random()*colors.length)];
      c.style.animationDuration = 800 + Math.random()*900 + 'ms';
      document.body.appendChild(c);
      c.addEventListener('animationend', () => c.remove());
    }
  }

  function playTune() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const now = ctx.currentTime;
      const freqs = [440, 523, 660];
      let t = 0;
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = ['sine','sawtooth','triangle'][i%3];
        o.frequency.value = f;
        g.gain.value = 0.0001;
        o.connect(g);
        g.connect(ctx.destination);
        o.start(now + t);
        g.gain.exponentialRampToValueAtTime(0.12, now + t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.22);
        o.stop(now + t + 0.25);
        t += 0.12;
      });
    } catch (err) {
      console.warn('Audio not available', err);
    }
  }

  /* background audio (autoplay attempt + toggle) */
  function updateMusicBtnUI() {
    if (!musicBtn || !bgAudio) return;
    if (bgAudio.paused) {
      musicBtn.textContent = 'Play Music';
    } else if (bgAudio.muted) {
      musicBtn.textContent = 'Unmute';
    } else {
      musicBtn.textContent = 'Pause Music';
    }
    musicBtn.setAttribute('aria-pressed', String(!bgAudio.paused && !bgAudio.muted));
  }

  async function tryAutoPlayBg() {
    if (!bgAudio) return;
    // ensure muted autoplay so browsers allow it on page load (GitHub Pages / HTTPS)
    bgAudio.muted = true;
    bgAudio.volume = 0.55;
    try {
      await bgAudio.play();
      isBgPlaying = true; // playing but muted
      updateMusicBtnUI();
      showToast('Musik otomatis dimulai (muted) — tekan Unmute untuk suara');
    } catch (err) {
      // autoplay blocked — wait for first user interaction
      isBgPlaying = false;
      updateMusicBtnUI();
      const resume = async () => {
        try {
          await bgAudio.play();
          isBgPlaying = true;
          updateMusicBtnUI();
          showToast('Musik diputar');
        } catch (e) { /* ignored */ }
        window.removeEventListener('click', resume);
        window.removeEventListener('touchstart', resume);
      };
      window.addEventListener('click', resume, { once: true });
      window.addEventListener('touchstart', resume, { once: true });
      showToast('Autoplay diblokir — ketuk Play jika mau');
    }
  }

  function toggleBgMusic() {
    if (!bgAudio) return playTune();

    if (bgAudio.paused) {
      // user wants to start playback — unmute when starting
      bgAudio.muted = false;
      bgAudio.play().then(() => {
        isBgPlaying = true;
        updateMusicBtnUI();
        showToast('Musik diputar');
      }).catch(() => showToast('Silakan ketuk layar untuk memulai musik'));
      return;
    }

    // if playing but muted -> unmute; else -> pause
    if (bgAudio.muted) {
      bgAudio.muted = false;
      updateMusicBtnUI();
      showToast('Suara dinyalakan');
    } else {
      bgAudio.pause();
      isBgPlaying = false;
      updateMusicBtnUI();
      showToast('Musik dijeda');
    }
  }

  function showToast(msg, timeout = 1800) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), timeout);
  }

  function toggleHeartRain() {
    if (floatInterval) {
      clearInterval(floatInterval);
      floatInterval = null;
      rainBtn.textContent = 'Heart Rain: Off';
      showToast('Heart rain stopped');
    } else {
      floatInterval = setInterval(makeFloating, 800);
      rainBtn.textContent = 'Heart Rain: On';
      showToast('Heart rain started');
    }
  }

  function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    showToast('Theme toggled');
  }

  function randomizeColors() {
    const h1 = Math.floor(Math.random()*360);
    const h2 = (h1 + 25 + Math.floor(Math.random()*60))%360;
    document.documentElement.style.setProperty('--accent1', `hsl(${h1} 85% 62%)`);
    document.documentElement.style.setProperty('--accent2', `hsl(${h2} 85% 70%)`);
    showToast('Colors randomized');
  }

  function showQuote() {
    const quotes = [
      "You make my heart smile.",
      "Every moment with you is magic.",
      "You are my favorite hello and hardest goodbye.",
      "Together is a wonderful place to be."
    ];
    showToast(quotes[Math.floor(Math.random()*quotes.length)], 3200);
  }

  async function shareMessage() {
    const payload = {title: "Valentine's surprise", text: 'Thinking of you ❤️', url: location.href};
    if (navigator.share) {
      try { await navigator.share(payload); showToast('Shared 💌'); }
      catch (e) { showToast('Share cancelled'); }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(payload.text + ' — ' + payload.url);
      showToast('Link copied to clipboard');
    } else {
      showToast('No share available');
    }
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText('I ♥ You — sent with a static Valentine demo');
      showToast('Message copied');
    } catch (e) { showToast('Copy failed'); }
  }

  function toggleTitleSize() {
    title.classList.toggle('big');
    if (title.classList.contains('big')) setTimeout(() => title.classList.remove('big'), 2400);
  }

  function surprise() {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 3;
    confettiBurst(cx, cy, 40);
    explodeAt(cx, cy, 36);
    playTune();
    showToast('Surprise!');
  }

  /* ---------- wire up control buttons ---------- */
  if (confettiBtn) confettiBtn.addEventListener('click', () => confettiBurst());
  if (musicBtn) musicBtn.addEventListener('click', toggleBgMusic);
  if (rainBtn) rainBtn.addEventListener('click', toggleHeartRain);
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
  if (quoteBtn) quoteBtn.addEventListener('click', showQuote);
  if (colorBtn) colorBtn.addEventListener('click', randomizeColors);
  if (shareBtn) shareBtn.addEventListener('click', shareMessage);
  if (copyBtn) copyBtn.addEventListener('click', copyMessage);
  if (bigTitleBtn) bigTitleBtn.addEventListener('click', toggleTitleSize);
  if (surpriseBtn) surpriseBtn.addEventListener('click', surprise);

  // attempt autoplay of background music (graceful fallback)
  tryAutoPlayBg();

  // mobile: keep card centered (no forced scrolling)
  if (isMobile) {
    const cardEl = document.querySelector('.card');
    if (cardEl) cardEl.style.margin = 'auto';
  }

});