FROM node:21-alpine

WORKDIR /usr/src/app

COPY user-service/package*.json .

RUN npm install

COPY user-service .

COPY prisma/schema.prisma ./prisma/schema.prisma

RUN npx prisma generate --generator dockerDefault

CMD [ "npm", "run", "start:dev:docker" ]
