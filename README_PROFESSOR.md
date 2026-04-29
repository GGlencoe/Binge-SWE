#Running via Docker

#Requirement
-The `.env` file provided with this submission (contains API keys and database credentials).

#Setup
1. Make sure these two files are in the same directory:
   -`docker-compose.prod.yml`
   -`.env`

2. Open a terminal in that directory and run:
`bash docker compose -f docker-compose.prod.yml up -d`

3. Open your browser and go to **http://localhost:3000**

#Stopping the App
`bash docker compose -f docker-compose.prod.yml down`


