# Node server
FROM node:8.11.2 as node-server
RUN mkdir -p /usr/src/
WORKDIR /usr/src/
COPY package*.json /usr/src/
RUN npm cache clean -f
RUN npm cache verify
RUN npm install -f
COPY  . /usr/src/
EXPOSE 80
ENV jwtPrivateKey=;lksdlkslakdlkdslk
ENV NODE_ENV production
CMD [ "npm" , "start" ]