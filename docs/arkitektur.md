# Arkitektur

## Oversikt

`lydia-radgiver-frontend` er et frontend-prosjekt for IA-rådgivere. Det består av:

- **`client/`** – React 19 SPA bygget med Vite. Bruker NAV Aksel for UI, SWR for datahenting, Zod for validering.
- **`server/`** – Express BFF ("frackend") som proxier mot `lydia-api`, validerer tokens, håndterer CSRF og OBO-tokenveksling.
- **`lydia-api`** – Backend (eget repo). Snakker mot Postgres og Kafka.

I sky sitter også **wonderwall** (NAV-egen sidecar for OAuth2/OIDC) og **Azure AD** foran frackend.

## Dataflyt (sky)

```
Browser
   │
   │  HTTPS, cookies
   ▼
wonderwall  ──── Azure AD (login, OIDC)
   │
   │  legger Authorization-header med user-token
   ▼
frackend (server/)
   │  ├─ validerer JWT (jwks.ts + onBehalfOf.ts)
   │  ├─ CSRF-sjekk (csrf-csrf, double-submit)
   │  ├─ OBO-tokenveksling mot Azure → lydia-api-scope
   │  └─ proxy med Bearer <obo-token>
   ▼
lydia-api
   │
   ▼
Postgres + Kafka
```

## Dataflyt (lokalt)

Wonderwall og Azure erstattes av `mockOAuth2-server` ("fakedings"). OBO-vekslingen hoppes over i lokal modus (`inLocalMode()`-sjekk i `app.ts`). Alt orkestreres av `docker-compose.yaml` + `./run.sh`.

`http://localhost:2222` peker via wonderwall til frackend (`:3000`) som igjen serverer Vite-builden eller proxier `/api/*` til `lydia-api` (`:8080`).

## Auth-flyt detaljert

1. Bruker går til `https://fia.intern.nav.no` → wonderwall sjekker sesjonscookie, redirecter til Azure AD ved behov.
2. Etter login setter wonderwall en sesjonscookie og sender `Authorization: Bearer <user-token>`-header på alle requests videre til frackend.
3. Frackend validerer token mot Azure JWK-set (`validerTokenFraWonderwall` i `onBehalfOf.ts`).
4. For requests under `/api` og `/proxy`:
   - `onBehalfOfTokenMiddleware` veksler user-token → `lydia-api`-token via Azure (`urn:ietf:params:oauth:grant-type:jwt-bearer`).
   - OBO-tokens caches **kryptert** i Redis for ytelse (`crypto.ts` + `SessionStore.ts`).
   - Proxy-middleware (`proxy.ts`) setter `Authorization: Bearer <obo-token>` og videresender til `lydia-api`.

## CSRF-flyt

Bruker `csrf-csrf` (double-submit cookie). Frontend henter et token og sender det som header på alle muterende requests.

1. Frontend kaller `GET /csrf-token` → server svarer med `{ csrfToken }` og setter en hash-cookie (`__fia.intern.nav.no-x-csrf-token`).
2. Frontend (`fetchNative` i `client/src/api/lydia-api/networkRequests.ts`) henter token, og sender det som `x-csrf-token`-header på POST/PUT/DELETE.
3. `doubleCsrfProtection` middleware på server validerer match mellom header og cookie + binding mot `req.session.id`.

GET-kall trenger ikke CSRF-token (SWR-hooks bruker kun `defaultFetcher`).

## URL-struktur (frackend → backend)

| Frontend kaller | Frackend rewriter til | Bakgrunn |
| --- | --- | --- |
| `/api/iasak/radgiver/...` | `/iasak/radgiver/...` | `pathRewrite` i `proxy.ts` stripper `/api` |
| `/proxy/api/v1/...` | `/api/v1/...` | `/proxy` strippes; `/api/v1` blir værende (ny flyt) |
| `/innloggetAnsatt` | (ikke proxy) | Håndteres direkte av frackend, returnerer brukerinfo |
| `/csrf-token` | (ikke proxy) | CSRF-token-utdeling |
| `/loggut` | (ikke proxy) | Sletter sesjon, redirecter til wonderwall logout |

Bare path-prefikser i `whitelistedPaths` (i `proxy.ts`) tillates videre. Andre returnerer 404.

## Konfigurasjon og hemmeligheter

Alle env-variabler defineres i `server/config.ts` (`miljøVariabler`-objektet). Ingen `process.env.X` direkte i app-koden.

- **Lokalt**: `env.local` i repo-rot lastes av `dotenv` i `server.ts`.
- **Sky**: NAIS-manifest under `.nais/` setter env og mounter hemmeligheter.

## Sesjonshåndtering

- **Lokalt/test**: in-memory store (`inMemorySessionManager`).
- **Sky**: Redis via `connect-redis` (`sessionManager`).

Sesjon brukes til CSRF-binding og caching av OBO-tokens.

## Bygg og deploy

- `client/` bygges med `vite build` → `client/dist/`.
- `server/` kompileres med `tsc -p tsconfig.build.json` → `server/build/`.
- Begge kopieres inn i samme Docker-image (`Dockerfile`). Frackend serverer statisk frontend.
- Deployes til NAIS via GitHub Actions (`.github/workflows/main.yaml`).

## Helsesjekker og metrikker

- `GET /internal/isAlive`, `GET /internal/isReady` – brukes av NAIS, må svare uten auth.
- `GET /internal/metrics` – Prometheus-format via `prometheus-api-metrics` + `prom-client`.

## Logging

Winston-logger (`server/logging.ts`). Hver request får et `requestId` (UUID) som settes på `res.locals.requestId` og videresendes som `x-request-id`-header til `lydia-api` for korrelasjon på tvers.
