FROM node:21-alpine AS build

WORKDIR /usr/src/app

COPY user-service/package.json user-service/package-lock.json ./

RUN npm install

COPY user-service .

RUN npm run build

COPY prisma/migrations ./prisma/migrations


RUN apk add --no-cache bash openssl postgresql curl

WORKDIR /app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/proto ./proto
COPY --from=build /usr/src/app/prisma/migrations ./prisma/migrations

COPY --from=build /usr/src/app/entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
