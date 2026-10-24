FROM node:22-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY --chown=node:node ./server/build build
COPY --chown=node:node ./server/package.json ./server/pnpm-lock.yaml ./server/pnpm-workspace.yaml ./
COPY --chown=node:node ./client/dist client/dist
RUN pnpm install --frozen-lockfile --prod --node-linker=hoisted

FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:22-slim@sha256:3e444367be393366d86a1ac5ec9d41ed22cf90c319d20e65e85e9ece44a98571 AS runner
WORKDIR /app
COPY --from=builder /app /app
ENV NODE_ENV=production
CMD ["/app/build/server.js"]
