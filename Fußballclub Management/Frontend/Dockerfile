# syntax=docker/dockerfile:1

#-------------------------------------------------------------------------------
# Schritt 1: Deploybare App bauen (in einem temporären Container)
#-------------------------------------------------------------------------------
FROM node:17-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY scripts ./scripts
COPY static ./static
COPY src ./src
RUN npm run build

#-------------------------------------------------------------------------------
# Schritt 2: Den eigentlichen Container bauen
#-------------------------------------------------------------------------------
FROM nginx:alpine
COPY save-api-url.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/save-api-url.sh
COPY --from=build /app/build /usr/share/nginx/html
