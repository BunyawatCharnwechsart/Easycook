FROM node:22-bookworm-slim

WORKDIR /app

ENV WRANGLER_SEND_METRICS=false

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 8787

CMD ["sh", "-c", "export PATH=/app/node_modules/.bin:$PATH && wrangler d1 execute easycookDB --local --file=src/schema.sql && wrangler dev --ip 0.0.0.0 --port 8787 --var JWT_SECRET:$$JWT_SECRET"]