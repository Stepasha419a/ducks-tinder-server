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

COPY --from=build /usr/src/app/target/*.jar /app/app.jar
COPY --from=build /usr/src/app/src/main/resources/db/migration /app/migration

COPY --from=build /usr/src/app/entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]