# Multi-stage Dockerfile for building and serving React frontend

# Stage 1: Build the React application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci
ENV NODE_ENV=production

# Copy source code
COPY . ./

# Build the application
RUN npm run build

# Stage 2: Serve the application with nginx
FROM nginx:alpine

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for nginx
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]