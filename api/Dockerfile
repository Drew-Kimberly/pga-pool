ARG BASE_IMAGE="node:24.14.0-alpine"

# --- START: base stage ---
FROM $BASE_IMAGE as base

RUN apk update \
 && apk upgrade \
 && apk add bash \
 && apk add git

# --- START: Production Deps stage ---
FROM base as prod-deps
WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn --frozen-lockfile --ignore-optional --production


# --- START: dev-deps stage ---
FROM base as dev-deps
WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn --frozen-lockfile --ignore-optional


# --- START: build stage ---
FROM dev-deps as build
WORKDIR /app

COPY nest-cli.json tsconfig.build.json tsconfig.json seeds /app/
COPY src /app/src/

RUN yarn build


# --- START: prod stage
FROM base as prod
WORKDIR /app
ENV NODE_ENV=production

USER node

COPY --chown=node:node --from=prod-deps /app/node_modules /app/node_modules
COPY --chown=node:node --from=build /app/dist /app/dist
COPY --chown=node:node seeds /app/seeds
