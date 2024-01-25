FROM node:20.11.0-alpine

WORKDIR /app

COPY package*.json yarn.lock .
RUN yarn install

# MySQL 호스트 설정
ENV MYSQL_DB_HOST host.docker.internal

COPY . .
RUN yarn build

EXPOSE 8000
CMD ["yarn", "start"]
