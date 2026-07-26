# Raven Finance

A MERN expense tracker written in TypeScript, styled with Tailwind CSS.

Track income and expenses against a running balance. JWT authentication,
per-user transaction history, amounts in PHP.

- **Live app:** https://leonlau4148.github.io/raven-mern-ts/
- **API:** https://raven-mern-ts.onrender.com/api/health

The API runs on Render's free tier and sleeps when idle, so the first
sign-in after a quiet spell takes 30–50 seconds while it wakes.

## Stack

**Client** — React 19, TypeScript, Vite, Tailwind CSS v4, React Router,
axios. Tailwind v4 is CSS-first: the theme lives in an `@theme` block in
[`client/src/index.css`](client/src/index.css), not a JS config file.

**Server** — Express 5, TypeScript (ESM), MongoDB with Mongoose, JWT,
bcrypt. Model types derive from the schemas via `InferSchemaType`, so the
two cannot drift apart.

## Running it locally

You'll need Node 20+ and a MongoDB database (local or Atlas).

**Server**

```bash
cd server
npm install
cp .env.example .env    # then fill in the real values
npm run dev             # http://localhost:5000
```

`.env` needs:

| Variable     | Purpose                                            |
| ------------ | -------------------------------------------------- |
| `MONGO_URI`     | MongoDB connection string                        |
| `JWT_SECRET`    | Long random string used to sign tokens           |
| `PORT`          | Optional, defaults to `5000`                     |
| `CORS_ORIGINS`  | Optional, comma-separated allowed origins. Unset allows any. |

The server exits at startup if `MONGO_URI` or `JWT_SECRET` is missing,
rather than failing later on the first request.

**Client**

```bash
cd client
npm install
npm run dev             # http://localhost:5173
```

The client defaults to `http://localhost:5000/api`. To point it elsewhere,
set `VITE_API_URL` — `.env.production` already does this for the deployed
build.

## Scripts

| Location | Command             | Does                                   |
| -------- | ------------------- | -------------------------------------- |
| client   | `npm run dev`       | Vite dev server with hot reload         |
| client   | `npm run build`     | Typecheck, then build to `dist/`        |
| client   | `npm run typecheck` | Typecheck only                          |
| client   | `npm run preview`   | Serve the production build locally      |
| client   | `npm run deploy`    | Build and publish to GitHub Pages       |
| server   | `npm run dev`       | Run from TypeScript sources, watching   |
| server   | `npm run build`     | Compile to `dist/`                      |
| server   | `npm start`         | Run the compiled build                  |
| server   | `npm run typecheck` | Typecheck without emitting              |

## Deployment notes

The frontend is hosted on GitHub Pages and the API on Render.

Run `npm run deploy` from `client/` to publish. It builds and pushes
`dist/` to the `gh-pages` branch; Pages must be pointed at that branch
once, under Settings → Pages.

Two constraints come from Pages specifically. It serves the site from
`/<repo-name>/`, so `base` in
[`client/vite.config.ts`](client/vite.config.ts) must match the
repository name or every asset 404s. And it cannot rewrite unmatched
paths to `index.html`, which is why the app uses `HashRouter` — URLs
carry a `#`, but a refresh on `/#/login` works instead of 404ing.

The API the client talks to is set by `VITE_API_URL` in
[`client/.env.production`](client/.env.production). It is baked in at
build time, not read at runtime, so changing it means rebuilding.

The API deploys to Render as a Node web service, configured in
[`render.yaml`](render.yaml): it builds with `npm ci && npm run build`
and starts with `npm start`. `MONGO_URI` must be set in the Render
dashboard; `JWT_SECRET` is generated there on first deploy.

On Render's free tier the service sleeps when idle, so the first request
after a quiet spell takes 30–50 seconds to wake.

## API

All `/api/transactions` routes require an `Authorization: Bearer <token>`
header.

| Method   | Route                    | Purpose                     |
| -------- | ------------------------ | --------------------------- |
| `POST`   | `/api/auth/register`     | Create an account, get token |
| `POST`   | `/api/auth/login`        | Sign in, get token           |
| `GET`    | `/api/transactions`      | List yours, newest first     |
| `POST`   | `/api/transactions`      | Create one                   |
| `PUT`    | `/api/transactions/:id`  | Update one                   |
| `DELETE` | `/api/transactions/:id`  | Delete one                   |
| `GET`    | `/api/health`            | Liveness check               |
