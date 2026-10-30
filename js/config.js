// Site configuration.
// Paste the project's anon (or "publishable") key from
// Supabase dashboard -> Project Settings -> API Keys.
// This key is safe to publish: Row Level Security in supabase/schema.sql protects the data.
// While the key is empty the site runs in read-only demo mode using the bundled JSON files.
//
// Each dataset is one GEDCOM file with its own Supabase table and JSON copy.
//   nameLang  language the `name` column is written in ('ar' or 'en')
//   altField  optional column holding the name in the other language (overrides auto-translation)
//   founder   name (in `name`) of the person the family is named after, used on the home page
window.FARAH_CONFIG = {
  supabaseUrl: 'https://dmacifguvdyvpkgfgbcp.supabase.co',
  supabaseAnonKey: 'sb_publishable_xbPrg0-LWV-QNGOSXWxIDQ_PlT-bnMz',
  defaultDataset: '480',
  datasets: [
    {
      key: '480', table: 'persons', json: 'data/family.json',
      nameLang: 'ar', altField: 'name_en', founder: 'فرح',
      label: { ar: '480 فرداً', en: '480 people' },
    },
    {
      key: '799', table: 'persons_799', json: 'data/family-799.json',
      nameLang: 'en', altField: 'name_ar', founder: 'Farah',
      label: { ar: '799 فرداً', en: '799 people' },
    },
  ],
};

// Active dataset: ?tree=799, then the last choice saved in this browser, then the default.
(function () {
  const cfg = window.FARAH_CONFIG;
  const known = (k) => cfg.datasets.some((d) => d.key === k);
  let key = new URLSearchParams(location.search).get('tree');
  if (!known(key)) {
    try { key = localStorage.getItem('farah-tree'); } catch (e) { key = null; }
  }
  if (!known(key)) key = cfg.defaultDataset;
  try { localStorage.setItem('farah-tree', key); } catch (e) { /* storage unavailable */ }
  window.FARAH_DATASET = cfg.datasets.find((d) => d.key === key);
})();
