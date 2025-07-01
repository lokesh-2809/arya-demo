# Use official Node.js image
FROM node:20-alpine
 
# Create app directory
WORKDIR /usr/src/app
 
# Copy package files
COPY package*.json ./
 
# Install dependencies
RUN npm install
 
# Bundle app source
COPY . .
 
# Expose port
EXPOSE 5000
 
# Run the app
CMD ["node", "app.js"]