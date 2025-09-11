# שלב בנייה (Builder Stage) - מכיל את כל מה שנדרש לקומפילציה והתקנת תלויות
FROM node:20-alpine AS builder
WORKDIR /app 

# העתקת קבצי package.json והתקנת תלויות (מנצל cache)
COPY lib/backend/package*.json ./ 

# העתקת תיקיית המודל הנדרשת כ-dependency
COPY lib/model ./model

# שימוש ב-npm ci שמבטיח התקנה נקייה
RUN npm ci --include=dev

# העתקת קוד המקור (מחוץ לnode_modules)
COPY lib/backend/src ./src
COPY lib/backend/tsconfig.json ./
COPY lib/backend/jest.config.ts ./ 

# קומפילציית TypeScript
RUN npm run build

# שלב Production - מכיל רק את מה שנדרש להרצת האפליקציה (קטן ויעיל יותר)
FROM node:20-alpine AS production 
WORKDIR /app 

# העתקת קבצי ה-package מה-builder stage כדי לאפשר התקנת תלויות production
COPY --from=builder /app/package*.json ./ 

# העתקת תיקיית המודל משלב ה-builder
COPY --from=builder /app/model ./model 

# התקנת תלויות Production עם npm ci
RUN npm ci --omit=dev

# העתקת הקבצים המקומפלים (dist) משלב ה-builder
COPY --from=builder /app/dist ./dist 

# הגדרת פורט חשיפה
EXPOSE 3006

# פקודת ההפעלה של השרת
CMD ["node", "dist/index.js"]