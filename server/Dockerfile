FROM node:16-alpine as base

ARG IS_PRODUCTION

WORKDIR /home/node/app/server

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

FROM base as production

RUN yarn run build