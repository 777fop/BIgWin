# Stage 1: Build the JAR with Maven
FROM maven:3.9.3-eclipse-temurin-17 AS build

# Set working directory inside the container
WORKDIR /app

# Copy pom.xml and download dependencies (cache this layer if pom.xml doesn't change)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy all source code
COPY src ./src

# Build the jar (skip tests for faster build, remove -DskipTests to run tests)
RUN mvn clean package -DskipTests

# Stage 2: Run the JAR in a lightweight JRE image
FROM eclipse-temurin:17-jre-alpine

# Add a volume pointing to /tmp (recommended for Spring Boot)
VOLUME /tmp

# Copy the jar from the build stage
COPY --from=build /app/target/bigwin-server-0.0.1-SNAPSHOT.jar app.jar

# Expose the port your app listens on
EXPOSE 8080

# Run the jar
ENTRYPOINT ["java","-jar","/app.jar"]
