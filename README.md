lydia-radgiver-frontend
================

Frontend for IA rådgivere

# Komme i gang

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
Sjekk om du har postgresql-klient ved å køyre
`psql --version`

Installer ein postgresql-klient, for eksempel ved å gjere  
`brew install libpq`  
Legg så til psql i PATH. Du vil få instruksjonar på dette frå brew, og det ser litt sånn ut:  
> If you need to have libpq first in your PATH, run:  
> echo 'export PATH="/usr/local/opt/libpq/bin:$PATH"' >> ~/.zshrc

Sjekk at du har colima `colima version`  
Om du ikkje har colima, køyr `brew install colima`

Sjekk at du har docker `docker -v`  
Om du ikkje har docker, køyr `brew install docker`


Vi skal leggje til linja `127.0.0.1 host.docker.internal` i fila `/etc/hosts` i rota av datamaskina di.
Da vil nettlesaren automatisk fange opp wonderwall og mock-oauth2-server, som da vil resolve det til localhost.

Dette kan du til dømes gjere ved å skrive `sudo vi /etc/hosts` i terminalen og så 
leggje til `127.0.0.1 host.docker.internal` nedst på ei ega linje.
Sørg for at du har skrudd på administrator-rettar for brukaren din (privileges.app på mac).



### Køyr server og frontend med avhengigheter:  
Pass på at du har ein køyrande docker-instans. 
For Colima gjer du dette ved å køyre `colima status` og eventuelt `colima start`

Om du bruker Colima treng du også å køyre denne for å få ting til å fungere. Hugs å gjer brukaren din admin-rettar først.  
`sudo rm -rf /var/run/docker.sock && sudo ln -s /Users/$(whoami)/.colima/docker.sock /var/run/docker.sock
`

Når du har docker på plass kan du køyre   
`./run.sh -cif` i rotmappa. Dette startar server og frontend med sine avhengigheiter.

Besøk deretter http://localhost:2222 i din favorittbrowser.  
Skjemaet som dukker opp her gjev deg høve til å endre kva rettar testbrukaren din har. I dei fleste tilfelle kan du skrive inn noko tilfeldig tekst og trykke "SIGN-IN".

### Rydd opp etter deg når du er ferdig med testinga:
`docker-compose down -v`
(-v sletter volumes)

Om du ikkje gjer dette risikerer du trøbbel neste gong. Det betyr også: om ting ikkje funker neste gong - start med `docker-compose down` i alle repo ;)

#### Tving nedlastning og bygging av nye images

For å tvinge nedlastning av nye images (feks hvis det har kommet ett nytt backend image siden sist kjøring) kan man kjøre:

`docker-compose down && docker-compose build --pull`

Nokre gonger vil ikkje lydia-api-imaget oppdatere seg. Dette kan du sjekke ved å gjere `docker images` og sjekke opprettingsdatoen for ghcr.io/navikt/lydia-api. For å slette imaget gjer du `docker rmi <IMAGE ID>`. IMAGE ID finn du i tabellen frå `docker images`.


## Storybook
For å raskt kunne teste at ein komponent ser ut som den skal har vi laga stories i Storybook. 
Dette gjer det mogleg å sjå komponenten i ein nøytral eller bestemt kontekst.

For å køyre opp dette gjer du  
`npm run storybook` i `./client/`

