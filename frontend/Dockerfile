# Development Dockerfile for Next.js + Tailwind
FROM node:20-alpine
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy source code
COPY . .

EXPOSE 3000

CMD ["yarn", "dev"] 