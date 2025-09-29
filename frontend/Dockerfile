FROM node:18-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all source files explicitly
COPY . .

# Verify the utils.ts file exists
RUN ls -la src/lib/ || echo "lib directory not found"
RUN cat src/lib/utils.ts || echo "utils.ts not found"

# Build the application
RUN npm run build

# Use a lightweight server for production
RUN npm install -g serve

EXPOSE $PORT

# Start the application using Railway's PORT
CMD serve -s dist -l $PORT