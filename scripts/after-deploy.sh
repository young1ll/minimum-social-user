#!/bin/bash
REPOSITORY=/home/ubuntu/user-server/build
echo "> USER-SERVER REPOSITORY: $REPOSITORY"

cd $REPOSITORY

# Docker Stop & Remove
sudo docker stop user-server
sudo docker rm user-server

# Docker Build
sudo docker build -t user-server .

# Docker Run
sudo docker run -d -p 8000:8000 user-server