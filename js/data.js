// Shared data access (Supabase or the bundled demo JSON), auth and family-tree helpers.
(function () {
  const cfg = window.FARAH_CONFIG || {};
  const live = !!(cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase);
  const sb = live ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey) : null;

  const FIELDS = 'id,name,sex,father_id,mother_name,birth_date,death_date,birth_place,notes,photo_url';

  async function loadPersons() {
    if (!live) {
      const res = await fetch('data/family.json');
      if (!res.ok) throw new Error('تعذر تحميل البيانات');
      return res.json();
    }
    const all = [];
    const page = 1000;
    for (let from = 0; ; from += page) {
      const { data, error } = await sb.from('persons').select(FIELDS).order('id').range(from, from + page - 1);
      if (error) throw error;
      all.push(...data);
      if (data.length < page) break;
    }
    return all;
  }

  function requireLive() {
    if (!live) throw new Error('الموقع في وضع العرض التجريبي. أضف مفتاح Supabase في js/config.js لتفعيل التعديل.');
  }

  async function addPerson(person) {
    requireLive();
    const { data, error } = await sb.from('persons').insert(person).select(FIELDS).single();
    if (error) throw error;
    return data;
  }

  async function updatePerson(id, patch) {
    requireLive();
    const { data, error } = await sb.from('persons').update(patch).eq('id', id).select(FIELDS).single();
    if (error) throw error;
    return data;
  }

  async function deletePerson(id) {
    requireLive();
    const { error } = await sb.from('persons').delete().eq('id', id);
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
        .map((p, i) => (i === 0 ? p.name : (chain[i - 1].sex === 'F' ? 'بنت ' : 'بن ') + p.name))
        .join(' ');
    }

    // "زهير اديب" finds Zuhier whose father is Adib: token i must match ancestor i.
    function search(query, limit = 30) {
      const tokens = normalize(query).split(' ').filter(Boolean);
      if (!tokens.length) return [];
      const results = [];
      for (const p of persons) {
        const chain = ancestors(p.id);
        if (chain.length < tokens.length) continue;
        if (tokens.every((t, i) => normalize(chain[i].name).includes(t))) {
          const exact = normalize(p.name) === tokens[0] ? 0 : 1;
          results.push({ person: p, score: exact * 1000 + chain.length });
        }
      }
      results.sort((a, b) => a.score - b.score);
      return results.slice(0, limit).map((r) => r.person);
    }

    const generations = Math.max(0, ...persons.map((p) => ancestors(p.id).length));

    return { persons, byId, children, roots, ancestors, descendantCount, lineageName, search, generations };
  }

  window.FamilyData = { live, loadPersons, addPerson, updatePerson, deletePerson, auth, normalize, buildIndex };
})();
