#! /usr/bin/env bash


echo "Bygger prosjektet lokalt"

PORT=9876

cd client
npm install
npm run build
cd ../server
npm install
npm run build
cd ..
docker build -t lydia-radgiver-frontend:latest .
docker run -p $PORT:8080 -d lydia-radgiver-frontend:latest -d
echo "lydia-radgiver-frontend kjører på port $PORT"