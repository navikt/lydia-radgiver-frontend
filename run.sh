#! /usr/bin/env bash

ENV_FILE=env.local
LOCAL_PORT=9876

function install_deps(){
    echo "Installerer avhengigheter"
    cd client
    npm install
    npm run build
    cd ../server
    npm install
    npm run build
    cd ..    
}

function build_local(){
    echo "Bygger prosjektet lokalt"
    docker build -t lydia-radgiver-frontend:latest .
    docker run -p $LOCAL_PORT:8080 --env-file $ENV_FILE -d lydia-radgiver-frontend:latest
    echo "lydia-radgiver-frontend er tilgjengelig på port http://localhost:$LOCAL_PORT/lydia-radgiver"
}

if [ "$1" == "--no-install" ]; then
    build_local
else
    install_deps
    build_local
fi

unset install_deps
unset build_local