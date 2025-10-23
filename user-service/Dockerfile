FROM node:21-alpine AS build

WORKDIR /usr/src/app

RUN apk update && apk add bash openssl postgresql

COPY user-service/package*.json .

RUN npm install

COPY user-service .

COPY prisma ./prisma

RUN npx prisma generate --generator dockerDefault

RUN npm run build

FROM node:21-alpine

RUN apk add --no-cache bash openssl postgresql
