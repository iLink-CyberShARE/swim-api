# SWIM Core Services
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FiLink-CyberShARE%2Fswim-api.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FiLink-CyberShARE%2Fswim-api?ref=badge_shield)

Restful API for the Sustainable Water Through Integrated Modeling Platform.   

This API provides a programmatic interface for the SWIM modeling database, user database and logger database.   

The endpoint paths are grouped as following:   
+ /swim-api : Modeling database operations. (SWIM-DATA)
+ /swim-auth-api: User registration and authentication. (SWIM-AUTH)
+ /swim-logger-api: Platform event and execution logs. (SWIM-LOGGER)


## Endpoint Authentication
The SWIM 2 API endpoints require user authentication through JSON Web Tokens.   
You will need to have a user account linked to the user database.   

1. For the SWIM production platform you can register an account at https://swim.cybershare.utep.edu
2. Once you are registered you can generate a token through the ​/swim-auth-api​/authenticate endpoint (see swagger doc).
3. The endpoint will provide a JWT token. 
4. Copy the token string (after JWT string) and paste it on the value field available on the Authorize window.
5. Endpoint requests will now include your access token.
6. Some endpoints might require additional access level, contact the sysadmin to obtain access.

## Build and Run

### Recommended Execution Environment
+ Node JS v12 and above
+ npm v6 and above
+ All dependencies managed via package.json

### Option 1: Docker Compose File
1. Download the docker-composer.yml file to a path in your machine.   
2. Install Docker and Docker composer on your target machine.   
3. Setup your docker account at: https://www.docker.com/get-started   
4. Configure the docker-composer file with your own app settings.   
5. Run docker compose: $docker-compose up   
5a. Use -d option on the composer command to run on the background.   
6. Swagger docs available at http://localhost:9110/api-docs

### Option 2: Build Docker Container
1. Download this repository into a folder on your machine.
2. Install Docker and Docker composer on your target machine.
3. Setup your docker account at: https://www.docker.com/get-started
4. Using a command line or terminal navigate to the base path of the project.
6. Comment the .env file on the .dockerignore.
6. Rename the env file to .env and configure settings as needed.
5. Build the image: $docker build -t swim-api-public:latest .
7. Run the container: $docker run -p 3000:3000 dockeruser/swim-api-public
8. Swagger docs available at http://localhost:3000/api-docs

### Option 3: Native
1. Install Node.js for your platform (MacOS, Windows or Linux)
2. Download or clone repo to a folder
3. Open terminal with path on project folder (or use visual studio)
4. Install dependencies from package.json: $npm install
5. Rename the env file .env and configure settings as needed.
6. Run app: $node server.js
7. Swagger docs available at http://localhost:3000/api-docs

## Documentation
[SWIM Architecture Docs](https://water.cybershare.utep.edu/resources/docs/en2/architecture/layered-view/)   
[SWIM API Docs](https://water.cybershare.utep.edu/resources/docs/en2/backend/swim-api/)

## Contributors
Luis A Garnica Chavira - UTEP   
Aaron Zambrano - UTEP   
Ian Love - UTEP   

## Acknowledgements
This material is based upon work supported by the National Science Foundation (NSF) under Grant No. 1835897.   

Any opinions, findings, and conclusions or recommendations expressed in this material are those of the author(s) and do not necessarily reflect the views of the National Science Foundation.  

## License
This software code is licensed under the [GNU GENERAL PUBLIC LICENSE v3.0](./LICENSE) and uses third party libraries that are distributed under their own terms (see [LICENSE-3RD-PARTY.md](./LICENSE-3RD-PARTY.md)).


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FiLink-CyberShARE%2Fswim-api.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FiLink-CyberShARE%2Fswim-api?ref=badge_large)

## Copyright
© 2019-2023 - University of Texas at El Paso (SWIM Project).