-- Adds an optional English name. Run once in the Supabase SQL Editor.
-- When empty, the site shows an automatic transliteration (js/i18n.js).
alter table public.persons add column if not exists name_en text;
