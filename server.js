const http = require("http");
const fs = require("fs");
const { readFile } = require("fs/promises");
const { createHash, randomUUID } = require("crypto");
const path = require("path");

const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const raw = fs.readFileSync(envPath, "utf8");
  raw
    .split(/\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .forEach((line) => {
      const idx = line.indexOf("=");
      if (idx === -1) return;
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    });
}

const PORT = Number(process.env.PORT || 8000);
const SQUARE_ENV = process.env.SQUARE_ENV || "sandbox";
const SQUARE_APPLICATION_ID = process.env.SQUARE_APPLICATION_ID || "";
const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN || "";
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID || "";

const baseUrl =
  SQUARE_ENV === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";

const orderStore = new Map();

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });

const createPayment = async ({ token, amount, currency }) => {
  const response = await fetch(`${baseUrl}/v2/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      idempotency_key: randomUUID(),
      source_id: token,
      location_id: SQUARE_LOCATION_ID,
      amount_money: {
        amount,
        currency
      }
    })
  });

  const data = await response.json();
  return { status: response.status, data };
};

const listOrders = () => {
  return Array.from(orderStore.values()).sort((a, b) => {
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });
};

const tryExtractOrderId = (payload) => {
  return (
    payload?.data?.object?.payment?.id ||
    payload?.data?.object?.order?.id ||
    payload?.payment?.id ||
    payload?.order?.id ||
    payload?.paymentId ||
    payload?.orderId ||
    null
  );
};

const markOrderReady = (orderId) => {
  if (!orderId) return false;
  const current = orderStore.get(orderId) || {
    id: orderId,
    createdAt: new Date().toISOString()
  };
  orderStore.set(orderId, {
    ...current,
    status: "ready",
    readyAt: new Date().toISOString(),
    message: "Your order is ready for pickup."
  });
  return true;
};

const updateOrderStatus = (orderId, status) => {
  if (!orderId || !orderStore.has(orderId)) return null;
  const current = orderStore.get(orderId);
  const next = {
    ...current,
    status,
    updatedAt: new Date().toISOString()
  };
  if (status === "ready") {
    next.readyAt = next.readyAt || next.updatedAt;
    next.message = "Your order is ready for pickup.";
  }
  if (status === "completed") {
    next.completedAt = next.updatedAt;
    next.message = "Order completed.";
  }
  orderStore.set(orderId, next);
  return next;
};

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/api/config") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        applicationId: SQUARE_APPLICATION_ID,
        locationId: SQUARE_LOCATION_ID,
        environment: SQUARE_ENV
      })
    );
    return;
  }

  if (req.method === "GET" && req.url.startsWith("/api/order-status")) {
    const url = new URL(req.url, "http://localhost");
    const orderId = url.searchParams.get("orderId");
    const order = orderId ? orderStore.get(orderId) : null;
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify(
        order || {
          status: "pending",
          message: "Your order is being prepared."
        }
      )
    );
    return;
  }

  if (req.method === "GET" && req.url === "/api/admin/orders") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ orders: listOrders() }));
    return;
  }

  if (req.method === "POST" && req.url.startsWith("/api/admin/orders/") && req.url.endsWith("/status")) {
    try {
      const match = req.url.match(/^\/api\/admin\/orders\/([^/]+)\/status$/);
      const orderId = match?.[1] ? decodeURIComponent(match[1]) : null;
      const body = await readBody(req);
      const payload = JSON.parse(body || "{}");
      const status = String(payload.status || "").toLowerCase();
      if (!orderId || !["paid", "ready", "completed"].includes(status)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid order or status." }));
        return;
      }
      const updated = updateOrderStatus(orderId, status);
      if (!updated) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Order not found." }));
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ order: updated }));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Unable to update order." }));
    }
    return;
  }

  if (req.method === "POST" && req.url === "/api/pay") {
    try {
      if (!SQUARE_ACCESS_TOKEN || !SQUARE_LOCATION_ID) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            errors: [
              {
                detail:
                  "Missing Square credentials. Set SQUARE_ACCESS_TOKEN and SQUARE_LOCATION_ID."
              }
            ]
          })
        );
        return;
      }

      const body = await readBody(req);
      const payload = JSON.parse(body || "{}");
      if (!payload.token || !payload.amount) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            errors: [{ detail: "Missing token or amount." }]
          })
        );
        return;
      }

      const { status, data } = await createPayment({
        token: payload.token,
        amount: payload.amount,
        currency: payload.currency || "USD"
      });

      const paymentId = data?.payment?.id || null;
      if (status >= 200 && status < 300 && paymentId) {
        orderStore.set(paymentId, {
          id: paymentId,
          status: "paid",
          total: payload.amount,
          currency: payload.currency || "USD",
          items: Array.isArray(payload.items) ? payload.items : [],
          pickupTime: payload.pickupTime || "asap",
          notes: payload.notes || "",
          createdAt: new Date().toISOString(),
          message: "We received your payment and are preparing your order."
        });
      }

      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          ...data,
          orderId: paymentId
        })
      );
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          errors: [{ detail: "Server error processing payment." }]
        })
      );
    }
    return;
  }

  if (req.method === "POST" && req.url === "/api/webhooks/square") {
    try {
      const body = await readBody(req);
      const payload = JSON.parse(body || "{}");
      const orderId = tryExtractOrderId(payload);
      const eventType = payload?.type || payload?.event_type || "";
      const fulfillmentStatus =
        payload?.data?.object?.order?.fulfillments?.[0]?.state ||
        payload?.data?.object?.order?.state ||
        payload?.data?.object?.payment?.status ||
        "";

      if (
        orderId &&
        (eventType.includes("order") ||
          eventType.includes("payment") ||
          String(fulfillmentStatus).toUpperCase().includes("READY") ||
          String(fulfillmentStatus).toUpperCase().includes("COMPLET"))
      ) {
        const ready = String(fulfillmentStatus).toUpperCase().includes("READY") ||
          String(fulfillmentStatus).toUpperCase().includes("COMPLET");
        if (ready) markOrderReady(orderId);
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false }));
    }
    return;
  }

  if (req.method !== "GET") {
    res.writeHead(405);
    res.end();
    return;
  }

  const reqPath = req.url === "/" ? "/index.html" : req.url;
  const safePath = reqPath.split("?")[0];
  const filePath = path.join(__dirname, safePath);

  try {
    const data = await readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "text/plain" });
    res.end(data);
  } catch (error) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});

server.listen(PORT, () => {
  const hash = createHash("md5").update(String(Date.now())).digest("hex");
  console.log(`Wolf Shack server running on http://localhost:${PORT}`);
  console.log(`Session ${hash.slice(0, 6)} (${SQUARE_ENV})`);
});