Då kan du nå Storybook i ein nettlesar på adressa [localhost:6006](http://localhost:6006).


## Deploy til NAIS  
// TODO skriv noko om 'frackend' og deploy til NAIS  

## Koble til postgresql lokalt via docker-compose oppsett

Sjekk https://github.com/navikt/lydia-api#koble-til-postgresql-lokalt-via-docker-compose-oppsett

---

## Ymse feilsøking
### Applikasjonen køyrer fint, men etter innlogging får du beskjed om å logge inn på nytt
Dato: 2023-03-23  
Utviklar: Ingrid  
Case:
Frontend og backend køyrer fint. Frontend får opp oAuth. Backend responderer på [localhost:8080/internal/isAlive](http://localhost:8080/internal/isalive). Etter innlogging får du feilmeldingsside med beskjed om "trykk her for å logge inn på nytt".

<details>
<summary>
Feilsøking
</summary>
Sjekk docker logs på frackend
`docker ps`
Kopier CONTAINER ID for lydia-radgiver-frontend-frackend 
`docker logs [CONTAINER ID HERE]`
Sjekk om du får feilmeldingar her.

Fordi ein kan (og i tilfelle docker-imaget for frackend er gamalt)
`docker images`, hent ut id for lydia-radgiver-frontend-frackend
`docker rmi [CONTAINER ID HERE]`
Gjer `/run.sh` på nytt

Etter dette fungerte ting på magisk vis 2023-03-23.

<br>

Andre ting vi prøvde som kanskje/kanskje ikkje hjalp
- installere dependencies i /server
- køyre `npm run dev` i /server (etter at docker-containarar var stoppa) for å sjå feilmeldinger litt betre
- docker logs

</details>


###  `[vite] http proxy error at /innloggetAnsatt` + feilmelding om allokert port
Dato: 2023-06-19  
Utviklar: Ingrid og Thomas  
Case:  
Får til å køyre opp frontend med /run.sh, men etter innlogging i OAuth får vi feilmelding i frontend og i terminalen.

Frontend:
> Noe gikk feil ved innlasting av siden.  
> Du kan prøve å logge inn på nytt ved å trykke på denne lenken.

Terminal:
```bash
10:22:57 AM [vite] http proxy error at /innloggetAnsatt:
Error: connect ECONNREFUSED ::1:3000
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1494:16)
```

Ved ./run.sh fekk Thomas ein ei feilmelding om at ein port allereie var allokkert. Dette er truleg rota til problemet.

<details>
<summary>
Feilsøking
</summary>

- Ta ned alle containarar og volumes: `docker-compose down --remove-orphans -v`  
- Fjern dockar-containarar. Ingrid fjerna lydia-api + lydia-radgiver-frontend-frackend,  Thomas fjerna alle. Å fjerne alle tek litt lengre tid å køyre opp, men då funka localhost:2222 med ein gong etterpå, hos Ingrid funka ting etter at ho hadde hatt lunsj.  
- `./run.sh -i` (eller `./run.sh -cfi` om du vil gjere dei to stega over ein ekstra gong)  
- 🎉🎉🎉  

</details>



### `[vite] http proxy error at /innloggetAnsatt` (aka "den gongen vi ikkje googla feilmeldinga")
Dato: 2023-06-20  
Utviklar: Ingrid, (Christian og Per-Christian er med på feilsøking)  

Case:  
Får til å køyre opp frontend med /run.sh, men etter innlogging i OAuth får vi feilmelding i frontend og i terminalen.

Frontend:  
> Noe gikk feil ved innlasting av siden.   
> Du kan prøve å logge inn på nytt ved å trykke på denne lenken.

Terminal:  
```bash
10:22:57 AM [vite] http proxy error at /innloggetAnsatt:
Error: connect ECONNREFUSED ::1:3000
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1494:16)
```

Får ikkje feilmeldingar ved køyring av ./run.sh før vi kallar ting frå frontend.

<details>
<summary>
Feilsøking
</summary>

Vi prøvde mykje greier som vi skildrar lengre nede, men fann til slutt problemet ved å google feilmeldinga frå terminalen.  
Dette er artiklane vi fann som forklarte problemet vårt:  
- https://github.com/lima-vm/lima/issues/1330  
- https://github.com/nodejs/node/issues/40702  

#### Feilen, kort oppsummert:  
Frå Node v17 vert ikkje IP-adresser lengre sortert med IPv4 fyrst. Dette gjer at datamaskina ikkje nødvendigvis finn localhost 127.0.0.1 (IPv4) før localhost ::1 (IPv6). Lima, som Colima er bygga på, støttar ikkje IPv6 enno. Det betyr:   
Når Colima får ::1 som localhost klikkar ting.

#### Løysing:
Hardkode `127.0.0.1` som localhost-adresse i `vite.config.ts` i staden for å berre skrive `localhost`.



Vi legg med ei oppsummering av ting vi prøvde før vi googla som ikkje fungerte, som ei påminning om å spørje internett før du tenker sjølv i fire timar.

#### Feilsøking som ikkje funka

- Ta ned alle containarar og volumes: `docker-compose down --remove-orphans -v`  
- Køyr opp med `docker-compose up` i root og `npm run dev` i /client for meir gjennomsiktig logging.
- Får feilmeldingar om "proxy error at /innloggetAnsatt". At noko skjer på :3000 tyder på at vi ikkje når frackend.
- (Ein gong rundt her lurer Per-Christian på om IPv6 kan vere problemet, vi burde fylgd dette sporet allereie no.)
- Sjekkar logs på frackend-container: `docker logs [container id]`. Dei er normale (typ 10-ish linjer)
- Sjekkar logs på lydia-api, får masse vanleg ræl. 
- Sjekkar isalive på dei ulike portane: http://localhost:3000/internal/isalive (frackend), http://localhost:8080/internal/isalive (backend)

No veit vi:  
- wonderwall er oppe (fordi vi får innloggingsprompt og svar på 2222)
- frontend er oppe (fordi vi kan sjå feilmelding i nettlesaren)
- frackend er oppe (isalive 3000)
- backend er oppe (isalive 8080)  

Meir feilsøking:  
- inspiserar request i Networks i devtools i nettlesar. Får "500 internal server error" på /innloggetAnsatt.
- Køyrar `./run.sh -cif`. Får `psql:/tmp/db_script.sql:4606: ERROR:  role "cloudsqliamuser" does not exist` i tillegg til den vanlege `role "testuser" does not exist`. Framleis feil i innlogging. Vi trur vi får denne fordi vi sletta volumes i -c-steget i run.sh

Vi byrjar å bli svoltne, så då prøver vi drastiske ting.   
- Fjerne alle "dangeling" images: `dc down`, så `docker image prune`. [Info om kva image prune gjer.](https://docs.docker.com/engine/reference/commandline/image_prune/) Dette fjerna tydelegvis 3-ish greier, mellom anna containaren "none". 
- Fjernar resten av images: `dc down`, så `docker image prune -a`. Fjernar dangling images + alle utan minst ein container knytt til seg. Output: `Total reclaimed space: 5.966GB`.
- `docker images` for å sjå om alt er borte. 
- `./run.sh` på nytt medan vi et lunsj. Dette hjalp heller ikkje. Kult. Vi har sånn 7 docker-images no.
-Vi prøver `docker-network prune`. `docker network ls`  listar nettverk. Vi hadde 3 stk. Etter `docker network prune` har vi framleis 3 stk. 
- Vi stoppar Alt: `docker-compose down`, så `docker system prune -a`. Dette fjernar images, alle stoppa containarar, networks og volumes. `Total reclaimed space: 7.259GB`. Kult.
- Vi restartar terminalen, i tilfelle det hjelp på noko. `docker-compose down` fyrst.
- Googlar feilmelding: https://github.com/nodejs/node/issues/40702. Finn ut kva problemet var. Tek ein oppgitt pause.
- Bytta ut localhost i vite.config.ts med 127.0.0.1. Då funka ting etter restart av run.sh.
- 🎉🎉🎉

#### Læringspunkt:
- Å google ting burde ikkje vere steg 16, men kanskje sånn mellom 1 og 3 ein stad.
- Lytt til Erfarne Fjellfolk når dei nevnar IPv6.
- Om ei adresse ser litt rar ut – søk den opp med ein gong. ::1:3000 var jo litt rart, og ville nok leidd oss på rett veg.
- Når feilmeldinga i terminal seier noko om TCP har kanskje feilen noko med nettverk å gjere.
- Det er fint å notere feilsøkingssteg, då har vi betre oversikt over kva vi har gjort.
- Guide frå tidlegare buggar var nyttig i å finne ein stad å starte feilsøkinga, sjølv om vi ikkje burde starta der.

</details>


---

### Ukjent feil: Fetch not defined
Dato: 2023-06-20  
Utvikler: Per-Christian  
Case: får feilmelding `Ukjent feil: Fetch not defined`

<details>
<summary>
Oppdater til node 18
</summary>
Om du ikke har nvm sjekk ut [denne linken](https://medium.com/devops-techable/how-to-install-nvm-node-version-manager-on-macos-with-homebrew-1bc10626181) først.

```bash
nvm install 18 --latest-npm
nvm alias default 18
nvm use 18

#evt:
nvm install 18 --default --latest-npm
nvm use 18

#sjekk med:
node -v
```
Kjør npm install på nytt i både server og client
```bash
cd client
npm install
cd ../server
npm install
```
Stop docker images og slett frackend imaget
```bash
docker-compose down
docker images | grep frackend
docker rmi [image id]
run.sh -cfi
```
* Profit!

</details>


---

### Error occurred while trying to proxy: 127.0.0.1:3000/sykefraversstatistikk/antallTreff?

Dato: 2023-08-07
Utviklar: Ingrid

Case:
Får timeout på api-kall og beskjed om feil i tilkopling til proxy. 
Det er fyrste dag etter sommarferien, backend hadde 44 commits, frontend 4, sidan sist eg pulla.

<details>
<summary> Feilsøking </summary>@

#### Problemet  
Det er sannsynlegvis lenge sidan sist nokon prøvde å køyre opp Fia lokalt frå frontend, så eg mistenker feilen handlar om ei endring i backend som frontend ikkje har fått med seg.


- får ikkje tak i filterverdiar fordi timeout(504): GET
  http://localhost:2222/api/sykefraversstatistikk/filterverdier  
- også timeout på http://localhost:2222/api/sykefraversstatistikk/publiseringsinfo  
- Har også (forhåpentlegvis ikkje relaterte) feilmeldingar om at sida ikkje liker å skulle vise feilmelding-banner samstundes som den skal vise "ny statistikk publiseres"-banner  
- Andre timeouts: GET
  http://localhost:2222/api/sykefraversstatistikk og GET
  http://localhost:2222/api/sykefraversstatistikk/antallTreff, sistnemnde får feilmeldingbanneret.  

#### Feilsøking
- ./run.sh -cfi
- Sletta images som er relaterte  
- Dobbeltsjekka at vi bruker same $DB_DUMP i backend og frontend
- Sjekka for feilmeldingar etter ./run.sh  
- Køyrer `pus` i terminal (`docker ps`), ser at lydia-api står som "restarting". Det pleier sjeldan vere bra.
- (Har også "ReferenceError: utilsService is not defined" i frontend-konsollen)
- Er på naisdevice, har oppdatert brew, har pulla nyaste frontend (og backend)

- Køyrer opp med `dc up` og `npm run dev` i client. Får då feilmelding i terminal for docker: `lydia-radgiver-frontend-frackend-1    | [HPM] Error occurred while proxying request 127.0.0.1:3000/sykefraversstatistikk/publiseringsinfo to http://backend:8080/ [ENOTFOUND] (https://nodejs.org/api/errors.html#errors_common_system_errors)
  `
- Så kom det (kanskje?) gull:
```
lydia-radgiver-frontend-backend-1 exited with code 1
lydia-radgiver-frontend-backend-1     | Picked up JAVA_TOOL_OPTIONS: -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005
lydia-radgiver-frontend-backend-1     | Listening for transport dt_socket at address: 5005
lydia-radgiver-frontend-backend-1     | Exception in thread "main" 
lydia-radgiver-frontend-backend-1     | java.lang.RuntimeException: Missing required variable STATISTIKK_METADATA_VIRKSOMHET_TOPIC
lydia-radgiver-frontend-backend-1     | 	at no.nav.lydia.NaisEnvironmentKt.getEnvVar(NaisEnvironment.kt:155)
lydia-radgiver-frontend-backend-1     | 	at no.nav.lydia.NaisEnvironmentKt.getEnvVar$default(NaisEnvironment.kt:154)
lydia-radgiver-frontend-backend-1     | 	at no.nav.lydia.Kafka.<init>(NaisEnvironment.kt:83)
lydia-radgiver-frontend-backend-1     | 	at no.nav.lydia.NaisEnvironment.<init>(NaisEnvironment.kt:14)
lydia-radgiver-frontend-backend-1     | 	at no.nav.lydia.AppKt.startLydiaBackend(App.kt:69)
lydia-radgiver-frontend-backend-1     | 	at no.nav.lydia.AppKt.main(App.kt:65)
lydia-radgiver-frontend-backend-1     | 	at no.nav.lydia.AppKt.main(App.kt)
lydia-radgiver-frontend-backend-1 exited with code 1
```

Legg til `STATISTIKK_METADATA_VIRKSOMHET_TOPIC` i `docker-compose.yaml`, hentar verdiar frå backend. Køyrer opp på nytt med `./run.sh -cfi`

Denne gongen får eg feilmelding om `STATISTIKK_SEKTOR_TOPIC` etter å ha venta litt. Eg trur eg ser mønsteret.

</details>

Løysing:
Leggje inn alle manglande kafka-topics i `docker-compose.yaml`. Hentar verdiar frå `nais.yaml` i backend (lydia-api). 

Lærdom:
- Framleis fint å køyre opp ting med `dc up` + `npm run dev`, då får ein betre feilmeldingar.
- Det er lurt å la ting køyre ein stund etter at du har framprovosert feilen, i tilfelle terminalen spyttar ut fleire feilmeldingar etter kvart. Det gjorde den i dag. Det viste seg at om ein venta nokre minutt spytta den ut alle manglande topics.  

---

### Klarer ikke å laste ned backend fra ghcr.io
Fikk authentication feil ven nedlasting... Kjørte ```docker logout ghcr.io``` og ble glad igjen.
Litt usikker på hva som skjedde.


# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen [#team-pia-utvikling](https://nav-it.slack.com/archives/C02T6RG9AE4).
