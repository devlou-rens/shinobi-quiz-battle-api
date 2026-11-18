# Development journey: Shinobi Quiz Battle API

Student: Lourens Gacias · Section: BSCS 3-1 · Group: Team 2

One entry per milestone, written the week you did it. Newest at the bottom.
## Initial Setup · Weeks 12–18 Kit

- Dates worked: November 12–13, 2026 · Time spent: 8hrs total
- Goal: Prepare my Week 11 Shinobi Quiz Battle API project for the Weeks 12–18 requirements.
- What I built: Installed the instructor kit, added the required dependencies for authentication, file uploads, security, API documentation, and automated testing. Updated the environment configuration to support JWT authentication and CORS.
- Evidence: Branch `feature/auth` · Commit `0cfd0e9` — `chore: install the Weeks 12-18 kit`
- Problem I hit: The original user model and repository needed to be combined with the instructor kit versions without breaking the existing Week 11 database structure.
- How I solved it: Compared the existing model and repository with the instructor kit, then preserved the existing database table and column definitions while adding the password hash and login-related repository functions.
- Decision I made and why: Kept PostgreSQL configuration and the existing API port 3001. Added JWT authentication settings and kept `.env` excluded from Git to protect secrets.
- Changes to my design set: Added the password authentication requirement to the existing User model. The password migration and seeder will be documented during M1 implementation.
- What I would explain to a classmate: Before adding new authentication features, I need to understand the existing database structure so that new changes do not break previously working features.


## M1 · Accounts, passwords and tokens

- Dates worked: November 13–14, 2026 · Time spent: 11hrs total
- Goal: Implement secure account registration, login, JWT authentication, and role-based access control for the Shinobi Quiz Battle API.
- What I built: Added password hashing using bcryptjs, JWT token creation and verification, registration and login validation, and account management for administrators. Implemented `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `GET /users`, and `PATCH /users/:id/role`. Updated middleware to protect routes using Bearer tokens and user roles. Added Postman login and Accounts folders with automated request tests.
- Evidence: Branch `feature/auth` · Commits: `1cf30b8` — `feat: add password hashes for demo users`; `56d623a` — `feat: add account authentication and role management`; `9d06eb4` — `docs: implement secure account registration, login, and role-based access control`. Pull request: [#3 — M1 Authentication](https://github.com/devlou-rens/shinobi-quiz-battle-api/pull/3) (merged).
- Problem I hit: The `/auth/me` endpoint returned `AUTH_REQUIRED` even when I supplied a valid token. I also encountered an invalid token in Postman when the Kakashi login token was not being saved correctly.
- How I solved it: Corrected the route middleware order so that the current-user middleware runs before the protected authentication routes. Fixed the Postman login test script to save the Kakashi HOST token as a collection variable, then tested the ownership restriction again.
- Decision I made and why: New registrations always receive the `PLAYER` role, even if someone attempts to submit `ADMIN` or `HOST`. Only an administrator can change account roles. This prevents users from giving themselves higher privileges.
- Changes to my design set: Added `password_hash` to the existing `users` table through a migration. Updated the authentication and user-management endpoint requirements. Kept the existing Week 11 database structure.
- What I would explain to a classmate: Passwords should never be stored as plain text. Hash passwords before saving them, use tokens to authenticate requests, and check user roles before allowing access to protected features.

## M2 · The question bank

- Dates worked: November 18, 2026 · Time spent: [confirm total hours]
- Goal: Implement a complete question bank feature that allows hosts to manage questions and choices, search and organize questions, and upload question set cover images.
- What I built: Added question bank endpoints with pagination, search, and sorting. Implemented nested question and choice management through `GET /question-sets/:id/questions`, `POST /question-sets/:id/questions`, `PATCH /question-sets/:id/questions/:questionId`, and `DELETE /question-sets/:id/questions/:questionId`. Added validation to require exactly one correct choice, automatically assign choice positions, and prevent changes to question sets already used by a game. Added the `QuestionChoice` model and database migration. Added `?include=questions` to retrieve a question set with its questions and choices. Implemented PNG/JPEG cover image uploads with file type and 1 MB size validation. Added demo question choices to the database seeder. Tested the endpoints using Postman.
- Evidence: Branch `feature/question-bank` · Commits: `f52293d` — `feat: add question bank and cover image upload`; `c106f77` — `test: seed demo question choices`. Pull request: [Question Bank feature PR](https://github.com/devlou-rens/shinobi-quiz-battle-api/pull/5) (merged into `main`).
- Problem I hit: The GitHub Actions checker failed because the `QuestionChoice` table had no seed rows. I also encountered an `fs is not defined` error when setting up the cover image upload middleware.
- How I solved it: Created a new seeder that adds four choices for each of the five demo questions, then ran it and verified the inserted records in PostgreSQL. Fixed the upload middleware by importing the Node.js `fs` module. Retested successful image uploads, invalid file types, and oversized files.
- Decision I made and why: Stored question choices in a separate `QuestionChoice` table instead of placing them directly inside the `Question` table. This keeps the database organized and allows each question to have multiple choices with their own positions. I also made question set editing unavailable once it has been used by a game to protect existing game content.
- Changes to my design set: Added the `QuestionChoice` table and its relationship with `Question`. Added the nullable `coverImage` field to `QuestionSet`. Updated the question bank endpoint requirements to support pagination, search, sorting, nested question management, and cover image uploads.
- What I would explain to a classmate: A question bank needs more than just storing questions. It should also manage choices, validate the correct answer, protect content from unauthorized users, and prevent changes that could affect existing games. Database migrations and seeders help keep the structure and sample data consistent.

## M3 · Gameplay

## M4 · Automated tests and server preparation

## M5 · API documentation and deployment

## M6 · The SE1 portfolio and the release

## M7 · The Test Report
