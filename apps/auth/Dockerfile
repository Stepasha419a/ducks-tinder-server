FROM node:alpine as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

COPY prisma ./prisma/

RUN npm run build auth

FROM node:alpine

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/auth/main"]