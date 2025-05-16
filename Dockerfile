# Stage 1: Build the TypeScript code
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or pnpm-lock.yaml / yarn.lock if you use those)
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the TypeScript app
RUN npm run build

# Stage 2: Run the built app with only production dependencies
# Stage 2: runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Copy production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/server.js"]

