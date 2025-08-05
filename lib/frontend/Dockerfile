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
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80