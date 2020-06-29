FROM node:14
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run install:server
RUN npm run install:generator
EXPOSE 3050
EXPOSE 3055
