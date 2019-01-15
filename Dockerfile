FROM node:current-stretch

WORKDIR /usr/src/app

# install dependencies
COPY package*.json ./
RUN npm install --only=production

# copy source code
COPY . .

CMD [ "run.sh" ]
