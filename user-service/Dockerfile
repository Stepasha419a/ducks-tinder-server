FROM node:21-alpine AS build

WORKDIR /usr/src/app

COPY user-service/package.json user-service/package-lock.json ./

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate --generator dockerDefault

COPY user-service .

RUN npm run build

FROM node:21-alpine

RUN apk add --no-cache bash openssl postgresql

WORKDIR /app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/proto ./proto

COPY --from=build /usr/src/app/entrypoint.sh ./entrypoint.sh
