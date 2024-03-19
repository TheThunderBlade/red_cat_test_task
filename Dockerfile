FROM node:20.11-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

COPY ./dist ./dist

CMD ["yarn", "run", "start"]

