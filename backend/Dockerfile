# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copy package config and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy compiled code from build stage
COPY --from=build /app/dist ./dist

# Expose the backend port
EXPOSE 5000

# Start the application
CMD ["node", "dist/index.js"]
