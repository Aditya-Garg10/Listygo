# Use official Node.js image
FROM node:18-alpine

# 1. Pick a clear working directory
WORKDIR /app

# 2. Copy only package manifests, install deps (caches unless package.json changes)
COPY package*.json ./
RUN npm ci

# 3. Copy everything else (your index.js is at the project root, so it goes into /app)
COPY . .

# 4. Expose and start
EXPOSE 8000
# Make sure your package.json has "start": "node index.js"
CMD ["npm", "start"]
