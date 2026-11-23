
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Order } from "@/types/order";

// Product images
const productImages: Record<string, string> = {
  "Vanilla Candle": "/images/vanilla-candle.png",
  "Cedar Candle": "/images/cedar-candle.png",
  "Mini Gift Candle": "/images/mini-gift-candle.png",
};

export default function OrderDashboard() {
  // Available products
  const products = [
    { name: "Vanilla Candle", price: 8 },
    { name: "Cedar Candle", price: 10 },
    { name: "Mini Gift Candle", price: 6 },
  ];

  // States
  const [orders, setOrders] = useState<Order[]>([]); //Stores the orders returned by the API
  const [loading, setLoading] = useState(true); //Tracks whether orders are being fetched and allows me to display a loading message.
  const [error, setError] = useState(""); //Stores an error message if fetching orders fails

  const [formData, setFormData] = useState({ //Stores the values entered by the user in the create order form.
    customerName: "",
    phone: "",
    productName: "",
    quantity: "1",
    unitPrice: "0",
  });

  const [submitting, setSubmitting] = useState(false); //Tracks whether an order is currently being submitted.
  const [formError, setFormError] = useState(""); //Stores errors that occur when creating an order.
  const [activeFilter, setActiveFilter] = useState("All"); //Stores the currently selected status filter.

    
  {/* This function retrieves the orders from the backend, 
  stores them in the frontend, and handles loading and error states*/}
  async function fetchOrders() {
    try {
      const response = await fetch("/api/orders");

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to fetch orders.");
      }

      const data: Order[] = await response.json();

      setOrders(data);
      setError("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

   {/*I use useEffect to call fetchOrders() when the dashboard first loads, 
    so the orders are automatically retrieved from the API 
    without requiring the user to click a button.*/}

  useEffect(() => {
  Promise.resolve().then(() => {
    fetchOrders();
  });
}, []);


  function handleRetry() {
    setLoading(true);
    setError("");
    fetchOrders();
  }

  {/*This function collects the form data, sends it to the backend to create an order, 
    handles success or errors, and refreshes the dashboard.*/}
  async function addOrder() {
    try {
      setSubmitting(true);
      setFormError("");

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity),
          unitPrice: Number(formData.unitPrice),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order.");
      }

      setFormData({
        customerName: "",
        phone: "",
        productName: "",
        quantity: "1",
        unitPrice: "0",
      });

      await fetchOrders();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  }

   {/*This function updates an order's quantity through the API
     without replacing the entire order,then refreshes the dashboard*/}
  async function updateOrder(id: string) {
    const newQuantity = prompt("Enter the new quantity:");

    if (newQuantity === null || newQuantity.trim() === "") {
      return;
    }

    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: Number(newQuantity),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update order.");
      }

      await fetchOrders();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    }
  }

  {/*This function updates an order's status through the API
    without changing its other information,then refreshes the dashboard.*/}
  async function updateStatus(
    id: string,
    newStatus: Order["status"]
  ) {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status.");
      }

      await fetchOrders();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    }
  }

  
  {/*This function confirms and deletes the selected order through the API, 
    handles success or errors, and refreshes the dashboard.*/}
  async function deleteOrder(id: string) {
    const confirmed = confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.error || "Failed to delete order."
        );
      }

      alert("Order deleted successfully!");

      await fetchOrders();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    }
  }

  // Summary calculations
  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const preparingOrders = orders.filter(
    (order) => order.status === "Preparing"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  // This part filters the orders based on the status selected by the user.
 // If the user selects All, it displays every order.
//If the user selects Pending, Preparing, or Delivered, it displays only orders with that status.

  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  return (
    <main className="min-h-screen bg-[#F7F2EA] text-[#493729]">
      <div className="mx-auto min-h-screen w-full max-w-[1600px] px-4 py-6 sm:px-8 sm:py-8 lg:px-12">

        {/* Header */}
        <header className="mb-8 sm:mb-10">
          <p className="font-body mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#A08060]">
            Nour Candle Studio
          </p>

          <h1 className="font-cinzel text-3xl font-medium tracking-wide sm:text-5xl">
            Order Dashboard
          </h1>

          <p className="font-cormorant mt-2 text-xl leading-relaxed text-[#927B65] sm:text-3xl">
            Manage your orders and keep your business glowing.
          </p>
        </header>

        
        <section className="mb-8 sm:mb-10">
          <div className="mb-4 sm:mb-5">
            <h2 className="font-cinzel text-xl font-medium tracking-wide sm:text-2xl">
              Overview
            </h2>
          </div>

          {/* Two columns on mobile, four on desktop */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">

            <div className="rounded-2xl border border-[#E7D9C8] bg-[#FFFDF9] p-4 shadow-sm sm:p-6">
              <p className="font-body text-xs text-[#927B65] sm:text-sm">
                Total Orders
              </p>
              <p className="font-cinzel mt-2 text-3xl font-medium sm:mt-3 sm:text-4xl">
                {totalOrders}
              </p>
              <p className="font-body mt-1 text-[10px] text-[#A58C74] sm:mt-2 sm:text-xs">
                All orders
              </p>
            </div>

            <div className="rounded-2xl border border-[#E7D9C8] bg-[#F0E3D3] p-4 shadow-sm sm:p-6">
              <p className="font-body text-xs text-[#795C43] sm:text-sm">
                Pending
              </p>
              <p className="font-cinzel mt-2 text-3xl font-medium sm:mt-3 sm:text-4xl">
                {pendingOrders}
              </p>
              <p className="font-body mt-1 text-[10px] text-[#927B65] sm:mt-2 sm:text-xs">
                Waiting to be processed
              </p>
            </div>

            <div className="rounded-2xl border border-[#E7D9C8] bg-[#E8D6C1] p-4 shadow-sm sm:p-6">
              <p className="font-body text-xs text-[#795C43] sm:text-sm">
                Preparing
              </p>
              <p className="font-cinzel mt-2 text-3xl font-medium sm:mt-3 sm:text-4xl">
                {preparingOrders}
              </p>
              <p className="font-body mt-1 text-[10px] text-[#927B65] sm:mt-2 sm:text-xs">
                Currently in progress
              </p>
            </div>

            <div className="rounded-2xl border border-[#E7D9C8] bg-[#6F5038] p-4 text-[#FFF9F1] shadow-sm sm:p-6">
              <p className="font-body text-xs text-[#EAD9C6] sm:text-sm">
                Delivered
              </p>
              <p className="font-cinzel mt-2 text-3xl font-medium sm:mt-3 sm:text-4xl">
                {deliveredOrders}
              </p>
              <p className="font-body mt-1 text-[10px] text-[#EAD9C6] sm:mt-2 sm:text-xs">
                Successfully completed
              </p>
            </div>

          </div>
        </section>

        {/* Main dashboard layout */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(360px,1fr)]">

         
          <section className="order-1 rounded-2xl border border-[#E7D9C8] bg-[#FFFDF9] p-5 shadow-sm sm:p-8 lg:order-2">

            <div className="mb-6 sm:mb-7">
              <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-[#A08060]">
                New order
              </p>

              <h2 className="font-cinzel mt-2 text-2xl font-medium tracking-wide sm:text-3xl">
                Create an Order
              </h2>

              <p className="font-cormorant mt-1 text-lg text-[#927B65] sm:text-xl">
                Add a new candle order to your studio.
              </p>
            </div>

            {/* Compact two-column mobile form */}
            <form
              className="grid grid-cols-2 gap-4 sm:gap-5"
              onSubmit={(event) => {
                event.preventDefault();
                addOrder();
              }}
            >

              {/* Customer Name */}``
              <div className="col-span-2">
                <label
                  htmlFor="customerName"
                  className="font-body mb-2 block text-sm font-semibold"
                >
                  Customer Name
                </label>

                <input
                  id="customerName"
                  type="text"
                  value={formData.customerName}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      customerName: event.target.value,
                    })
                  }
                  required
                  placeholder="Enter customer name"
                  className="font-body w-full rounded-xl border border-[#DFD0BE] bg-[#FAF6F0] px-3 py-3 text-sm outline-none transition focus:border-[#8B6849] focus:ring-2 focus:ring-[#8B6849]/15 sm:px-4"
                />
              </div>

              {/* Phone */}
              <div className="col-span-2">
                <label
                  htmlFor="phone"
                  className="font-body mb-2 block text-sm font-semibold"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      phone: event.target.value,
                    })
                  }
                  required
                  placeholder="Enter phone number"
                  className="font-body w-full rounded-xl border border-[#DFD0BE] bg-[#FAF6F0] px-3 py-3 text-sm outline-none transition focus:border-[#8B6849] focus:ring-2 focus:ring-[#8B6849]/15 sm:px-4"
                />
              </div>

              {/* Product Selection */}
              <div className="col-span-2">
                <label
                  htmlFor="productName"
                  className="font-body mb-2 block text-sm font-semibold"
                >
                  Product Name
                </label>

                <select
                  id="productName"
                  value={formData.productName}
                  onChange={(event) => {
                    const selectedProduct = products.find(
                      (product) => product.name === event.target.value
                    );

                    setFormData({
                      ...formData,
                      productName: event.target.value,
                      unitPrice: selectedProduct
                        ? selectedProduct.price.toString()
                        : "0",
                    });
                  }}
                  required
                  className="font-body w-full rounded-xl border border-[#DFD0BE] bg-[#FAF6F0] px-3 py-3 text-sm outline-none transition focus:border-[#8B6849] focus:ring-2 focus:ring-[#8B6849]/15 sm:px-4"
                >
                  <option value="" disabled>
                    Select a candle
                  </option>

                  {products.map((product) => (
                    <option key={product.name} value={product.name}>
                      {product.name} — ${product.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label
                  htmlFor="quantity"
                  className="font-body mb-2 block text-sm font-semibold"
                >
                  Quantity
                </label>

                <input
                  id="quantity"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.quantity}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      quantity: event.target.value,
                    })
                  }
                  required
                  className="font-body w-full rounded-xl border border-[#DFD0BE] bg-[#FAF6F0] px-3 py-3 text-sm outline-none transition focus:border-[#8B6849] focus:ring-2 focus:ring-[#8B6849]/15"
                />
              </div>

              {/* Unit Price */}
              <div>
                <label
                  htmlFor="unitPrice"
                  className="font-body mb-2 block text-sm font-semibold"
                >
                  Unit Price (USD)
                </label>

                <input
                  id="unitPrice"
                  type="number"
                  value={formData.unitPrice}
                  readOnly
                  className="font-body w-full rounded-xl border border-[#DFD0BE] bg-[#EFE5D8] px-3 py-3 text-sm text-[#795C43] outline-none"
                />
              </div>

              {/* Form Error */}
              {formError && (
                <p
                  role="alert"
                  className="font-body col-span-2 text-sm text-red-700"
                >
                  {formError}
                </p>
              )}

              {/* Order Total Preview */}
              <div className="col-span-2 flex items-center justify-between rounded-xl bg-[#F0E3D3] p-4">
                <span className="font-body text-sm text-[#795C43]">
                  Estimated Total
                </span>

                <span className="font-cinzel text-xl font-medium sm:text-2xl">
                  $
                  {(
                    Number(formData.quantity) *
                    Number(formData.unitPrice)
                  ).toFixed(2)}
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="font-body col-span-2 w-full rounded-xl bg-[#6F5038] px-6 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-[#513A29] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Creating..." : "+ Create Order"}
              </button>

            </form>
          </section>

          {/* Recent Orders - Left on desktop, second on mobile */}
          <section className="order-2 min-w-0 rounded-2xl border border-[#E7D9C8] bg-[#FFFDF9] p-5 shadow-sm sm:p-8 lg:order-1">

            <div className="mb-6 sm:mb-7">
              <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-[#A08060]">
                Order management
              </p>

              <h2 className="font-cinzel mt-2 text-2xl font-medium tracking-wide sm:text-3xl">
                Recent Orders
              </h2>

              <p className="font-cormorant mt-1 text-lg text-[#927B65] sm:text-xl">
                Keep track of your candle orders.
              </p>
            </div>

            {/* Filters */}
            <div className="mb-5 flex flex-wrap gap-2 sm:mb-6">
              {["All", "Pending", "Preparing", "Delivered"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`font-body rounded-full border px-3 py-2 text-xs transition sm:px-4 sm:text-sm ${
                    activeFilter === filter
                      ? "border-[#6F5038] bg-[#6F5038] text-white"
                      : "border-[#DFD0BE] text-[#795C43] hover:bg-[#F0E3D3]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Loading */}
            {loading && (
              <p className="font-body py-8 text-center text-sm text-[#927B65]">
                Loading orders...
              </p>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="rounded-xl bg-[#F3E5D8] p-5 text-center">
                <p role="alert" className="font-body text-sm">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={handleRetry}
                  className="font-body mt-4 rounded-lg bg-[#6F5038] px-5 py-2 text-sm text-white hover:bg-[#513A29]"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && filteredOrders.length === 0 && (
              <p className="font-body py-8 text-center text-sm text-[#927B65]">
                {orders.length === 0
                  ? "No orders found. Add your first order!"
                  : "No orders found for this status."}
              </p>
            )}

            {/* Order Cards */}
            {!loading && !error && filteredOrders.length > 0 && (
              <>
                {/* Swipeable on mobile, vertical list on desktop */}
                <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:flex-col lg:overflow-visible">

                  {filteredOrders.map((order) => (
                    <article
                      key={order.id}
                      className="w-[280px] min-w-[280px] snap-start rounded-2xl border border-[#E9DECF] bg-[#FAF6F0] p-4 shadow-sm transition hover:border-[#C5A98A] hover:shadow-md sm:w-[320px] sm:min-w-[320px] sm:p-5 lg:w-full lg:min-w-0"
                    >

                      <div className="flex flex-col gap-4 lg:flex-row lg:gap-5">

                        {/* Product Image */}
                        <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl bg-[#E8D6C1] lg:h-36 lg:w-36">
                          <Image
                            src={
                              productImages[order.productName] ||
                              "/images/nour-studio.jpg"
                            }
                            alt={order.productName}
                            fill
                            sizes="(min-width: 1024px) 144px, 320px"
                            className="object-cover"
                          />
                        </div>

                        {/* Order Information */}
                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-start justify-between gap-3">

                            <div>
                              <h3 className="font-cinzel text-xl font-medium tracking-wide">
                                {order.productName}
                              </h3>

                              <p className="font-body mt-2 text-xs text-[#927B65] sm:text-sm">
                                Customer: {order.customerName}
                              </p>

                              <p className="font-body mt-1 text-xs text-[#927B65] sm:text-sm">
                                Phone: {order.phone}
                              </p>
                            </div>

                            {/* Status */}
                            <span
                              className={`font-body rounded-full px-3 py-1.5 text-[10px] font-semibold sm:text-xs ${
                                order.status === "Delivered"
                                  ? "bg-[#E2E9DC] text-[#536B48]"
                                  : order.status === "Preparing"
                                    ? "bg-[#E8D6C1] text-[#795C43]"
                                    : "bg-[#F1E5D5] text-[#8B6849]"
                              }`}
                            >
                              {order.status}
                            </span>

                          </div>

                          {/* Order Details */}
                          <div className="my-4 grid grid-cols-3 gap-2 border-y border-[#E5D8C8] py-3 sm:gap-4 lg:my-5 lg:py-4">

                            <div>
                              <p className="font-body text-[10px] text-[#9A826A] sm:text-xs">
                                Quantity
                              </p>
                              <p className="font-body mt-1 text-sm font-semibold">
                                {order.quantity}
                              </p>
                            </div>

                            <div>
                              <p className="font-body text-[10px] text-[#9A826A] sm:text-xs">
                                Unit Price
                              </p>
                              <p className="font-body mt-1 text-sm font-semibold">
                                ${order.unitPrice.toFixed(2)}
                              </p>
                            </div>

                            <div>
                              <p className="font-body text-[10px] text-[#9A826A] sm:text-xs">
                                Total
                              </p>
                              <p className="font-cinzel mt-1 text-sm font-medium sm:text-lg">
                                ${order.total.toFixed(2)}
                              </p>
                            </div>

                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2">

                            <select
                              aria-label={`Update status for ${order.productName}`}
                              value={order.status}
                              onChange={(event) =>
                                updateStatus(
                                  order.id,
                                  event.target.value as Order["status"]
                                )
                              }
                              className="font-body min-w-0 rounded-lg border border-[#DFD0BE] bg-[#FFFDF9] px-2 py-2 text-xs text-[#795C43] outline-none focus:border-[#8B6849] sm:px-3 sm:text-sm"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Preparing">Preparing</option>
                              <option value="Delivered">Delivered</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => updateOrder(order.id)}
                              className="font-body rounded-lg border border-[#A98A6A] px-3 py-2 text-xs font-medium text-[#795C43] transition hover:bg-[#EDE0D0] sm:px-5 sm:text-sm"
                            >
                              Edit Quantity
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteOrder(order.id)}
                              className="font-body rounded-lg border border-[#B78B7B] px-3 py-2 text-xs font-medium text-[#895B4A] transition hover:bg-[#F1E1D9] sm:px-5 sm:text-sm"
                            >
                              Delete
                            </button>

                          </div>

                        </div>
                      </div>
                    </article>
                  ))}

                </div>

                {/* Swipe for mobile */}
                <p className="font-body mt-1 text-center text-[10px] text-[#A58C74] lg:hidden">
                  Swipe horizontally to view more orders →
                </p>
              </>
            )}

          </section>

        </div>

        {/* Footer */}
        <footer className="mt-10 border-t border-[#E5D8C8] py-7 text-center">
          <p className="font-cinzel text-lg tracking-wider text-[#795C43]">
            Nour Candle Studio
          </p>

          <p className="font-cormorant mt-1 text-lg text-[#A58C74]">
            Crafted with warmth and love.
          </p>
        </footer>

      </div>
    </main>
  );
}
