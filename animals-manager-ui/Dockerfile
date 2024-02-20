FROM node:20-alpine AS build

WORKDIR /usr/src/ui-app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD ["npm", "start"]

