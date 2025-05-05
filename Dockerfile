# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps and build
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

# Copy built JS
COPY --from=builder /app/dist ./dist

# Set NODE_ENV
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Run app
CMD ["node", "dist/server.js"]
    