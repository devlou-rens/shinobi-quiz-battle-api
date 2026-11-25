# Changelog

All notable changes, newest first.
## 1.6.1 (Week 16): version fix
- Fixed the version number so package.json, package-lock.json, the OpenAPI examples and the API reference all say 1.6.1.

## [1.6.0] (Week 16): SE1 portfolio and release preparation
- Completed the technical specification, user guide, and SE2 frontend handoff.
- Generated the API reference and data dictionary.
- Completed and exported the six project diagrams.
- Updated the README with links to the project documentation.
- Updated the development journey and prepared the project for release.

## [1.5.0] (Week 15): project documentation and diagrams
- Organized the project documentation under the `docs/` folder.
- Created and exported the six diagrams: use-case, class, sequence, activity, ERD, and architecture.
- Added scripts to generate the API reference and data dictionary.
- Reviewed documentation for unfinished placeholders and corrected documentation links.

## [1.4.0] (Week 14): gameplay improvements
- Implemented the 10-minute game timer and host-controlled game closing.
- Added repeating randomized question cycles for players.
- Improved player question progress and answer history.
- Ensured games close only when the timer expires or the host manually closes them.

## [1.3.0] (Week 13): API testing and integration
- Added and improved automated API tests.
- Verified authentication, game session, player, question, and answer endpoints.
- Improved Library Game Hub API integration.
- Tested the API using the Postman collection.

## [1.2.0] (Week 12): authentication and API security
- Implemented user authentication using bcryptjs and JWT.
- Added role-based access control and protected API routes.
- Prepared the OpenAPI specification and API documentation.
- Improved authentication and authorization for project endpoints.

## [1.0.0] (Weeks 10 to 11): foundation
- Established the Express.js and PostgreSQL project structure.
- Created the database models, migrations, and seeders.
- Implemented the initial game session, player, question, answer, and reward features.