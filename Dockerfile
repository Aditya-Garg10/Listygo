# 1. Use a lightweight Node.js base
FROM node:18-alpine
WORKDIR /app

# 2. Install dependencies
COPY package*.json ./
RUN npm ci

# 3. Copy Firebase creds into the image
COPY firebase-credentials.json ./

# 4. Copy application source
COPY . .

# 5. Tell any client libraries where to find your credentials
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/firebase-credentials.json

# 6. Expose & run
EXPOSE 8000
CMD ["npm", "start"]