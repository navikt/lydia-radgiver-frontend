FROM navikt/node-express:16

USER root

WORKDIR /app
COPY client client
COPY server server

WORKDIR /app/client
RUN yarn install
RUN yarn run build

WORKDIR /app/server
RUN yarn install

# set right permissions for non-root user
RUN chown node:node -R .

USER node
CMD ["yarn", "start"]