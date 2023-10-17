FROM node:18-alpine

WORKDIR app

COPY ./ ./

COPY package*.json ./

RUN npm install

EXPOSE $PORT

CMD npm run start