FROM node:16-alpine AS builder

COPY . .

ENV VITE_USE_MSW=true

RUN npm ci
RUN npm run build

FROM nginx:alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder ./dist /usr/share/nginx/html

EXPOSE 8080