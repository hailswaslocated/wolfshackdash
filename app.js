const menuItems = [
  {
    id: "bfast-1",
    name: "Breakfast Burrito",
    description:
      "Bacon, two eggs, cheddar, topped with roasted potatos, spinach, onion and a hint of 1000 island sauce.",
    price: 8,
    category: "Breakfast",
    tags: ["Available 8-11 AM"],
    addons: [
      { name: "Extra cheddar", price: 1 },
      { name: "Avocado", price: 1 },
      { name: "Jalapenos", price: 1 }
    ]
  },
  {
    id: "bfast-2",
    name: "Breakfast Bowl",
    description:
      "Bacon, two eggs, cheddar, topped with roasted potatos, spinach, onion and a hint of 1000 island sauce.",
    price: 8,
    category: "Breakfast",
    tags: ["Available 8-11 AM"],
    addons: [
      { name: "Extra cheddar", price: 1 },
      { name: "Avocado", price: 1 },
      { name: "Jalapenos", price: 1 }
    ]
  },
  {
    id: "bfast-3",
    name: "Breakfast Sandwich",
    description:
      "Bacon, two eggs, cheddar, topped with roasted potatos, spinach, onion and a hint of 1000 island sauce.",
    price: 8,
    category: "Breakfast",
    tags: ["Available 8-11 AM"],
    addons: [
      { name: "Extra cheddar", price: 1 },
      { name: "Avocado", price: 1 },
      { name: "Jalapenos", price: 1 }
    ]
  },
  {
    id: "waffle-1",
    name: "Classic Belgian Waffle",
    description: "Butter + syrup.",
    price: 5,
    category: "Breakfast",
    tags: ["Waffle"],
    addons: [
      { name: "Add 2 eggs + bacon", price: 5 },
      { name: "Whipped cream", price: 1 },
      { name: "Extra syrup", price: 1 },
      { name: "Fresh berries", price: 1 }
    ]
  },
  {
    id: "waffle-2",
    name: "Strawberry + Powdered Sugar Waffle",
    description: "Strawberries, powdered sugar, and house syrup.",
    price: 6,
    category: "Breakfast",
    tags: ["Waffle", "Popular"],
    addons: [
      { name: "Add 2 eggs + bacon", price: 5 },
      { name: "Whipped cream", price: 1 },
      { name: "Extra syrup", price: 1 },
      { name: "Fresh berries", price: 1 }
    ]
  },
  {
    id: "waffle-3",
    name: "Nutella + Banana Waffle",
    description: "Nutella drizzle, sliced banana, and powdered sugar.",
    price: 7,
    category: "Breakfast",
    tags: ["Waffle"],
    addons: [
      { name: "Add 2 eggs + bacon", price: 5 },
      { name: "Whipped cream", price: 1 },
      { name: "Extra syrup", price: 1 },
      { name: "Fresh berries", price: 1 }
    ]
  },
  {
    id: "salad-1",
    name: "Chicken Caesar Salad",
    description: "Romaine, parmesan, croutons, and house caesar.",
    price: 10,
    category: "Salads + Sandwiches",
    tags: ["Salad"],
    addons: [
      { name: "Lettuce", price: 1 },
      { name: "Tomato", price: 1 },
      { name: "Pickles", price: 1 },
      { name: "Avocado", price: 1 },
      { name: "Cheddar", price: 1 }
    ]
  },
  {
    id: "salad-2",
    name: "Grilled Chicken Caesar Salad",
    description: "Classic caesar topped with grilled chicken.",
    price: 12,
    category: "Salads + Sandwiches",
    tags: ["Salad"],
    addons: [
      { name: "Lettuce", price: 1 },
      { name: "Tomato", price: 1 },
      { name: "Pickles", price: 1 },
      { name: "Avocado", price: 1 },
      { name: "Cheddar", price: 1 }
    ]
  },
  {
    id: "sand-1",
    name: "Wolf Shack Burger",
    description: "House burger with optional toppings.",
    price: 10,
    category: "Salads + Sandwiches",
    tags: ["Sandwich"],
    addons: [
      { name: "Lettuce", price: 1 },
      { name: "Tomato", price: 1 },
      { name: "Pickles", price: 1 },
      { name: "Avocado", price: 1 },
      { name: "Cheddar", price: 1 }
    ]
  },
  {
    id: "sand-2",
    name: "Grilled Cheese",
    description: "Golden grilled cheese on toasted bread.",
    price: 10,
    category: "Salads + Sandwiches",
    tags: ["Sandwich"],
    addons: [
      { name: "Lettuce", price: 1 },
      { name: "Tomato", price: 1 },
      { name: "Pickles", price: 1 },
      { name: "Avocado", price: 1 },
      { name: "Cheddar", price: 1 }
    ]
  },
  {
    id: "sand-3",
    name: "Grilled Chicken Sandwich",
    description: "Grilled chicken sandwich with optional toppings.",
    price: 12,
    category: "Salads + Sandwiches",
    tags: ["Sandwich"],
    addons: [
      { name: "Lettuce", price: 1 },
      { name: "Tomato", price: 1 },
      { name: "Pickles", price: 1 },
      { name: "Avocado", price: 1 },
      { name: "Cheddar", price: 1 }
    ]
  },
  {
    id: "drink-1",
    name: "Lemonade",
    description: "Hot or iced. Iced +$1.",
    price: 4.5,
    category: "Hot / Iced Drinks",
    tags: ["Drink"],
    addons: [{ name: "Iced upgrade", price: 1 }]
  },
  {
    id: "drink-2",
    name: "Chai & Matcha",
    description: "Hot or iced. Iced +$1.",
    price: 4.5,
    category: "Hot / Iced Drinks",
    tags: ["Drink"],
    addons: [{ name: "Iced upgrade", price: 1 }]
  },
  {
    id: "drink-3",
    name: "Cold Brew",
    description: "Hot or iced. Iced +$1.",
    price: 4.5,
    category: "Hot / Iced Drinks",
    tags: ["Drink"],
    addons: [{ name: "Iced upgrade", price: 1 }]
  },
  {
    id: "drink-4",
    name: "Latte / Cappuccino",
    description: "Hot or iced. Iced +$1.",
    price: 4.5,
    category: "Hot / Iced Drinks",
    tags: ["Drink"],
    addons: [{ name: "Iced upgrade", price: 1 }]
  },
  {
    id: "smooth-1",
    name: "Strawberry Banana",
    description: "Classic blend, served cold.",
    price: 7,
    category: "Smoothies",
    tags: ["Smoothie"],
    addons: [{ name: "Add protein", price: 2 }]
  },
  {
    id: "smooth-2",
    name: "Peanut Butter Banana",
    description: "Rich peanut butter with banana.",
    price: 7,
    category: "Smoothies",
    tags: ["Smoothie"],
    addons: [{ name: "Add protein", price: 2 }]
  },
  {
    id: "smooth-3",
    name: "Matcha",
    description: "Creamy matcha smoothie.",
    price: 7,
    category: "Smoothies",
    tags: ["Smoothie"],
    addons: [{ name: "Add protein", price: 2 }]
  },
  {
    id: "acai-1",
    name: "Acai Bowl (Medium)",
    description:
      "Smoothie bowl base topped with your choice of fruit, granola, honey, agave, coconut flakes, drizzle, condensed milk, and Nutella.",
    price: 7,
    category: "Acai Bowl",
    tags: ["Bowl"]
  },
  {
    id: "acai-2",
    name: "Acai Bowl (Large)",
    description:
      "Smoothie bowl base topped with your choice of fruit, granola, honey, agave, coconut flakes, drizzle, condensed milk, and Nutella.",
    price: 9,
    category: "Acai Bowl",
    tags: ["Bowl"]
  }
];

