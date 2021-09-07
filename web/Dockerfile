FROM node:14.14.0-alpine
WORKDIR /app
COPY package.json .
RUN npm install && npm install -g pm2
COPY . .
CMD ["pm2", "start", "app.js"]