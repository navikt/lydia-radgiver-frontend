FROM node:16-alpine

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

WORKDIR /home/node/app

COPY ./server/build build
COPY ./client/dist client/dist

# gi node-bruker riktige rettigheter 
RUN chown -R node /home/node/app
USER node

COPY server/package*.json .
RUN npm ci --production

CMD ["node", "build/server.js"]