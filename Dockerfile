# Use the official Node.js image as the base image
FROM node:22 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Use the official Nginx image
FROM nginx:alpine

# Copy the updated nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output to Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
