# Stage 1: Build
FROM node:20 AS build
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx AS final
WORKDIR /usr/share/nginx/html
COPY --from=build /build/dist .
