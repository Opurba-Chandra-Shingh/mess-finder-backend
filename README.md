# Mess Finder - Backend

A website where varsity students find a mess and mess managers advertise free seats.
Students browse messes, post "seat wanted", chat with managers and get a seat.
Managers keep their rooms, members, monthly rent and payments in one place.

This repository holds the **database** and the **Express API**.
The website pages live in the separate `frontend` repository.

## Technology

| Part | Technology |
|---|---|
| Database | MySQL 8 (plain SQL, no ORM) |
| API | Node.js and Express.js 5 |
| Chat | Socket.io (added in a later step) |
| Login | bcryptjs (passwords) and JSON Web Tokens |
| Database driver | mysql2 |

## Project status

| Phase | Work | State |
|---|---|---|
| 1 | Database schema (26 tables), demo data, basic queries | Done |
| 2 | Advanced SQL: views, functions, procedures, triggers, events, indexes | Done |
| 3 | Express API | In progress: login, messes, manager setup, newsfeed and Interested done |
| 4 | Frontend | Planned |

## Run the API

1. Build the database and load the demo data, see [database/README.md](database/README.md).
2. Copy `.env.example` to `.env` and fill in `DB_PASSWORD` and a long random `JWT_SECRET`.
3. Install the packages:

```powershell
npm install
```

4. Start the server (`npm run dev` restarts it on every change):

```powershell
npm start
```

5. Open `http://localhost:5000/api/health`. It should show `{"status":"ok"}`.

Run the automated tests (they use the demo database, so do not change its data first):

```powershell
npm test
```

## Folder structure

```
backend/
|-- server.js               starts the server
|-- package.json
|-- .env.example            copy to .env and fill in your own values
|-- src/
|   |-- app.js              builds the Express app
|   |-- config/             env.js (settings) and db.js (MySQL connection pool)
|   |-- middleware/         auth.js (login check, roles) and error-handler.js
|   |-- routes/             which address goes to which controller
|   |-- controllers/        the code of each endpoint (the SQL lives here)
|   `-- utils/              input checks and the AppError class
|-- tests/                  automated tests of the API
`-- database/               everything about MySQL, see database/README.md
```

## API

Every address starts with `/api`. The website sends and receives JSON.
When something goes wrong the answer is `{ "error": "message" }` with a fitting status code (400, 401, 403, 404, 409).
A logged in user sends the token in the header `Authorization: Bearer <token>`.

### Login and account

| Method and address | Who | What it does |
|---|---|---|
| `POST /auth/register` | everybody | Create a student or manager account, returns a token. |
| `POST /auth/login` | everybody | Log in, returns a token. |
| `GET /auth/me` | logged in | Own details. A student also gets the mess he lives in, a manager gets his mess. |
| `GET /health` | everybody | Is the server up and connected to MySQL? |
| `GET /reference/areas`, `/universities`, `/facilities` | everybody | Lists for forms and filters. |

### Messes

| Method and address | Who | What it does |
|---|---|---|
| `GET /messes` | everybody | Mess cards. Filters: `area_id`, `type`, `min_rent`, `max_rent`, `min_rating`, `has_meal`, `utility_included`, `only_free`, `facility_ids=1,4`, `university_id`, `q`. Sorting: `sort=newest, rent_low, rent_high, rating, nearest`. Pages: `page`, `limit`. |
| `GET /messes/nearby?university_id=3&km=3` | everybody | Messes within X km of a university, nearest first, with `distance_km`. |
| `GET /messes/:id` | everybody | Details page: facilities, nearby universities, history numbers, ratings. A logged in user also gets the phone numbers and what he can do here (`viewer`). |
| `GET /messes/:id/seats` | everybody | Rooms with their seats. The manager of the mess sees who lives in each seat. |
| `GET /messes/:id/history` | everybody | Established year, total members ever, members now (numbers only). |
| `GET /messes/:id/reviews` | everybody | Reviews with "Current member" or "Ex-member" and the manager's reply. |

A mess that the admin has not verified yet is visible only to its manager and the admin.

### Newsfeed, comments and Interested

| Method and address | Who | What it does |
|---|---|---|
| `GET /newsfeed` | everybody | Vacancy posts and seat wanted posts together, newest first. Filters: `type=vacancy` or `seat_wanted`, `area_id`, `mess_type`, `status=open`. Closed and removed posts are not shown. |
| `POST /seat-wanted` | student | Make a "seat wanted" post (at most 5 open at the same time). |
| `GET /seat-wanted/my` | student | His own posts. |
| `PATCH /seat-wanted/:id/close` | student | Close his own post. |
| `GET /posts/vacancy/:id/comments`, `GET /posts/wanted/:id/comments` | everybody | The comments of a post. |
| `POST /posts/vacancy/:id/comments`, `POST /posts/wanted/:id/comments` | logged in | Write a comment (`{ "body": "..." }`). The owner of the post gets a notification. |
| `DELETE /comments/:id` | owner or admin | Hides a comment (soft delete). |
| `POST /interests/toggle` | student | The Interested button: `{ "mess_id": 1, "post_id": 3 }`. Press again to remove. |
| `GET /interests/my` | student | The messes he marked, with the chat if there is one. |

### Manager: mess, rooms, seats and posts

All these need a manager login. A manager can reach only his own mess, rooms and seats.

| Method and address | What it does |
|---|---|
| `POST /manager/mess`, `GET /manager/mess`, `PUT /manager/mess` | Create (it waits for the admin), read and change the mess with its facilities and nearby universities. |
| `POST /manager/rooms`, `PATCH /manager/rooms/:id` | Add and change a room. |
| `PATCH /manager/rooms/:id/deactivate`, `.../activate` | Switch a room off or on (not possible while members live in it). |
| `POST /manager/rooms/:id/seats` | Add a seat to a room. |
| `PATCH /manager/seats/:id/rent` | Change the rent of a seat (the old rent is logged, members keep their own rent). |
| `PATCH /manager/seats/:id/deactivate`, `.../activate` | Switch a seat off or on (not possible while a member lives in it). |
| `GET /manager/rooms-seats` | The Room-wise seats page: every room with its seats and who lives in them. |
| `POST /manager/posts`, `GET /manager/posts`, `PATCH /manager/posts/:id/close` | Vacancy posts: `{ "title", "description", "available_from", "seat_ids": [19, 18] }`. |
| `GET /manager/interests` | The students who are interested in his mess. |
