# User guide: Shinobi Quiz Battle API

This guide explains how Players, Hosts, Administrators, and the Library Game Hub use the Shinobi Quiz Battle API.

**Live API base URL:**  
`https://shinobi-quiz-battle-devlou-rens.onrender.com/api/v1`

**Interactive Swagger documentation:**  
`https://shinobi-quiz-battle-devlou-rens.onrender.com/api/v1/docs/`

Standard API errors use this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Description of the error."
  }
}
```

For protected endpoints, include this request header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Do not share your JWT token with other people.

## Players

### 1. Create an account

Send a `POST /auth/register` request with the following JSON body:

```json
{
  "school_id": "20240001",
  "full_name": "Nina Cruz",
  "email": "nina@example.com",
  "password": "Libro-2026"
}
```

Use a valid school ID, full name, email address, and password. The password must contain at least eight characters, including at least one letter and one number.

New registrations are automatically assigned the `PLAYER` role. Supplying another role during registration does not grant additional permissions.

A successful registration returns HTTP `201`.

### 2. Log in and keep the token

Send a `POST /auth/login` request:

```json
{
  "school_id": "20240001",
  "password": "Libro-2026"
}
```

A successful login returns a JWT token, its token type, expiration, and account information.

Copy the token and use it in the `Authorization` header for protected endpoints.

You can verify your login using `GET /auth/me`.

### 3. Join or rejoin a game

Ask the Host for the six-digit Game PIN.

Send a `POST /sessions/{code}/players` request. Replace `{code}` with the Game PIN and provide a nickname and avatar:

```json
{
  "nickname": "NarutoFan",
  "avatar": "naruto"
}
```

A successful new join returns HTTP `201`. If the same account joins the same session again, the API returns HTTP `200` and the existing player record. Rejoining preserves the player's existing game record and Chakra.

You can view the other participants using `GET /sessions/{code}/players`.

### 4. Play the game

Once the Host starts the session, request a question using:

`GET /sessions/{code}/question`

The response contains the question, its time limit, and available choices.

Submit your selected answer through:

`POST /sessions/{code}/answers`

Example request:

```json
{
  "questionId": 1,
  "choiceId": 1
}
```

The API checks the submitted answer, calculates the points earned, records the result, and updates the player's Chakra.

After submitting an answer, request the next question. Questions are selected independently for each player. When a player finishes the available questions in a cycle, the question progress resets and another randomized cycle begins.

Continue answering until the game timer expires or the Host closes the session.

### 5. View the leaderboard

Send a `GET /sessions/{code}/leaderboard` request to view the current rankings.

You may provide the optional `limit` query parameter to control how many leaderboard entries are returned. The allowed range is 1 to 100, and the default is 10.

The leaderboard displays player information and Chakra totals.

**When is a game considered completed?**

A player does not complete the game merely by answering every available question once. The game continues through repeated question cycles. The session is considered finished when its status becomes `CLOSED`, either because the game timer expires or the Host or an Administrator closes it.

## Hosts

### 1. Prepare the game content

Log in using a Host account. Create a question set through:

`POST /question-sets`

Example request:

```json
{
  "title": "Naruto General Knowledge",
  "subject": "Anime"
}
```

Add questions using:

`POST /question-sets/{id}/questions`

Each question must include its text, type, time limit, and choices. Exactly one choice must be marked as correct.

You can also:

- View a question set using `GET /question-sets/{id}`.
- Update a question set using `PATCH /question-sets/{id}`.
- View its questions using `GET /question-sets/{id}/questions`.
- Update a question using `PATCH /question-sets/{id}/questions/{questionId}`.
- Delete a question using `DELETE /question-sets/{id}/questions/{questionId}`.
- Upload a cover image using `PUT /question-sets/{id}/cover`.

Only authorized users with the appropriate permissions can manage question sets and their questions.

### 2. Create and start a game

Create a session using:

`POST /sessions`

Example request:

```json
{
  "questionSetId": 1,
  "timeLimit": 600
}
```

The `timeLimit` value is in seconds. For a ten-minute game, use `600`.

The API returns a session with a generated six-digit `joinCode` and an initial `LOBBY` status.

Share the Game PIN with the Players so they can join.

To start the game, send a `PATCH /sessions/{code}` request:

```json
{
  "status": "RUNNING"
}
```

The game timer starts when the session enters the `RUNNING` state.

### 3. Monitor and close a game

Use these endpoints to monitor the session:

- `GET /sessions/{code}` — view session information and status.
- `GET /sessions/{code}/players` — view joined Players.
- `GET /sessions/{code}/leaderboard` — view current rankings.

When the game should end, the Host can close the session using:

`PATCH /sessions/{code}`

```json
{
  "status": "CLOSED"
}
```

Only the session's Host or an Administrator can update its status. The game also closes automatically when its configured timer expires.

Completing a question cycle does not automatically close the session.

## Admins

Administrators manage user accounts and roles.

### 1. Access the administrator account

The first Administrator account on a new server is created by the deployment bootstrap script, `scripts/create-admin.js`, using the configured environment variables.

The administrator logs in through `POST /auth/login` using the configured school ID and password.

### 2. View user accounts

Send:

`GET /users`

This endpoint returns the registered user accounts. It requires an authenticated Administrator account.

### 3. Change a user's role

Send:

`PATCH /users/{id}/role`

Replace `{id}` with the target user's `user_id`.

Example request:

```json
{
  "role": "HOST"
}
```

Available roles are:

- `PLAYER` — participates in quiz games.
- `HOST` — creates question sets and manages hosted sessions.
- `ADMIN` — manages user accounts and administrative access.

Only an authorized Administrator should change user roles. Protect administrator credentials and never share administrator tokens.

## The Library Game Hub

The Library Game Hub can retrieve finished game results through a protected endpoint.

### 1. Get game information

Send:

`GET /game-info`

This public endpoint provides the game's identifying information, developer information, description, and supported player limits.

### 2. Retrieve finished game results

Send:

`GET /results`

Include the required API key header:

```http
X-Hub-Key: YOUR_HUB_API_KEY
```

The Hub API key must be configured securely by the server administrator. Do not place it in public frontend code or expose it to Players.

An optional `since` query parameter can filter results by their ending date and time.

Example:

`GET /results?since=2026-11-01T00:00:00Z`

The endpoint returns the game identifier, developer information, generation timestamp, and finished game results.

A request without a valid `X-Hub-Key` receives HTTP `401`.

## When something goes wrong

The API uses HTTP status codes and error codes to explain failed requests.

| HTTP status | Meaning | What to do |
|---|---|---|
| `400` | Invalid request data or parameters | Check required fields, data types, and input values. |
| `401` | Missing or invalid authentication | Log in again and provide a valid Bearer token. |
| `403` | The account does not have permission | Contact an Administrator if your role is incorrect. |
| `404` | The requested account, session, or resource was not found | Check the ID, Game PIN, or resource path. |
| `409` | The request conflicts with existing data or the current game state | Check for duplicate records or an invalid session state. |
| `413` | Uploaded image is too large | Use a PNG or JPEG image no larger than 1 MB. |
| `503` | The API or database is temporarily unavailable | Wait and try again later. |

Common application error codes include:

| Error code | Meaning | Suggested action |
|---|---|---|
| `VALIDATION_FAILED` | Submitted information did not pass validation. | Check the request fields and required values. |
| `AUTH_REQUIRED` | Login is required. | Log in and provide the Bearer token. |
| `INVALID_TOKEN` | The token is invalid or expired. | Log in again to obtain a new token. |
| `INVALID_CREDENTIALS` | The school ID or password is incorrect. | Check your login details. |
| `FORBIDDEN` | Your account does not have the required role or permission. | Contact an Administrator. |
| `SCHOOL_ID_EXISTS` | The school ID is already registered. | Use the account associated with that school ID. |
| `EMAIL_EXISTS` | The email address is already registered. | Use another email address or the existing account. |
| `NICKNAME_TAKEN` | The nickname is already used in the game. | Choose another nickname. |
| `PLAYER_ALREADY_JOINED` | The account already has a player record in the session. | Rejoin using the same account. |
| `HUB_KEY_REQUIRED` | The Hub API key is missing or invalid. | Check the configured `X-Hub-Key`. |
| `GAME_NOT_RUNNING` | The session is not currently running. | Wait for the Host to start the game or check its status. |
| `GAME_TIME_EXPIRED` | The configured game timer has expired. | The session is finished. |

For more details about endpoint parameters, request bodies, and responses, open the Swagger documentation:

`https://shinobi-quiz-battle-devlou-rens.onrender.com/api/v1/docs/`