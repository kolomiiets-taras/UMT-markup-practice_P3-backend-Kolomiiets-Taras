# Flora — Backend (Scope 3)

Express + PostgreSQL + Sequelize REST API для проєкту Flora. Навчальний проєкт UMT. Автор — Коломієць Тарас Павлович.

## Стек

- Node.js 20+ / Express
- PostgreSQL + Sequelize ORM
- Joi (валідація) — окремі схеми create / update / favorite
- Multer (завантаження файлів)
- Swagger UI (`/api-docs`)
- CORS, Morgan, dotenv

## Структура

```
.
├── server.js            # точка запуску, виклик connect() → app.listen()
├── app.js               # Express, middleware, маршрути, swagger
├── routes/bouquets.js
├── controllers/bouquets.js
├── services/bouquets.js # Sequelize-методи
├── models/
│   ├── index.js         # Sequelize init + connect (process.exit(1) on fail)
│   └── bouquet.js       # модель Bouquet
├── schemas/bouquets.js  # Joi: create / update / favorite
├── middlewares/
│   ├── validateBody.js
│   ├── upload.js        # Multer (temp → /public/photos)
│   └── errorHandler.js
├── helpers/HttpError.js
├── public/photos/       # постійні фото, віддаються через express.static
├── temp/                # тимчасові завантажені файли Multer
├── swagger.json
├── .env.example
└── package.json
```

## API

Базовий URL: `/api/bouquets`.

| Метод | Endpoint                       | Опис                                                              |
|-------|--------------------------------|-------------------------------------------------------------------|
| GET   | `/api/bouquets`                | Список усіх букетів. `200`                                        |
| GET   | `/api/bouquets/:id`            | Один букет. `200` або `404 { message: "Not found" }`              |
| POST  | `/api/bouquets`                | Створити (Joi `bouquetCreateSchema`, `photoURL` через gravatar). `201` / `400` |
| PUT   | `/api/bouquets/:id`            | Оновити (Joi `bouquetUpdateSchema`, body не може бути порожнім). `200` / `400` / `404` |
| DELETE| `/api/bouquets/:id`            | Видалити. `200` / `404`                                           |
| PATCH | `/api/bouquets/:id/favorite`   | Оновити прапорець `favorite` (Joi `bouquetFavoriteSchema`).       |
| PATCH | `/api/bouquets/:id/photo`      | Завантажити фото (`multipart/form-data`, поле `photo`). Файл переноситься з `/temp` у `/public/photos` з унікальним іменем `${id}_${Date.now()}_${originalname}`. Повертається оновлений `photoURL`. |

Документація: `/api-docs` (Swagger UI), JSON: `/api-docs.json`.

## Локальний запуск

1. Встановити залежності:
   ```bash
   npm install
   ```
2. Скопіювати `.env.example` → `.env` і заповнити:
   ```env
   PORT=3000
   DB_HOST=...
   DB_PORT=5432
   DB_USER=...
   DB_PASSWORD=...
   DB_NAME=flora
   DB_SSL=false                # true для Render Postgres
   PUBLIC_BASE_URL=http://localhost:3000
   ```
3. Підняти сервер:
   ```bash
   npm run dev      # nodemon з --watch
   # або
   npm start
   ```
4. Перевірити:
   - API: `http://localhost:3000/api/bouquets`
   - Swagger UI: `http://localhost:3000/api-docs`

При успішному з'єднанні з БД у консоль виводиться `Database connection successful`. При фейлі — `process.exit(1)`.

## Деплой на Render

### 1. PostgreSQL
- Render → **New → PostgreSQL** → виставити план Free → Create.
- Зі сторінки бази скопіювати **Internal Database URL** (або окремі поля Host / Port / User / Password / Database).
- Для зовнішніх клієнтів використовуйте **External Database URL** з SSL.

### 2. Web Service
- Render → **New → Web Service** → під'єднати GitHub-репозиторій.
- Environment: `Node`. Build Command: `npm install`. Start Command: `npm start`.
- Environment Variables (Render → Environment):
  - `PORT` — Render сам пробросить, не задавати або поставити `10000`.
  - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` з облікового запису Postgres.
  - `DB_SSL=true`.
  - `PUBLIC_BASE_URL` — публічний URL сервісу, наприклад `https://flora-backend.onrender.com`.
- Після першого деплою Sequelize створить таблицю `bouquets` автоматично через `sync()`.

### 3. Swagger UI
Доступний на проді за `${PUBLIC_BASE_URL}/api-docs`.

## Інтеграція з frontend

У `flora-frontend/js/api.js` замінити `BASE_URL` на адресу задеплоєного backend, наприклад:
```js
const BASE_URL = 'https://flora-backend.onrender.com/api';
```
Решту коду не змінювати — `/bouquets` URL збігається з реалізованим маршрутом.
