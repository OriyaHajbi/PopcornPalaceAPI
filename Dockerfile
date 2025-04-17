# Use Node.js official image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /oriya/src/app

# Copy package.json and package-lock.json (or yarn.lock) to install dependencies first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Build the TypeScript code into JavaScript
RUN npm run build

# Expose the port that the app will run on
EXPOSE 3000

# Start the application in production mode
CMD ["npm", "run", "start:prod"]