const cart = new Map();
const TAX_RATE = 0.0875;

const menuGrid = document.getElementById("menuGrid");
const categoryChips = document.getElementById("categoryChips");
const searchInput = document.getElementById("searchInput");
const cartItems = document.getElementById("cartItems");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const pickupTime = document.getElementById("pickupTime");
const pickupEta = document.getElementById("pickupEta");
const notes = document.getElementById("notes");
const clearCart = document.getElementById("clearCart");
const addSpecial = document.getElementById("addSpecial");
const jumpToCart = document.getElementById("jumpToCart");

const formatCurrency = (value) => `$${value.toFixed(2)}`;

const getCategories = () => {
  const categories = new Set(menuItems.map((item) => item.category));
  return ["All", ...Array.from(categories)];
};

const renderChips = () => {
  const categories = getCategories();
  categoryChips.innerHTML = categories
    .map((category, index) => {
      const active = index === 0 ? "active" : "";
      return `<button class="chip ${active}" data-category="${category}">${category}</button>`;
    })
    .join("");
};

const state = {
  category: "All",
  query: ""
};

const matchesFilters = (item) => {
  const matchesCategory =
    state.category === "All" || item.category === state.category;
  const query = state.query.trim().toLowerCase();
  const matchesQuery =
    !query ||
    item.name.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query);
  return matchesCategory && matchesQuery;
};

