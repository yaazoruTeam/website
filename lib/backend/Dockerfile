# שלב 1: Build Stage - בניית האפליקציה (קומפילציה של TypeScript)
# FROM node:20-alpine AS builder

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

# העתקת קבצי הגדרות הפרויקט בלבד
# זה מאפשר ניצול יעיל של מטמון ה-Docker (cache) - אם קבצי ה-package.json/package-lock.json לא השתנו,
# ה-Docker לא יצטרך להריץ שוב את npm install
COPY package*.json ./

# התקנת כל התלויות (גם devDependencies לצורך ה-build)
RUN npm install

# העתקת קוד המקור
COPY . .

# ביצוע ה-build של האפליקציה (קומפילציה של TypeScript ל-JavaScript)
# הפקודה "build" מוגדרת ב-package.json
RUN npm run build

# שלב 2: Production Stage - יצירת אימג' סופי קטן ונקי
FROM node:20-alpine

WORKDIR /app

# העתקת קבצי הגדרות הפרויקט בלבד עבור תלויות הייצור
COPY package*.json ./

# התקנת תלויות ייצור בלבד
# שימוש ב-npm ci מבטיח התקנה נקייה ומדויקת על פי package-lock.json
RUN npm ci --only=production

# העתקת תוצרי ה-build משלב ה-builder
# אנחנו מעתיקים את התיקייה 'dist' שיצר ה-build, ואת קובץ ה-package.json
# (package.json נחוץ עבור הפקודה npm ci וגם אם יש סקריפטים שרצים מהתיקיה)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# משתני סביבה (ניתן גם להעביר מבחוץ, מומלץ יותר לסביבות ייצור)
ENV PORT=3006
ENV NODE_ENV=production

# חשיפת פורט
EXPOSE 3006

# הפקודה שתריץ את האפליקציה ב-production
# אנחנו מריצים את הסקריפט 'start' שהגדרת ב-package.json,
# שמוביל ל-'node dist/index.js'
CMD [ "npm", "start" ]