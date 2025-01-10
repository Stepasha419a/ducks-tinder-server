FROM maven:3.8.5-openjdk-17

WORKDIR /app

COPY . /app

COPY /src/main/resources/application-dev-docker.properties /app/src/main/resources/application.properties

RUN mvn -f /app/pom.xml clean package -Dmaven.test.skip=true

ENTRYPOINT ["java", "-jar", "/app/target/map_service-0.0.1-SNAPSHOT.jar"]