FROM node:18-alpine

WORKDIR app

COPY ./ ./

COPY package*.json ./

RUN npm install

RUN npm install -g @nestjs/cli

EXPOSE $PORT

CMD npm run start