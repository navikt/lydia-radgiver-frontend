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

---

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen [#team-pia-utvikling](https://nav-it.slack.com/archives/C02T6RG9AE4).
