# Production Dockerfile for Next.js + Tailwind

FROM node:23-alpine AS builder
WORKDIR /app

# Install dependencies

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code and build

COPY . .
RUN yarn build

# Production image

FROM node:23-alpine
WORKDIR /app

# Copy the build from the builder stage

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock

# Ensure .next and static files are present

COPY --from=builder /app/.next/static ./.next/static

# Install only production dependencies

RUN yarn install --production --frozen-lockfile

# Expose port and run the application

EXPOSE 3000
CMD ["yarn", "start"]
