# Stage 1: Build client and server
FROM node:22-alpine AS build

WORKDIR /app

# Copy workspace root files
COPY package.json package-lock.json .npmrc ./

# Copy package.json and tsconfig for both workspaces
COPY packages/client/package.json packages/client/
COPY packages/server/package.json packages/server/
COPY packages/server/tsconfig.json packages/server/

# Install all dependencies
RUN npm ci

# Copy source code
COPY packages/client/ packages/client/
COPY packages/server/ packages/server/

# Build the client and compile the server TypeScript
RUN npm run client:build && npm run build --workspace spune-server

# Stage 2: Production image
FROM node:22-alpine

WORKDIR /app

# Copy workspace root files
COPY package.json package-lock.json .npmrc ./
COPY packages/server/package.json packages/server/

# Install production server dependencies only
RUN npm ci --workspace=spune-server --omit=dev

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
