FROM node:20-bullseye

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run test

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]
