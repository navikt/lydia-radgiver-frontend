lydia-radgiver-frontend
================

Frontend for IA rådgivere

# Komme i gang

## Sette opp utviklingmiljø
1. Installere avhengigheter: Kjør `npm install` i `client` og `server`-mappene
2. Starte frackend: Kjør `npm run dev` i `server`-mappen
3. Starte frontend: Kjør `npm run dev` i `client`-mappen

`npm run dev` gir blant annet hot reloading.

## Kjøre opp lokalt
Dette let deg køyre opp frontend lokalt med alt av avhengigheitene som trengst. 
Dette vert orkestrert av docker-compose. 


### Avhengigheiter som vert køyrd
- backend: lydia-api
- postgres
- kafka
- wonderwall
- mockOAuth2-server


### Før du startar
// PSQL er ein ting du treng
// TODO installere psql

// TODO nevn colima/docker desktop
Vi skal leggje til linja `127.0.0.1 host.docker.internal` i fila `/etc/hosts` i rota av datamaskina di.
Da vil nettlesaren automatisk fange opp wonderwall og mock-oauth2-server, som da vil resolve det til localhost.

Dette kan du til dømes gjere ved å skrive `sudo vi /etc/hosts` i terminalen og så 
leggje til `127.0.0.1 host.docker.internal` nedst på ei ega linje.
Sørg for at du har skrudd på administrator-rettar for brukaren din (privileges.app på mac).



### Køyr server og frontend med avhengigheter:  
`./run.sh` i rotmappa

Besøk deretter http://localhost:2222 i din favorittbrowser
Skjemaet som dukker opp her gjev deg høve til å endre kva rettar testbrukaren din har. I dei fleste tilfelle kan du skrive inn noko tilfeldig tekst og trykke "SIGN-IN".

### Rydd opp etter deg når du er ferdig med testinga:
`docker-compose down`

Om du ikkje gjer dette risikerer du trøbbel neste gong. Det betyr også: om ting ikkje funker neste gong - start med `docker-compose down` i alle repo ;)

## Storybook
For å raskt kunne teste at ein komponent ser ut som den skal har vi laga stories i Storybook. 
Dette gjer det mogleg å sjå komponenten i ein nøytral eller bestemt kontekst.

For å køyre opp dette gjer du  
`npm run storybook` i `./client/`

Då kan du nå Storybook i ein nettlesar på adressa [localhost:6006](http://localhost:6006).


## Deploy til NAIS  
// TODO skriv noko om 'frackend' og deploy til NAIS


## E2E-testing
Vi bruker Cypress til ende-til-ende-testing (e2e-testing). 

For å køyre desse gjer du 
// TODO korleis køyre opp cypress-testar
`[kommando]` i `[mappe]` 


---

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen [#team-pia-utvikling](https://nav-it.slack.com/archives/C02T6RG9AE4).
