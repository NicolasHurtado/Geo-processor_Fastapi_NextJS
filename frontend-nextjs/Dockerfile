FROM node:20-alpine

WORKDIR /app



COPY package.json package-lock.json* ./

RUN npm install

COPY . .

EXPOSE 3000

# It will allow hot-reloading thanks to the volumes in docker-compose.yml
CMD ["npm", "run", "dev"] 