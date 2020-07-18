FROM node:latest

RUN mkdir -p /app/server

WORKDIR /app/server

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]