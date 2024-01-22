FROM node:20.11.0-alpine

WORKDIR /app

COPY package*.json yarn.lock .
RUN yarn install

COPY . .
RUN yarn build

EXPOSE 8000
CMD ["yarn", "start"]
