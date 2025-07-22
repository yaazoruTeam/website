# FROM node:20

# WORKDIR /app

# # העתקת package files
# COPY lib/backend/package*.json ./
# COPY lib/backend/tsconfig.json ./

# # התקנת dependencies
# RUN npm install

# # העתקת הקוד
# COPY lib/backend/src ./src
# COPY lib/model ./lib/model

# # build schema
# RUN npm run build-schema

# EXPOSE 3006

# # משתני סביבה - הסרתי host.docker.internal
# ENV PORT=3006
# ENV NODE_ENV=development

# CMD ["npm", "run", "dev"]

# Dockerfile עבור ה-Backend
# פתרון מתקדם: Multi-Stage Build עם אופטימיזציות

# שלב בנייה (Builder Stage) - מכיל את כל מה שנדרש לקומפילציה והתקנת תלויות
FROM node:20-alpine AS builder

WORKDIR /app 

# העתקת קבצי package.json להתקנת תלויות (מנצל cache)
COPY lib/backend/package*.json ./ 

# התקנת כל התלויות (כולל dev dependencies הנחוצות לקומפילציה)
RUN npm install --silent

# העתקת קבצי TypeScript והגדרות
COPY lib/backend/tsconfig.json ./

# העתקת קוד מקור (ללא תיקיית tests)
COPY lib/backend/src ./src

# מחיקת תיקיית הבדיקות אם היא קיימת
RUN rm -rf ./src/tests || true

# העתקת המודלים הנדרשים במיקום הנכון
COPY lib/model ./model

# קומפילציית TypeScript (ללא בדיקות, עם דילוג על בדיקות lib)
RUN npx tsc --skipLibCheck

# שלב Production - מכיל רק את מה שנדרש להרצת האפליקציה (קטן ויעיל יותר)
FROM node:20-alpine AS production

# יצירת משתמש לא-רוט לביטחון
RUN addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001

WORKDIR /app 

# העתקת קבצי ה-package מה-builder stage כדי לאפשר התקנת תלויות production
COPY --from=builder /app/package*.json ./ 

# התקנת תלויות Production בלבד (אופטימיזציה נוספת)
RUN npm ci --only=production --silent && npm cache clean --force

# העתקת הקבצים המקומפלים (dist) משלב ה-builder
COPY --from=builder /app/dist ./dist 

# העתקת המודלים הנדרשים לזמן הרצה במיקום הנכון
COPY --from=builder /app/model ./model

# שינוי בעלות לכל הקבצים למשתמש appuser
RUN chown -R appuser:nodejs /app
USER appuser

# הגדרת פורט חשיפה
EXPOSE 3006

# הגדרת משתני סביבה
ENV NODE_ENV=production
ENV PORT=3006

# בדיקת תקינות
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); const options = { host: 'localhost', port: 3006, timeout: 2000 }; const req = http.request(options, res => { console.log('STATUS:', res.statusCode); process.exit(res.statusCode === 200 ? 0 : 1) }); req.on('error', () => process.exit(1)); req.end();"

# פקודת ההפעלה של השרת
CMD ["node", "dist/index.js"]
