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
VER_PATCH="6"

DEPLOY_DIR="avor_${VER_MAJOR}.${VER_MINOR}.${VER_PATCH}"
DEPLOY_FILE_NAME="avor_${VER_MAJOR}.${VER_MINOR}.${VER_PATCH}.tar.gz"

if [ -d "$DEPLOY_DIR" ]; then
    rm -rf  "$DEPLOY_DIR"
fi
#
if [ -f "$DEPLOY_FILE_NAME" ]; then
    rm -rf  "$DEPLOY_FILE_NAME"
fi
#
#
mkdir "$DEPLOY_DIR"
cp -aR app/* "$DEPLOY_DIR"
mkdir "$DEPLOY_DIR/docs"

sleep 1
pandoc -o "$DEPLOY_DIR/docs/INSTALL.html" ./docs/INSTALL.md
pandoc -o "$DEPLOY_DIR/docs/ReleaseNotes.html" ./docs/ReleaseNotes.md

cp "$DEPLOY_DIR/docs/INSTALL.html" .
cp "$DEPLOY_DIR/docs/ReleaseNotes.html" .

rm -rf "$DEPLOY_DIR/bower_components.tar.gz"
rm -rf "$DEPLOY_DIR/bower_components"

#find ${DEPLOY_DIR} -name CVS -prune -exec rm -rf {} \;

tar cvzf "${DEPLOY_FILE_NAME}" "${DEPLOY_DIR}"

if [ ! -f "$DEPLOY_FILE_NAME" ]; then
    echo "Deploy build failed."
    exit 1
fi

if [ ! -d releases ]; then
        mkdir releases
fi

mv ${DEPLOY_FILE_NAME} ./releases
mv INSTALL.* ./releases
mv ReleaseNotes.* ./releases

rm -rf "$DEPLOY_DIR"


echo "Deploy build complete."
