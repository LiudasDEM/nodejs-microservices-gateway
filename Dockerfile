FROM node:12-alpine AS builder
RUN mkdir /prod_node_modules
WORKDIR /prod_node_modules
COPY package*.json ./
RUN npm ci --production --quiet
RUN mkdir /build
WORKDIR /build
COPY package*.json ./
RUN npm ci --quiet
COPY . .
RUN npm run build



FROM node:12-alpine
HEALTHCHECK CMD curl -f http://127.0.0.1:8080/api/health || exit 1
EXPOSE 8080
WORKDIR /usr/src/app
COPY --from=builder /prod_node_modules/node_modules ./node_modules
COPY --from=builder /build/dist ./dist
CMD [ "node", "dist/bundle.js" ]
