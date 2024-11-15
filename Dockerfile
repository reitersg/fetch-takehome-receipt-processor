FROM node:23-alpine

WORKDIR /src

EXPOSE 3000

CMD ["npm", "start"]

COPY package.json /src

COPY package-lock.json /src

RUN npm ci

COPY . /src

RUN npm build

