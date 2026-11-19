#!/bin/bash

# Configuration
BLUE_DIR = "/sites/message_board/blue_env"
GREEN_DIR = "/sites/message_board/green_env"
BLUE_PORT = 3001
GREEN_PORT = 3002
BLUE_NAME = "message-board-blue" # The process name for the blue environment
GREEN_NAME = "message-board-green" # The process name for the green environment
GITHUB_REPO = "https://github.com/LJPCODESTUDIO/message_board.git"

TARGET_NAME = $BLUE_NAME
TARGET_PORT = $BLUE_PORT
TARGET_DiR = $BLUE_DIR
OLD_NAME = $GREEN_NAME

echo "Checking active environment"
if [ pm2 pid $TARGET_NAME | grep -q . ]; then
  TARGET_NAME = $GREEN_NAME
  TARGET_PORT = $GREEN_PORT
  TARGET_DIR = $GREEN_DIR
  OLD_NAME = $BLUE_NAME
fi

echo "Pulling latest code into target environment ($TARGET_DIR)..."
cd $TARGET_DIR
git pull $GITHUB_REPO

echo "Building project..."