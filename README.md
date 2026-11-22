# Mess Finder - Backend

A website where varsity students find a mess and mess managers advertise free seats.
Students browse messes, post "seat wanted", chat with managers and get a seat.
Managers keep their rooms, members, monthly rent and payments in one place.

This repository holds the **database** and (from Phase 3) the **Express API**.
The website pages live in the separate `frontend` repository.

## Technology

| Part | Technology |
|---|---|
| Database | MySQL 8 (plain SQL, no ORM) |
| API | Node.js and Express.js |
| Chat | Socket.io |
| Login | bcrypt (passwords) and JSON Web Tokens |
| Database driver | mysql2 |

## Project status

| Phase | Work | State |
|---|---|---|
| 1 | Database schema (26 tables), demo data, basic queries | Done |
| 2 | Advanced SQL: views, functions, procedures, triggers, events, indexes | Next |
| 3 | Express API | Planned |
| 4 | Frontend | Planned |

## Folder structure

```
backend/
|-- README.md
|-- .env.example            copy to .env and fill in your own values
|-- .gitignore
`-- database/               everything about MySQL, see database/README.md
    |-- schema/             CREATE TABLE files, one per topic
    |-- seed/               demo data
    |-- queries/basic/      SELECT, INSERT, UPDATE, DELETE and integrity examples
    |-- scripts/            setup and reset scripts
    `-- build/              the whole database joined into one file for Workbench
```

The `src/` folder with the API code will be added in Phase 3.

## Quick start (database)

1. Open MySQL Workbench and connect to your local server.
2. Choose **File > Open SQL Script** and select `database/build/mess_finder_full.sql`.
3. Press the lightning button. The `mess_finder` database is created with demo data.

More ways to build it, the demo logins and the design notes are in [database/README.md](database/README.md).
