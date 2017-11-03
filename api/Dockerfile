FROM node:boron

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
#COPY package.json .
RUN npm install

#RUN npm install -g nodemon

# Bundle app source
#COPY . /usr/src/app

EXPOSE 8080

#USER node

CMD [ "nodemon", "start" ]
