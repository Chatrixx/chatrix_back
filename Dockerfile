FROM node:22-alpine AS builder

ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./

EXPOSE 8080

CMD ["node", "dist/server.js"]

