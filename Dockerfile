FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# # Use production environment by default
# ENV NODE_ENV=production

# Install app dependencies (copy package files first for better caching)
COPY package*.json ./
RUN npm ci
RUN npm install -g nodemon

# Create non-root user early
RUN addgroup -S app && adduser -S app -G app

# Copy app source
COPY . .

# Ensure logs directory exists (will fix permission issues)
RUN mkdir -p /usr/src/app/logs && chown -R app:app /usr/src/app/logs

# Expose default port
EXPOSE 3000

# Use non-root user
USER app

# Start the app in dev mode
CMD ["npm", "run", "dev"]
