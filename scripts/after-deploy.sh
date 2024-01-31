#!/bin/bash
REPOSITORY=/home/ubuntu/user-app
echo "> USER-APP REPOSITORY: $REPOSITORY"

cd $REPOSITORY

# 기존 컨테이너 중지 및 삭제
docker stop user-app
docker rm user-app

# Docker Build
docker build -t user-app:latest .

# Docker Run
docker run -d -p 8000:8000 --name user-app user-app:latest