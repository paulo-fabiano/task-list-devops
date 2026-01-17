# Build
FROM maven:3.8.3-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean install -DskipTests -Dmaven.test.skip=true -Dmaven.build.dest=/app/target

# Aplication
FROM eclipse-temurin:17.0.17_10-jre-jammy

WORKDIR /app

COPY --from=build /app/target/lista_tarefas.jar /app/app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
