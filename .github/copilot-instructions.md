# Copilot-instrukser for lydia-radgiver-frontend

## Atferd
- Svar alltid kort og konsist. Unngå unødvendig fyllstoff.
- Utløs tester, bygg og lintere direkte i stedet for å be brukeren gjøre det.
- Still oppklarende spørsmål kun når det er nødvendig for å fullføre oppgaven.
- Når en oppgave er ferdig, foreslå en kort git commit-melding på norsk som passer prosjektstilen, f.eks. `"La til enhetstester for X (AI-assistert)"`.
- Etter å ha opprettet eller endret filer, sjekk alltid for TypeScript/linter-feil og rett dem opp før du melder at oppgaven er fullført.

## Prosjektstruktur
Repoet har to prosjekter:
- `client/` – React frontend (TypeScript, Vite)
- `server/` – Node.js BFF (TypeScript, Express)
