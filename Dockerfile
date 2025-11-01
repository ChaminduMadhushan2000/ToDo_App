FROM node:18-alpine
WORKDIR /todo-app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node","server.js"]
