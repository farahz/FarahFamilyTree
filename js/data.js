// Shared data access (Supabase or the bundled demo JSON), auth and family-tree helpers.
(function () {
  const cfg = window.FARAH_CONFIG || {};
  const ds = window.FARAH_DATASET;
  const live = !!(cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase);
  const sb = live ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey) : null;
  let usingDb = live; // false once the dataset's table is missing and the bundled JSON is used instead

  const BASE_FIELDS = 'id,name,sex,father_id,mother_name,birth_date,death_date,birth_place,notes,photo_url';
  // The alternate-language name column (name_en / name_ar) may not exist yet (see supabase/002_name_en.sql);
  // until then the query falls back to BASE_FIELDS.
  let fields = BASE_FIELDS + ',' + ds.altField;
  const { t, displayName, nameEn, nameAr } = window.I18N;

  async function loadJson() {
    const res = await fetch(ds.json);
    if (!res.ok) throw new Error(t('load_failed'));
    return res.json();
  }

  async function loadPersons() {
    if (!usingDb) return loadJson();
    const all = [];
    const page = 1000;
    for (let from = 0; ; from += page) {
      const { data, error } = await sb.from(ds.table).select(fields).order('id').range(from, from + page - 1);
      if (error && error.code === '42703' && fields !== BASE_FIELDS) {
        fields = BASE_FIELDS; // column does not exist
        return loadPersons();
      }
      if (error && (error.code === '42P01' || error.code === 'PGRST205')) {
        usingDb = false; // table not created yet: show the bundled data, read-only
        return loadJson();
      }
      if (error) throw error;
      all.push(...data);
      if (data.length < page) break;
    }
    return all;
  }

  function requireLive() {
    if (!usingDb) throw new Error(t('read_only'));
  }

  async function addPerson(person) {
    requireLive();
    const { data, error } = await sb.from(ds.table).insert(person).select(fields).single();
    if (error) throw error;
    return data;
  }

  async function updatePerson(id, patch) {
    requireLive();
    const { data, error } = await sb.from(ds.table).update(patch).eq('id', id).select(fields).single();
    if (error) throw error;
    return data;
  }

  async function deletePerson(id) {
    requireLive();
    const { error } = await sb.from(ds.table).delete().eq('id', id);
    if (error) throw error;
  }

  const auth = {
    async user() {
      if (!live) return null;
      const { data } = await sb.auth.getSession();
      return data.session ? data.session.user : null;
    },
    async signIn(email, password) {
      requireLive();
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    async signOut() {
      if (live) await sb.auth.signOut();
    },
    onChange(cb) {
      if (live) sb.auth.onAuthStateChange((_event, session) => cb(session ? session.user : null));
    },
  };

  // Arabic-aware search normalization: strip diacritics/tatweel and unify letter variants.
  function normalize(s) {
    return (s || '')
      .toLowerCase()
      .replace(/[ً-ٰٟـ]/g, '')
      .replace(/[أإآٱ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Index persons by id, children and generation.
  function buildIndex(persons) {
    const byId = new Map();
    const children = new Map();
    persons.forEach((p) => {
      byId.set(p.id, p);
      children.set(p.id, []);
    });
    const roots = [];
    persons.forEach((p) => {
      if (p.father_id != null && byId.has(p.father_id)) children.get(p.father_id).push(p);
      else roots.push(p);
    });
    children.forEach((list) => list.sort((a, b) => a.id - b.id));

    function ancestors(id) {
      const chain = [];
      let p = byId.get(id);
      while (p && chain.length < 100) {
        chain.push(p);
        p = p.father_id != null ? byId.get(p.father_id) : null;
      }
      return chain; // self first, root last
    }

    function descendantCount(id) {
      let n = 0;
      const stack = [...children.get(id)];
      while (stack.length) {
        const c = stack.pop();
        n++;
        stack.push(...children.get(c.id));
      }
      return n;
    }

    function lineageName(id, max = 4) {
      const chain = ancestors(id).slice(0, max);
      return chain
        .map((p, i) => (i === 0 ? displayName(p) : t(chain[i - 1].sex === 'F' ? 'daughter_of' : 'son_of') + ' ' + displayName(p)))
        .join(' ');
    }

    // "زهير اديب" / "zuhier adib" finds Zuhier whose father is Adib: token i must match ancestor i,
    // in either the Arabic or the English form of the name.
    function search(query, limit = 30) {
      const tokens = normalize(query).split(' ').filter(Boolean);
      if (!tokens.length) return [];
      const results = [];
      for (const p of persons) {
        const chain = ancestors(p.id);
        if (chain.length < tokens.length) continue;
        const matches = (tok, q) => normalize(q.name).includes(tok) || normalize(nameEn(q)).includes(tok) || normalize(nameAr(q)).includes(tok);
        if (tokens.every((tok, i) => matches(tok, chain[i]))) {
          const exact = [p.name, nameEn(p), nameAr(p)].some((n) => normalize(n) === tokens[0]) ? 0 : 1;
          results.push({ person: p, score: exact * 1000 + chain.length });
        }
      }
      results.sort((a, b) => a.score - b.score);
      return results.slice(0, limit).map((r) => r.person);
    }

    const generations = Math.max(0, ...persons.map((p) => ancestors(p.id).length));

    // The alternate-name column is editable only once it exists in the table.
    const hasAltName = persons.length > 0 && ds.altField in persons[0];

    return { persons, byId, children, roots, ancestors, descendantCount, lineageName, search, generations, hasAltName };
  }

  window.FamilyData = { live, dataset: ds, altField: ds.altField, loadPersons, addPerson, updatePerson, deletePerson, auth, normalize, buildIndex };
})();
