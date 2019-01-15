FROM buildkite/puppeteer:latest

WORKDIR /usr/src/app

RUN apt-get update \
	&& apt-get install -y git ssh

# install dependencies
COPY package*.json ./
RUN npm install --only=production

# copy source code
COPY . .

CMD [ "./run.sh" ]
