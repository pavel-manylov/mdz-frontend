# Тестовое задание Медузы — Frontend (редактор)

## Запуск в режиме разработки

1. Прописать в файле public/updateSettings.js путь до тестового API сервера
2. `docker-compose up -d` (запускается на порту 3002)

## Запуск в production-режиме

```bash
docker build -t mdz_frontend .
docker run -d --name mdz_frontend -e API_BASE_PATH=http://localhost:3000 -p 8001:80 mdz_frontend
```

В результате frontend будет запущен на порту 8001, API запросы будут направляться на http://localhost:3000