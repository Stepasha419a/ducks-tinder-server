FROM node:alpine as development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

COPY prisma ./prisma/

RUN npm run build auth

FROM node:alpine

COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/package*.json ./
COPY --from=development /app/dist ./dist

CMD [ "npm", "run", "start:prod", "auth" ]