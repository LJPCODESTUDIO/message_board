#!/bin/bash

# Configuration
set -a && source .env && set +a
BLUE_DIR="../blue_env"
GREEN_DIR="../green_env"
BLUE_NAME="message-board-blue" # The process name for the blue environment
GREEN_NAME="message-board-green" # The process name for the green environment
GITHUB_REPO="https://github.com/LJPCODESTUDIO/message_board.git"

TARGET_NAME=$BLUE_NAME
TARGET_DIR=$BLUE_DIR
OLD_NAME=$GREEN_NAME

echo "Checking active environment"
if pm2 pid $TARGET_NAME | grep -q "."; then
  TARGET_NAME=$GREEN_NAME
  TARGET_DIR=$GREEN_DIR
  OLD_NAME=$BLUE_NAME
fi

echo "Pulling latest code into target environment ($TARGET_DIR)..."
cd $TARGET_DIR
git pull $GITHUB_REPO

echo "Building project..."
npm ci
npm run build

echo "Starting new environment..."
pm2 delete $TARGET_NAME
pm2 start server.js -n "$TARGET_NAME"

sleep 5 # Give the server a chance to start

echo "Checking target environment health..."
STATUS_CODE = $(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT)

if [ "$STATUS_CODE" -ne 200 ]; then
  echo "Target environment health check failed with status code: $STATUS_CODE"
  echo "Remaining on previous environment"
  exit 1
fi

echo "Target environment is healthy. Stopping previous environment"
pm2 delete $OLD_NAME
pm2 save

echo "Deployment complete. Target environment ($TARGET_NAME) is now live!"