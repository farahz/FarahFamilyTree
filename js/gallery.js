// Home page photo slideshow in the history section. A static site can't list a folder, so the images in
// assets/photos/ are listed through the GitHub API. With no photos (or no API) the illustration stays.
(async function () {
  const { t, num } = window.I18N;
  const { repo, path } = window.FARAH_CONFIG.photos;
  const fig = document.querySelector('.about-figure');
  if (!fig) return;

  let photos;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`);
    if (!res.ok) return;
    photos = (await res.json())
      .filter((f) => f.type === 'file' && /\.(jpe?g|png|webp|gif|avif)$/i.test(f.name))
      .map((f) => f.path.split('/').map(encodeURIComponent).join('/'));
  } catch (e) {
    return;
  }
  if (!photos.length) return;

  const rtl = document.documentElement.dir === 'rtl';
  const many = photos.length > 1;
  const chevron = '<svg class="btn-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  const navButton = (cls, key) =>
    `<button type="button" class="photo-nav ${cls}" aria-label="${t(key)}" title="${t(key)}">${chevron}</button>`;
  let current = 0;

  // ---------- Slideshow ----------
  const caption = fig.querySelector('figcaption');
  caption.removeAttribute('data-i18n');
  fig.classList.add('has-photos');
  const slides = photos.map((src, i) => {
    const img = document.createElement('img');
    img.className = 'slide';
    img.src = src;
    img.alt = '';
    img.decoding = 'async';
    if (i) img.loading = 'lazy';
    fig.prepend(img);
    return img;
  });
  fig.insertAdjacentHTML('beforeend',
    `<button type="button" class="photo-open" aria-label="${t('photo_open')}" title="${t('photo_open')}"></button>` +
    (many ? navButton('prev', 'photo_prev') + navButton('next', 'photo_next') : ''));
  fig.append(caption); // keep the caption above the buttons

  // ---------- Full-screen viewer ----------
  const box = document.createElement('dialog');
  box.className = 'lightbox';
  box.innerHTML = `<img alt="">
    <button type="button" class="photo-nav lightbox-close" aria-label="${t('close')}" title="${t('close')}">×</button>
    ${many ? navButton('prev', 'photo_prev') + navButton('next', 'photo_next') : ''}
    <div class="lightbox-count"></div>`;
  document.body.append(box);
  const boxImg = box.querySelector('img');

  function show(i) {
    current = (i + photos.length) % photos.length;
    slides.forEach((s, j) => s.classList.toggle('active', j === current));
    const count = many ? ` · ${num(current + 1)} / ${num(photos.length)}` : '';
    caption.textContent = t('photos_caption') + count;
    boxImg.src = photos[current];
    box.querySelector('.lightbox-count').textContent = many ? `${num(current + 1)} / ${num(photos.length)}` : '';
  }

  // ---------- Auto-advance (off for reduced motion, paused while hovered, viewing or hidden) ----------
  const autoplay = many && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer = null;
  function restart() {
    clearInterval(timer);
    if (autoplay && !box.open && !fig.matches(':hover') && !document.hidden) timer = setInterval(() => show(current + 1), 5000);
  }
  function step(d) { show(current + d); restart(); }

  [fig, box].forEach((root) => root.addEventListener('click', (e) => {
    if (e.target.closest('.prev')) step(-1);
    else if (e.target.closest('.next')) step(1);
  }));
  fig.querySelector('.photo-open').addEventListener('click', () => {
    if (swiped) return;
    box.showModal();
    restart();
  });
  box.querySelector('.lightbox-close').addEventListener('click', () => box.close());
  box.addEventListener('click', (e) => { if (e.target === box) box.close(); });
  box.addEventListener('close', restart);
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') step(rtl ? -1 : 1);
    if (e.key === 'ArrowLeft') step(rtl ? 1 : -1);
  });
  fig.addEventListener('mouseenter', restart);
  fig.addEventListener('mouseleave', restart);
  document.addEventListener('visibilitychange', restart);

  // Swipe: the next photo comes from the reading direction's far side.
  let startX = null, swiped = false;
  [fig, box].forEach((root) => {
    root.addEventListener('pointerdown', (e) => { startX = e.clientX; swiped = false; });
    root.addEventListener('pointerup', (e) => {
      if (startX == null || !many) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) < 40) return;
      swiped = true;
      step((dx < 0) !== rtl ? 1 : -1);
    });
  });

  show(0);
  restart();
})();
