# Use a Gradle image for building the project
FROM gradle:8-jdk AS build
WORKDIR /app
COPY . .
RUN gradle build -x test

# Use a lightweight JDK image to run the app
FROM openjdk:21
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
COPY  spotify.cer /home/spotify.cer

RUN  keytool  -importcert -storetype JKS -keystore "/usr/java/openjdk-21/lib/security/cacerts" -alias caroot -file /home/spotify.cer -noprompt -storepass changeit



EXPOSE 8080
CMD ["java", "-jar", "app.jar", "sleep 5 && java -jar app.jar"]
