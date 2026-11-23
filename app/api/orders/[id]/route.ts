
import { NextResponse } from "next/server";
import { orders } from "@/lib/orders";

// GET - Retrieve one order
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const order = orders.find((item) => item.id === id);

  if (!order) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "order is found",
    order,
  });
}

// PATCH - Update an existing order
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. Find the order
  const orderIndex = orders.findIndex((item) => item.id === id);

  if (orderIndex === -1) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  // 2. Read and parse the request body
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // 3. Check that the body is a valid object
  if (
    body === null ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return NextResponse.json(
      { error: "Request body must be an object" },
      { status: 400 }
    );
  }

  // 4. Reject an empty update
  if (Object.keys(body).length === 0) {
    return NextResponse.json(
      { error: "At least one field is required for update" },
      { status: 400 }
    );
  }

  // 5. Allow only editable fields
  const allowedFields = [
    "customerName",
    "phone",
    "productName",
    "quantity",
    "unitPrice",
    "status",
  ];

  const invalidFields = Object.keys(body).filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    return NextResponse.json(
      {
        error: `Fields cannot be updated: ${invalidFields.join(", ")}`,
      },
      { status: 400 }
    );
  }

  // 6. Validate only the supplied fields
  if (
    "customerName" in body &&
    (typeof body.customerName !== "string" ||
      body.customerName.trim() === "")
  ) {
    return NextResponse.json(
      { error: "Customer name is required" },
      { status: 400 }
    );
  }

  if (
    "phone" in body &&
    (typeof body.phone !== "string" ||
      body.phone.trim() === "")
  ) {
    return NextResponse.json(
      { error: "Phone is required" },
      { status: 400 }
    );
  }

  if (
    "productName" in body &&
    (typeof body.productName !== "string" ||
      body.productName.trim() === "")
  ) {
    return NextResponse.json(
      { error: "Product name is required" },
      { status: 400 }
    );
  }

  if (
    "quantity" in body &&
    (typeof body.quantity !== "number" ||
      !Number.isInteger(body.quantity) ||
      body.quantity < 1)
  ) {
    return NextResponse.json(
      { error: "Quantity must be a positive integer" },
      { status: 400 }
    );
  }

  if (
    "unitPrice" in body &&
    (typeof body.unitPrice !== "number" ||
      !Number.isFinite(body.unitPrice) ||
      body.unitPrice < 0 ||
      Math.round(body.unitPrice * 100) !== body.unitPrice * 100)
  ) {
    return NextResponse.json(
      {
        error:
          "Unit price must be a finite non-negative number with at most two decimal places",
      },
      { status: 400 }
    );
  }

  if (
    "status" in body &&
    !["Pending", "Preparing", "Delivered"].includes(body.status)
  ) {
    return NextResponse.json(
      { error: "Invalid status" },
      { status: 400 }
    );
  }

  // 7. Update the existing order
  const currentOrder = orders[orderIndex];

  const updatedOrder = {
    ...currentOrder,
    ...body,

    customerName:
      body.customerName !== undefined
        ? body.customerName.trim()
        : currentOrder.customerName,

    phone:
      body.phone !== undefined
        ? body.phone.trim()
        : currentOrder.phone,

    productName:
      body.productName !== undefined
        ? body.productName.trim()
        : currentOrder.productName,

    quantity: body.quantity ?? currentOrder.quantity,

    unitPrice: body.unitPrice ?? currentOrder.unitPrice,

    total:
      (Math.round(
        (body.unitPrice ?? currentOrder.unitPrice) * 100
      ) *
        (body.quantity ?? currentOrder.quantity)) /
      100,
  };

  orders[orderIndex] = updatedOrder;

  return NextResponse.json(updatedOrder, { status: 200 });
}

// DELETE - Remove an order
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const orderIndex = orders.findIndex((item) => item.id === id);

  if (orderIndex === -1) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  orders.splice(orderIndex, 1);

  return new Response(null, { status: 204 });
}
