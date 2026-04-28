const orderBoard = document.getElementById("orderBoard");
const adminStats = document.getElementById("adminStats");
const searchOrders = document.getElementById("searchOrders");
const statusFilters = document.getElementById("statusFilters");
const lastRefresh = document.getElementById("lastRefresh");
const printQueue = document.getElementById("printQueue");

const state = {
  orders: [],
  status: "all",
  query: ""
};

const formatCurrency = (cents) => {
  return `$${(Number(cents || 0) / 100).toFixed(2)}`;
};

const formatTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
};

const summarizeItems = (items = []) => {
  if (!items.length) return "No line items saved yet.";
  return items.map((item) => `${item.quantity}x ${item.name}`).join(", ");
};

const filteredOrders = () => {
  return state.orders.filter((order) => {
    const matchesStatus = state.status === "all" || order.status === state.status;
    const query = state.query.trim().toLowerCase();
    if (!query) return matchesStatus;
    const haystack = [
      order.id,
      order.status,
      order.notes,
      order.pickupTime,
      ...(order.items || []).map((item) => item.name)
    ]
      .join(" ")
      .toLowerCase();
    return matchesStatus && haystack.includes(query);
  });
};

const renderStats = () => {
  const orders = state.orders;
  const totals = orders.reduce(
    (acc, order) => {
      acc.total += 1;
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    { total: 0, paid: 0, ready: 0, completed: 0 }
  );

  adminStats.innerHTML = `
    <div class="stat-card"><span>Total</span><strong>${totals.total}</strong></div>
    <div class="stat-card"><span>Paid</span><strong>${totals.paid}</strong></div>
    <div class="stat-card"><span>Ready</span><strong>${totals.ready}</strong></div>
    <div class="stat-card"><span>Completed</span><strong>${totals.completed}</strong></div>
  `;
};

const statusLabel = (status) => {
  if (status === "ready") return "Ready";
  if (status === "completed") return "Completed";
  return "Paid";
};

const renderOrders = () => {
  const orders = filteredOrders();
  if (!orders.length) {
    orderBoard.innerHTML = `<div class="empty-state">No orders match these filters.</div>`;
    return;
  }

  orderBoard.innerHTML = orders
    .map(
      (order) => `
      <article class="order-card">
        <div class="order-card-top">
          <div>
            <p class="order-id">${order.id}</p>
            <h3>${statusLabel(order.status)}</h3>
          </div>
          <span class="status-pill status-${order.status}">${order.status}</span>
        </div>
        <div class="order-meta">
          <span>Placed ${formatTime(order.createdAt)}</span>
          <span>Total ${formatCurrency(order.total)}</span>
          <span>Pickup ${order.pickupTime || "asap"}</span>
        </div>
        <p class="order-items">${summarizeItems(order.items)}</p>
        <p class="order-notes">${order.notes ? `Notes: ${order.notes}` : "No special instructions."}</p>
        <div class="order-actions">
          <button class="chip" data-action="paid" data-id="${order.id}">Paid</button>
          <button class="chip" data-action="ready" data-id="${order.id}">Ready</button>
          <button class="chip" data-action="completed" data-id="${order.id}">Completed</button>
          <button class="chip" data-action="print" data-id="${order.id}">Print</button>
        </div>
      </article>
    `
    )
    .join("");
};

const refreshOrders = async () => {
  try {
    const response = await fetch("/api/admin/orders");
    if (!response.ok) throw new Error("Failed to load orders");
    const data = await response.json();
    state.orders = data.orders || [];
    renderStats();
    renderOrders();
    if (lastRefresh) {
      lastRefresh.textContent = `Updated ${new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
      })}`;
    }
  } catch (error) {
    orderBoard.innerHTML = `<div class="empty-state">Could not load orders.</div>`;
  }
};

const updateStatus = async (id, status) => {
  await fetch(`/api/admin/orders/${encodeURIComponent(id)}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  await refreshOrders();
};

statusFilters?.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  state.status = button.dataset.status || "all";
  document.querySelectorAll("#statusFilters .chip").forEach((chip) => {
    chip.classList.toggle("active", chip === button);
  });
  renderOrders();
});

searchOrders?.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderOrders();
});

orderBoard?.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  if (action === "print") {
    window.print();
    return;
  }
  await updateStatus(id, action);
});

printQueue?.addEventListener("click", () => window.print());

refreshOrders();
setInterval(refreshOrders, 5000);
