#! /usr/bin/env bash

while getopts 'hif' opt; do
  case "$opt" in
    h)
      echo "Kjører opp utvikler miljøet. Bruk: $(basename $0) [-h] [-i] [-f]"
      echo "  -h denne hjelpeteksten"
      echo "  -i sletter volumes, kjører opp postgres, og laster inn datadump fra git"
      echo "  -f fjerner gammelt backend og frackend image"
      exit 0
      ;;

    i)
      echo "Sletter volumes ..."
      docker-compose down -v
      echo "Initialiserer database..."
      docker-compose up postgres -d
      sleep 3
      DB_DUMP=/tmp/db_script.sql
      curl -o $DB_DUMP https://raw.githubusercontent.com/navikt/lydia-api/main/scripts/db/lydia-api-container-db_localhost-2024_11_13_12_42_52-dump.sql
      PGPASSWORD=test psql -h localhost -p 5432 -U postgres -f $DB_DUMP > /dev/null
      rm $DB_DUMP
      sleep 1
      docker-compose stop postgres
      ;;

    f)
      docker-compose down
      docker-compose pull authserver azure postgres redis kafka wonderwall
      echo "Sletter gammelt backend og frackend image"
      docker rmi $(docker images | grep -E "lydia-api|lydia-radgiver-frontend" | cut -w -f3)
      ;;

    ?)
      echo -e "Ugyldig argument. Bruk: $(basename $0) [-h] [-i] [-f]"
      exit 1
      ;;
  esac
done
shift "$(($OPTIND -1))"

# stop evt kjørende tjenester
docker-compose stop

# kjør opp tjenester (dette migrerer databasen til nyeste versjon)
docker-compose up -d

if [ $? -eq 0 ]
then
  sleep 5

  # kjør opp frontend
  cd client
  npm install
  npm run dev
fi
