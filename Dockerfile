FROM openjdk:8-alpine
WORKDIR /
ADD /target/order-management-system-0.0.1-SNAPSHOT.jar /target/order-management-system-0.0.1-SNAPSHOT.jar
EXPOSE 8080
CMD ["java", "-jar", "/target/order-management-system-0.0.1-SNAPSHOT.jar"]