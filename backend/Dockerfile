FROM node:20-slim

# Install latest Chromium and required Linux dependencies for headless PDF generation
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
      wget \
      gnupg \
      ca-certificates \
      procps \
      libxss1 \
      fonts-liberation \
      libnss3 \
      lsb-release \
      xdg-utils \
      chromium \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
