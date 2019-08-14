# Node server
FROM node:8.11.2 as node-server
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm cache clean -f
RUN npm cache verify
RUN npm install -f 
COPY  . /usr/src/app/
EXPOSE 80
ENV coPrivateKey=;lksdlkslakdlkdslk
ENV NODE_ENV production
ENV GEOLOCATION_API_KEY=AIzaSyB8lm4CEk6YVOXTVvkeDDluMEXb06rOkhw
CMD [ "npm" , "start" ]