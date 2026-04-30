# AGENTS.md

Inngangspunkt for KI-agenter (GitHub Copilot, Claude, Cursor o.l.) som jobber i `lydia-radgiver-frontend`.

## Hva er dette repoet?

Frontend for IA-rådgivere i NAV. Monorepo med to pnpm-prosjekter:

- **`client/`** – React 19 + TypeScript + Vite. SPA som bruker NAV Aksel-komponenter, SWR for data og Zod for validering. Se [`.github/instructions/client.instructions.md`](.github/instructions/client.instructions.md).
- **`server/`** – Node.js + Express BFF (kalt "frackend"). Sitter mellom nettleser og `lydia-api`, håndterer auth (Azure AD via wonderwall), CSRF og on-behalf-of-tokens. Se [`.github/instructions/server.instructions.md`](.github/instructions/server.instructions.md).

Backend (`lydia-api`) ligger i et eget repo og kjøres som Docker-image lokalt.

## Pakkehåndtering

**Bruk alltid `pnpm`.** Aldri `npm` eller `yarn`. Kjør kommandoer i riktig prosjektmappe (`cd client` eller `cd server`).

## Felles regler

- **Kort og konsis kommunikasjon på norsk** (bokmål er greit). Variabel- og funksjonsnavn på norsk der domenet er norsk: `virksomhet`, `sak`, `hendelse`, `samarbeid`.
- **Les faktiske typedefinisjoner** før du lager mock-data eller objekter. Aldri anta typer.
- **Verifiser alltid endringer**: kjør `pnpm tsc` og `pnpm lint` i prosjektet du har endret. Ikke meld oppgaven ferdig før alt kompilerer uten feil.
- **Test-kjøring**: `pnpm test` i `client/` eller `server/`.
- **Utløs verktøyene direkte** – ikke be brukeren kjøre dem.
- **Commit-meldinger på norsk**, marker AI-assisterte endringer: `"La til X (AI-assistert)"`.

## Hvor finner jeg ...?

| Tema | Sted |
| --- | --- |
| Klient-spesifikke regler og mønstre | `.github/instructions/client.instructions.md` |
| Server-spesifikke regler og mønstre | `.github/instructions/server.instructions.md` |
| Arkitektur og dataflyt | `docs/arkitektur.md` |
| Tverrgående kodemønstre (context, feilhåndtering, navngiving) | `docs/kodemonstre.md` |
| Lokal oppstart, feilsøking | `README.md` |

## Typiske oppgaver

| Oppgave | Følg oppskrift i |
| --- | --- |
| Legge til ny side, SWR-hook, POST-mutasjon, domenetype, test | `.github/instructions/client.instructions.md` (seksjonen "Oppskrifter") |
| Endre proxy-whitelist, legge til nytt API-prefiks | `.github/instructions/server.instructions.md` |
| Forstå auth/CSRF-flyten | `docs/arkitektur.md` |

## Kjør lokalt

```sh
./run.sh -if          # første gang eller etter dependencies-endring
./run.sh              # vanlig oppstart
```

Detaljer og feilsøking i [`README.md`](README.md).
