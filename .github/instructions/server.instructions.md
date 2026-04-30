---
applyTo: 'server/**'
---
# Server – Node.js BFF ("frackend")

Express-basert BFF som sitter mellom nettleseren og `lydia-api`. Hovedoppgaver: autentisering (validere Azure AD-tokens fra wonderwall), CSRF-beskyttelse, on-behalf-of-tokenveksling, og proxying til `lydia-api`.

## Teknisk stack

- Node.js + TypeScript
- Express 5
- `jose` for JWT-validering
- `csrf-csrf` (double-submit-pattern) for CSRF
- `http-proxy-middleware` for proxy mot `lydia-api`
- `express-session` + `connect-redis` (Redis i sky, in-memory lokalt)
- `winston` for logging, `prometheus-api-metrics` + `prom-client` for metrikker
- Test: Jest + `supertest` + `nock` for HTTP-mock
- Pakkehåndtering: pnpm

## Filstruktur (i dag)

Alle TS-filer ligger flatt i `server/`:

| Fil | Ansvar |
| --- | --- |
| `server.ts` | Entry point. Laster env, setter opp JWK-set og sesjon, starter HTTP-server. |
| `app.ts` | Bygger Express-app: helmet, sesjon, token-validering, CSRF, ruter, proxy, statiske filer. |
| `config.ts` | `Config`-klasse + `Azure`/`Server`/`LydiaApi`/`Secrets` + miljøvariabel-mapping. |
| `proxy.ts` | `LydiaApiProxy` med whitelist av tillatte path-prefikser og pathRewrite for `/api` og `/proxy`. |
| `onBehalfOf.ts` | OBO-tokenveksling, JWT-validering for innkommende requests (wonderwall/fakedings). |
| `brukerinfo.ts` | Henter ut brukerinfo (navn, ident, rolle) fra Azure-token, mapper grupper → rolle. |
| `jwks.ts` | JWK-set (henter remote i sky, genererer lokalt for tester). |
| `crypto.ts` | Kryptering/dekryptering av OBO-tokens før caching i Redis. |
| `SessionStore.ts` | `sessionManager` (Redis) og `inMemorySessionManager` (lokal/test). |
| `error.ts` | `AuthError`. |
| `logging.ts` | Winston-logger. |
| `metrikker.ts` | Prometheus-tellere. |
| `__tests__/` | `app.test.ts`, `config.test.ts`, `crypto.test.ts`. |

## Sentrale mønstre

### Miljøvariabler

Bruk konstantene i `miljøVariabler` i `config.ts`. Aldri `process.env.X` direkte i app-koden – bruk `getEnvVar(miljøVariabler.X)`. Manglende påkrevde variabler skal kaste tidlig (i `Config`-konstruktøren).

```ts
import { getEnvVar, miljøVariabler } from "./config";

const uri = getEnvVar(miljøVariabler.lydiaApiUri);
```

### Avhengighetsinjisering

`Application` tar `Config` og `RequestHandler` (sesjon) i konstruktøren – ikke les env eller Redis direkte i `app.ts`. Dette gjør `app.ts` testbar.

### Token-validering

To varianter:
- **Sky** (`validerTokenFraWonderwall`): leser `authorization`-header satt av wonderwall.
- **Lokalt** (`validerTokenFraFakedings`): bruker mock-OAuth.

`app.ts` velger basert på `inLocalMode()`. Begge gir samme middleware-signatur.

### On-behalf-of (OBO)

`onBehalfOfTokenMiddleware(config)` veksler innkommende user-token til et `lydia-api`-token via Azure. Resultatet legges på `res.locals.on_behalf_of_token`. Cachet kryptert i Redis for ytelse. **OBO hoppes over i `inLocalMode()`.**

### Proxy

`LydiaApiProxy` har en hardkodet whitelist av path-prefikser. **Skal du eksponere et nytt API-prefiks fra `lydia-api`, legg det til i `whitelistedPaths` i `proxy.ts`.** Requests som ikke matcher whitelist returnerer 404.

`pathRewrite` stripper `/api` og `/proxy` før requesten sendes videre.

### CSRF

