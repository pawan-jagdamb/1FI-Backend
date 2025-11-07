# Backend – Product EMI API

Express + MongoDB service that exposes product and EMI plan endpoints consumed by the React frontend.

## Prerequisites

- Node.js v18+
- npm v9+
- MongoDB 4.4+ (local or Atlas)

## Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/product-emi-db

# Example Atlas URI
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/product-emi-db
```

## Install & Run

```bash
cd server
npm install

node scripts/seedData.js   # optional: seed sample products & EMI plans

npm run dev                # start with nodemon
# or
npm start                  # start with node
```

API served at `http://localhost:5000` (configurable via `PORT`).

## Available Scripts

| Script         | Description                       |
| -------------- | --------------------------------- |
| `npm run dev`  | Start server with nodemon watch   |
| `npm start`    | Start server with node            |
| `npm test`     | Placeholder (no tests yet)        |
| `node scripts/seedData.js` | Seed sample data into Mongo |

## REST Endpoints

All routes are prefixed with `/api`.

### Products

- `GET /api/products` – list products with variants & EMI plans
- `GET /api/products/slug/:slug` – fetch product via slug
- `GET /api/products/:id` – fetch product via MongoID (legacy)
- `POST /api/products` – create a product (expects payload matching schema)

### EMI Plans

- `GET /api/emi-plans` – list all EMI plans
- `GET /api/emi-plans/product/:productId` – plans tied to a specific product
- `POST /api/emi-plans` – create a new EMI plan for a product/variant

### Utilities

- `GET /api/health` – service health check

Refer to the root `README.md` for detailed request/response samples and schema diagrams.

## Project Structure

```
config/          # Mongo connection helper
controllers/     # Request handlers
models/          # Mongoose schemas (Product, EMIPlan)
routes/          # Express routers
scripts/         # Seed script / utilities
data/            # Seed JSON data
index.js         # Application entry point
```

## Troubleshooting

- **MongoDB connection errors**: verify `MONGODB_URI` and Mongo is running
- **Port already in use**: change `PORT` or stop the conflicting service
- **CORS issues**: ensure frontend `VITE_API_BASE_URL` matches backend URL

## Related Docs

- Frontend README: `../client/README.md`
- Root project overview: `../README.md`

