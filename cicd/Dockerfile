FROM node:14.14.0-alpine3.11 as base

RUN apk add --no-cache git gcc g++

WORKDIR /var/www

FROM base as production

COPY package.json package-lock.json ./

RUN npm install

COPY ./ ./

ENV NODE_ENV "production"

RUN npm run build && npm prune --production

CMD ["npm", "run", "start:prod"]

FROM base as dev

ARG PUID=1000

RUN set -x \
  && adduser -u $PUID -D sws \
  && chown -R sws /var/www

RUN apk add --no-cache bash openssh make curl openssl

USER sws

VOLUME $STD_HOME/.npm
VOLUME $STD_HOME/.yarn-cache

# Chokidar's watch doesn't work by default in some networked environments
# such as a container running nodemon reading across a mounted drive
# See https://github.com/paulmillr/chokidar#performance
ARG IS_MAC_HOST=false
ENV CHOKIDAR_USEPOLLING=${IS_MAC_HOST}
ENV CHOKIDAR_INTERVAL=200

ENV NODE_ENV "development"
