#!/usr/bin/env bash

# set git info from env vars
git config --global user.name "$GIT_NAME"
git config --global user.email "$GIT_EMAIL"

# set npm token from env var
echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc

# update dependencies (we want the latest authcode) and run.
npm update && node index.js
