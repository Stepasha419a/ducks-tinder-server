FROM node:alpine

WORKDIR /usr/src/app

COPY chat-service/package*.json .

RUN npm install

COPY chat-service .

COPY prisma/schema.prisma ./prisma/schema.prisma

RUN npx prisma generate --generator dockerDefault

CMD [ "npm", "run", "start:dev:docker" ]
