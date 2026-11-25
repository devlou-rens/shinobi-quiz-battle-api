# SE2 handoff: Shinobi Quiz Battle frontend

## Connection

| Item | Value |
|---|---|
| Base URL (production) | `https://shinobi-quiz-battle-devlou-rens.onrender.com/api/v1` |
| Base URL (local) | `http://localhost:3001/api/v1` |
| Contract | Hub Contract v1.3; OpenAPI source: `src/docs/openapi.yaml`. Production Swagger UI: `https://shinobi-quiz-battle-devlou-rens.onrender.com/api/v1/docs/` |
| CORS | Add the exact frontend origin (including protocol and port) to the Render `CORS_ORIGINS` environment variable. Multiple origins are comma-separated. |
| Login | Call `POST /auth/login`. Use the returned token in protected requests with `Authorization: Bearer <token>`. Store it securely. The default token lifetime is 1 hour (`JWT_EXPIRES_IN` can override it). If a request returns `401 Unauthorized`, ask the user to log in again. |
| First request | The production API runs on Render's free service and may sleep after 15 minutes of inactivity. The first request may take longer while the service starts. |

## Screens and the endpoints they use

| Screen | Endpoints |
|---|---|
| Registration and login | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Player game lobby | `POST /sessions/{code}/players`, `GET /sessions/{code}/players`, `GET /sessions/{code}` |
| Player quiz | `GET /sessions/{code}/question`, `POST /sessions/{code}/answers` |
| Player leaderboard | `GET /sessions/{code}/leaderboard` |
| Host question-set management | `POST /question-sets`, `GET /question-sets/{id}`, `PATCH /question-sets/{id}`, `DELETE /question-sets/{id}` |
| Host question management | `GET /question-sets/{id}/questions`, `POST /question-sets/{id}/questions`, `PATCH /question-sets/{id}/questions/{questionId}`, `DELETE /question-sets/{id}/questions/{questionId}` |
| Host game management | `POST /sessions`, `GET /sessions/{code}`, `PATCH /sessions/{code}` |
| Admin user management | `GET /users`, `PATCH /users/{id}/role` |
| Library Game Hub | `GET /game-info`, `GET /results` |

## Known limits and the SE2 backlog

1. The production API uses Render's free service, which may sleep after inactivity and cause a cold start delay.
2. The production PostgreSQL database is scheduled to expire on December 24, 2026. Arrange a replacement or upgraded database before that date.
3. Build and test the frontend against the production API, including login/token handling, player gameplay, host controls, and admin access. Confirm the frontend origin is configured in `CORS_ORIGINS` before deployment.
