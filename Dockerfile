FROM node:12
WORKDIR /app
COPY ./ ./
#RUN npm install
EXPOSE 5262
CMD [ "npm", "run", "start" ]