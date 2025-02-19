FROM node:20-alpine

RUN npm install -g @nestjs/cli

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "build"]

COPY . .