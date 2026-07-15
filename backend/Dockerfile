# ---- Build stage: compile and package the Spring Boot jar ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache dependencies first (only re-downloads when pom.xml changes).
COPY pom.xml .
RUN mvn -q dependency:go-offline

COPY src ./src
RUN mvn -q clean package -DskipTests

# ---- Run stage: small JRE image with just the jar ----
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# The app reads $PORT (Render/Fly/Railway inject it); defaults to 8080 locally.
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
