# Kodemønstre

Tverrgående mønstre for `lydia-radgiver-frontend`. Klient-spesifikke mønstre (SWR-hooks, Zod-domenetyper, API-paths) er beskrevet i [`client.instructions.md`](../.github/instructions/client.instructions.md). Server-spesifikke i [`server.instructions.md`](../.github/instructions/server.instructions.md).

## Norsk navngiving

Bruk norske navn for domeneting i kode: `virksomhet`, `sak`, `samarbeid`, `hendelse`, `bruker`, `prosess`, `kartlegging`, `leveranse`. Engelsk er greit for tekniske begreper (`config`, `middleware`, `fetcher`, `provider`, `dispatch`).

Filnavn bruker camelCase eller PascalCase (komponenter): `iaSakProsess.ts`, `VirksomhetsVisning.tsx`. Funksjons- og variabelnavn camelCase: `useHentSak`, `oppdaterSak`.

Test-tekster på norsk:

```ts
describe("filtervisning-reducer", () => {
    test("setter valgt kommune når kommune-action dispatches", () => { ... });
});
```

## React Context

Alle kontekster i `client/src/` følger samme mønster:

```tsx
const MinContext = React.createContext<MinContextType | null>(null);

export function MinContextProvider({ children, ...props }: Props) {
    return <MinContext.Provider value={...}>{children}</MinContext.Provider>;
}

export function useMinContext(): MinContextType {
    const context = React.useContext(MinContext);
    if (!context) {
        throw new Error("useMinContext må brukes innenfor en MinContextProvider");
    }
    return context;
}
```

**Hvorfor**: Hooken kaster eksplisitt feil hvis den brukes utenfor provider, så vi unngår `undefined`-sjekker overalt og får tydelig feilmelding i stedet for kryptisk crash.

Eksempler i koden: `VirksomhetContext`, `SamarbeidContext`, `SpørreundersøkelseContext`.

## Feilhåndtering (klient)

`useSwrTemplate` viser automatisk feilbanner via `dispatchFeilmelding` ved fetch- eller parse-feil. For manuell feilvisning (typisk etter en POST som feiler):

```ts
import { dispatchFeilmelding } from "../../components/Banner/dispatchFeilmelding";

dispatchFeilmelding({ feilmelding: "Kunne ikke opprette sak" });
```

Dette sender en `CustomEvent` som det globale `FeilmeldingBanner`-komponentet (mountet i `App.tsx`) fanger opp.

For å skru av automatisk feilbanner i et SWR-kall (f.eks. fordi en 404 er forventet), send `false` som fjerde argument:

```ts
useSwrTemplate(url, schema, defaultSwrConfiguration, false);
```

## Feilhåndtering (server)

Kast `AuthError` fra `server/error.ts` ved auth-feil. Express error-handler i bunnen av `app.ts` mapper:

- `AuthError` → HTTP 401
- Alt annet → HTTP 500 + winston error-log

Ikke kast egne `Error`-subklasser uten å oppdatere error-handleren.

## Validering med Zod

**Importer alltid fra `"zod/v4"`**, ikke `"zod"`. Definer skjema og utled type:

```ts
import { z } from "zod/v4";

export const minTypeSchema = z.object({
    id: z.string(),
    navn: z.string(),
});
export type MinType = z.infer<typeof minTypeSchema>;
```

`useSwrTemplate` parser respons mot skjema automatisk, og logger ZodError til konsollen ved mismatch (se `client/src/api/lydia-api/networkRequests.ts`).

## Analytics

Bruk hjelpefunksjoner i `client/src/util/analytics-klient.ts` (`loggSideLastet`, `loggSøkMedFilter`, ...). **Aldri kall `window.umami` direkte** – det gir oss ett sted å bytte ut leverandør og enklere mocking i tester.

## SCSS Modules

Komponent-spesifikk styling i `*.module.scss` ved siden av komponenten. Importer som `styles`:

```tsx
import styles from "./minKomponent.module.scss";

<div className={styles.container}>
```

Globale variabler/mixins ligger i `client/src/styling/`. Aksel-tokens (avstand, farge, typografi) brukes via CSS-variabler – ikke definer egne fargevariabler.

## Aksel-komponenter fremfor egne

Bruk eksisterende komponenter fra `@navikt/ds-react` fremfor å bygge UI-primitiver selv. Sjekk Aksel-dokumentasjonen først. Ikoner fra `@navikt/aksel-icons`.

## Tilgjengelighet

- ESLint kjører `eslint-plugin-jsx-a11y` (i dag warning-nivå, planlagt error).
- `vitest-axe` er tilgjengelig for komponenttester.

```ts
import { axe } from "vitest-axe";
expect.extend(toHaveNoViolations);

test("har ingen a11y-brudd", async () => {
    const { container } = render(<Komponent />);
    expect(await axe(container)).toHaveNoViolations();
});
```

## Test-kjøring

```sh
cd client && pnpm test       # Vitest + Testing Library
cd server && pnpm test       # Jest + supertest + nock
```

## Verifisering før commit

Kjør i prosjektet du har endret:

```sh
pnpm lint
pnpm tsc --noEmit            # eller pnpm tsc når skriptet er på plass
pnpm test
```

Pre-commit-hooken kjører `pnpm run build && pnpm run test` i client/ i dag (planlagt erstattet med lint-staged + typecheck). Hopp ikke over hooks.
