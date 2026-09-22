# Fit-Track

Fit-Track is a fitness tracking web application for recording exercise, meals, calories, and BMI progress in one place. It uses a React frontend, serverless API endpoints, Prisma, and a SQLite database.

## Features

- User login with JWT authentication
- User profile with height, weight, and calculated BMI
- Exercise logging with duration and estimated calories burned
- Meal logging with calorie intake
- BMI progress tracking
- Activity history with selectable and removable entries
- Charts for calorie activity and BMI progress
- Responsive dashboard navigation for Features, History, Charts, and Profile

## Tech Stack

- React 18 and Create React App
- React Router
- Chart.js and `react-chartjs-2`
- Node.js serverless functions
- Prisma ORM
- SQLite for local development
- Netlify/Vercel-compatible API deployment

## Project Structure

The application lives in [`deployingFitness-main`](deployingFitness-main):

```text
deployingFitness-main/
├── src/                  # React application and UI components
├── api/                  # Serverless API handlers
├── prisma/               # Database schema, migrations, and seed script
├── public/               # Static frontend assets
├── netlify/              # Netlify function copies/configuration
├── package.json          # Frontend scripts and dependencies
└── netlify.toml          # Netlify build and routing configuration
```

## Requirements

- Node.js 18 or newer
- npm
- A SQLite database for local development

## Local Setup

1. Change into the application directory:

	```bash
	cd deployingFitness-main
	```

2. Install dependencies:

	```bash
	npm install
	```

3. Create a `.env` file in `deployingFitness-main`:

	```env
	DATABASE_URL="file:./dev.db"
	JWT_SECRET="replace-this-with-a-local-secret"
	REACT_APP_API_URL="/api"
	```

	`REACT_APP_API_URL` is optional because `/api` is the default. Set it to a deployed API URL when the frontend and API are hosted separately.

4. Create the database and generate the Prisma client:

	```bash
	npx prisma migrate dev
	npx prisma generate
	```

5. Optionally seed a development user:

	```bash
	node prisma/seed.js
	```

	The seed script creates the username `User` with the password `password123`. Change or remove this development credential before deploying.

## Running the App

To run the React development server:

```bash
npm start
```

This starts the frontend at `http://localhost:3000`. The frontend expects the API to be available under `/api`, so use the project's serverless development workflow when you need login and database features locally.

For a Netlify-style local environment, install the Netlify CLI if needed and run:

```bash
netlify dev
```

The API includes handlers for:

- `POST /api/login` - authenticate a user and return a JWT
- `GET /api/me` - return the authenticated user's profile
- `GET /api/logs/:username` - retrieve a user's activity logs
- `POST /api/logs/:username` - create an activity log

Authenticated requests use the header `Authorization: Bearer <token>`.

## Available Scripts

Run these commands from `deployingFitness-main`:

| Command | Purpose |
| --- | --- |
| `npm start` | Start the React development server |
| `npm test` | Run the React test runner |
| `npm run build` | Create a production frontend build |
| `npm run vercel-build` | Generate Prisma Client and build for Vercel |
| `npx prisma migrate dev` | Apply development database migrations |
| `npx prisma studio` | Open the Prisma database browser |

## Deployment

The included [`netlify.toml`](deployingFitness-main/netlify.toml) configures Netlify to:

- Build the React frontend into `build/`
- Generate Prisma Client during the build
- Deploy functions from `api/netlify/functions`
- Rewrite `/api/*` requests to Netlify Functions
- Serve the React app for client-side routes

Set `DATABASE_URL` and a strong `JWT_SECRET` in the deployment provider's environment settings. Do not use the seeded development password or the fallback JWT secret in production.

## Notes

- User passwords are stored as bcrypt hashes when users are created through the API.
- Activity records belong to a user and include a type, value, and timestamp.
- The SQLite database is intended for local development. Use a hosted database compatible with Prisma for production deployments.
