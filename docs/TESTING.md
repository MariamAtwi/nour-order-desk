# Testing Documentation – Nour's Order Desk

## Testing Environment

- **Testing tool:** Thunder Client
- **API base URL:** `http://localhost:3000/api/orders`

## API Test Results

| # | Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| 1 | List all orders | 200 and an array | 200, orders returned successfully | PASS |
| 2 | Read an existing order | 200 and matching object | 200, correct order returned | PASS |
| 3 | Create a valid order | 201, unique ID, correct total, Pending | 201, order created successfully | PASS |
| 4 | Omit customer name | 400 with useful error | 400, Customer name is required | PASS |
| 5 | Send a blank phone | 400 | 400, blank phone rejected with updated error message | PASS |
| 6 | Send quantity 0,-1,1.5 | 400 | 400, positive integer validation error | PASS |
| 7 | Send negative unit price | 400 | 400, unit price validation error | PASS |
| 10 | Send non-numeric unit price | 400 | 400, unit price validation error | PASS |
| 11 | Send status `Flying` | 400 on PATCH | 400, Invalid status | PASS |
| 12 | Send malformed JSON | 400, not an unhandled 500 | 400, Invalid JSON body | PASS |
| 13 | Send an empty PATCH body | 400 | 400, At least one field is required for update | PASS |
| 14 | Update quantity without sending customer name | 200, customer name preserved | 200, omitted fields remained unchanged | PASS |
| 15 | Attempt to change an ID | Server-owned ID remains unchanged | 400, Fields cannot be updated: id | PASS |
| 16 | Delete an existing order | 204 with no body | 204 No Content, empty response | PASS |
| 17 | GET,PATCH,DELETE an unknown ID | 404 | 404, Order not found | PASS |


## Maya’s client acceptance test-Dashboard
Starting state: 1 order in the list, after a clean server restart.

1. Add an order for 3 Vanilla Candles at $8 each.The order appeared in the dashboard, and the server calculated the total as $24.00 and assigned the status `Pending`. The Total Orders count increased from 1 to 2.

2. Change the quantity to 4.The server recalculated the total from $24.00 to $32.00.

3. Change the status to Delivered.The dashboard updated the counts:Pending decreased to 1, and Delivered increased from to 1.

4. Setting the quantity to -2 through Postman or Thunder Client.I sent a PATCH request with quantity: -2 t and the API returned 400 Bad Request. I then fetched the same order again to verify its data. The quantity remained 4 and the total remained $32.00, confirming that the rejected update did not modify the order.

5. Sending total: 0 with otherwise valid data.I sent a POST request with otherwise valid data and `total: 0`. The API returned `201 Created` with the correct total of $32.00. This confirms that the server ignores the client's total and calculates it itself.

6. Create a second, accidental order and delete it.I created a second accidental order, then deleted it. The API returned `204` with no body and the order disappeared from the dashboard, and the counts returned to Total 2, Pending 1, and Delivered 1.

7. Fetch the deleted order by ID.I sent a GET request using the ID of the deleted order. The API returned `404 Not Found` with an "Order not found" error message, confirming that the order was successfully deleted.


## Evidence

Screenshots of the API requests and responses are stored in:

`docs/evidence/endpoints/`

### Mobile View

**Viewport:** 393 × 852 px

**Checks passed:**
- Dashboard adapts to the mobile screen.
- Summary cards display in two columns.
- Create Order section appears below the overview.
- Form fields fit within the mobile layout.
- Order cards support horizontal scrolling.
- Buttons, inputs, and dropdowns work on mobile.
- No unwanted horizontal page overflow.

**Screenshot evidence:** [View Mobile Screenshot](screenshots/mobile-viewport.png)

## Scripts

when we ran `npm run lint` for the first time, ESLint reported an error related to the react-hooks/set-state-in-effect rule. The reason was that fetchOrders() was called directly inside useEffect, and this function updates React state using setOrders(), setError(), and setLoading(). These updates trigger React re-renders, and the lint rule discourages synchronous state updates directly inside an effect.To fix the issue we used Promise.resolve().then() to schedule the call to fetchOrders() after the synchronous effect body finishes. We ran npm run lint again, and it passed without errors or warnings.

I ran `npm run build` to verify that the application was ready for production and The production build completed successfully with no errors.


## Things i could not verify
None
