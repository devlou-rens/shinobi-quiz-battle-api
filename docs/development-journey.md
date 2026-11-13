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
- Dates worked: [e.g. Nov 4 to Nov 7, 2026] · Time spent: [hours]
- Goal: [one sentence]
- What I built: [files and endpoints]
- Evidence: [pull request link] · [two or three commit hashes]
- Problem I hit: [the error or wrong behaviour]
- How I solved it: [what you tried, what worked, where you found the answer]
- Decision I made and why: [a rule, a limit or a name, and its cost]
- Changes to my design set: [ERD, data dictionary or endpoint table changes, or "none"]
- What I would explain to a classmate: [one idea, in your own words]

## M2 · The question bank

## M3 · Gameplay

## M4 · Automated tests and server preparation

## M5 · API documentation and deployment

## M6 · The SE1 portfolio and the release

## M7 · The Test Report
