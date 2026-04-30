# Kartlegging: features/-struktur (forslag, ikke implementert)

Dette dokumentet er forarbeidet til fase 6 av opprydningen. Det viser hvordan
eksisterende `api/lydia-api/*` og `domenetyper/*` kan grupperes per feature.
`Pages/` og `components/` beholdes i sin nåværende form — `features/` blir
en additiv mappe for tverrgående feature-logikk.

## Foreslått mapping

### `features/virksomhet/`
- **api**: `api/lydia-api/virksomhet.ts`
- **types**: `domenetyper/virksomhet.ts`, `domenetyper/virksomhetsoversikt.ts`,
  `domenetyper/virksomhetsstatistikkSiste4Kvartaler.ts`,
  `domenetyper/virksomhetsstatistikkSisteKvartal.ts`,
  `domenetyper/historiskstatistikk.ts`, `domenetyper/bransjestatistikk.ts`,
  `domenetyper/sammenligneFylker.test.ts`, `domenetyper/fylkeOgKommune.ts`

### `features/sak/`
- **api**: `api/lydia-api/sak.ts`, `api/lydia-api/nyFlyt.ts`
- **types**: `domenetyper/iaSakProsess.ts`, `domenetyper/iaSakStatus.ts`,
  `domenetyper/sakshistorikk.ts`, `domenetyper/samarbeidsEndring.ts`,
  `domenetyper/salesforceInfo.ts`, `domenetyper/statusoversikt.ts`

### `features/samarbeid/`
- (deler `sak.ts`/`nyFlyt.ts` API – import fra `features/sak`)
- Assosierte komponenter ligger i `Pages/Virksomhet/Samarbeid*` og blir der.

### `features/plan/`
- **api**: `api/lydia-api/plan.ts`, `api/lydia-api/dokumentpublisering.ts`
- **types**: `domenetyper/plan.ts`, `domenetyper/publiseringsinfo.ts`

### `features/leveranse/`
- **api**: `api/lydia-api/leveranse.ts`
- **types**: `domenetyper/leveranse.ts`

### `features/kartlegging/` (Spørreundersøkelse)
- **api**: `api/lydia-api/spørreundersøkelse.ts`
- **types**: `domenetyper/spørreundersøkelse.ts`,
  `domenetyper/spørreundersøkelseMedInnhold.ts`,
  `domenetyper/spørreundersøkelseResultat.ts`

### `features/prioritering/` (Søk og filter)
- **api**: `api/lydia-api/sok.ts`
- **types**: `domenetyper/filterverdier.ts`
- **utils**: `Pages/Prioritering/Filter/søkeparametre*.ts`,
  `Pages/Prioritering/loggSøkMedFilterIAnalytics.ts` kan flyttes hit på sikt.

### `features/bruker/` (Innlogget ansatt + team)
- **api**: `api/lydia-api/bruker.ts`, `api/lydia-api/team.ts`
- **types**: `domenetyper/brukerinformasjon.ts`, `domenetyper/brukeriteam.ts`

### `features/mineSaker/`
- (deler `sak.ts` API – import fra `features/sak`)
- **types**: `domenetyper/mineSaker.ts`

### Felles på rot av features (ikke per feature)
- `api/lydia-api/networkRequests.ts` → `features/_shared/api/networkRequests.ts`
  eller behold i `api/`. Brukes av alle features.
- `api/lydia-api/paths.ts` → samme.
- `domenetyper/domenetyper.ts` → behold i `domenetyper/` til vi vet hva som er felles.
- `domenetyper/kvartal.ts` → felles util, behold i `domenetyper/` eller flytt til `util/`.

## Migreringsstrategi

1. **Codemod**: Flytt filene fysisk og oppdater alle imports samtidig (én commit per
   feature, eller én stor codemod for alle).
2. **Aliases**: Legg til `@features/*` i `tsconfig.json`, `vite.config.mts`, `vitest.config.mts`.
3. **Smell-tester**: `pnpm typecheck && pnpm lint && pnpm test` etter hver feature.
4. **Rekkefølge**: Start med en isolert feature (f.eks. `bruker` eller `leveranse`)
   for å validere mønsteret før vi tar de store (`virksomhet`, `sak`).

## Risiko og avveininger

- **Sirkulære imports**: Hvis to features begge trenger en delt type, må den
  flyttes til `features/_shared/` eller bli eksplisitt re-eksportert.
- **Test-imports**: Tester importerer ofte mange domenetyper. `@/`-alias gjør
  oppdateringen mekanisk, men antall imports er stort (200+).
- **Diff-størrelse**: Anbefales å gjøre én feature av gangen for review-bar PR.

## Anbefalt rekkefølge for migrering

1. `bruker` (lite, lavt antall avhengigheter)
2. `leveranse` (lite)
3. `kartlegging` (medium, godt isolert)
4. `plan` (medium)
5. `prioritering` (medium)
6. `sak` (stort, mange avhengigheter)
7. `virksomhet` (størst)
8. `mineSaker` (sist – avhenger av `sak` og `bruker`)
