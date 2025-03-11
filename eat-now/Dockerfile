# Stage 1: Build the Angular project
FROM node:18-alpine as build-step

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json /app/

# Install Angular CLI globally and project dependencies
RUN npm install -g @angular/cli@17 && npm install

# Copy the rest of the app to the working directory
COPY . /app

# Build the Angular app in production mode
RUN ng build --configuration production

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the build output from stage 1
COPY --from=build-step /app/dist/eat-now/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx and keep it running
CMD ["nginx", "-g", "daemon off;"]