const renderMenu = () => {
  const filtered = menuItems.filter(matchesFilters);
  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const sections = Object.entries(grouped)
    .map(([category, items]) => {
      const categoryNote =
        category === "Breakfast" ? `<p class="category-note">Available 8-11 AM</p>` : "";
      return `
        <div class="menu-section">
          <h3>${category}</h3>
          ${categoryNote}
          <div class="menu-items">
            ${items
              .map(
                (item) => `
              <article class="menu-item">
                <div class="menu-item-top">
                  <div>
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                  </div>
                  <div>
                    <div class="price">${formatCurrency(item.price)}</div>
                    <button class="add-btn" data-id="${item.id}">Add</button>
                  </div>
                </div>
                <div class="tags">
                  ${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
                </div>
                ${
                  item.addons
                    ? `
                  <div class="addons">
                    <span class="addons-label">Add-ons</span>
                    ${item.addons
                      .map((addon) => {
                        const data =
                          typeof addon === "string"
                            ? { name: addon, price: 1 }
                            : addon;
                        return `<button class="addon-btn" data-addon="${data.name}" data-addon-price="${data.price}">${data.name} +$${data.price}</button>`;
                      })
                      .join("")}
                  </div>
                `
                    : ""
                }
              </article>
            `
              )
              .join("")}
          </div>
        </div>
      `;
    })
    .join("");

  menuGrid.innerHTML = sections ||
    `<div class="menu-item">No matches. Try a different search.</div>`;
};

const updateCart = () => {
  const items = Array.from(cart.values());
  if (!items.length) {
    cartItems.innerHTML = `<p class="muted">Your cart is empty. Add something tasty.</p>`;
  } else {
    cartItems.innerHTML = items
      .map((item) => {
        return `
        <div class="cart-item">
          <div>
            <h4>${item.name}</h4>
            <p class="muted">${formatCurrency(item.price)}</p>
          </div>
          <div>
            <div class="qty">
              <button data-action="decrease" data-id="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button data-action="increase" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `;
      })
      .join("");
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  subtotalEl.textContent = formatCurrency(subtotal);
  taxEl.textContent = formatCurrency(tax);
  totalEl.textContent = formatCurrency(total);

  const cartSnapshot = {
    items: items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })),
    subtotal,
    tax,
    total
  };
  localStorage.setItem("wolfshack-cart", JSON.stringify(cartSnapshot));
};

const addToCart = (id) => {
  const item = menuItems.find((menuItem) => menuItem.id === id);
  if (!item) return;
  const existing = cart.get(id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.set(id, { ...item, quantity: 1 });
  }
  updateCart();
};

const addAddonToCart = (addonName, addonPrice = 1) => {
  const id = `addon-${addonName.toLowerCase().replace(/\\s+/g, "-")}`;
  const existing = cart.get(id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.set(id, {
      id,
      name: `Add-on: ${addonName}`,
      description: "Add-on item",
      price: addonPrice,
      category: "Add-ons",
      quantity: 1
    });
  }
  updateCart();
};

const changeQuantity = (id, delta) => {
  const item = cart.get(id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    cart.delete(id);
  }
  updateCart();
};

const buildPickupTimes = () => {
  const now = new Date();
  const times = [15, 25, 35, 45].map((minutes) => {
    const date = new Date(now.getTime() + minutes * 60000);
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  });

  pickupTime.innerHTML = `
    <option value="asap">ASAP (15 to 20 min)</option>
    ${times
      .map(
        (time) => `<option value="${time}">Pickup at ${time}</option>`
      )
      .join("")}
  `;

  pickupEta.textContent = "15 to 20 min";
};

const handlePickupChange = () => {
  const value = pickupTime.value;
  if (value === "asap") {
    pickupEta.textContent = "15 to 20 min";
  } else {
    pickupEta.textContent = `Ready by ${value}`;
  }
};

categoryChips.addEventListener("click", (event) => {
  const button = event.target.closest(".chip");
  if (!button) return;
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.classList.toggle("active", chip === button);
  });
  state.category = button.dataset.category;
  renderMenu();
});

menuGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".add-btn");
  if (button) {
    addToCart(button.dataset.id);
    return;
  }
  const addonButton = event.target.closest(".addon-btn");
  if (addonButton) {
    const price = Number(addonButton.dataset.addonPrice || 1);
    addAddonToCart(addonButton.dataset.addon, price);
  }
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const id = button.dataset.id;
  const action = button.dataset.action;
  if (action === "increase") changeQuantity(id, 1);
  if (action === "decrease") changeQuantity(id, -1);
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderMenu();
});

clearCart.addEventListener("click", () => {
  cart.clear();
  updateCart();
});

addSpecial.addEventListener("click", () => {
  addToCart("bfast-1");
  addToCart("drink-1");
});

jumpToCart.addEventListener("click", () => {
  document.getElementById("cartPanel").scrollIntoView({ behavior: "smooth" });
});

pickupTime.addEventListener("change", handlePickupChange);
notes.addEventListener("input", () => {});

renderChips();
renderMenu();
updateCart();
buildPickupTimes();
