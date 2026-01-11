FROM node:22-slim

WORKDIR /app

COPY package*.json .

RUN npm i

COPY main.js .
COPY public ./public

EXPOSE 3000

CMD ["npm", "start"]
