FROM node:16-alpine as base

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

WORKDIR /home/node/app

COPY server server
COPY client client

WORKDIR /home/node/app/server

RUN yarn install

FROM base as production

WORKDIR /home/node/app/client

RUN yarn install

RUN yarn run build

WORKDIR /home/node/app/server

RUN yarn run build

ENTRYPOINT ["yarn", "run", "start"]

FROM base as dev

CMD ["yarn", "run", "dev"]