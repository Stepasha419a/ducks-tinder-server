FROM node:alpine AS development

WORKDIR /usr/src/app

COPY chat-service/package*.json ./

RUN npm install

COPY chat-service .

COPY prisma/schema.prisma ./prisma/schema.prisma

RUN npx prisma generate --generator dockerDefault

RUN npm run build

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY chat-service/package*.json ./

RUN npm install --only=production

COPY chat-service .

COPY --from=development /usr/src/app/dist ./dist

CMD [ "npm", "run", "start:prod" ]
