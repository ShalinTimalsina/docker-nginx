# ---------- Builder Stage ----------
FROM node:25.8.2-alpine3.22 AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --only=production

# ---------- Runtime Stage ----------
FROM node:25.8.2-alpine3.22 AS runtime

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application files
COPY --chown=appuser:appgroup server.js index.html ./

USER appuser

EXPOSE 3000

CMD ["node", "server.js"]
