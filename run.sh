#! /usr/bin/env bash

docker-compose up -d
DB_DUMP=/tmp/db_script.sql
curl -o $DB_DUMP https://raw.githubusercontent.com/navikt/lydia-api/main/scripts/db/lydia_api_container_db_localhost-2022_12_05_10_57_42-dump.sql
sleep 3
PGPASSWORD=test psql -h localhost -p 5432 -U postgres -f $DB_DUMP > /dev/null
rm $DB_DUMP
cd client
npm install
npm run dev
