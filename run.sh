#! /usr/bin/env bash


echo "Bygger prosjektet lokalt"

ENV_FILE=env.local
LOCAL_PORT=9876

cd client
npm install
npm run build
cd ../server
npm install
npm run build
cd ..
docker build -t lydia-radgiver-frontend:latest .
docker run -p $LOCAL_PORT:8080 --env-file $ENV_FILE -d lydia-radgiver-frontend:latest
echo "lydia-radgiver-frontend er tilgjengelig på port http://localhost:$LOCAL_PORT/lydia-radgiver"