# syntax=docker/dockerfile:1

# ─── Stage 1: Build Frontend ───────────────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ .
ENV NEXT_PUBLIC_API_URL=/api
RUN npm run build

# ─── Stage 2: Build Backend ────────────────────────────────────────
FROM node:20-alpine AS backend-builder
RUN apk add --no-cache python3 make g++
WORKDIR /app/api
COPY api/package.json api/package-lock.json ./
RUN npm install
COPY api/ .
RUN npm run build

# ─── Stage 3: Production ──────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

# Install build deps for better-sqlite3 native module, then remove after install
RUN apk add --no-cache python3 make g++
COPY api/package.json api/package-lock.json ./
RUN npm install --omit=dev
RUN apk del python3 make g++

# Copy built backend
COPY --from=backend-builder /app/api/dist ./dist
COPY --from=backend-builder /app/api/static ./static

# Copy built frontend (static export)
COPY --from=frontend-builder /app/frontend/out ./frontend-out

# Copy professor images
COPY Prof_subtitles ./Prof_subtitles

# Copy entrypoint that serves frontend + API
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
