FROM node:24-alpine AS build

WORKDIR /usr/src/app

COPY chat-service/package.json chat-service/package-lock.json ./

RUN npm install

COPY chat-service .

RUN npm run build

COPY prisma/migrations ./prisma/migrations

FROM node:24-alpine

RUN apk add --no-cache bash openssl postgresql curl

WORKDIR /app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/proto ./proto
COPY --from=build /usr/src/app/prisma/migrations ./prisma/migrations

COPY --from=build /usr/src/app/entrypoint.sh .

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
