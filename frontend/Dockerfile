FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Важно: добавляем опцию --host для правильного доступа в Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

EXPOSE 5173