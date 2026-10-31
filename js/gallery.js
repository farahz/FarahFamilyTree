// Home page photo slideshow in the history section. A static site can't list a folder, so the images in
// assets/photos/ are listed through the GitHub API. With no photos (or no API) the illustration stays.
// A text file with the same name as a photo (photo.txt, or photo.en.txt for English) is its description:
// the first line is the title shown in the caption, the rest is shown under the photo in the full-screen view.
(async function () {
  const { t, num, lang } = window.I18N;
  const { esc } = window.UI;
  const { repo, path } = window.FARAH_CONFIG.photos;
  const fig = document.querySelector('.about-figure');
  if (!fig) return;

  const url = (f) => f.path.split('/').map(encodeURIComponent).join('/');
  const base = (name) => name.replace(/\.[^.]+$/, '');
  let photos;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`);
    if (!res.ok) return;
    const files = (await res.json()).filter((f) => f.type === 'file');
    const texts = new Map(files.filter((f) => /\.txt$/i.test(f.name)).map((f) => [base(f.name), url(f)]));
    const textFor = (b) => (lang === 'en' ? texts.get(b + '.en') || texts.get(b) : texts.get(b) || texts.get(b + '.en'));
    photos = files
      .filter((f) => /\.(jpe?g|png|webp|gif|avif)$/i.test(f.name))
      .map((f) => ({ src: url(f), textUrl: textFor(base(f.name)), title: '', body: '' }));
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
  const slides = photos.map((p, i) => {
    const img = document.createElement('img');
    img.className = 'slide';
    img.src = p.src;
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

  // ---------- Full-screen viewer: photo, then its description ----------
  const box = document.createElement('dialog');
  box.className = 'lightbox';
  box.innerHTML = `<button type="button" class="photo-nav lightbox-close" aria-label="${t('close')}" title="${t('close')}">×</button>
    <div class="lightbox-body">
      <img alt="">
      ${many ? `<div class="lightbox-bar">${navButton('prev', 'photo_prev')}<span class="lightbox-count"></span>${navButton('next', 'photo_next')}</div>` : ''}
      <article class="lightbox-text" hidden></article>
    </div>`;
  document.body.append(box);
  const boxImg = box.querySelector('img');
  const boxText = box.querySelector('.lightbox-text');

  // Descriptions are small text files; load them all up front so captions show titles.
  await Promise.all(photos.filter((p) => p.textUrl).map(async (p) => {
    try {
      const res = await fetch(p.textUrl);
      if (!res.ok) return;
      const [title, ...rest] = (await res.text()).replace(/\r/g, '').trim().split('\n');
      p.title = title.trim();
      p.body = rest.join('\n').trim();
    } catch (e) { /* show the photo without a description */ }
  }));

  function show(i) {
    current = (i + photos.length) % photos.length;
    const p = photos[current];
    slides.forEach((s, j) => s.classList.toggle('active', j === current));
    const count = many ? `${num(current + 1)} / ${num(photos.length)}` : '';
    caption.textContent = (p.title || t('photos_caption')) + (count ? ' · ' + count : '');
    boxImg.src = p.src;
    boxImg.alt = p.title;
    if (many) box.querySelector('.lightbox-count').textContent = count;
    boxText.hidden = !p.title && !p.body;
    boxText.dir = /[؀-ۿ]/.test(p.title + p.body) ? 'rtl' : 'ltr';
    boxText.innerHTML = (p.title ? `<h2>${esc(p.title)}</h2>` : '') +
      p.body.split(/\n\s*\n/).filter(Boolean).map((para) => `<p>${esc(para.trim())}</p>`).join('');
    box.scrollTop = 0;
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
    box.scrollTop = 0;
    restart();
  });
  box.querySelector('.lightbox-close').addEventListener('click', () => box.close());
  box.addEventListener('click', (e) => { if (e.target === box || e.target.classList.contains('lightbox-body')) box.close(); });
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
