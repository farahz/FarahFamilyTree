// Interactive family tree: D3 collapsible tree (in Arabic the root is on the right and generations
// flow left; in English it is mirrored), search, details panel, and add/edit/delete for signed-in users.
(async function () {
  const FD = window.FamilyData;
  const { esc, toast, openModal, closeModal } = window.UI;
  const L = window.I18N;
  window.UI.init();

  const GAP_X = 210;   // distance between generations
  const GAP_Y = 46;    // distance between siblings
  const CARD_H = 34;
  const INITIAL_DEPTH = 4;
  const DIR = L.lang === 'en' ? 1 : -1; // direction generations grow along the x axis
  const fmt = L.num;
  const cardWidth = (name) => Math.max(72, Math.min(170, name.length * 8.5 + 28));

  const canvas = document.getElementById('tree-canvas');
  const status = document.getElementById('tree-status');
  const panel = document.getElementById('panel');

  let persons, idx;
  try {
    persons = await FD.loadPersons();
    idx = FD.buildIndex(persons);
  } catch (e) {
    status.textContent = L.t('tree_failed', { msg: e.message });
    return;
  }
  status.remove();

  const rootPerson = idx.roots[0];
  const expanded = new Set();
  let selectedId = null;
  let positions = new Map(); // id -> {x, y, w} of the last render, used to animate from/to

  (function expandToDepth(p, depth) {
    if (depth >= INITIAL_DEPTH) return;
    expanded.add(p.id);
    idx.children.get(p.id).forEach((c) => expandToDepth(c, depth + 1));
  })(rootPerson, 1);

  // ---------- SVG setup ----------
  const svg = d3.select(canvas).append('svg');
  const g = svg.append('g');
  const linkLayer = g.append('g');
  const nodeLayer = g.append('g');
  const zoom = d3.zoom().scaleExtent([0.08, 2.5]).on('zoom', (e) => g.attr('transform', e.transform));
  svg.call(zoom).on('dblclick.zoom', null);

  function linkPath(s, t) {
    const x1 = s.x + DIR * s.w / 2, x2 = t.x - DIR * t.w / 2, mx = (x1 + x2) / 2;
    return `M${x1},${s.y}C${mx},${s.y} ${mx},${t.y} ${x2},${t.y}`;
  }

  function nearestVisible(id, map) {
    let p = idx.byId.get(id);
    while (p && !map.has(p.id)) p = idx.byId.get(p.father_id);
    return p ? map.get(p.id) : map.get(rootPerson.id);
  }

  function render(duration = 400) {
    const hier = d3.hierarchy(rootPerson, (p) =>
      expanded.has(p.id) && idx.children.get(p.id).length ? idx.children.get(p.id) : null);
    d3.tree().nodeSize([GAP_Y, GAP_X]).separation((a, b) => (a.parent === b.parent ? 1 : 1.25))(hier);

    const next = new Map();
    hier.each((d) => next.set(d.data.id, { x: DIR * d.y, y: d.x, w: cardWidth(L.displayName(d.data)) }));
    const pathIds = new Set(selectedId != null ? idx.ancestors(selectedId).map((p) => p.id) : []);
    const t = svg.transition().duration(duration);

    // Links
    const links = linkLayer.selectAll('path.link').data(hier.links(), (d) => d.target.data.id);
    links.exit().transition(t)
      .attr('d', (d) => { const a = nearestVisible(d.source.data.id, next); return linkPath(a, a); })
      .remove();
    links.enter().append('path').attr('class', 'link')
      .attr('d', (d) => { const a = positions.get(d.source.data.id) || next.get(d.source.data.id); return linkPath(a, a); })
      .merge(links)
      .classed('on-path', (d) => pathIds.has(d.target.data.id))
      .transition(t)
      .attr('d', (d) => linkPath(next.get(d.source.data.id), next.get(d.target.data.id)));
    linkLayer.selectAll('path.on-path').raise();

    // Nodes
    const nodes = nodeLayer.selectAll('g.node').data(hier.descendants(), (d) => d.data.id);
    nodes.exit().transition(t)
      .attr('transform', (d) => { const a = nearestVisible(d.data.father_id, next); return `translate(${a.x},${a.y})`; })
      .style('opacity', 0)
      .remove();

    const enter = nodes.enter().append('g').attr('class', 'node')
      .attr('transform', (d) => {
        const a = (d.parent && positions.get(d.parent.data.id)) || next.get(d.data.id);
        return `translate(${a.x},${a.y})`;
      })
      .style('opacity', 0)
      .on('click', (e, d) => onNodeClick(d.data.id));
    enter.append('title');
    enter.append('rect').attr('class', 'card').attr('rx', 9).attr('height', CARD_H).attr('y', -CARD_H / 2);
    enter.append('text').attr('class', 'name').attr('text-anchor', 'middle').attr('dy', '0.35em');
    const badge = enter.append('g').attr('class', 'badge');
    badge.append('circle').attr('r', 11);
    badge.append('text').attr('text-anchor', 'middle').attr('dy', '0.35em');

    const all = enter.merge(nodes);
    all.classed('selected', (d) => d.data.id === selectedId)
      .classed('on-path', (d) => pathIds.has(d.data.id))
      .classed('root', (d) => d.data.id === rootPerson.id);
    all.select('title').text((d) => idx.lineageName(d.data.id, 3));
    all.select('rect.card')
      .attr('width', (d) => next.get(d.data.id).w)
      .attr('x', (d) => -next.get(d.data.id).w / 2);
    all.select('text.name').text((d) => L.displayName(d.data));
    all.select('g.badge')
      .attr('transform', (d) => `translate(${DIR * next.get(d.data.id).w / 2},0)`)
      .style('display', (d) => (!expanded.has(d.data.id) && idx.children.get(d.data.id).length ? null : 'none'))
      .select('text').text((d) => '+' + idx.children.get(d.data.id).length);
    all.transition(t)
      .attr('transform', (d) => `translate(${next.get(d.data.id).x},${next.get(d.data.id).y})`)
      .style('opacity', 1);

    positions = next;
  }

  // ---------- View helpers ----------
  function viewport() {
    const r = canvas.getBoundingClientRect();
    const sheet = window.matchMedia('(max-width: 860px)').matches && panel.classList.contains('open');
    return { w: r.width, h: sheet ? r.height * 0.45 : r.height };
  }

  function centerOn(id, duration = 600) {
    const p = positions.get(id);
    if (!p) return;
    const { w, h } = viewport();
    const k = Math.max(d3.zoomTransform(svg.node()).k, 0.8);
    applyTransform(d3.zoomIdentity.translate(w / 2 - p.x * k, h / 2 - p.y * k).scale(k), duration);
  }

  function applyTransform(tr, duration) {
    if (duration) svg.transition().duration(duration).call(zoom.transform, tr);
    else svg.call(zoom.transform, tr);
  }

  function fit(duration = 600) {
    const pts = [...positions.values()];
    const minX = d3.min(pts, (p) => p.x - p.w / 2), maxX = d3.max(pts, (p) => p.x + p.w / 2);
    const minY = d3.min(pts, (p) => p.y) - CARD_H, maxY = d3.max(pts, (p) => p.y) + CARD_H;
    const { w, h } = viewport();
    const k = Math.min(1.1, 0.92 * Math.min(w / (maxX - minX), h / (maxY - minY)));
    const tr = d3.zoomIdentity.translate(w / 2 - ((minX + maxX) / 2) * k, h / 2 - ((minY + maxY) / 2) * k).scale(k);
    applyTransform(tr, duration);
  }

  function reveal(id) {
    idx.ancestors(id).slice(1).forEach((p) => expanded.add(p.id));
  }

  function focusPerson(id, { expand = false, instant = false } = {}) {
    if (!idx.byId.has(id)) return;
    reveal(id);
    if (expand && idx.children.get(id).length) expanded.add(id);
    select(id);
    render(instant ? 0 : 400);
    if (instant) centerOn(id, 0);
    else setTimeout(() => centerOn(id), 50);
  }

  function onNodeClick(id) {
    if (selectedId === id) {
      if (expanded.has(id)) expanded.delete(id);
      else expanded.add(id);
    } else {
      select(id);
      if (idx.children.get(id).length) expanded.add(id);
    }
    render();
  }

  function select(id) {
    selectedId = id;
    const url = new URL(location.href);
    url.searchParams.delete('q');
    if (id != null) url.searchParams.set('id', id);
    else url.searchParams.delete('id');
    history.replaceState(null, '', url);
    renderPanel();
  }

  // ---------- Details panel ----------
  function personButtons(list) {
    return `<ul class="person-list">${list
      .map((p) => `<li><button class="person-link" data-goto="${p.id}">${esc(L.displayName(p))}</button></li>`)
      .join('')}</ul>`;
  }

  function renderPanel() {
    if (selectedId == null || !idx.byId.has(selectedId)) {
      panel.classList.remove('open');
      panel.innerHTML = '';
      return;
    }
    const p = idx.byId.get(selectedId);
    const chain = idx.ancestors(p.id);
    const father = chain[1];
    const kids = idx.children.get(p.id);
    const siblings = father ? idx.children.get(father.id).filter((s) => s.id !== p.id) : [];
    const user = window.UI.user();

    const facts = [
      ['mother', p.mother_name], ['born', p.birth_date], ['birthplace', p.birth_place], ['died', p.death_date],
    ].filter(([, v]) => v);

    panel.innerHTML = `
      <div class="panel-header">
        <h2>${esc(L.displayName(p))}</h2>
        <button class="btn btn-ghost btn-icon" data-close-panel aria-label="${L.t('close')}">×</button>
      </div>
      <div class="panel-lineage">${esc(idx.lineageName(p.id, 5))}</div>
      <div class="panel-meta">
        <span class="chip">${L.t('generation', { n: fmt(chain.length) })}</span>
        ${p.sex === 'M' ? `<span class="chip">${L.t('male')}</span>` : p.sex === 'F' ? `<span class="chip">${L.t('female')}</span>` : ''}
        <span class="chip">${L.t('n_children', { n: fmt(kids.length) })}</span>
        <span class="chip">${L.t('n_descendants', { n: fmt(idx.descendantCount(p.id)) })}</span>
      </div>
      ${facts.length ? `<dl class="facts">${facts.map(([k, v]) => `<dt>${L.t(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>` : ''}
      ${p.notes ? `<h3>${L.t('notes')}</h3><p style="white-space:pre-line;margin:0">${esc(p.notes)}</p>` : ''}
      ${father ? `<h3>${L.t('father')}</h3>${personButtons([father])}` : ''}
      ${kids.length ? `<h3>${L.t('children_h', { n: fmt(kids.length) })}</h3>${personButtons(kids)}` : ''}
      ${siblings.length ? `<h3>${L.t('siblings_h', { n: fmt(siblings.length) })}</h3>${personButtons(siblings)}` : ''}
      ${chain.length > 1 ? `<h3>${L.t('ancestry_h')}</h3><ol class="ancestry">${chain
        .map((a) => `<li><button data-goto="${a.id}">${esc(L.displayName(a))}</button></li>`).join('')}</ol>` : ''}
      <div class="panel-actions">
        ${user ? `
          <button class="btn btn-sm" data-action="add">${L.t('add_child')}</button>
          <button class="btn btn-ghost btn-sm" data-action="edit">${L.t('edit')}</button>
          ${kids.length ? '' : `<button class="btn btn-danger btn-sm" data-action="delete">${L.t('delete')}</button>`}`
        : `<span class="muted">${L.t(FD.live ? 'login_to_edit' : 'demo_edit_note')}</span>`}
      </div>`;
    panel.classList.add('open');
    panel.scrollTop = 0;
  }

  panel.addEventListener('click', (e) => {
    const go = e.target.closest('[data-goto]');
    if (go) return focusPerson(Number(go.dataset.goto));
    if (e.target.closest('[data-close-panel]')) {
      select(null);
      return render(200);
    }
    const action = e.target.closest('[data-action]');
    if (!action) return;
    if (action.dataset.action === 'add') openForm('add');
    if (action.dataset.action === 'edit') openForm('edit');
    if (action.dataset.action === 'delete') removeSelected();
  });

  window.UI.onUser(() => renderPanel());

  // ---------- Add / edit / delete ----------
  const form = document.getElementById('person-form');
  const formError = document.getElementById('person-error');
  const formFields = () => ['name', ...(idx.hasAltName ? [FD.altField] : []),
    'sex', 'mother_name', 'birth_date', 'death_date', 'birth_place', 'notes'];
  let formMode = 'add';

  // The main name field is in the dataset's language; the optional second one is the other language.
  const nameIsArabic = FD.dataset.nameLang === 'ar';
  const altInput = document.getElementById('f-name-alt');
  altInput.name = FD.altField;
  altInput.dir = nameIsArabic ? 'ltr' : 'rtl';
  document.getElementById('f-name').dir = nameIsArabic ? 'rtl' : 'ltr';
  [['f-name-label', nameIsArabic ? 'f_name' : 'f_name_latin'],
    ['f-name-alt-label', nameIsArabic ? 'f_name_en' : 'f_name_ar']].forEach(([id, key]) => {
    const el = document.getElementById(id);
    el.dataset.i18n = key;
    el.textContent = L.t(key);
  });

  function openForm(mode) {
    formMode = mode;
    const p = idx.byId.get(selectedId);
    form.reset();
    formError.textContent = '';
    document.getElementById('name-alt-row').hidden = !idx.hasAltName;
    document.getElementById('person-form-title').textContent = L.t(mode === 'add' ? 'form_add' : 'form_edit');
    document.getElementById('person-form-sub').textContent =
      mode === 'add' ? L.t('form_father', { name: idx.lineageName(p.id, 3) }) : idx.lineageName(p.id, 3);
    if (mode === 'edit') formFields().forEach((f) => { form.elements[f].value = p[f] || (f === 'sex' ? 'U' : ''); });
    else form.elements.sex.value = 'M';
    openModal('person-modal');
    form.elements.name.focus();
  }

  document.getElementById('person-modal').addEventListener('click', (e) => {
    if (e.target.id === 'person-modal' || e.target.hasAttribute('data-close')) closeModal('person-modal');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const values = {};
    formFields().forEach((f) => {
      const v = form.elements[f].value.trim();
      values[f] = v === '' ? null : v;
    });
    if (!values.name) return (formError.textContent = L.t('name_required'));
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    formError.textContent = '';
    try {
      if (formMode === 'add') {
        const created = await FD.addPerson({ ...values, father_id: selectedId });
        persons.push(created);
        idx = FD.buildIndex(persons);
        expanded.add(selectedId);
        closeModal('person-modal');
        focusPerson(created.id);
        toast(L.t('added', { name: L.displayName(created) }));
      } else {
        const updated = await FD.updatePerson(selectedId, values);
        persons[persons.findIndex((p) => p.id === updated.id)] = updated;
        idx = FD.buildIndex(persons);
        closeModal('person-modal');
        renderPanel();
        render(200);
        toast(L.t('saved'));
      }
    } catch (ex) {
      formError.textContent = ex.message;
    } finally {
      btn.disabled = false;
    }
  });

  async function removeSelected() {
    const p = idx.byId.get(selectedId);
    if (!confirm(L.t('confirm_delete', { name: idx.lineageName(p.id, 3) }))) return;
    try {
      await FD.deletePerson(p.id);
      persons.splice(persons.findIndex((x) => x.id === p.id), 1);
      idx = FD.buildIndex(persons);
      expanded.delete(p.id);
      toast(L.t('deleted'));
      if (p.father_id != null) focusPerson(p.father_id);
      else { select(null); render(); }
    } catch (ex) {
      toast(ex.message);
    }
  }

  // ---------- Search ----------
  const input = document.getElementById('search');
  const resultsEl = document.getElementById('search-results');
  let results = [];
  let active = -1;

  function showResults() {
    const q = input.value.trim();
    results = q ? idx.search(q) : [];
    active = results.length ? 0 : -1;
    if (!q) return (resultsEl.hidden = true);
    resultsEl.innerHTML = results.length
      ? results.map((p, i) => `<li data-i="${i}" class="${i === active ? 'active' : ''}">
          <span>${esc(idx.lineageName(p.id, 4))}</span><span class="gen">${L.t('generation', { n: fmt(idx.ancestors(p.id).length) })}</span></li>`).join('')
      : `<li class="empty">${L.t('no_results')}</li>`;
    resultsEl.hidden = false;
  }

  function choose(i) {
    const p = results[i];
    if (!p) return;
    resultsEl.hidden = true;
    input.blur();
    focusPerson(p.id, { expand: true });
  }

  input.addEventListener('input', showResults);
  input.addEventListener('focus', () => { if (input.value.trim()) showResults(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!results.length) return;
      active = (active + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length;
      resultsEl.querySelectorAll('li').forEach((li, i) => li.classList.toggle('active', i === active));
      resultsEl.querySelector('li.active')?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(active);
    } else if (e.key === 'Escape') {
      resultsEl.hidden = true;
    }
  });
  resultsEl.addEventListener('mousedown', (e) => {
    const li = e.target.closest('li[data-i]');
    if (li) { e.preventDefault(); choose(Number(li.dataset.i)); }
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.search-box')) resultsEl.hidden = true; });

  // ---------- Toolbar ----------
  document.getElementById('expand-all').onclick = () => {
    idx.persons.forEach((p) => { if (idx.children.get(p.id).length) expanded.add(p.id); });
    render();
    setTimeout(() => fit(), 420);
  };
  document.getElementById('collapse-all').onclick = () => {
    expanded.clear();
    expanded.add(rootPerson.id);
    if (selectedId != null) reveal(selectedId);
    render();
    setTimeout(() => fit(), 420);
  };
  document.getElementById('zoom-in').onclick = () => svg.transition().duration(250).call(zoom.scaleBy, 1.3);
  document.getElementById('zoom-out').onclick = () => svg.transition().duration(250).call(zoom.scaleBy, 1 / 1.3);
  document.getElementById('zoom-fit').onclick = () => fit();

  // ---------- Start ----------
  render(0);
  const params = new URLSearchParams(location.search);
  const startId = Number(params.get('id'));
  const startQuery = params.get('q');
  if (startId && idx.byId.has(startId)) {
    focusPerson(startId, { expand: true, instant: true });
  } else if (startQuery) {
    fit(0);
    input.value = startQuery;
    showResults();
    if (results.length === 1) choose(0);
    else input.focus();
  } else {
    fit(0);
  }
})();
