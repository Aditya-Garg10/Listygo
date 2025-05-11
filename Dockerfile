# Use official Node.js image
FROM node:18-alpine
WORKDIR /app

# 1. Install deps
COPY package*.json ./
RUN npm ci

# 2. Copy your Firebase credentials into /app
#    (so that /app/firebase-credentials.json exists)
COPY firebase-credentials.json ./

# 3. Copy the rest of your code
COPY . .

# 4. (Optional) set env var for other libs
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/firebase-credentials.json

EXPOSE 8000
CMD ["npm", "start"]
