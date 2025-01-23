FROM node:20-alpine3.19 AS build
WORKDIR /app
COPY . /app
RUN npm install && npm run build 

FROM node:20-alpine3.19 AS runtime
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN   npm install --production
COPY --from=build /app/dist /app/dist
RUN   npm install -g /app

ENTRYPOINT ["vehicle-cli"]