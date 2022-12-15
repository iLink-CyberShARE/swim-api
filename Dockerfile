# Pull official Node JS Image - w/Alpine OS
FROM node:14.17-alpine3.11

# install dumb-init package from alpine repo
RUN apk add dumb-init

# Set production env variable
ENV NODE_ENV production

# set the working directory to /swim-api
WORKDIR /swim-api

# copy as node user owner
COPY --chown=node:node . /swim-api

# install npm dependencies
RUN npm install

# use user node
USER node

# run the node application
CMD ["dumb-init", "node", "server.js"]

# Application default port
EXPOSE 3000
