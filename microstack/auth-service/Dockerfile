FROM node:18-bullseye

WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies (full install, not --production)
RUN npm install

# Copy Prisma schema before generating client
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

EXPOSE 4001

CMD ["npm", "start"]
