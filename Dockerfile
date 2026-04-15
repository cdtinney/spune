# Stage 1: Build client and server
FROM node:22-alpine AS build

RUN corepack enable pnpm

WORKDIR /app

# Copy workspace config and lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/client/package.json packages/client/
COPY packages/server/package.json packages/server/
COPY packages/server/tsconfig.json packages/server/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/client/ packages/client/
COPY packages/server/ packages/server/

# Chromecast app ID (baked into client at build time)
ARG VITE_CAST_APP_ID=CCD3A879
ENV VITE_CAST_APP_ID=$VITE_CAST_APP_ID

# Build the client and compile the server TypeScript
RUN pnpm client:build && pnpm server:build

# Stage 2: Production image
FROM node:22-alpine

RUN corepack enable pnpm

WORKDIR /app

# Copy workspace config and lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/server/package.json packages/server/

# Install production server dependencies only
RUN pnpm install --frozen-lockfile --filter spune-server --prod

# Copy compiled server from build stage
COPY --from=build /app/packages/server/dist packages/server/dist/

# Copy built client from build stage
COPY --from=build /app/packages/client/build packages/client/build/

# Copy database migration
COPY packages/server/src/database/migrations/ packages/server/src/database/migrations/

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "packages/server/dist/app.js"]
