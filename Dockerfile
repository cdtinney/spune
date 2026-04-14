# Stage 1: Build the client
FROM node:22-alpine AS build

WORKDIR /app

# Copy workspace root files
COPY package.json package-lock.json .npmrc ./

# Copy package.json files for both workspaces (needed for npm ci)
COPY packages/client/package.json packages/client/
COPY packages/server/package.json packages/server/

# Install all dependencies (client + server)
RUN npm ci --install-strategy=hoisted

# Copy source code
COPY packages/client/ packages/client/
COPY packages/server/ packages/server/

# Build the client
RUN npm run client:build

# Stage 2: Production image with only server + built client
FROM node:22-alpine

WORKDIR /app

# Copy workspace root files
COPY package.json package-lock.json .npmrc ./
COPY packages/server/package.json packages/server/

# Install production server dependencies only
RUN npm ci --install-strategy=hoisted --workspace=packages/server --omit=dev

# Copy server source
COPY packages/server/ packages/server/

# Copy built client from build stage
COPY --from=build /app/packages/client/build packages/client/build/

# Copy database migration
COPY packages/server/src/database/migrations/ packages/server/src/database/migrations/

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "packages/server/app.js"]
