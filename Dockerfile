FROM node:23-alpine

WORKDIR /app

EXPOSE 3000

CMD ["npm", "start"]

COPY package.json .

COPY package-lock.json .

RUN npm ci

COPY . .

RUN npm run build
