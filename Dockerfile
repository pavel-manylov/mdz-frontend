FROM node:16.6-alpine as build
RUN mkdir /app
WORKDIR /app
COPY . ./
RUN npm install
RUN npm run build

FROM nginx:1.20.1
COPY --from=build /app/build/ /usr/share/nginx/html
COPY docker/prepare-settings-docker.sh /docker-entrypoint.d/
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf