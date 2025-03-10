# Запуск

```bash
cp .env.example .env
docker build -t your_super_account/movies .
docker run --name movies -p 8000:8050 -e APP_PORT=8050 your_super_account/movies
```

# Фронтенд частина в файлі index.html
