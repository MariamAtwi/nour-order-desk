### 1. Trace one Add Order action from the form to the Route Handler and back.

When we add an order, the form calls the `addOrder` function, which sends a POST request to the `/api/orders` endpoint. The server receives the request, validates the information, generates a unique ID, and calculates the total. Then it returns a response with all the order information, including the customer name, product name, quantity, unit price, and calculated total. If the order is created successfully, the server returns **201 Created**.

### 2. Where is the total calculated, and why is that decision important?

The total is calculated on the server side because the backend is responsible for handling business operations and logic. The server calculates it by multiplying the quantity by the unit price. This is important because we should not trust values sent by the client.

### 3. Show one invalid request. Why did it fail, and did stored data remain unchanged?

I sent a PATCH request to update an order with a quantity of `-2`. The server returned **400 Bad Request** because the quantity must be a positive integer greater than or equal to 1. I then checked the order using GET and confirmed that the stored quantity and total remained unchanged.


### 4. What is the difference between PATCH and replacing an entire object?

With PATCH, we update only the fields we send in the request, while the other fields remain unchanged. For example, if we send only the quantity, the server updates the quantity and recalculates the total without changing the other order information. Replacing an entire object requires sending the complete object instead of only the fields we want to change.

### 5. What happens to your orders after a server restart?

The orders are stored in a server-side in-memory store, not in a database. They can remain available during development reloads, but after a full server restart, the stored changes are lost and the initial orders are loaded again.


### 6. Which AI suggestion did you correct or verify, and what evidence helped you decide?

The AI suggested restarting the server to verify that the in-memory orders would reset to the initial seed data. However, I did not accept the suggestion without checking. After restarting, the three orders were still showing. I then checked the terminal, found that the old Next.js server process was still running (PID 7444), and stopped it using `taskkill /PID 7444 /F`. After restarting the server, the orders reset to the single seed order. This helped me verify that the in-memory data resets after a complete server process restart.