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

# בניית הפרויקט
RUN npm run build

# שלב 2: Nginx להגשָת האתר
FROM nginx:alpine

# Copy the built React app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY lib/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Create startup script with logging
RUN echo '#!/bin/sh' > /startup.sh && \
    echo 'echo "=================================="' >> /startup.sh && \
    echo 'echo "🚀 Frontend Server Starting..."' >> /startup.sh && \
    echo 'echo "📍 Running on: http://localhost:80"' >> /startup.sh && \
    echo 'echo "🔍 Health check: http://localhost:80/health"' >> /startup.sh && \
    echo 'echo "=================================="' >> /startup.sh && \
    echo 'exec nginx -g "daemon off;"' >> /startup.sh && \
    chmod +x /startup.sh

EXPOSE 80

CMD ["/startup.sh"]