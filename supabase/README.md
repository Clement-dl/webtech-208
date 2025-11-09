# Supabase (local)

- Démarrer : `npx supabase@latest start`
- Arrêter  : `npx supabase@latest stop`
- Studio   : http://localhost:54323
- API      : http://localhost:54321
- DB       : host=localhost port=54322 dbname=postgres user=postgres password=postgres

## Migrations
- Créer : `npx supabase@latest migration new <name>`
- Appliquer : `npx supabase@latest db reset` (réinitialise + applique)
