#Dockerfile רב-שלבי (Multi-Stage Build)

# שלב בנייה (Builder Stage) - מכיל את כל מה שנדרש לקומפילציה והתקנת תלויות
FROM node:20-alpine AS builder
WORKDIR /app 

# העתקת קבצי package.json להתקנת תלויות (מנצל cache)
COPY lib/backend/package*.json ./ 

# התקנת כל התלויות (כולל dev dependencies הנחוצות לקומפילציה)
RUN npm install 

# העתקת קוד המקור
COPY lib/backend/. . 

# קומפילציית TypeScript
#RUN npx tsc 
# קומפילציית TypeScript
RUN npm run build

# שלב Production - מכיל רק את מה שנדרש להרצת האפליקציה (קטן ויעיל יותר)
FROM node:20-alpine AS production 
WORKDIR /app 

# העתקת קבצי ה-package מה-builder stage כדי לאפשר התקנת תלויות production
COPY --from=builder /app/package*.json ./ 
COPY --from=builder /app/tsconfig.json ./ 


# התקנת תלויות Production בלבד (אופטימיזציה נוספת)
RUN npm install --production --omit=dev 

# העתקת הקבצים המקומפלים (dist) משלב ה-builder
COPY --from=builder /app/dist ./dist 

# הגדרת פורט חשיפה
EXPOSE 3006

# פקודת ההפעלה של השרת
CMD ["node", "dist/index.js"]