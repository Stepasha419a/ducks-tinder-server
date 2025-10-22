FROM maven:3.8.5-openjdk-17-slim AS build

WORKDIR /usr/src/app

COPY ./pom.xml ./pom.xml

RUN mvn dependency:go-offline

COPY . .

# TODO: fix tests skipping
RUN mvn clean package -DskipTests -Dmaven.test.skip=true

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

RUN apk add --no-cache bash

RUN mvn -f /app/pom.xml verify clean --fail-never

COPY . /app

# TODO: fix tests skipping
RUN mvn -f /app/pom.xml package -Dmaven.test.skip=true

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]