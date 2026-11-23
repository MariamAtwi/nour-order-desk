# Nour's Order Desk – Project Plan

## 1. Client Problem

Orders are scattered. Nour cannot reliably see which orders exist, what each customer requested, or which ones still need preparation.

The goal is to give Nour one clear dashboard where she can record an order, correct it, track its status, and remove an accidental entry.

## 2. Required Features

The dashboard must provide the following features:

| Feature | Description |
|---|---|
| List orders | Show customer, product, quantity, total, and status. |
| View an order | Show customer, product, quantity, total, and status. |
| Add an order |  Submit a form and show the saved server response.|
| Update an order | Edit its information and change its status. |
| Delete an order | Ask for confirmation before removing an accidental entry. |
| Summary counts |Total orders, pending orders, and delivered orders, derived from actual order data. |

## 3. API Endpoints

| HTTP Method | Endpoint           | Purpose                                                                                                                                           |
| ----------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET         | `/api/orders`      | list all orders                                                                                            |
| GET         | `/api/orders/[id]` | Retrieve a specific order using its ID.                                                                                                           |
| POST        | `/api/orders`      | Create a new order    |
| PATCH       | `/api/orders/[id]` | update an existing order using its ID.|
| DELETE      | `/api/orders/[id]` | Delete an existing order using its ID.                                                                                                            |

## Implementation Steps

1. Create the working branch `assignment-4-nour-order-desk`.
2. Define the Order type, shared in-memory store, validation, and total calculation.
3. Build the REST API Route Handlers for all CRUD operations.
4. Develop the responsive order management dashboard and connect it to the API using `fetch`.
5. Test every endpoint using Thunder Client, including invalid input and unknown IDs.
6. Fix issues found during testing and retest all endpoints.
7. Complete the documentation, record testing evidence, and run lint and build checks.