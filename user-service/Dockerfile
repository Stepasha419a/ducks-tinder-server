FROM node:21-alpine

WORKDIR /usr/src/app

RUN apk update && apk add bash openssl postgresql

COPY user-service/package*.json .

RUN npm install

COPY user-service .

COPY prisma ./prisma

RUN npx prisma generate --generator dockerDefault

RUN npm run build

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
