#!/bin/bash
REPOSITORY=/home/ubuntu/user-server/build
echo "> USER-SERVER REPOSITORY: $REPOSITORY"

cd $REPOSITORY

# 기존 컨테이너 중지 및 삭제
sudo docker stop user-server
sudo docker rm user-server

# Docker Build
sudo docker build -t user-server:latest .

# Docker Run
sudo docker run -d -p 8000:8000 --name user-server user-server:latest