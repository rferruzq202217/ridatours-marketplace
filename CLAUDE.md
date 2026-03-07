# Ridatours Marketplace

## Qué es
Marketplace de tours y experiencias turísticas. Dominio: www.ridatours.com

## Stack
- Next.js 15 + TypeScript + Tailwind
- Supabase (PostgreSQL) — experiencias, ciudades, categorías, monumentos
- Payload CMS — blog posts y guías de viaje
- DeepL API — traducción automática ES/EN/FR/IT/DE
- Anthropic API (Claude Sonnet 4.5) — generación de contenido editorial
- Vercel — deploy automático desde main

## Estructura clave
- app/[locale]/[city]/[slug]/page.tsx — página de actividad
- app/[locale]/[city]/page.tsx — página de ciudad
- lib/schema.ts — Schema.org JSON-LD
- app/sitemap.ts — sitemap dinámico (950 URLs)

## Base de datos (Supabase)

### Tabla `cities`
Campos principales:
- `id` — UUID
- `name`, `slug`, `country` — Identificación
- `description` — Descripción corta (~100-150 caracteres)
- `description_long` — Contenido editorial largo (~400 palabras) generado con Claude Sonnet 4.5
- `image`, `image_url`, `hero_image_url` — Imágenes
- `latitude`, `longitude` — Coordenadas
- `tiqets_affiliate_link` — Enlaces de afiliado
- `country_id` — Relación con países

### Scripts útiles
- `scripts/generate-city-descriptions.js` — Genera contenido editorial para ciudades usando Claude API
  - Procesa ciudades en batches de 5 con pausas de 2s
  - Genera ~400 palabras en español por ciudad
  - Incluye: monumentos, consejos de visita, reserva anticipada

## Deploy
git push origin main → Vercel autodeploy

## Pendiente
- Slugs de categoría localizados por idioma

## Idioma
Responde siempre en español.
