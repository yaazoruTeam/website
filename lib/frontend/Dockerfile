# שלב 1: בניית React
FROM node:20 AS builder
WORKDIR /app

# העתקת קבצי package.json להתקנת תלויות (מנצל cache)
COPY lib/frontend/package*.json ./

# התקנת תלויות
RUN npm install

# העתקת תיקיית המודל הנדרשת עבור TypeScript path mapping
COPY lib/model ./model

# העתקת קוד המקור
COPY lib/frontend/. .

# הגדרת משתני סביבה לבניה
ARG VITE_BASE_URL=/api
ARG VITE_LIMIT=50
ENV VITE_BASE_URL=${VITE_BASE_URL}
ENV VITE_LIMIT=${VITE_LIMIT}

# בניית הפרויקט
RUN npm run build

# שלב 2: Nginx להגשָת האתר
FROM nginx:alpine

# Copy the built React app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration (relative to build context root)
COPY lib/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Create SSL directory and generate self-signed certificate
RUN mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/server.key \
    -out /etc/nginx/ssl/server.crt \
    -subj "/C=IL/ST=Israel/L=TelAviv/O=Yaazoru/CN=localhost"

# Create startup script with logging
RUN echo '#!/bin/sh' > /startup.sh && \
    echo 'echo "=================================="' >> /startup.sh && \
    echo 'echo "🚀 Frontend Server Starting..."' >> /startup.sh && \
    echo 'echo "📍 Running on: https://localhost:443"' >> /startup.sh && \
    echo 'echo "🔍 Health check: https://localhost:443/health"' >> /startup.sh && \
    echo 'echo "=================================="' >> /startup.sh && \
    echo 'exec nginx -g "daemon off;"' >> /startup.sh && \
    chmod +x /startup.sh

EXPOSE 443

CMD ["/startup.sh"]