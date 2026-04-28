const params = new URLSearchParams(window.location.search);
const orderId =
  params.get("orderId") || localStorage.getItem("wolfshack-last-order-id");

const statusMessage = document.getElementById("statusMessage");
const statusPill = document.getElementById("statusPill");
const statusCard = document.getElementById("statusCard");
const orderMeta = document.getElementById("orderMeta");
const enableNotifications = document.getElementById("enableNotifications");
const simulateReady = document.getElementById("simulateReady");
let readyNotified = localStorage.getItem("wolfshack-ready-notified") === "true";

const updateUi = (state) => {
  const pretty = state?.status || "pending";
  if (statusPill) {
    statusPill.textContent =
      pretty === "ready" ? "Ready" : pretty === "paid" ? "Preparing" : "Queued";
  }
  if (statusMessage) {
    statusMessage.textContent =
      pretty === "ready"
        ? "Your order is ready for pickup. Head to the Wolf Shack counter."
        : "We’ll let you know when it is ready for pickup.";
  }
  if (statusCard) {
    statusCard.textContent =
      pretty === "ready"
        ? "Come pick up your order at the Wolf Shack counter."
        : state?.message || "Waiting for pickup update.";
  }
  if (orderMeta) {
    orderMeta.innerHTML = `
      <div class="summary-row"><span>Order ID</span><span>${orderId || "Not available"}</span></div>
      <div class="summary-row"><span>Status</span><span>${pretty}</span></div>
    `;
  }
  if (pretty === "ready" && !readyNotified) {
    readyNotified = true;
    localStorage.setItem("wolfshack-ready-notified", "true");
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Wolf Shack order ready", {
        body: "Your order is done. Come pick up at the Wolf Shack counter."
      });
    }
  }
};

const fetchStatus = async () => {
  if (!orderId) {
    updateUi({
      status: "pending",
      message: "No order ID found yet. Finish checkout first."
    });
    return;
  }

  try {
    const response = await fetch(`/api/order-status?orderId=${encodeURIComponent(orderId)}`);
    if (!response.ok) throw new Error("Status request failed");
    const data = await response.json();
    updateUi(data);
  } catch (error) {
    updateUi({
      status: "pending",
      message: "Could not load order status right now."
    });
  }
};

const requestNotifications = async () => {
  if (!("Notification" in window)) {
    alert("Notifications are not supported in this browser.");
    return;
  }
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    new Notification("Wolf Shack notifications enabled", {
      body: "We’ll notify you when your order is ready."
    });
  }
};

if (enableNotifications) {
  enableNotifications.addEventListener("click", requestNotifications);
}

if (simulateReady) {
  simulateReady.addEventListener("click", async () => {
    if (!orderId) return;
    await fetch("/api/webhooks/square", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "order.updated",
        data: { object: { order: { id: orderId, fulfillments: [{ state: "READY" }] } } }
      })
    });
    await fetchStatus();
  });
}

fetchStatus();
setInterval(fetchStatus, 5000);
