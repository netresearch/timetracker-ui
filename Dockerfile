FROM node:24-alpine AS builder

LABEL maintainer="christian.opitz@netresearch.de"

WORKDIR /root/build

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files for pnpm
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml .pnpmrc ./
COPY ./srv/package*.json ./srv/

# Install all dependencies with pnpm
RUN pnpm install --frozen-lockfile

# Copy source files
COPY ./index.html ./vite.config.js ./eslint.config.js ./
COPY ./src ./src
COPY ./static/config.json.dist ./static/config.json

# Build with Vite
RUN pnpm build

# Verify build output
RUN ls -la /root/build/dist

FROM ghcr.io/netresearch/node-webserver:master

WORKDIR /app

# Copy proxy service and install with npm (netresearch/node-webserver uses npm)
COPY ./srv ./timetracker-proxy
RUN cd timetracker-proxy && npm install --production

# Copy built static files from builder
COPY --from=builder /root/build/dist ./public

# Register proxy middleware
RUN echo 'console.log("Registered timetracker proxy")' > customize.js \
    && echo 'module.exports = require("./timetracker-proxy")' >> customize.js
