#! /usr/bin/env bash

while getopts 'cifh' opt; do
  case "$opt" in
    c)
      echo "Rydder opp..."
      docker-compose down -v
      ;;

    i)
      echo "Initialiserer database..."
      docker-compose up postgres -d
      sleep 3
      DB_DUMP=/tmp/db_script.sql
      curl -o $DB_DUMP https://raw.githubusercontent.com/navikt/lydia-api/main/scripts/db/lydia_api_container_db_localhost-2023_09_01_13_03_33-dump.sql
      PGPASSWORD=test psql -h localhost -p 5432 -U postgres -f $DB_DUMP > /dev/null
      rm $DB_DUMP
      sleep 1
      docker-compose stop postgres
      ;;

    f)
      docker-compose down
      docker rmi $(docker images | grep -E "lydia-api" | cut -w -f3)
      ;;

    h)
      echo "Kjører opp utvikler miljøet. Bruk: $(basename $0) [-c] [-i] [-h] [-f]"
      echo "  -c rydder opp (kjører ned docker compose med tilhørende volumes)"
      echo "  -i kjører opp postgres, og forsøker å laste inn datadump fra git"
      echo "  -f fjerner gammelt backend image"
      echo "  -h denne hjelpeteksten"
      exit 0
      ;;

    ?)
      echo -e "Ugyldig argument. Bruk: $(basename $0) [-c] [-i] [-h]"
      exit 1
      ;;
  esac
done
shift "$(($OPTIND -1))"

# stop evt kjørende tjenester
docker-compose stop

# kjør opp tjenester (dette migrerer databasen til nyeste versjon)
docker-compose up -d
sleep 5

# kjør opp frontend
cd client
npm install
npm run dev
