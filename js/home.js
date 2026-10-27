// Home page: live statistics, origin line and main branches.
(async function () {
  const { esc } = window.UI;
  const { t, num, displayName } = window.I18N;
  window.UI.init();

  let idx;
  try {
    idx = window.FamilyData.buildIndex(await window.FamilyData.loadPersons());
  } catch (e) {
    console.error(e);
    return;
  }

  // The family is named after the first "فرح" in the line.
  const depth = (p) => idx.ancestors(p.id).length;
  const founder = idx.persons
    .filter((p) => window.FamilyData.normalize(p.name) === 'فرح')
    .sort((a, b) => depth(a) - depth(b))[0] || idx.roots[0];

  const branches = [];
  idx.children.get(founder.id).forEach((son) => {
    idx.children.get(son.id).forEach((g) => branches.push({ person: g, count: idx.descendantCount(g.id) }));
  });
  branches.sort((a, b) => b.count - a.count);

  const stats = {
    persons: idx.persons.length,
    generations: idx.generations,
    branches: branches.length,
    families: [...idx.children.values()].filter((c) => c.length).length,
  };
  document.querySelectorAll('[data-stat]').forEach((el) => {
    el.textContent = num(stats[el.dataset.stat]);
  });

  const line = idx.ancestors(founder.id).reverse();
  document.getElementById('origin').innerHTML = line
    .map((p) => `<a class="origin-step${p.id === founder.id ? ' key' : ''}" href="tree.html?id=${p.id}">${esc(displayName(p))}</a>`)
    .join(`<span class="origin-arrow" aria-hidden="true">${t('arrow')}</span>`);

  document.getElementById('branches').innerHTML = branches
    .map(({ person, count }) => `
      <a class="branch" href="tree.html?id=${person.id}">
        <div class="branch-name">${esc(displayName(person))}</div>
        <div class="branch-line">${esc(idx.lineageName(person.id, 3))}</div>
        <div class="branch-count">${t('n_descendants', { n: num(count) })}</div>
      </a>`)
    .join('');
})();
