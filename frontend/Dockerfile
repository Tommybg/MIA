FROM node:18-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Install serve globally
RUN npm install -g serve

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Remove source files to reduce image size
RUN rm -rf src public node_modules/.cache

EXPOSE 3000

# Start the application using Railway's PORT
CMD ["sh", "-c", "serve -s dist -l ${PORT:-3000}"]
