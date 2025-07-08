# universal-time-app-backend/Dockerfile

# --- Stage 1: Build the TypeScript application ---
FROM node:20-alpine AS builder

# Install pnpm globally within the builder stage
RUN npm install -g pnpm

WORKDIR /app

# Copy package.json and pnpm-lock.yaml first
COPY package.json pnpm-lock.yaml ./

# Install development and production dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of your application code
COPY . .

# Build the TypeScript code
RUN pnpm build

# --- Stage 2: Create the production-ready image ---
FROM node:20-alpine AS production

# Install pnpm globally within the production stage as well
RUN npm install -g pnpm

WORKDIR /app

# Set production environment variable within the image
# Corrected syntax: ENV key=value
ENV NODE_ENV=production

# Copy package.json and pnpm-lock.yaml for production dependencies
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies using pnpm
# CORRECTED: Reverted to pnpm install --prod --frozen-lockfile
RUN pnpm install --prod --frozen-lockfile

# Copy the compiled application from the builder stage
COPY --from=builder /app/dist ./dist

# Switch to a non-root user for security
USER node

# Expose the port your application will listen on
EXPOSE 3000

# Define the command to run your application using pnpm
CMD ["pnpm", "start"]