FROM maven:3.8.5-openjdk-17

WORKDIR /app

COPY ./pom.xml /app/pom.xml

RUN mvn -f /app/pom.xml verify clean --fail-never

COPY . /app

# TODO: fix tests skipping
RUN mvn -f /app/pom.xml package -Dmaven.test.skip=true

ENTRYPOINT ["java", "-jar", "/app/target/map_service-0.0.1-SNAPSHOT.jar"]