# Journal Service Dockerfile
FROM node:18-alpine as base

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Development stage
FROM base as development
RUN npm install
COPY . .
EXPOSE 3002
CMD ["npm", "run", "start:dev"]

# Production stage
FROM base as production
COPY . .
EXPOSE 3002
CMD ["npm", "run", "start:prod"]
