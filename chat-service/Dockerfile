FROM node:21-alpine

WORKDIR /usr/src/app

COPY chat-service .

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate --generator dockerDefault

RUN npm run build

FROM node:21-alpine

RUN apk add --no-cache bash openssl postgresql

WORKDIR /app
