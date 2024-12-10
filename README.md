# HiddenPeak ERP Project

This repository contains the source code for the HiddenPeak ERP project. The system is designed to run fully containerized using Docker.

The front end is a standard website that is built using HTML, CSS, and Javascript

The back end application is built using the Java SpringBoot framework.

The database is MySQL. Upon system startup, the backend ERP application populates the database with some sample data defined in the [TestDataController](erp/src/main/java/com/hiddenpeak/erp/TestDataController.java) class.


## Build Dependencies
- Java 17 or later
- Maven
- A local Docker installation

## Build Instructions

The build process consists of first building the backend Java SpringBoot application from source, then building two Docker images to deploy as containers.

To build the backend Java SpringBoot application and its corresponding Docker container, do the following:

```
# From the root of the project
cd erp
mvn clean package
docker build . -t erp:latest
```

To build the frontend container, do the following:
```
# From the root of the project
docker build . -t frontend:latest
```

If successful, there should now be two Docker images loaded in your local Docker registry. To verify:
```
> docker image ls
REPOSITORY                                                                                    TAG                                                                          IMAGE ID       CREATED         SIZE
frontend                                                                                      latest                                                                       2e52aa932862   13 hours ago    55.5MB
erp                                                                                           latest                                                                       c60c4521b66b   13 hours ago    312MB
```

## Running Instructions

Once the Docker images are built and loaded locally, you can run the following command to launch the entire system via Docker Compose:

```
docker compose -f docker-compose-local.yml up
```

For convenience, pre-built containers are uploaded to Github container registry (requires an access token):

```
docker compose -f docker-compose.yml up
```

Once the system is running, navigate to localhost:8000 in a web browser to access the application.

