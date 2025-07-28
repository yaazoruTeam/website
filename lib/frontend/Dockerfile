# שלב 1: בניית React
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY . .

RUN npm install
RUN npm run build

# שלב 2: Nginx להגשָת האתר
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80