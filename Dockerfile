FROM node:alpine as builder

LABEL maintainer="christian.opitz@netresearch.de"

WORKDIR /root/build

COPY package*.json /root/build/
RUN npm install

COPY ./.babelrc ./.eslint* ./.postcssrc.js ./index.html ./
COPY ./src ./src
COPY ./build ./build
COPY ./config ./config
COPY ./static/config.json.dist ./static/config.json
RUN ls -la /root/build
RUN npm run build

RUN ls -la /root/build/build

FROM netresearch/node-webserver

WORKDIR /app

COPY ./srv ./timetracker-proxy
RUN cd timetracker-proxy && npm install

COPY --from=builder /root/build/dist ./public

RUN echo 'console.log("Registered timetracker proxy")' > customize.js \
    && echo 'module.exports = require("./timetracker-proxy")' >> customize.js
