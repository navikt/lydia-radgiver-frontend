#! /usr/bin/env bash

while getopts 'cih' opt; do
  case "$opt" in
    c)
      echo "\nRydder opp...\n"
      docker-compose down -v
      ;;

    i)
      echo "\nInitialiserer database...\n"
      docker-compose up postgres -d
      sleep 3
      DB_DUMP=/tmp/db_script.sql
      curl -o $DB_DUMP https://raw.githubusercontent.com/navikt/lydia-api/main/scripts/db/lydia_api_container_db_localhost-2023_01_11_13_11_11-dump.sql
      PGPASSWORD=test psql -h localhost -p 5432 -U postgres -f $DB_DUMP > /dev/null
      rm $DB_DUMP
      sleep 1
      echo "\nFerdi\n"
      ;;

    h)
      echo "Kjører opp utvikler miljøet. Bruk: $(basename $0) [-c] [-i] [-h]\n"
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

# kjør opp tjenester (dette migrerer databasen til nyeste versjon)
docker-compose up -d

# kjør opp frontend
cd client
npm install
npm run dev