Bruker `csrf-csrf` med double-submit-cookie. Frontend henter token fra `GET /csrf-token` og sender det som `x-csrf-token`-header på POST/PUT/DELETE. **Ruter under `/api` og `/proxy` er CSRF-beskyttet automatisk** via `doubleCsrfProtection` middleware lagt på i `app.ts`.

### Sesjon

Lokal/test bruker `inMemorySessionManager`. Sky bruker Redis via `connect-redis`. Sesjons-id er `req.session.id` og brukes som CSRF-binding via `getSessionIdentifier`.

### Logging

```ts
import logger from "./logging";

logger.info("melding");
logger.error("feil", { error });
```

Inkluder `res.locals.requestId` der det gir mening (sett opp i app.ts som UUID per request).

### Feilhåndtering

Kast `AuthError` fra `error.ts` ved auth-feil. Express-error-handler i bunnen av `app.ts` returnerer 401 for `AuthError`, 500 ellers.

### Helsesjekker

`GET /internal/isAlive` og `GET /internal/isReady` – plassert **før** sesjon og auth slik at de alltid svarer. Ikke flytt dem.

### Metrikker

Tilgjengelig på `GET /internal/metrics`. Egne tellere (f.eks. `redisCacheHitCounter`) defineres i `metrikker.ts`.

## Testing

- Plasser tester i `__tests__/` (planlagt: colocate under `src/` i en senere fase).
- Bruk `supertest` mot `Application`-instansen, ikke mot live HTTP-server.
- Bruk `nock` for å mocke HTTP-kall til Azure og `lydia-api`.
- For tokens: `createMockToken()` i `app.test.ts` viser mønsteret med `SignJWT` + lokalt nøkkelpar fra `generateLocalKeys()`.
- Sett env-variabler via en `mockEnv()`-funksjon før `Application` konstrueres.

```sh
cd server
pnpm test
```

## Kjør lokalt

`server/` startes som del av `./run.sh` i root, men du kan også kjøre `pnpm dev` direkte i `server/` (med dependencies fra docker-compose oppe). Krever `env.local` i repo-rot.

```sh
cd server
pnpm dev          # nodemon + ts-node
pnpm test         # Jest
pnpm lint         # ESLint
pnpm build        # tsc → build/
```

## Verktøy og kvalitet

- ESLint: kjøres på alle TS-filer.
- TypeScript: `tsc -p tsconfig.build.json` for build. `pnpm tsc --noEmit` for typecheck (planlagt eget skript).
- Prettier: bruk `pnpm prettify` før commit.
- **Verifiser alltid med `pnpm lint && pnpm tsc --noEmit && pnpm test` etter endringer.**

## Typiske oppgaver

### Eksponere et nytt API-prefiks fra lydia-api
1. Legg til prefikset i `whitelistedPaths` i `proxy.ts`.
2. Verifiser at frontend bruker en path som matcher (se `client/src/api/lydia-api/paths.ts`).
3. Skriv test i `__tests__/app.test.ts` som verifiserer at requesten proxies (eller blokkeres når den ikke skal).

### Legge til ny miljøvariabel
1. Legg navnet i `miljøVariabler`-objektet i `config.ts`.
2. Bruk `getEnvVar(miljøVariabler.X)` der den trengs (i en `Config`-underklasse hvis det er konfigurasjon).
3. Legg til i `env.local` (lokal) og oppdater nais-config (`.nais/`) for sky.
4. Mock i `mockEnv()` i `__tests__/app.test.ts`.

### Legge til ny rolle/gruppe
1. Legg til gruppe-id-miljøvariabel i `miljøVariabler` og `fiaRoller()` i `brukerinfo.ts`.
2. Utvid `Rolle`-enum og rolle-mapping.
3. Skriv test som verifiserer mapping fra gruppe → rolle.

### Endre CSRF-cookie-navn eller -konfig
Endres i `doubleCsrf({...})`-kallet i `app.ts`. Husk at frontend må stemme overens (cookie-navnet brukes ikke i frontend, bare `x-csrf-token`-headeren).

## Norsk navngiving

Bruk norske navn for domeneting (`virksomhet`, `sak`, `bruker`). Engelsk er greit for tekniske begreper (`config`, `proxy`, `middleware`).
