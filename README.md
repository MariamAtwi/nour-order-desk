# Nour's Order Desk

**Full Name:** Mariam Atwy
**Project branch:** assignment-4-nour-order-desk

## Project Overview

Nour's Order Desk is a web-based order management application designed to help a small candle business organize and manage customer orders.

The application provides a central dashboard where Nour can create orders, view order details, update quantities and statuses, and delete unwanted orders.

It combines a responsive user interface with a REST API that handles order operations and enforces business rules on the server.

## Technologies Used

- **Next.js** – React framework and API Route Handlers.
- **React** – Component-based user interface.
- **TypeScript** – Type safety.
- **Tailwind CSS** – Styling and responsive layouts.
- **REST API** – Communication between the frontend and backend.
- **Thunder Client** – API endpoint testing.

### Installation

```bash
git clone https://github.com/MariamAtwi/nour-order-desk
```

```bash
cd nour-order-desk
```

```bash
npm install
```

```bash
npm run dev
```


```text
http://localhost:3000
```


## Data Storage and Limitations

This assignment uses a shared server-side in-memory store for order data.

- All API Route Handlers access the same shared store.
- Orders are available while the relevant server process retains the data.
- Data is not stored in a database.
- Orders can reset after a server restart or development reload.
- In-memory storage is not suitable for production or multiple server instances.


## Documentation

- [PLAN.md](docs/PLAN.md)
- [API.md](docs/API.md)
- [TESTING.md](docs/TESTING.md)
- [REVIEW.md](docs/REVIEW.md)
- [Evidence](docs/evidence/)
- [screenshots](docs/screenshots)

## Validation Before Submission

Run the available project checks:

```bash
npm run lint
npm run build
```
