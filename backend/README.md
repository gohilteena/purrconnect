# PurrConnect Backend

Express + Mongoose REST API.

## Setup
```bash
cp .env.example .env     # then edit JWT_SECRET and ADMIN_* values
npm install
npm run seed             # demo cats, testimonials, enquiries
npm run create-admin     # creates the admin from ADMIN_* in .env
npm run dev
```

## Scripts
| Script | Purpose |
|---|---|
| `npm run dev` | Start with nodemon |
| `npm start` | Start with node |
| `npm run seed` | Reset and fill cats/testimonials/enquiries (refuses in production) |
| `npm run create-admin` | Create admin from `ADMIN_NAME/EMAIL/PASSWORD` |
| `npm run create-test-user` | Create a non-admin user (for testing 403s) |

## Endpoints
| Method | Path | Access |
|---|---|---|
| GET | /api/health | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Logged in |
| GET | /api/cats | Public |
| GET | /api/cats/:id (id or slug) | Public |
| POST / PUT / DELETE | /api/cats, /api/cats/:id | Admin |
| POST | /api/enquiries | Public |
| GET | /api/enquiries | Admin |
| PUT | /api/enquiries/:id | Admin |
| GET | /api/testimonials | Public (approved only; admins may add `?approved=all\|false`) |
| POST / PUT / DELETE | /api/testimonials, /api/testimonials/:id | Admin |

Import `postman/PurrConnect.postman_collection.json` into Postman to test everything.
