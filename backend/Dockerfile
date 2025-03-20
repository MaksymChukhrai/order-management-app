# Используем Node.js образ
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем код в контейнер
COPY . .

# Указываем порт, который будет использоваться
EXPOSE 5000

# Запускаем сервер
CMD ["npm", "start"]
