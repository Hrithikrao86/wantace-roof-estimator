# Northline Roofing & Exteriors — Config-Driven Estimator

A full-stack take-home implementation for the Wantace SDE Intern Round 1 task.

## Stack

- React + Vite
- Express.js + Node.js
- MongoDB + Mongoose
- JWT stored in an HttpOnly cookie for owner authentication
- Plain CSS for a small, responsive UI

## Architecture

`client/` is the public estimator and owner panel. `server/` exposes the API and owns all configuration, validation, pricing, authentication, and lead persistence.

The estimator first loads the active configuration from `GET /api/config`. It never contains business questions, labels, options, or pricing rates in source code. The server calculates estimates and persists leads.

Configuration edits create a new immutable configuration version. A public estimator session sends the version it started with to `/api/estimate`, so a homeowner already filling out the form is not broken by an owner editing prices or toggling questions. New visitors receive the newest active version.

## Live Deployment

- Public estimator: https://wantace-roof-estimator-five.vercel.app/
- Owner panel: https://wantace-roof-estimator-five.vercel.app/admin/login
- Backend API: https://wantace-roof-estimator-fnf5.onrender.com
- API health check: https://wantace-roof-estimator-fnf5.onrender.com/api/health

### Test owner credentials

```text
Username: admin
Password: roofing2026!


Then add:

```md
## Project Structure

```text
wantace-roof-estimator/
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── styles.css
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── test/
├── AI_LOG.md
├── DECISIONS.md
├── README.md
└── render.yaml

## Requirements

- Node.js 18+
- MongoDB 6+ locally or a MongoDB Atlas connection string
- Git

## Environment setup

Copy `server/.env.example` to `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/wantace_roof_estimator
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=roofing2026!

```

For production, use a strong generated JWT secret and do not use the sample admin password.

## Install

From the repository root:

```bash
npm run install:all
```

## Seed the database

```bash
npm run seed
```

The seed creates configuration version 3 and the three historical leads supplied in the task brief. It is safe to run against a fresh database; existing records with the same seed IDs are not duplicated.

## Run locally

Start both apps:

```bash
npm run dev
```

- Public estimator: http://localhost:5173/
- Owner login: http://localhost:5173/admin/login
- API: http://localhost:5000

Test owner credentials for local development:

```text
Username: admin
Password: roofing2026!
```

## API

### Public

- `GET /api/config` — returns the active public configuration.
- `POST /api/estimate` — validates a lead against the selected configuration version, calculates the estimate server-side, and stores the lead.

### Authentication

- `POST /api/auth/login` — validates owner credentials and sets an HttpOnly JWT cookie.
- `POST /api/auth/logout` — clears the cookie.
- `GET /api/auth/me` — checks the current session.

### Owner-only

- `GET /api/admin/config` — returns the active configuration.
- `PUT /api/admin/config` — creates the next configuration version and activates it atomically.
- `GET /api/admin/leads` — returns captured leads ordered by newest first.

## Pricing formula

The backend uses the deterministic formula specified in the supplied reference document:

1. Base material cost = roof area × material rate × (1 + waste factor)
2. Tear-off cost = roof area × tear-off rate
3. Adjusted subtotal = (material cost + tear-off cost) × pitch multiplier × stories multiplier
4. Mid estimate = adjusted subtotal + permit fee
5. Low estimate = mid estimate × (1 − spread)
6. High estimate = mid estimate × (1 + spread)

The default seed modifiers are 10% waste, $350 permit fee, and 12% range spread.




```md
## Verification

The following checks were performed during development:

- Confirmed that estimator questions, options, and pricing configuration are
  loaded from the backend rather than hardcoded in the frontend.
- Confirmed that the estimator calculates and returns an estimate.
- Confirmed that submitted leads are persisted in MongoDB.
- Confirmed that owner authentication protects the owner-only endpoints.
- Confirmed that changing a configuration through the Owner Panel creates a
  new configuration version.
- Confirmed that a new estimator session can use the updated configuration
  without a server redeployment.
- Confirmed that `DECISIONS.md` and `AI_LOG.md` are present.