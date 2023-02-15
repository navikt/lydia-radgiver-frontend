#! /usr/bin/env bash

while getopts 'cih' opt; do
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
      curl -o $DB_DUMP https://raw.githubusercontent.com/navikt/lydia-api/main/scripts/db/lydia_api_container_db_localhost-2023_01_11_13_11_11-dump.sql
      PGPASSWORD=test psql -h localhost -p 5432 -U postgres -f $DB_DUMP > /dev/null
      rm $DB_DUMP
      sleep 1
      docker-compose stop postgres
      ;;

    h)
      echo "Kjører opp utvikler miljøet. Bruk: $(basename $0) [-c] [-i] [-h]"
      echo "  -c rydder opp (kjører ned docker compose med tilhørende volumes)"
      echo "  -i kjører opp postgres, og forsøker å laste inn datadump fra git"
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
sleep 10

# kjør opp frontend
cd client
npm install
npm run dev
