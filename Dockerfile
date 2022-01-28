FROM node:16-alpine as base

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

WORKDIR /home/node/app

COPY ./server/build build
COPY ./client/dist dist

CMD ["yarn", "run", "start"]