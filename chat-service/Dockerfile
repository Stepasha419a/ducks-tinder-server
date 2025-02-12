FROM node:21-alpine

WORKDIR /usr/src/app

COPY chat-service/package*.json .

RUN npm install

COPY chat-service .

COPY prisma ./prisma

RUN npx prisma generate --generator dockerDefault

RUN npm run build

CMD ["npm", "run", "start:prod"]
