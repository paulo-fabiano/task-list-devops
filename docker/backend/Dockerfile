# Build
FROM maven:3.8.3-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean install -DskipTests -Dmaven.test.skip=true -Dmaven.build.dest=/app/target

# Aplication
FROM openjdk:17

WORKDIR /app

COPY --from=build /app/target/lista_tarefas.jar /app/app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
