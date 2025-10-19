FROM node:21-alpine

WORKDIR /usr/src/app

RUN apk update && apk add bash openssl postgresql

COPY chat-service/package*.json .

RUN npm install

COPY chat-service .

COPY prisma ./prisma

RUN npx prisma generate --generator dockerDefault

RUN npm run build

FROM node:21-alpine
