FROM node:14
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run install:server
EXPOSE 3050
EXPOSE 3055
