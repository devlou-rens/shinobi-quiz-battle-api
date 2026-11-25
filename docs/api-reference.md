# API reference: Shinobi Quiz Battle API 1.6.1

Generated from `src/docs/openapi.yaml` by `npm run docs:api`. Base URL: `/api/v1`. Try every endpoint in Swagger UI at `/api/v1/docs/`.

Every error answers `{ "error": { "code": "...", "message": "..." } }`. "Login" means the header `Authorization: Bearer <token>`.

## Hub Contract

| Method | Path | What it does | Needs | Answers |
|---|---|---|---|---|
| GET | `/health` | Check API and database health | nothing | 200, 503 |
| GET | `/game-info` | Get game information for the Library Game Hub | nothing | 200 |
| GET | `/results` | Retrieve finished game results for the Library Game Hub | X-Hub-Key | 200, 400, 401 |

## Accounts

| Method | Path | What it does | Needs | Answers |
|---|---|---|---|---|
| POST | `/auth/register` | Register a new PLAYER account | nothing | 201, 400, 409 |
| POST | `/auth/login` | Log in using school ID and password | nothing | 200, 400, 401 |
| GET | `/auth/me` | Get the currently authenticated user's account | login | 200, 401, 404 |

## Users

| Method | Path | What it does | Needs | Answers |
|---|---|---|---|---|
| GET | `/users` | List all user accounts | login | 200, 401, 403 |
| PATCH | `/users/{id}/role` | Change a user's role | login | 200, 400, 401, 403, 404, 409 |

## Sessions

| Method | Path | What it does | Needs | Answers |
|---|---|---|---|---|
| POST | `/sessions` | Create a new multiplayer game session | login | 201, 400, 401, 403 |
| GET | `/sessions/{code}` | Retrieve a game session using its join code | nothing | 200, 400, 404 |
| PATCH | `/sessions/{code}` | Update the status or current question position of a session | login | 200, 400, 401, 403, 404, 409 |
| GET | `/sessions/{code}/question` | Get the current unanswered question for a player | login | 200, 401, 404, 409 |

## Answers

| Method | Path | What it does | Needs | Answers |
|---|---|---|---|---|
| POST | `/sessions/{code}/answers` | Submit an answer to the active question | login | 201, 400, 401, 404, 409 |

## Players

| Method | Path | What it does | Needs | Answers |
|---|---|---|---|---|
| GET | `/sessions/{code}/players` | List players who joined a game session | nothing | 200, 404 |
| POST | `/sessions/{code}/players` | Join or rejoin a game session | login | 200, 201, 400, 401, 404, 409 |
| GET | `/sessions/{code}/leaderboard` | Retrieve the session leaderboard | nothing | 200, 400, 404 |

## Question Sets

| Method | Path | What it does | Needs | Answers |
|---|---|---|---|---|
| POST | `/question-sets` | Create a new question set | login | 201, 400, 401, 403 |
| GET | `/question-sets/{id}` | Get one question set | login | 200, 400, 401, 403, 404 |
| PATCH | `/question-sets/{id}` | Update a question set | login | 200, 400, 401, 403, 404 |
| DELETE | `/question-sets/{id}` | Delete a question set | login | 204, 401, 403, 404, 409 |
| PUT | `/question-sets/{id}/cover` | Upload a cover image for a question set | login | 200, 400, 401, 403, 404, 413 |

## Questions

| Method | Path | What it does | Needs | Answers |
|---|---|---|---|---|
| GET | `/question-sets/{id}/questions` | List questions in a question set | login | 200, 400, 401, 403, 404 |
| POST | `/question-sets/{id}/questions` | Add a question to a question set | login | 201, 400, 401, 403, 404 |
| PATCH | `/question-sets/{id}/questions/{questionId}` | Update a question in a question set | login | 200, 400, 401, 403, 404 |
| DELETE | `/question-sets/{id}/questions/{questionId}` | Delete a question from a question set | login | 204, 401, 403, 404 |

