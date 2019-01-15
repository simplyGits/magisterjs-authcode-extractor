FROM buildkite/puppeteer:latest

WORKDIR /usr/src/app
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1

RUN apt-get update \
	&& apt-get install -y git ssh

# install dependencies
COPY package*.json ./
RUN npm ci --only=production

# copy source code
COPY . .

CMD [ "./run.sh" ]
