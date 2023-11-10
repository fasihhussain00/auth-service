FROM node:alpine
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
CMD cd build && npm run migration:run && npm start
EXPOSE 5001