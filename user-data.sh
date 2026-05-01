#!/bin/bash
sudo apt update -y
sudo apt upgrade -y
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
#ssh -i "user-service-key.pem" ubuntu@13.206.187.253
#git commit --allow-empty -m "msg"
#git push origin main