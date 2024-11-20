# Stage 1: Build the Next.js app
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./ 
RUN npm install

# Copy the application code
COPY . .

# Build the Next.js application
RUN npm run build



# Expose the port the app will run on
EXPOSE 3000

# Command to start the Next.js app
CMD ["npm", "start"]
