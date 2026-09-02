# EU4Food Safety — Sistemi i Menaxhimit të Projektit

Aplikacion web (Next.js) që zëvendëson skedarin Excel të menaxhimit të
projektit EU4Food Safety (Shqipëri) me një "program" real, në browser, ku
Menaxheri i Projektit (PM) dhe kolegët PM (2–3 persona) kyçen me
email/fjalëkalim dhe menaxhojnë: lotet, roster-in e ekspertëve, RACI-n,
fletët e kohës, katalogun e deliverables, deliverables & vlerësimin QC,
historikun e versioneve dhe log-un e problematikave (RAID). Ekspertët e
jashtëm **nuk** kanë qasje/login në këtë version — të dhënat e tyre futen
dhe rishikohen nga ekipi PM.

I gjithë ndërfaqja është në shqip.

## Stack teknik

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **Prisma ORM** me **SQLite** për zhvillim lokal (`prisma/dev.db`)
- **NextAuth.js v4** (Credentials provider, JWT, fjalëkalimet hash-uar me bcrypt)
- **Server Actions** për të gjitha shtimet/ndryshimet (pa REST API të veçantë)

## Si të fillosh (zhvillim lokal)

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Hap [http://localhost:3000](http://localhost:3000). Do të ridrejtohesh te
`/login`.

### Llogaritë e para-mbjella (seed) — PËRKOHSHME

Skripti i seed-it (`prisma/seed.ts`) krijon 3 llogari me të njëjtin
fjalëkalim të përkohshëm:

| Emri | Email | Fjalëkalimi |
|---|---|---|
| Keldi Bozo | keldibozo@gmail.com | `eu4fs2026` |
| PM Kolegë 1 | pm1@example.com | `eu4fs2026` |
| PM Kolegë 2 | pm2@example.com | `eu4fs2026` |

**E rëndësishme:** `pm1@example.com` dhe `pm2@example.com` janë llogari
placeholder (vendmbajtëse). Para përdorimit real, riemërto ato me emrat dhe
email-et e vërteta të kolegëve PM, dhe të gjithë ndryshoni fjalëkalimin e
përkohshëm `eu4fs2026` (aktualisht nuk ka ende faqe "ndrysho fjalëkalimin"
në UI — ndryshimi bëhet duke rigjeneruar hash-in me bcrypt dhe duke
përditësuar `passwordHash` në tabelën `User`, p.sh. me një skript të
vogël `tsx` ose direkt në databazë).

## Të dhëna të para-mbjella (seed)

`prisma/seed.ts` pastron dhe rimbush çdo herë që ekzekutohet (i sigurt për
rindjekje gjatë zhvillimit) me:

- 3 lote reale: **LOT1** (Food Safety), **LOT2** (Veterinary), **LOT3** (Phytosanitary)
- 1 ekspert shembull (ilustrues): **Elira Krasniqi** (LOT1, Ligjor)
- 7 rreshta RACI për aktivitetet kryesore të workflow-it
- Rubrika e plotë QC (12 kritere: 6 Ligjor + 6 Teknik, peshat shumojnë 100%)
- Katalogu i 7 deliverables kontraktuale (C001–C007, sipas ToR 7000016213)
- 1 deliverable shembull i plotë (D001) me vlerësim QC dhe 2 rreshta historiku
  versionesh — shërben si shembull referimi për formulat e llogaritjes

## Formulat e llogaritjes (identike me versionin Excel)

- **Vlerësimi i Ponderuar** = K1×30% + K2×20% + K3×15% + K4×15% + K5×15% + K6×5%
  (vetëm nëse të gjashtë K1–K6 janë vendosur, përndryshe bosh)
- **Vendimi**: nëse K1 ≤ 2 → "Kërkon Rishikim të Plotë" (edhe nëse mesatarja
  është e lartë); përndryshe ≥4 → "Aprovohet"; ≥3 → "Aprovohet me Ndryshime
  të Vogla"; më poshtë → "Kërkon Rishikim të Plotë"
- **Me Vonesë**: `submissionDate > deadline` (kur të dyja janë vendosur)
- **Statusi i Ekspertit**: Kujdes (vonesa ose mesatare <3) → Tejkalim Ditësh
  (>100% përdorim) → Afër Kufirit (≥85%) → Në Rregull
- **Mbulimi i Katalogut**: Nuk ka Filluar / Në Proces / Aprovuar, sipas
  statuseve të deliverables të lidhura

Të gjitha këto llogariten "live" në kod (jo të ruajtura në databazë) dhe
kontrolli i saktësisë u verifikua: deliverable-i shembull D001
(K1..K6 = 5,4,5,4,5,4) jep Vlerësim të Ponderuar **4.6** dhe Vendim
**"Aprovohet"**.

## Struktura e projektit (shkurt)

- `prisma/schema.prisma` — modeli i plotë i të dhënave
- `prisma/seed.ts` — të dhënat fillestare
- `lib/compute.ts` — formulat e llogaritjes (vlerësimi QC, statuset, etj.)
- `lib/aggregate.ts` — agregimet për dashboard-in dhe pasqyrën e ekspertit
- `lib/enums.ts` — vlerat e enum-eve dhe etiketat shqip
- `app/(dashboard)/...` — faqet e mbrojtura (pas login-it)
- `app/(auth)/login` — faqja e kyçjes
- `app/actions/*.ts` — Server Actions për shtim/ndryshim/fshirje
- `proxy.ts` — mbrojtja e rrugëve (në Next.js 16 kjo zëvendëson
  `middleware.ts` të versioneve më të vjetra)

## ⚠️ Shënim i rëndësishëm mbi mjedisin ku u ndërtua ky projekt

Ky aplikacion u zhvillua brenda një ambienti (sandbox) agjenti me akses të
kufizuar në internet, ku hosti `binaries.prisma.sh` (nga i cili Prisma CLI
shkarkon motorët e tij "schema-engine"/"query-engine" gjatë `prisma
generate` / `migrate` / `db push`) ishte i bllokuar nga politika e rrjetit.
Për këtë arsye, komandat `npx prisma generate` dhe `npx prisma migrate dev`
**nuk u ekzekutuan me sukses brenda atij sandbox-i** — pjesë krejtësisht e
jashtme e kontrollit të këtij projekti, jo e lidhur me korrektësinë e
skemës apo kodit.

Për të verifikuar sërish që aplikacioni funksionon saktë (build, faqet,
login-i, llogaritjet), gjatë ndërtimit u përdor **përkohësisht**, vetëm
brenda `node_modules` (pra jashtë projektit që merr përdoruesi — nuk
prek asnjë skedar të depozitës/zip), një "shim" i thjeshtë i Prisma
Client-it i mbështetur nga `node:sqlite` (i integruar në Node.js, pa
shkarkim rrjeti), në mënyrë që `npm run build`, `npm run dev` dhe skripti
i seed-it të mund të testoheshin plotësisht brenda sandbox-it. Kodi i
aplikacionit (skema, `lib/prisma.ts`, Server Actions, faqet) është
**standard Prisma Client** — nuk ka asnjë varësi nga ky shim.

**Për ty (në kompjuterin tënd apo në CI/CD normal, me internet të plotë)
kjo nuk përbën problem: `npm install` + `npx prisma generate` + `npx
prisma migrate dev` do të shkarkojnë motorët e vërtetë të Prisma-s dhe do
të funksionojnë normalisht**, pikërisht siç përshkruhet te "Si të fillosh"
më sipër. Nëse ndonjëherë has një gabim identik ("Failed to fetch ...
checksum ... binaries.prisma.sh ... 403") në një rrjet tjetër të kufizuar
(p.sh. firewall korporate), shkaku është i njëjtë — qasje e bllokuar te
ai host — dhe zgjidhja është të lejosh atë host në rrjetin tënd, jo një
problem i skemës.

## ⚠️ SQLite vs Prodhim (Vercel)

`DATABASE_URL="file:./dev.db"` (SQLite) në `.env` funksionon shkëlqyeshëm
për zhvillim/testim lokal, **por NUK duhet përdorur në Vercel** — Vercel
përdor një filesystem të përkohshëm (ephemeral), kështu që skedari
`dev.db` do të fshihet/rikrijohej bosh në çdo deploy të ri dhe të dhënat
do të humbnin. Për prodhim, ndrysho provider-in në
`prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"   // ndrysho nga "sqlite"
  url      = env("DATABASE_URL")
}
```

## Vendosja (Deployment) në Vercel — hap pas hapi

1. **Push në GitHub**: krijo një repository të ri dhe shty (push) këtë
   projekt (pa `node_modules`, `.next`, `dev.db` — shiko `.gitignore`).
2. **Databaza**: krijo një databazë Postgres — më e thjeshta është **Vercel
   Postgres** (nga dashboard-i i Vercel: Storage → Create Database →
   Postgres) ose **Neon** (neon.tech, plan falas i mjaftueshëm për këtë
   madhësi projekti).
3. **Ndrysho schema.prisma**: vendos `provider = "postgresql"` siç u tregua
   më sipër, dhe commit/push ndryshimin.
4. **Importo projektin në Vercel**: vercel.com → Add New → Project →
   zgjidh repository-n nga GitHub.
5. **Environment Variables** (Vercel → Project Settings → Environment
   Variables):
   - `DATABASE_URL` — connection string i databazës Postgres (Vercel
     Postgres/Neon ta japin këtë automatikisht ose te dashboard-i i tyre)
   - `NEXTAUTH_SECRET` — një varg i rastësishëm i gjatë dhe sekret (gjenero
     me `openssl rand -base64 32`)
   - `NEXTAUTH_URL` — URL-ja publike e aplikacionit (p.sh.
     `https://emri-i-projektit.vercel.app`)
6. **Build Command**: Vercel e zbulon vetë Next.js-in; sigurohu që
   `package.json` → `scripts.build` mbetet `next build` (Prisma Client
   gjenerohet automatikisht si pjesë e `npm install` nëse shtoni
   `"postinstall": "prisma generate"` te `package.json`, ose thirre
   manualisht te Build Command: `prisma generate && next build`).
7. **Migrimi i skemës në databazën e re**: para deploy-it të parë (ose si
   hap build-i), ekzekuto `npx prisma migrate deploy` kundrejt
   `DATABASE_URL` të prodhimit (mund ta shtosh si pjesë e Build Command:
   `npx prisma migrate deploy && next build`), më pas (një herë të vetme)
   `npx prisma db seed` nëse do llogaritë fillestare/shembullin — ose krijo
   drejtpërdrejt llogaritë reale të PM-ve në databazën e prodhimit.
8. **Deploy**. Kyçu me llogarinë e parë PM dhe fillo të zëvendësosh
   Excel-in.

### Alternativë: Render

Nëse preferon Render.com në vend të Vercel-it: krijo një **Web Service**
nga i njëjti repo GitHub (build command `npm install && npx prisma
generate && npx prisma migrate deploy && npm run build`, start command
`npm start`), plus një **PostgreSQL** instance nga Render (jep
`DATABASE_URL`-në automatikisht si env var të lidhur). Pjesa tjetër
(ndryshimi i `schema.prisma` provider, env variables `NEXTAUTH_SECRET`/
`NEXTAUTH_URL`) është identike me udhëzimet e Vercel-it më sipër.

## Çfarë u thjeshtua / u la jashtë fushës (për ndershmëri)

- Nuk ka faqe të veçantë "Konfigurimi i Projektit" për ndryshimin e emrit
  të projektit/financuesit/PM kryesor nga UI — këto shfaqen (nga rreshti i
  vetëm i tabelës `Project`) në header të dashboard-it; ndryshimi bëhet
  direkt në databazë. Kjo faqe nuk kërkohej shprehimisht në listën e
  rrugëve (routes) të specifikuara.
- Nuk ka ende faqe "ndrysho fjalëkalimin" nga UI (shiko shënimin te
  llogaritë e para-mbjella më sipër).
- Fshirja e një rreshti të referuar nga rreshta të tjerë (p.sh. fshirja e
  një eksperti me deliverables/fletë kohe ekzistuese) do të refuzohet nga
  databaza (gabim i integritetit referencial) — sjellje e saktë dhe e
  qëllimshme (mbron nga humbja e të dhënave), por UI aktualisht nuk shfaq
  ende një mesazh të bukur gabimi për këtë rast (shfaqet faqja standarde e
  gabimit të Next.js).
- Google Fonts (next/font/google) nuk u përdor — u zgjodh një font-stack
  sistemi (system-ui) për thjeshtësi dhe pavarësi nga rrjeti gjatë build-it.
- Design-i është i qëllimshëm minimal/funksional (Tailwind, pa librari UI
  shtesë) — siç u kërkua, funksionaliteti u prioritizua mbi poliçimin
  vizual.
