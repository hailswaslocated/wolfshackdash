let config = window.SQUARE_CONFIG || null;
const statusEl = document.getElementById("payment-status");
const orderItemsEl = document.getElementById("orderItems");
const orderSubtotalEl = document.getElementById("orderSubtotal");
const orderTaxEl = document.getElementById("orderTax");
const orderTotalEl = document.getElementById("orderTotal");
const payButton = document.getElementById("card-button");

const formatCurrency = (value) => `$${value.toFixed(2)}`;

const readCart = () => {
  const raw = localStorage.getItem("wolfshack-cart");
  if (!raw) return { items: [], subtotal: 0, tax: 0, total: 0 };
  try {
    const parsed = JSON.parse(raw);
    return {
      items: parsed.items || [],
      subtotal: parsed.subtotal || 0,
      tax: parsed.tax || 0,
      total: parsed.total || 0
    };
  } catch (error) {
    return { items: [], subtotal: 0, tax: 0, total: 0 };
  }
};

const readOrderMeta = () => {
  return {
    pickupTime: localStorage.getItem("wolfshack-pickup-time") || "asap",
    notes: localStorage.getItem("wolfshack-notes") || ""
  };
};

const renderSummary = () => {
  const cart = readCart();
  if (!cart.items.length) {
    orderItemsEl.innerHTML = `<p class="muted">Your cart is empty.</p>`;
  } else {
    orderItemsEl.innerHTML = cart.items
      .map(
        (item) => `
        <div class="order-item">
          <span>${item.name} x${item.quantity}</span>
          <span>${formatCurrency(item.price * item.quantity)}</span>
        </div>
      `
      )
      .join("");
  }
  orderSubtotalEl.textContent = formatCurrency(cart.subtotal);
  orderTaxEl.textContent = formatCurrency(cart.tax);
  orderTotalEl.textContent = formatCurrency(cart.total);
};

const setStatus = (message) => {
  if (statusEl) statusEl.textContent = message;
};

const loadConfig = async () => {
  if (config) return config;
  try {
    const response = await fetch("/api/config");
    if (!response.ok) throw new Error("Config unavailable");
    config = await response.json();
  } catch (error) {
    config = null;
  }
  return config;
};

const loadSquareScript = async (environment) => {
  if (window.Square) return;
  const script = document.createElement("script");
  script.src =
    environment === "production"
      ? "https://web.squarecdn.com/v1/square.js"
      : "https://sandbox.web.squarecdn.com/v1/square.js";
  script.async = true;
  document.body.appendChild(script);
  await new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = () => reject(new Error("Square script failed"));
  });
};

const initSquare = async () => {
  const cfg = await loadConfig();
  if (!cfg || !cfg.applicationId || !cfg.locationId) {
    setStatus(
      "Square config missing. Set SQUARE_APPLICATION_ID and SQUARE_LOCATION_ID."
    );
    return null;
  }

  await loadSquareScript(cfg.environment || "sandbox");
  if (!window.Square) {
    setStatus("Square payments failed to load.");
    return null;
  }

  const payments = window.Square.payments(
    cfg.applicationId,
    cfg.locationId
  );
  const card = await payments.card();
  await card.attach("#card-container");
  return card;
};

const pay = async (card) => {
  const cart = readCart();
  const orderMeta = readOrderMeta();
  if (!cart.total) {
    setStatus("Your cart is empty. Add items first.");
    return;
  }

  setStatus("Processing payment...");
  const result = await card.tokenize();
  if (result.status !== "OK") {
    setStatus("Card tokenization failed. Check your details.");
    return;
  }

  const response = await fetch("/api/pay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: result.token,
      amount: Math.round(cart.total * 100),
      currency: "USD",
      items: cart.items,
      pickupTime: orderMeta.pickupTime,
      notes: orderMeta.notes
    })
  });

  const data = await response.json();
  if (!response.ok) {
    setStatus(data?.errors?.[0]?.detail || "Payment failed.");
    return;
  }

  const orderId = data.orderId || data?.payment?.id;
  if (orderId) {
    localStorage.setItem("wolfshack-last-order-id", orderId);
  }
  setStatus("Payment successful! Redirecting to your pickup status.");
  window.location.href = orderId
    ? `order-status.html?orderId=${encodeURIComponent(orderId)}`
    : "order-status.html";
};

const start = async () => {
  renderSummary();
  const card = await initSquare();
  if (!card || !payButton) return;
  payButton.addEventListener("click", () => pay(card));
};

start();
