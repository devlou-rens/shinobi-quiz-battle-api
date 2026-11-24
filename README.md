# Shinobi Quiz Battle API

Backend API for **Shinobi Quiz Battle**, a tournament game for the SorSU Bulan Campus library.
CS 313 Software Engineering 1, A.Y. 2026–2027.

- **Developer:** Lourens Gacias (`devlou-rens`), BSCS 3-1
- **Group and game concept:** Team 2 – Shinobi Quiz Battle

This is my own build of my group's game concept. Every commit in this repository was made by me, with Git, on my own computer or in my own Codespace.


## Tech stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 22 LTS or newer |
| Web framework | Express 5 |
| Database | PostgreSQL 16 or newer |
| ORM and migrations | Sequelize 6 with sequelize-cli |

## Setup

```bash
git clone [repository-url]
cd [folder-name]
npm install
```

Copy `.env.example` to `.env`, then put your own PostgreSQL password in `DB_PASSWORD`.

```bash
npm run db:create
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

Run `npm run db:create` only the first time.

## Environment variables

| Key | Example | Purpose |
|---|---|---|
| NODE_ENV | development | Which config block to use |
| PORT | 3001 | Port the API listens on |
| DB_HOST | 127.0.0.1 | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | your_game_slug | Database name |
| DB_USER | postgres | Database user |
| DB_PASSWORD | (your own) | Database password. Never commit this. |
| HUB_API_KEY | dev-hub-key | Key the Library Game Hub sends to read results. |

## Endpoints (Hub Contract v1.2)

Base URL: `http://localhost:3001/api/v1`

| Method | Path | Purpose | Success |
|---|---|---|---|
| GET | `/health` | Check API and database health | 200 |
| GET | `/game-info` | Return game information | 200 |
| GET | `/results` | Return finished games, players, and top 3. Requires `X-Hub-Key`. | 200 |
| GET | `/results?since=<timestamp>` | Filter results by end time | 200 |

The results endpoint returns 401 when the required Hub key is missing or invalid.

## Gameplay API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/v1/auth/login` | Log in a host |
| POST | `/api/v1/question-sets` | Create a Question Set |
| POST | `/api/v1/sessions` | Create a game session and join code |
| GET | `/api/v1/sessions/:code` | Retrieve session information |
| PATCH | `/api/v1/sessions/:code` | Update session status |
| POST | `/api/v1/sessions/:code/players` | Join a game session |
| GET | `/api/v1/sessions/:code/question` | Retrieve the player's current question |
| POST | `/api/v1/sessions/:code/answers` | Submit an answer |
| GET | `/api/v1/sessions/:code/players` | List session players |
| GET | `/api/v1/sessions/:code/leaderboard?limit=10` | View the live leaderboard |

## Gameplay flow

1. The host creates a session and receives a six-digit join code.
2. Players join while the session is in the lobby.
3. The host starts the game.
4. Players answer questions within the question time limit.
5. The server checks answers, calculates points, and updates Chakra.
6. Players continue through the questions. After answering all questions in the set, the question cycle can repeat.
7. The leaderboard ranks players by Chakra.
8. The game ends when the 10-minute session timer expires.

## Scoring formula

```text
points = round(1000 × (1 − elapsed / (2 × limit)))
```

- Base points: 1000
- `elapsed`: Server-measured answer time.
- `limit`: Question time limit.
- Incorrect or late answers receive 0 points.

**Example:** A correct answer submitted in 10 seconds with a 20-second limit earns **750 points**.

The server measures elapsed time and calculates the score.

## Game completion rule

A player is considered **completed** after answering every question in the session's selected Question Set at least once. Both correct and incorrect answers count. Players who leave before answering every question are marked **incomplete**.

## Database tables

| Table | Purpose |
|---|---|
| `users` | Stores user accounts and host information |
| `QuestionSet` | Stores collections of quiz questions |
| `GameSession` | Stores game sessions, join codes, status, and timer information |
| `Player` | Stores players in sessions and their accumulated Chakra |
| `Question` | Stores quiz questions and correct-answer information |
| `QuestionChoice` | Stores the choices for each question |
| `Answer` | Stores submitted-answer history and correctness |
| `PlayerQuestion` | Tracks each player's question progress and timing |
| `RewardRound` | Stores reward-round records |
| `RewardObject` | Stores available reward objects and their values |

## Demo accounts

The following accounts are available for testing the Shinobi Quiz Battle API.

**Shared demo password:** `shinobi123`

| School ID | Account | Role |
|---|---|---|
| `24179712` | Kakashi Hatake | HOST |
| `24179723` | Hinata Hyuga | PLAYER |
| `24179795` | Naruto Uzumaki | PLAYER |
| `24179111` | Sasuke Uchiha | PLAYER |
| `24179221` | Sakura Haruno | PLAYER |
| `24179333` | Tsunade Senju | HOST |

These are development and testing accounts only. Do not use these credentials in production.

## Database scripts

| Command | What it does |
|---|---|
| `npm run db:migrate` | Runs migrations that have not run yet |
| `npm run db:migrate:status` | Lists every migration as up or down |
| `npm run db:seed` | Loads the seed data |
| `npm run db:check` | Counts the rows in every table |
| `npm run db:reset` | Rebuilds the database and reloads seed data |
| `npm run check` | Runs the automatic project check |


## Automated tests

The project uses Jest for automated testing and Supertest for API endpoint testing.

### Run all tests

```bash
npm test
```

### Run tests with coverage

```bash
npm run test:coverage
```

The coverage report shows how much of the source code is covered by the tests. Jest also generates a `coverage` folder containing the detailed report.

### Test database

Automated tests use a dedicated test database named `shinobi_quiz_battle_test`.

Before running the tests, the Jest global setup prepares the test database by:
1. Creating the test database if it does not exist.
2. Clearing the test database.
3. Running all database migrations.
4. Loading the seed data.

**Important:** Automated tests should use the dedicated test database, not the development or production database.
