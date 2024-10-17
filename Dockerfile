FROM node:22.9.0-slim AS build

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Bundle app source
COPY . .
COPY urlsec.key /certs/
COPY urlsec.crt /certs/
COPY ca.crt /certs/

# Build the TypeScript files
RUN npm run build

# Stage 2: Runtime
# FROM node:22.9.0-slim

# Expose port 8080  
EXPOSE 8080

# Start the app 
CMD npm run start
