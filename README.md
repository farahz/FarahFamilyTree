# عائلة فرح – الناصرة · The Farah Family of Nazareth

Family website with an interactive family tree, built from `Farah Family 480.ged`.

- **Static site** (plain HTML/CSS/JS, no build step) → hosted on GitHub Pages
- **Supabase** (project `dmacifguvdyvpkgfgbcp`) → database + login for editors
- Without a Supabase key the site runs in **read-only demo mode** from `data/family.json`

## Structure

| Path | Purpose |
|---|---|
| `index.html` | Home page: banner, about, statistics, origin line and main branches |
| `tree.html` | Interactive tree: search, zoom/pan, details panel, add/edit/delete when signed in |
| `js/config.js` | Supabase URL + anon key |
| `js/data.js` | Data loading, auth, search (Arabic-normalized), lineage helpers |
| `js/ui.js` | Header login/logout, login modal, toasts |
| `js/home.js`, `js/tree.js` | Page logic |
| `css/style.css` | All styles |
| `assets/banner.svg` | Placeholder banner, to be replaced with the family photo |
| `supabase/schema.sql` | Table + Row Level Security policies |
| `supabase/seed.sql` | The 480 people from the GEDCOM file |
| `tools/gedcom_to_data.py` | Regenerates `data/family.json` and `supabase/seed.sql` from a `.ged` file |

## Run locally

```bash
python -m http.server 8000
# open http://localhost:8000
```

(Opening `index.html` by double-click will not work, because the browser blocks loading data from `file://`.)

## Connect Supabase

1. Dashboard → **SQL Editor** → run `supabase/schema.sql`, then `supabase/seed.sql`.
2. Dashboard → **Authentication → Sign In / Providers**: turn **off** "Allow new users to sign up".
3. Dashboard → **Authentication → Users → Add user**: create an account (email + password) for each family editor.
4. Dashboard → **Project Settings → API Keys**: copy the **anon / publishable** key into `js/config.js`.
   This key is meant to be public; the RLS policies let everyone read and only signed-in users write.
5. Authentication → **URL Configuration**: set Site URL to the GitHub Pages address.

## Deploy to GitHub Pages

Push to GitHub, then go to **Settings → Pages → Deploy from a branch → `main` / root**.
The site will be at `https://<user>.github.io/<repo>/`.

## Arabic / English

Every page has a language button in the header (`English` / `عربي`). The choice is remembered in the
browser, and links can force it with `?lang=en` or `?lang=ar`. Interface text lives in `js/i18n.js`.

Names are shown in English through a built-in transliteration table (`NAME_WORDS` / `NAME_PHRASES`
in `js/i18n.js`). To give a person a specific English spelling, run `supabase/002_name_en.sql` once.
That adds a `name_en` column, and a "Name in English" field then appears in the add/edit form.
A value saved there overrides the automatic transliteration.

## Search tips

Type a name, or a name followed by father and grandfather names, to tell people apart:
`زهير أديب` finds زهير بن أديب. Spelling variants (أ/إ/ا, ة/ه, ى/ي) and diacritics are ignored.

## Updating from a new GEDCOM export

```bash
python tools/gedcom_to_data.py "Farah Family 480.ged"
```

This rewrites `data/family.json` (demo data) and `supabase/seed.sql`. Note that the seed uses
`on conflict do nothing`, so it only adds new IDs. Edits made on the website live in Supabase.
