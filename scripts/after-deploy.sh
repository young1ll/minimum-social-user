#!/bin/bash
REPOSITORY=/home/ubuntu/build

cd $REPOSITORY

docker stop user-server
docker rm user-server
docker build -t user-server .
docker run -d -p 8080:8080 --name user-server user-server