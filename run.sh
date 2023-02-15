#! /usr/bin/env bash

while getopts 'cih' opt; do
  case "$opt" in
    c)
      echo "Rydder opp først"
      docker-compose down -v
      ;;

    i)
      echo "Initialiserer database"
      docker-compose up postgres -d
      sleep 3
      DB_DUMP=/tmp/db_script.sql
      curl -o $DB_DUMP https://raw.githubusercontent.com/navikt/lydia-api/main/scripts/db/lydia_api_container_db_localhost-2023_01_11_13_11_11-dump.sql
      PGPASSWORD=test psql -h localhost -p 5432 -U postgres -f $DB_DUMP > /dev/null
      rm $DB_DUMP
      sleep 1
      ;;

    h)
      echo "TODO"
      exit 0
      ;;

    ?)
      echo -e "Invalid command option.\nUsage: $(basename $0) [-a] [-b] [-c arg]"
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
