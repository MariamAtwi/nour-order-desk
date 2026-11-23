
import { NextResponse } from "next/server";
import { orders } from "@/lib/orders";

export async function GET() {
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (
    body === null ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return NextResponse.json(
      { error: "Request body must be a JSON object" },
      { status: 400 }
    );
  }

  if (
    typeof body.customerName !== "string" ||
    body.customerName.trim() === ""
  ) {
    return NextResponse.json(
      { error: "Customer name is required" },
      { status: 400 }
    );
  }

  if (
    typeof body.phone !== "string" ||
    body.phone.trim() === ""
  ) {
    return NextResponse.json(
      {
        error:
          "Please enter a valid phone number. This field cannot be empty.",
      },
      { status: 400 }
    );
  }

  if (
    typeof body.productName !== "string" ||
    body.productName.trim() === ""
  ) {
    return NextResponse.json(
      { error: "Product name is required" },
      { status: 400 }
    );
  }

  if (
    typeof body.quantity !== "number" ||
    !Number.isInteger(body.quantity) ||
    body.quantity < 1
  ) {
    return NextResponse.json(
      { error: "Quantity must be a positive integer" },
      { status: 400 }
    );
  }

  if (
    typeof body.unitPrice !== "number" ||
    !Number.isFinite(body.unitPrice) ||
    body.unitPrice < 0 ||
    Math.round(body.unitPrice * 100) !== body.unitPrice * 100
  ) {
    return NextResponse.json(
      {
        error:
          "Unit price must be a finite non-negative number with at most two decimal places",
      },
      { status: 400 }
    );
  }

  const order = {
    id: crypto.randomUUID(),
    customerName: body.customerName.trim(),
    phone: body.phone.trim(),
    productName: body.productName.trim(),
    quantity: body.quantity,
    unitPrice: body.unitPrice,
    total:
      (Math.round(body.unitPrice * 100) * body.quantity) / 100,
    status: "Pending" as const,
  };

  orders.push(order);

  return NextResponse.json(order, { status: 201 });
}
