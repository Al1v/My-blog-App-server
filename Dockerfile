FROM node:18-alpine AS development

WORKDIR app

COPY package*.json ./

RUN npm install --only=development

COPY ./ ./

RUN npm run build

FROM node:18-alpine AS production

WORKDIR app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /app/dist ./dist

CMD ["node", "dist/main"]

