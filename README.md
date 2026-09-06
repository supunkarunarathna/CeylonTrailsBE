# Ceylon Trails — Backend API

Node.js + Express + MySQL (Sequelize) REST API powering the Ceylon Trails boutique
Sri Lanka travel website, including the **Create Your Own Itinerary** matching
engine. Authentication uses JWT (JSON Web Tokens).

This is the **backend** project. The React frontend lives in a separate
project (`ceylon-trails-frontend`) and talks to this API over HTTP.

## Tech stack

- Node.js 18+ / Express 4
- MySQL 8 (or 5.7+) via Sequelize ORM
- JWT authentication (`jsonwebtoken`) + `bcryptjs` password hashing
- `express-validator` for request validation
- `helmet`, `cors`, `morgan` for security/logging basics

## Project structure

```
ceylon-trails-backend/
├── src/
│   ├── app.js                 # Express app + route mounting
│   ├── server.js              # Entry point: DB connection + HTTP listener
│   ├── config/
│   │   └── db.js              # Sequelize MySQL connection
│   ├── models/                # Sequelize models (User, Tour, Hotel, ...)
│   ├── controllers/           # Route handler logic
│   ├── routes/                # Express routers, one per resource
│   ├── middleware/
│   │   ├── auth.js            # JWT protect / optionalAuth / requireAdmin
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── jwt.js             # Token sign/verify helpers
│   │   └── itineraryMatcher.js# "Create Your Own Itinerary" scoring engine
│   └── seed/
│       ├── initDb.js          # Creates the database + syncs tables
│       └── seed.js            # Populates sample content + itinerary templates
├── .env.example
├── package.json
└── README.md
```

## 1. Prerequisites

- Node.js 18 or newer
- A running MySQL server (local install, Docker, or a managed instance)

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on (default `5000`) |
| `CLIENT_URL` | URL of the frontend, used for CORS (e.g. `http://localhost:5173`) |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | MySQL connection details |
| `JWT_SECRET` | Long random string used to sign JWTs — **change this** |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Credentials for the admin account created by the seed script |

## 4. Create the database & tables

This creates the MySQL database (if missing) and syncs all Sequelize models
into tables:

```bash
npm run db:init
```

## 5. Seed sample data

Populates destinations, tours, hotels, testimonials, blog posts, an admin
user, and the itinerary template catalog used for itinerary matching:

```bash
npm run db:seed
```

(You can run both steps at once with `npm run setup`.)

## 6. Run the server

```bash
npm run dev     # with nodemon, auto-restarts on file changes
# or
npm start        # plain node
```

The API will be available at `http://localhost:5000/api`. Check
`GET /api/health` to confirm it's running.

## API overview

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create an account, returns JWT |
| POST | `/api/auth/login` | – | Log in, returns JWT |
| GET | `/api/auth/me` | Bearer token | Get the logged-in user's profile |

### Content (public reads, admin writes)
| Resource | List/Get | Create/Update/Delete |
|---|---|---|
| Destinations | `GET /api/destinations`, `GET /api/destinations/:slug` | admin only |
| Tours | `GET /api/tours` (supports `?category&minPrice&maxPrice&minDays&maxDays&featured&search`), `GET /api/tours/:slug` | admin only |
| Hotels | `GET /api/hotels` (supports `?region&minPrice&maxPrice&search`), `GET /api/hotels/:slug` | admin only |
| Testimonials | `GET /api/testimonials` | admin only |
| Blog | `GET /api/blog`, `GET /api/blog/:slug` | admin only |

### Contact / Inquiries
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/contact` | – | Submit a contact/inquiry form |
| GET | `/api/contact` | admin | List all inquiries |
| PUT | `/api/contact/:id/status` | admin | Update inquiry status |

### Create Your Own Itinerary
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/itineraries/build` | optional (guests allowed) | Submit the itinerary form, returns top 5 matches |
| GET | `/api/itineraries/mine` | required | List the logged-in user's past itinerary requests + matches |
| GET | `/api/itineraries/templates` | – | List the raw itinerary template catalog |
| POST/PUT/DELETE | `/api/itineraries/templates(/:id)` | admin | Manage the template catalog |

**`POST /api/itineraries/build` request body:**

```json
{
  "name": "Jane Doe",
  "adults": 2,
  "children": 1,
  "hasDrivingLicense": false,
  "locationPreferences": ["coastal", "hill_country"],
  "travelMode": "van",
  "budget": 700
}
```

- `locationPreferences` — array of any of `coastal`, `hill_country`, `traditional`
- `travelMode` — one of `public_transport`, `tuk_tuk`, `car`, `van`
- `budget` — per-person budget in USD

**Response:** the 5 best-matching itinerary templates, each annotated with a
`matchScore` and a `matchBreakdown` (location/travel/budget/headcount sub-scores).

### How matching works

`src/utils/itineraryMatcher.js` scores every seeded itinerary template
against the visitor's answers:

- **Location overlap** (40 pts) — how much the template's location types overlap the visitor's preferences
- **Travel mode match** (25 pts) — exact match on transport type
- **Budget fit** (20 pts) — rewards templates that fit within budget without being far under it
- **Group size fit** (15 pts) — rewards templates whose min/max headcount includes the visitor's total party size

A template flagged `requiresLicense: true` (a self-drive car itinerary) is
automatically excluded if the visitor doesn't hold a driving license.

## Authentication notes

- Passwords are hashed with bcrypt before storage — plaintext passwords are
  never persisted.
- JWTs are returned on register/login and must be sent as
  `Authorization: Bearer <token>` on protected routes.
- `protect` middleware requires a valid token; `optionalAuth` (used by the
  itinerary builder) attaches the user if present but still allows guests;
  `requireAdmin` restricts a route to `role: "admin"` accounts.

## Default admin account

After running `npm run db:seed`, you can log in with the credentials set in
your `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`, default
`admin@ceylontrails.com` / `Admin@12345`). **Change these in production.**

## Notes

- CORS is restricted to `CLIENT_URL`; update it if your frontend runs on a
  different origin.
- This project was not `npm install`-ed inside the generation sandbox (no
  registry access there); run `npm install` in your own environment before
  starting the server.
