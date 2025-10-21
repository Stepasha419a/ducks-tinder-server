FROM maven:3.8.5-openjdk-17-slim AS build

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY ./pom.xml /app/pom.xml

RUN mvn -f /app/pom.xml verify clean --fail-never

COPY . /app

# TODO: fix tests skipping
RUN mvn -f /app/pom.xml package -Dmaven.test.skip=true

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]