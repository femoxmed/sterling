# Node server
FROM node:8.11.2 as node-server
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm cache clean -f
RUN npm cache verify
RUN npm install -f 
COPY  . /usr/src/app/
EXPOSE 6000
ENV jwtPrivateKey=;lksdlkslakdlkdslk
ENV NODE_ENV production
EXPOSE 6379
CMD ["redis-server"]
CMD [ "npm" , "start" ]