# Create base node image and install runtime environment
FROM node:alpine AS base
RUN apk update && apk add curl bash && curl -sf https://gobinaries.com/tj/node-prune | sh

# Install the dependencies
FROM base AS builder
WORKDIR /build
COPY package.json ./
RUN yarn install --frozen-lockfile
RUN yarn add pm2

# Build the nest backend
COPY deploy/api/ecosystem-config.json tsconfig.json tsconfig.build.json ./
COPY src/ ./src/
#COPY config/env/.production.env ./config/env/.env
COPY config/prisma/schema.prisma ./prisma/schema.prisma
ENV NODE_ENV=production
RUN yarn build
RUN npx prisma generate

# Clean node module folder for production
RUN npm prune --production --no-audit
RUN node-prune

# Copy relevant files from builder and start the api
FROM node:alpine
WORKDIR /api

COPY --from=builder /build/node_modules ./node_modules/
#COPY --from=builder /build/config/env/.env ./config/env/.env
COPY --from=builder /build/dist ./dist/
COPY --from=builder /build/ecosystem-config.json ./

EXPOSE 3000
CMD [ "node_modules/.bin/pm2-runtime", "ecosystem-config.json"]
