FROM node:16-alpine as base

WORKDIR /home/node/app/client

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

FROM base as production

RUN yarn run build