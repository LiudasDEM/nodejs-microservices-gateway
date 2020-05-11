FROM node:10 AS builder
RUN mkdir /build
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


FROM bitnami/node:10-prod
HEALTHCHECK CMD curl -f http://127.0.0.1:8080/api/health || exit 1
EXPOSE 8080
WORKDIR /usr/src/app
COPY --from=builder /build .
CMD [ "node", "dist/bundle.js" ]
