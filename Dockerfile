FROM node:22-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY --chown=node:node ./server/build build
COPY --chown=node:node ./server/package.json ./server/pnpm-lock.yaml ./server/pnpm-workspace.yaml ./
COPY --chown=node:node ./client/dist client/dist
RUN pnpm install --frozen-lockfile --prod --node-linker=hoisted

FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:22-slim@sha256:94d20c8533d825e9361ef8137e3699e25b52ca5bb0c50b7af7ce8860055dc102 AS runner
WORKDIR /app
COPY --from=builder /app /app
ENV NODE_ENV=production
CMD ["/app/build/server.js"]
