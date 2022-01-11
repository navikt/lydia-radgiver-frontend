FROM node:16-alpine as base

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

WORKDIR /home/node/app

COPY client client

WORKDIR /home/node/app/client

RUN yarn install

FROM base as production

RUN yarn run build

FROM base as dev

CMD ["yarn", "run", "dev"]