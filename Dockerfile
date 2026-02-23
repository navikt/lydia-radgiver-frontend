FROM node:22-alpine AS builder
WORKDIR /app
COPY --chown=node:node ./server/build build
COPY --chown=node:node ./server/package*.json ./
COPY --chown=node:node ./client/dist client/dist
RUN npm ci --production

FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:22-slim@sha256:f3408912cdd65a7ecdfc3affaf3960d9678730d9f770172d77bfd98ab1dc3c4b AS runner
WORKDIR /app
COPY --from=builder /app /app
ENV NODE_ENV=production
CMD ["/app/build/server.js"]
