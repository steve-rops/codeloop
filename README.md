# codeloop

The studio site: Next.js 16 (App Router), React 19, Tailwind 4, next-intl for
the English and Greek trees. Every page is prerendered at build time.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000 → redirects to /en or /el
npm run build   # also type-checks
npm run lint
```

## Environment

| Variable | Where | What it does |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Vercel project, production | The public origin, e.g. `https://example.com`, no trailing slash. Every canonical, hreflang, sitemap, share-card and structured-data URL is built from it. Without it the Vercel production domain is used; locally it falls back to `http://localhost:3000`. |
| `RESEND_API_KEY` | Vercel + `.env.local` | Sends the contact and brief forms. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | optional | Prints Google's `<meta name="google-site-verification">`. Not needed while `public/google*.html` is in place. |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | optional | Prints Bing's `msvalidate.01` meta tag. |

## Where things live

- `app/[locale]/` — the pages. Each exports `generateMetadata` built with
  `pageMetadata()` from `app/lib/seo.ts`, and renders its own schema.org graph
  through `<JsonLd>`.
- `app/lib/site.ts` — the studio's identity: name, founder, email, phone, base
  city, hours, social profiles. The structured data, footer and `llms.txt`
  all read from here.
- `app/lib/projects.ts` and `app/lib/services.ts` — the case studies and the
  services as structure; all their copy is in `messages/*.json`.
- `messages/en.json`, `messages/el.json` — every string a reader sees, in both
  languages. Keys must stay in parity.
- `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts` — crawler files,
  generated from the lists above.
- `app/llms.txt/` and `app/llms-full.txt/` — the site as Markdown for AI
  crawlers, written from the English catalogue (`app/lib/llms.ts`).

## Adding content

- **A case study**: add it to `PROJECTS` in `app/lib/projects.ts`, add
  `projects.<slug>` to both catalogues, drop a 1920px-wide WebP screenshot in
  `public/work/`. The work grid, nav count, sitemap, `llms.txt` and the
  "next project" loop pick it up.
- **A service**: add the slug to `SERVICES` in `app/lib/services.ts`, add
  `services.items.<slug>` and `metadata.service.<slug>` to both catalogues.
- **An FAQ entry**: append to `faq.items` (home page) or
  `services.items.<slug>.faq` in both catalogues; the FAQPage structured data
  is generated from the same list.

## Media

The hero footage is `public/code-loop-bg.mp4` (H.264, 1080p, no audio, about
2.6 MB) with `public/code-loop-poster.jpg` as its first frame. To replace it:

```bash
ffmpeg -i source.mp4 -an -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p \
  -movflags +faststart -vf "scale=1920:-2" public/code-loop-bg.mp4
ffmpeg -i source.mp4 -frames:v 1 -vf "scale=1920:-2" -q:v 4 public/code-loop-poster.jpg
```

Screenshots go in as WebP at 1920px wide (`cwebp -q 85 in.png -o out.webp`);
`next/image` resizes them per device from there.
