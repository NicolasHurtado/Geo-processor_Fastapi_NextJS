FROM node:20.14.0-bullseye
 

WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .

RUN npm run build

EXPOSE 3001

CMD ["bash", "run.sh"]
