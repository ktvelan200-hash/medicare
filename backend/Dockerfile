# Stage 1: Build the Spring Boot Application JAR
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Runtime Container
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/medicare-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Dspring.profiles.active=mysql", "-jar", "app.jar"]
