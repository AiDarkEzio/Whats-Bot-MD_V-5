FROM node:lts-buster

RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*

COPY package.json .

RUN npm install
RUN npm install supervisor -g

COPY . .

CMD ["supervisor", "-w", "lib,plugins,index.js,globle.js", "index.js"]
