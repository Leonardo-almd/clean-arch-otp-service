FROM node:22.18-alpine

WORKDIR /app

COPY package*.json ./

RUN mkdir -p /tmp/npm-cache \
 && npm install --no-audit --fund=false \
 && rm -rf /tmp/npm-cache /root/.npm/_cacache

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm","start"]
