#!/bin/bash
REPOSITORY=/home/ubuntu/user-app
echo "> USER-APP REPOSITORY: $REPOSITORY"

cd $REPOSITORY

# 기존 컨테이너 확인 후 중지 및 삭제
if docker ps -a | grep -q user-app; then
    docker stop user-app
    docker rm user-app
fi

# Docker Build
if docker build -t user-app:latest .; then
    # Docker Run
    docker run -d -p 8000:8000 --name user-app user-app:latest
else
    echo "Docker build failed."
    exit 1
fi