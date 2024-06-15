# Use an official Node.js runtime as a parent image
FROM node:current-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Add the current directory contents into the container at /app
ADD . /app

# Install any needed packages specified in package.json
RUN npm install

# Make port 80 available to the world outside this container
EXPOSE 3000

# Run next dev when the container launches
CMD ["npx", "next", "dev"]