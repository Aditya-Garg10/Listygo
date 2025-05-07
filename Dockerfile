# Use official Node.js image from Docker Hub
FROM node:18

# Set working directory to /src
WORKDIR /

# Copy package.json and package-lock.json (if it exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code to the container
COPY . .

# Expose port 8000 to access the backend app
EXPOSE 8000

# Run the backend app
CMD ["npm", "start"]
