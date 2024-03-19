## Моя конфігурація:
    1. NodeJS: v20.11.0
    2. Для докеру використав образ node:20.11-alpine
    3. Docker version 24.0.6, build ed223bc

## nvm:
    1. Для контролю версій NodeJS використовува nvm.
    2. Якщо версія NodeJS відрізняється, то можна встановити за допомогою => nvm install 20.11.0
    3. Перейти на версію можна за допомогою команди => nvm use 20.11.0

## Кроки для запуску програми:
    1. Створити .env файл
    2. Встановити всі пакети => yarn install
    3. Забілдити проект для генерації dist-папки => yarn run build
    4. Забілдити Docker => docker-compose build
    5. Підняти контейнери. Разом з цим запуститься сервер та можна протестувати роути => docker-compose up
    6. Swagger => http://localhost:5000/api

## .env
    1. Це звичайний енв файл, де потрібно вказати данні БД, порт та PRIVATE_KEY для jwt
    2. В поле POSTGRES_HOST заноситься назва процесу БД з services в docker-compose файла(В нашому випадку -  postgres)

## Приклад .prod.env файлу
    PORT=5000
    POSTGRES_HOST=localhost
    POSTGRESS_PORT=5432
    POSTGRES_USER=postgres
    POSTGRESS_PASSWORD=1111
    POSTGRES_DB=red_cat_db
    PRIVATE_KEY=some-key