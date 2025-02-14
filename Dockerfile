FROM node:22-alpine AS builder
WORKDIR /app
COPY --chown=node:node ./server/build build
COPY --chown=node:node ./server/package*.json ./
COPY --chown=node:node ./client/dist client/dist
RUN npm ci --production

FROM gcr.io/distroless/nodejs22-debian12:nonroot AS runner
WORKDIR /app
COPY --from=builder /app /app
ENV NODE_ENV=production
CMD ["/app/build/server.js"]
