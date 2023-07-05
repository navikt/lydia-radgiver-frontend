FROM cgr.dev/chainguard/node:latest

ENV NODE_ENV=production

WORKDIR /app

COPY --chown=node:node ./server/build build
COPY --chown=node:node ./client/dist client/dist
COPY --chown=node:node ./server/package*.json ./

RUN npm ci --production

CMD ["/app/build/server.js"]
