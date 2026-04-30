# Server (Frackend / BFF)

Backend-for-frontend som proxier kall fra `client/` til `lydia-api`.
Håndterer Azure AD on-behalf-of, sesjonscookies, CSRF-tokens og logging.

## Oppstart

```sh
pnpm install
pnpm dev      # Nodemon på src/server.ts
pnpm test     # Jest
pnpm lint     # ESLint flat config
pnpm typecheck
pnpm build    # tsc → build/
pnpm start    # node build/server.js
```

## Struktur

```
server/
  src/
    server.ts         # Entry – binder app, port og logging
    app.ts            # Express-oppsett (middleware, routes)
    config.ts         # Miljøvariabler og runtime-konfig
    proxy.ts          # http-proxy-middleware mot lydia-api
    onBehalfOf.ts     # Azure AD OBO-token-veksling
    brukerinfo.ts     # /innloggetAnsatt-endepunkt
    jwks.ts           # JWKS-henting for token-validering
    SessionStore.ts   # Redis session store
    crypto.ts         # AES-GCM krypto for cookies
    error.ts          # Express error-handler
    logging.ts        # Pino-basert structured logging
    metrikker.ts      # Prometheus metrics
    types/            # Globale type-augmentations (express-session)
    *.test.ts         # Tester ligger ved siden av kilden
```

## Mønstre

- **Auth**: ID-token i `__Host-loginstatus`-cookie. OBO-tokens caches per `oid` + `audience`.
- **CSRF**: Double-submit cookie. `/csrf-token` endepunkt returnerer token.
- **Logging**: Bruk `logger` fra `logging.ts` – aldri `console.log`. Inkluder structured fields (`{ ressurs, sak }`).
- **Tester**: Jest med babel-transform. Bruk `nock` for HTTP-mocks. Tester ligger som `*.test.ts` ved siden av kilden.

## Deploy

Bygg og deploy via `.github/workflows/main.yaml`. Docker-image bygges fra `Dockerfile` på rot,
som kopierer `server/build/` og `client/dist/` inn i en slank node-image.

Se [`docs/arkitektur.md`](../docs/arkitektur.md) for full request-flyt.
