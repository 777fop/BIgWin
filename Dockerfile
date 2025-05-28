# Start from an official OpenJDK 17 runtime image (adjust Java version if needed)
FROM openjdk:17-jdk-alpine

# Add a volume pointing to /tmp (optional, but recommended for Spring Boot)
VOLUME /tmp

# Copy the built jar file into the container
COPY bigwin-server-0.0.1-SNAPSHOT.jar app.jar

# Expose the port your app listens on (default Spring Boot port)
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java","-jar","/app.jar"]
