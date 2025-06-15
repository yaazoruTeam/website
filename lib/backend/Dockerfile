FROM node:20

WORKDIR /app

# העתקת package files
COPY lib/backend/package*.json ./
COPY lib/backend/tsconfig.json ./

# התקנת dependencies
RUN npm install

# העתקת הקוד
COPY lib/backend/src ./src
COPY lib/model ./lib/model

# build schema
RUN npm run build-schema

EXPOSE 3006

# משתני סביבה - הסרתי host.docker.internal
ENV PORT=3006
ENV NODE_ENV=development

CMD ["npm", "run", "dev"]