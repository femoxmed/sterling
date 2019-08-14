# Node server
FROM node:8.11.2 as node-server
RUN mkdir -p /usr/src/sterling_app/
WORKDIR /usr/src/Sterling_app
COPY package*.json /usr/src/Sterling_app/
RUN npm cache clean -f
RUN npm cache verify
RUN npm install -f 
COPY  . /usr/src/sterling_app/
EXPOSE 80
ENV jwtPrivateKey=;lksdlkslakdlkdslk
ENV NODE_ENV production
CMD [ "npm" , "start" ]