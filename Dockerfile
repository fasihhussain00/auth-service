FROM node:18-alpine
WORKDIR /app
COPY package*.json .
RUN npm i
COPY . .
RUN npm run build
CMD npm run migration:run && cd build && npm start
EXPOSE 5001