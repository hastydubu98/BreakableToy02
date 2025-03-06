# Base image for Node.js
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /frontend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire frontend source code
COPY . .

# Expose Vite's default dev server port
EXPOSE 9090

# Run Vite dev server
CMD ["npm", "run", "dev"]



