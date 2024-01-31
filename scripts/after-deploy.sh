#!/bin/bash
REPOSITORY=/home/ubuntu/user-server/build
echo "> USER-SERVER REPOSITORY: $REPOSITORY"

cd $REPOSITORY

# Docker Stop & Remove
docker stop user-server
docker rm user-server

# Docker Build
docker build -t user-server .

# Docker Run
docker run -d -p 8000:8000 user-server