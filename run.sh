#! /usr/bin/env bash

docker-compose up -d
cd client
npm install
npm run dev