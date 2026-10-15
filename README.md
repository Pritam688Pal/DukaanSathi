# DukaanSathi

**DukaanSathi** is a web-based shop management app for small retailers. It brings everyday stock and sales work into one place: owners can keep a product catalogue, record sales and purchases, track stock changes, manage supplier details, and review how the shop is doing.

The interface is designed to be straightforward for day-to-day use, with INR pricing and a dashboard that highlights sales, inventory value, low stock, and products nearing their best-before dates.

## What it can do

- **Shop accounts:** Register and sign in as an owner; shop records are scoped to the signed-in account.
- **Inventory:** Add and edit products with SKU, barcode, category, unit, cost, selling price, quantity, reorder level, supplier, and product-level expiry date. Search, sort, and filter by stock or expiry status.
- **Stock history:** Record quantity adjustments with a reason and see the movement history. Sales and purchases also create stock movements.
- **Sales:** Record a bill with multiple products, discount, and payment method. Stock is reduced when a sale is recorded; cancelled sales restore it.
- **Purchases:** Record stock received from a supplier, invoice number, unit cost, and payment status. Received stock is added to inventory; a purchase can be cancelled when the stock can be reversed safely.
- **Suppliers:** Save supplier names and contact details for use with inventory and purchases.
- **Dashboard and reports:** Review today's sales and estimated profit, inventory valuation, low-stock and expiry alerts, recent sales, a sales chart, and a 30-day summary.
- **Shop settings:** Update the shop and owner details.

## Technology

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, TanStack Query, Axios, and Recharts
- **Backend:** Node.js, Express, TypeScript, Mongoose, and Zod
- **Database:** MongoDB Atlas or a local MongoDB replica set
- **Authentication:** Password hashing with bcrypt and a signed, HTTP-only session cookie

## Run locally

Docker is not required. Run MongoDB separately, then use one terminal for the API and one for the frontend.

### 1. Configure MongoDB Atlas

Create an Atlas cluster and database user, and add your current IP address to the project's IP access list. In Atlas, choose **Connect → Drivers** and copy the Node.js connection string. Atlas requires both an allowed network address and a database user for the connection. See the [Atlas connection guide](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/).

Copy `.env.example` to `.env` in the project root. Set:

```dotenv
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-host>/dukaansathi?retryWrites=true&w=majority
JWT_SECRET=<a-random-secret-at-least-32-characters-long>
```

Replace the placeholders with your Atlas credentials and cluster host. Keep this URI private and in the backend environment only. If the database password contains reserved URL characters, percent-encode them before putting it in the URI. The API loads `.env` from the project root when started from `backend`.

The app uses MongoDB transactions for sales and purchases. Atlas clusters support the replica-set transactions those flows require. If using local MongoDB instead, run it as a single-node replica set named `rs0` and use the default local URI from `.env.example`.

### 2. Start the API

Open PowerShell in the `backend` folder:

```powershell
cd "C:\path\to\use-the-technologies-i-know-and\backend"
npm.cmd install
npm.cmd run dev
```

The API listens on `http://localhost:4000`. Keep this terminal open.

### 3. Start the frontend

Open a second PowerShell window in the `frontend` folder:

```powershell
cd "C:\path\to\use-the-technologies-i-know-and\frontend"
npm.cmd install
npm.cmd run dev
```

Open [http://localhost:5173](http://localhost:5173) and register your shop account. Keep this terminal open while using the app. In PowerShell, use `npm.cmd` if script execution blocks `npm`.

## Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `MONGO_URI` | MongoDB connection string | Local `rs0` URI in `.env.example` |
| `JWT_SECRET` | Secret used to sign session tokens; set at least 32 characters | None; required |
| `CLIENT_ORIGIN` | Allowed frontend origin for credentialed requests | `http://localhost:5173` |
| `PORT` | API port | `4000` |
| `NODE_ENV` | Enables secure cookies in production | `development` |
| `VITE_API_URL` | Frontend API base URL | `http://localhost:4000/api` |

## API overview

Authenticated data is scoped to the shop associated with the signed-in owner. The session token is stored in an HTTP-only cookie.

| Area | Routes |
| --- | --- |
| Authentication | `POST /api/auth/register`, `/login`, `/logout`; `GET /api/auth/me` |
| Shop | `GET/PATCH /api/shops/me` |
| Products | `GET/POST /api/products`; `GET/PATCH/DELETE /api/products/:id` |
| Inventory | `GET /api/inventory/movements`; `POST /api/inventory/adjustments` |
| Sales | `GET/POST /api/sales`; `GET /api/sales/:id`; `POST /api/sales/:id/cancel` |
| Suppliers | `GET/POST /api/suppliers`; `PATCH /api/suppliers/:id` |
| Purchases | `GET/POST /api/purchases`; `POST /api/purchases/:id/cancel` |
| Dashboard and reports | `GET /api/dashboard?days=7\|30`; `GET /api/reports/summary?from=&to=` |

Money values are stored as integer paise and displayed as Indian rupees. Estimated profit uses the product cost recorded for each sale; it is an estimate, not accounting advice.

## Development

- Start the API: `npm.cmd run dev` from `backend`.
- Start the frontend: `npm.cmd run dev` from `frontend`.
- Build the API: `npm.cmd run build` from `backend`.
- Build the frontend: `npm.cmd run build` from `frontend`.
- Run backend tests: `npm.cmd test` from `backend`.

## Current scope

This is an initial iteration for managing a single shop per owner account. Expiry dates are stored on products rather than individual stock batches. Purchase entry in the current interface is one product at a time. CSV import/export, barcode scanning, batch-level expiry, richer analytics, and production deployment hardening are not included yet.
