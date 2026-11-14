# Development journey: Shinobi Quiz Battle API

Student: Lourens Gacias · Section: BSCS 3-1 · Group: Team 2

One entry per milestone, written the week you did it. Newest at the bottom.
## Initial Setup · Weeks 12–18 Kit

- Dates worked: November 12–13, 2026 · Time spent: 25 hours
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
- Evidence: Branch `feature/auth` · Commits: `1cf30b8` — `feat: add password hashes for demo users`; `0cfd0e9` — `chore: install the Weeks 12-18 kit`; [add M1 implementation commit and pull request link after pushing].
- Problem I hit: The `/auth/me` endpoint returned `AUTH_REQUIRED` even when I supplied a valid token. I also encountered an invalid token in Postman when the Kakashi login token was not being saved correctly.
- How I solved it: Corrected the route middleware order so that the current-user middleware runs before the protected authentication routes. Fixed the Postman login test script to save the Kakashi HOST token as a collection variable, then tested the ownership restriction again.
- Decision I made and why: New registrations always receive the `PLAYER` role, even if someone attempts to submit `ADMIN` or `HOST`. Only an administrator can change account roles. This prevents users from giving themselves higher privileges.
- Changes to my design set: Added `password_hash` to the existing `users` table through a migration. Updated the authentication and user-management endpoint requirements. Kept the existing Week 11 database structure.
- What I would explain to a classmate: Passwords should never be stored as plain text. Hash passwords before saving them, use tokens to authenticate requests, and check user roles before allowing access to protected features.

## M2 · The question bank

## M3 · Gameplay

## M4 · Automated tests and server preparation

## M5 · API documentation and deployment

## M6 · The SE1 portfolio and the release

## M7 · The Test Report
