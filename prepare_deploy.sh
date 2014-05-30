#!/bin/bash
#
# 
# Description : Prepare deploy packages for odin application. 
# Author : vassilux
# Last modified : 2014-05-30 14:37:47 
#

set -e

VER_MAJOR="1"
VER_MINOR="0"
VER_PATCH="0"

DEPLOY_DIR="avor_${VER_MAJOR}.${VER_MINOR}.${VER_PATCH}"
DEPLOY_FILE_NAME="avor_${VER_MAJOR}.${VER_MINOR}.${VER_PATCH}.tar.gz"

if [ -d "$DEPLOY_DIR" ]; then
    rm -rf  "$DEPLOY_DIR"
fi
#
#
mkdir "$DEPLOY_DIR"
cp -aR app "$DEPLOY_DIR"

tar cvzf "${DEPLOY_FILE_NAME" "$DEPLOY_DIR"

if [ ! -f "$DEPLOY_FILE_NAME" ]; then
    echo "Deploy build failed."
    exit 1
fi


rm -rf "$DEPLOY_DIR"
echo "Deploy build complete."
