FROM node:22-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY --chown=node:node ./server/build build
COPY --chown=node:node ./server/package.json ./server/pnpm-lock.yaml ./server/pnpm-workspace.yaml ./
COPY --chown=node:node ./client/dist client/dist
RUN pnpm install --frozen-lockfile --prod --node-linker=hoisted

FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:22-slim@sha256:663477aa9109a3d7b9ebfa34f19d6fd1c4706775b1436603b2dea4f4a1eb7364 AS runner
WORKDIR /app
COPY --from=builder /app /app
ENV NODE_ENV=production
CMD ["/app/build/server.js"]
