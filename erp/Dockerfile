FROM eclipse-temurin:17-jre

COPY target/*.jar /app/erp.jar

WORKDIR /app

EXPOSE 8080

CMD ["java", "-jar", "erp.jar"]
