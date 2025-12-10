FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# Good practice for production
RUN npm ci --only=production

COPY . .

EXPOSE 3003

CMD ["node", "src/server.js"]