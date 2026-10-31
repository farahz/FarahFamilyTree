# عائلة فرح – الناصرة · The Farah Family of Nazareth

Family website with an interactive family tree, built from two GEDCOM files (two switchable datasets):
`Farah Family 480.ged` (Arabic names, default) and `Farah-Family-799.ged` (English names).

- **Static site** (plain HTML/CSS/JS, no build step) → hosted on GitHub Pages
- **Supabase** (project `dmacifguvdyvpkgfgbcp`) → database + login for editors
- Without a Supabase key the site runs in **read-only demo mode** from `data/family.json`
- **Phone friendly**: one-row header and tree toolbar (icon buttons, pinch to zoom), the tree opens at a
  readable zoom with the root at the screen edge, and person details slide up as a bottom sheet
- **Photo slideshow** in the history section: every image uploaded to `assets/photos/` on GitHub is shown
  (listed through the public GitHub API, so no file list to maintain), with swipe, arrows and a full-screen view

## Structure

| Path | Purpose |
|---|---|
| `index.html` | Home page: banner, about, statistics, origin line and main branches |
| `tree.html` | Interactive tree: search, zoom/pan, details panel, add/edit/delete when signed in |
| `js/config.js` | Supabase URL + anon key, and the list of datasets (table, JSON file, name language) |
| `js/data.js` | Data loading, auth, search (Arabic-normalized), lineage helpers |
| `js/ui.js` | Header login/logout, login modal, toasts |
| `js/home.js`, `js/tree.js` | Page logic |
| `js/gallery.js` | Home page photo slideshow + full-screen viewer for the images in `assets/photos/` |
| `css/style.css` | All styles |
| `assets/farah-family.jpg` | Home page banner (family photo collage) |
| `assets/banner.svg` | Nazareth illustration in the history section, shown until photos are added |
| `assets/photos/` | Family photos for the slideshow: upload images here on GitHub (see its README) |
| `supabase/schema.sql` | Table + Row Level Security policies |
| `supabase/seed.sql` | The 480 people from the GEDCOM file |
| `supabase/003_persons_799.sql`, `seed-799.sql` | Table and data for the 799 dataset |
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

**Current page URL:** https://farahz.github.io/FarahFamilyTree/

## Datasets (480 / 799)

A selector in the header switches between the datasets. The choice is remembered in the browser, and
links can force it with `?tree=480` or `?tree=799`. Each dataset has its own Supabase table
(`persons`, `persons_799`) and its own JSON copy for demo mode, so edits never mix.

To enable the 799 dataset in Supabase, run in the SQL Editor, in this order:
`supabase/003_persons_799.sql`, then `supabase/seed-799.sql`. Until then the site shows the bundled
`data/family-799.json` read-only. To add another dataset, add an entry to `datasets` in `js/config.js`.

The 799 file has English names. In Arabic mode they are translated through the `AR_WORDS` table in
`js/i18n.js` (unknown words stay in English). To give a person a specific Arabic spelling, set the
"Name in Arabic" field in the edit form (column `name_ar`). The file also contains a few placeholder
people literally named "NAME"; they show as "بدون اسم" in Arabic.

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
python tools/gedcom_to_data.py Farah-Family-799.ged 799 --strip-surname Farah
```

The first rewrites `data/family.json` (demo data) and `supabase/seed.sql`; the second writes
`data/family-799.json` and `supabase/seed-799.sql` (table `persons_799`). Note that the seed uses
`on conflict do nothing`, so it only adds new IDs. Edits made on the website live in Supabase.
