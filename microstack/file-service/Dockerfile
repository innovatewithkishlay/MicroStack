FROM node:18-bullseye

WORKDIR /app

# Copy package files first (efficient caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

EXPOSE 4002

CMD ["npm", "start"]
