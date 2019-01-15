#!/usr/bin/env bash

echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc

git config credential.helper '!f() { sleep 1; echo "username=${GIT_USER}\npassword=${GIT_PASSWORD}"; }; f'

npm update && node index.js
