FROM node:20

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

# Install Playwright browsers
RUN npx playwright install --with-deps

COPY . .

EXPOSE 3000

# It will allow hot-reloading thanks to the volumes in docker-compose.yml
CMD ["npm", "run", "dev"] 