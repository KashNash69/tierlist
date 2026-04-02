# Alignment Chart Project

## Structure
- `api/`: Express.js backend with TypeScript.
- `frontend/`: Next.js frontend (to be implemented).

## Backend (api)
### Features
- Authentication based on session cookies (transposed from `furby`).
- In-memory data storage (no database).
- Support for People, Images, and Result submissions.

### Routes
- `POST /auth/signin`: Create a new user.
- `POST /auth/login`: Login and receive a session cookie.
- `POST /auth/logout`: Logout and clear session.
- `GET /`: Index page.
- `GET /new`: Get all known people (Authenticated).
- `POST /send`: Submit alignment results (Authenticated).
- `GET /image/:id`: Get image details by ID.

### Running
```bash
cd api
npm install
npm run dev
```
