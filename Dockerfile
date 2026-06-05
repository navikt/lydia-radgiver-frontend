FROM node:22-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY --chown=node:node ./server/build build
COPY --chown=node:node ./server/package.json ./server/pnpm-lock.yaml ./server/pnpm-workspace.yaml ./
COPY --chown=node:node ./client/dist client/dist
RUN pnpm install --frozen-lockfile --prod --node-linker=hoisted

FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:22-slim@sha256:16ba163c021deb54b24ae19c168d4432dab34c86a782d171f0df4327a94d5f4b AS runner
WORKDIR /app
COPY --from=builder /app /app
ENV NODE_ENV=production
CMD ["/app/build/server.js"]
