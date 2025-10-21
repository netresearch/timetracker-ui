FROM node:14-alpine AS builder

LABEL maintainer="christian.opitz@netresearch.de"

WORKDIR /root/build

COPY package*.json /root/build/
RUN npm install

# Install srv dependencies manually (postinstall won't run in Docker)
COPY ./srv/package*.json /root/build/srv/
RUN cd srv && npm install

COPY ./.babelrc ./.eslint* ./.postcssrc.js ./index.html ./
COPY ./src ./src
COPY ./build ./build
COPY ./config ./config
COPY ./static/config.json.dist ./static/config.json
RUN ls -la /root/build
# Disable ESLint during build (ESLint 4 has bugs with template literals)
RUN sed -i 's/useEslint: true/useEslint: false/' config/index.js
RUN npm run build

RUN ls -la /root/build/build

FROM ghcr.io/netresearch/node-webserver:master

WORKDIR /app

COPY ./srv ./timetracker-proxy
RUN cd timetracker-proxy && npm install --production

COPY --from=builder /root/build/dist ./public

RUN echo 'console.log("Registered timetracker proxy")' > customize.js \
    && echo 'module.exports = require("./timetracker-proxy")' >> customize.js
