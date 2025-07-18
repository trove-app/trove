# Production Dockerfile for Next.js + Tailwind

FROM node:23-alpine AS builder

WORKDIR /app

# Install dependencies

COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

# Copy source code and build

COPY . .
RUN npm run build

# Production image

FROM node:23-alpine
WORKDIR /app

# Copy the build from the builder stage

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Install only production dependencies

RUN npm ci --production --frozen-lockfile

# Expose port and run the application

EXPOSE 3000
CMD ["npm", "start"]
