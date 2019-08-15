# Node server
FROM node:8.11.2 as node-server
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm cache clean -f
RUN npm cache verify
RUN npm i redis
RUN npm install -f 
COPY  . /usr/src/app/

ENV jwtPrivateKey=;lksdlkslakdlkdslk
ENV NODE_ENV production
EXPOSE 6379
# CMD ["redis-server"]
EXPOSE 80
CMD [ "npm" , "start" ]