---
applyTo: 'client/**'
---
# Client – React frontend

## Teknisk stack
- React 19, TypeScript, Vite
- Komponentbibliotek: `@navikt/ds-react` (NAV Aksel) – bruk eksisterende Aksel-komponenter fremfor å lage egne UI-primitiver
- Data-fetching: `swr` via `useSwrTemplate` fra `src/api/lydia-api/networkRequests.ts`
- Validering og typer: `zod` – definer alltid et zod-skjema og utled TypeScript-typen med `z.infer<typeof ...>`. Definer skjema og type i `src/domenetyper/`. **Importer alltid fra `"zod/v4"`**, ikke `"zod"`.
- Ikoner: `@navikt/aksel-icons`
- Routing: `react-router-dom`

## Kodemønstre

### Domenetyper
Definer typer med zod og `z.infer`:
```ts
export const minTypeSchema = z.object({ ... });
export type MinType = z.infer<typeof minTypeSchema>;
```

### API-hooks (GET) – SWR
Bruk `useSwrTemplate` for alle GET-kall. Signaturen er:
```ts
useSwrTemplate<T>(url: string | null, schema: ZodType<T>, config?: SWRConfiguration)
```

**Grunnleggende bruk:**
```ts
export const useHentNoe = (id: string) =>
    useSwrTemplate<MinType>(`/api/noe/${id}`, minTypeSchema);
```

**Array-respons** – bruk `.array()` på skjemaet:
```ts
export const useHentListe = (id: string) =>
    useSwrTemplate<MinType[]>(`/api/noe/${id}`, minTypeSchema.array());
```

**Betinget fetching** – send `null` som URL for å deaktivere kallet når nødvendige parametere mangler:
```ts
export const useHentNoe = (orgnummer?: string, saksnummer?: string) =>
    useSwrTemplate<MinType[]>(
        saksnummer && orgnummer ? `/api/noe/${orgnummer}/${saksnummer}` : null,
        minTypeSchema.array(),
    );
```

**Overstyr SWR-konfig** – send et konfig-objekt som tredje argument når standard ikke passer (f.eks. for polling-data som skal holdes oppdatert):
```ts
export const useHentNoe = (orgnummer: string, saksnummer: string) =>
    useSwrTemplate<MinType[]>(
        `/api/noe/${orgnummer}/${saksnummer}`,
        minTypeSchema.array(),
        { revalidateOnFocus: true, revalidateOnReconnect: true },
    );
```

Standard SWR-konfig har `revalidateOnFocus: false` og `revalidateOnReconnect: false`.

**Returverdier** – `useSwrTemplate` returnerer `{ data, mutate, error, loading, validating }`. Bruk `mutate` for å tvinge SWR til å hente data på nytt etter en mutasjon:
```tsx
const { data: sak, mutate: oppdaterSak } = useHentSakForVirksomhet(orgnr, saksnummer);

await nyHendelsePåSak(sak, hendelse);
oppdaterSak(); // invaliderer SWR-cachen og henter saken på nytt
```

Der det er viktig å ikke vise feilbanner, bruk fjerde argument `visFeilmelding: boolean` (standard `true`):
```ts
useSwrTemplate<MinType>(url, minTypeSchema, defaultSwrConfiguration, false);
```

### API-kall (POST/PUT/DELETE)
Bruk `post`, `put`, `httpDelete` fra `networkRequests.ts`:
```ts
export const opprettNoe = (body: NoeDto): Promise<MinType> =>
    post("/api/noe", minTypeSchema, body);
```

### API-paths
Alle API-stier er definert som konstanter i `src/api/lydia-api/paths.ts`. Bruk alltid disse konstantene – aldri skriv URL-strenger direkte i hooks eller kall:
```ts
import { iaSakPath } from "./paths";

export const useHentNoe = (orgnummer: string, saksnummer: string) =>
    useSwrTemplate<MinType>(`${iaSakPath}/${orgnummer}/${saksnummer}`, minTypeSchema);
```

### React Context
Kontekster følger et fast mønster: `createContext` → `Provider`-komponent → `useXxxContext`-hook som kaster feil ved manglende provider:
```tsx
const MinContext = React.createContext<MinContextType | null>(null);

export function useMinContext(): MinContextType {
    const context = React.useContext(MinContext);
    if (!context) {
        throw new Error("useMinContext må brukes innenfor en MinContextProvider");
    }
    return context;
}
```
Eksempler: `VirksomhetContext`, `SamarbeidContext`, `SpørreundersøkelseContext`.

### Feilhåndtering
`useSwrTemplate` viser automatisk feilbanner via `dispatchFeilmelding`. For manuell feilvisning (f.eks. etter en POST som feiler):
```ts
import { dispatchFeilmelding } from "../../components/Banner/dispatchFeilmelding";

dispatchFeilmelding({ feilmelding: "Noe gikk galt" });
```
Dette sender en CustomEvent som fanges av det globale `FeilmeldingBanner`-komponentet.

### Filplassering
- Domenetyper: `src/domenetyper/`
- API-kall og hooks: `src/api/lydia-api/`
- Sider: `src/Pages/`
- Gjenbrukbare komponenter: `src/components/`
- Hjelpefunksjoner/utils: `src/util/`

## Styling
Bruk SCSS Modules for komponent-spesifikk styling. Importer som `styles` og bruk `styles.klassenavn`:
```tsx
import styles from "./minKomponent.module.scss";

<div className={styles.container}>
```
Globale stilvariabler og mixins ligger i `src/styling/`.

## Routing
Ruter defineres i `src/App.tsx` med `react-router-dom` `<Routes>`/`<Route>`. Sider henter parametre med `useParams`:
```tsx
const { orgnummer, saksnummer, prosessId } = useParams();
```
Hoved-URL-strukturen er:
- `/prioritering` – søk/prioritering
- `/virksomhet/:orgnummer/sak?/:saksnummer?/samarbeid?/:prosessId?` – virksomhetsside
- `/minesaker` – mine saker
- `/statusoversikt` – statusoversikt

## Testing
- Testrammeverk: Jest + `@testing-library/react`
- Enhetstester: `__tests__/enhetstester/`
- Komponenttester: `__tests__/komponenttester/`
- Kjør tester med `npm test` fra `client/`-mappen
- Bruk norske `describe`/`test`-tekster som beskriver oppførselen

## Analytics
Sporing bruker Umami via `src/util/analytics-klient.ts`. Bruk eksisterende hjelpefunksjoner som `loggSideLastet`, `loggSøkMedFilter` osv. – ikke kall `window.umami` direkte.

## Tilgjengelighet
ESLint er konfigurert med `eslint-plugin-jsx-a11y`. `jest-axe` er tilgjengelig for automatisert a11y-testing i komponenttester.

## Norsk navngiving
Variabelnavn, funksjoner og typer bruker norske navn der domenet er norsk (f.eks. `virksomhet`, `sak`, `hendelse`).
