ARG VERSION=12
ARG APP_PORT=3000

# ---- base ----
FROM node:${VERSION}-alpine AS base

WORKDIR /app

COPY configs/tsconfig.backend.json ./configs/
COPY configs/ormconfig.js ./configs/
COPY ormconfig.js ./

# ---- dependencies ----
FROM base as dependencies

COPY yarn.lock ./
COPY package.json ./
COPY configs/.eslintrc.backend ./configs/
COPY configs/.eslintrc.frontend ./configs/
COPY configs/webpack.config.js ./configs/
COPY configs/tsconfig.frontend.json ./configs/
COPY configs/nodemon.json ./configs/

RUN yarn install --production --pure-lockfile --non-interactive --cache-folder ./ycache && \
    cp -R node_modules prod_node_modules && \
    rm -rf node_modules && \
    yarn install --pure-lockfile --non-interactive --cache-folder ./ycache && \
    rm -rf ./ycache

# ---- build ----
FROM dependencies as build

COPY assets ./assets
COPY src ./src
COPY templates ./templates

RUN ls -lar configs
RUN yarn run encore production --config ./configs/webpack.config.js

# ---- development ----
FROM dependencies as development

ENV NODE_ENV=development

# ---- production ----
FROM base as production

ENV NODE_ENV=production
ENV APP_PORT=${APP_PORT}

COPY --from=dependencies /app/prod_node_modules ./node_modules
COPY --from=build /app/src ./src
COPY --from=build /app/templates ./templates
COPY --from=build /app/public ./public

EXPOSE ${APP_PORT}

CMD yarn run ts-node --project ./configs/tsconfig.backend.json src/main.ts
