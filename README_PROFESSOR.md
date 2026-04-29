# Binge App - Running via Docker

This guide explains how to pull and run the application using Docker.

## Requirements
- Docker and Docker Compose installed on your machine.
- The `.env.example` file provided with this submission (contains API keys and database credentials).

## Setup Instructions

1. Ensure you have the following two files in the same directory:
   - `docker-compose.prod.yml`
   - `.env`

2. Open a terminal in that directory and run the following command to pull and start the application:

```bash
docker compose -f docker-compose.prod.yml up -d
```

*Note: This will download the pre-built image (`garrettglencoe/binge-swe:latest`) from Docker Hub and start it in the background.*

3. Once the container is running, open your browser and navigate to:
   **http://localhost:3000**

## Stopping the App
To stop the application, run:
```bash
docker compose -f docker-compose.prod.yml down
```


