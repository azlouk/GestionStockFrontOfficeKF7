# Use Node.js to build the Angular app
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --force

# Copy the rest of the application code
COPY . .

# Build the Angular app
RUN npm run build

# Use Nginx to serve the Angular app
FROM nginx:latest
COPY --from=build /app/dist/tuniselfrontend/browser /usr/share/nginx/html

# Copy custom Nginx configuration if needed
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
