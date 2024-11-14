FROM node:23

WORKDIR /app

COPY package-lock.json .

RUN npm ci

RUN npm build

COPY . .

EXPOSE 3000

ENV ADDRESS=0.0.0.0 PORT=3000

CMD ["npm", "start"]
