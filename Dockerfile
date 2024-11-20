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


# Set environment variables
# ENV NODE_ENV=production
# ENV DATABASE_URL="postgresql://iamuser:mypassword@subsmartdb.c1esicksyoj0.ap-south-1.rds.amazonaws.com:5432/subsmartdb"

# ENV NEXTAUTH_SECRET=password_nextauth

# ENV GOOGLE_ID=440557060881-fjvmfti4rl33nm1eoeaqbf55pfblvrh7.apps.googleusercontent.com

# ENV GOOGLE_SECRET=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


# Expose the port the app will run on
EXPOSE 3000

# Command to start the Next.js app
CMD ["npm", "start"]
