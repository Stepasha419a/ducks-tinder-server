FROM maven:3.9.12-eclipse-temurin-21 AS build

WORKDIR /usr/src/app

COPY ./src/main/resources/application-test.properties ./src/main/resources/application-test.properties
COPY ./pom.xml ./pom.xml

RUN mvn dependency:go-offline

COPY . .

# TODO: fix tests skipping
RUN mvn clean package -DskipTests -Dmaven.test.skip=true

FROM eclipse-temurin:21-jre-alpine-3.23

WORKDIR /app

RUN apk add --no-cache bash curl

COPY --from=build /usr/src/app/target/*.jar /app/app.jar
COPY --from=build /usr/src/app/src/main/resources/db/migration /app/migration

COPY --from=build /usr/src/app/entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]