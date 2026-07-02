/* ============================================================
   LUXE — Premium E-Commerce Script
   Beginner-friendly, fully commented vanilla JS.
   ============================================================ */

/* ---------- 1. DATA: Categories & Products ---------- */

const CATEGORIES = [
  { id: "electronics", name: "Electronics", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80" },
  { id: "fashion",     name: "Fashion",     img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80" },
  { id: "shoes",       name: "Shoes",       img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80" },
  { id: "watches",     name: "Watches",     img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80" },
  { id: "gaming",      name: "Gaming",      img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80" },
  { id: "furniture",   name: "Furniture",   img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80" },
  { id: "beauty",      name: "Beauty",      img: "https://th.bing.com/th/id/OIP.sI-TElAvDKohsbmZo8gmaQHaEJ?w=326&h=183&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3" },
  { id: "books",       name: "Books",       img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80" },
];

const PRODUCTS = [
  { id: 1,  title: "Classic Watch",    brand: "Matrix",  category: "watches", price: 599,  oldPrice:790, rating: 4.7, reviews: 312, sales: 980, img: "watch1.jpeg" },
  { id: 6,  title: "Camera Stand",           brand: "Stride",   category: "electronics",       price: 599,  oldPrice: 810, rating: 4.4, reviews: 612, sales: 2100,img: "camerastand1.jpeg" },
 
];

const TESTIMONIALS = [
  { name: "Sarah M.",    role: "Verified Buyer", img: "https://i.pravatar.cc/120?img=47", rating: 5, text: "The quality is unreal. Packaging felt like opening a luxury gift. I'll definitely shop here again." },
  { name: "James K.",    role: "Verified Buyer", img: "https://i.pravatar.cc/120?img=12", rating: 5, text: "Fast shipping, smooth checkout, and the watch is everything I hoped for. LUXE is now my go-to." },
  { name: "Ana López.",  role: "Verified Buyer", img: "https://i.pravatar.cc/120?img=32", rating: 4, text: "Beautiful design across the site and the product matched the photos exactly. Highly recommend." },
  { name: "David C.",    role: "Verified Buyer", img: "https://i.pravatar.cc/120?img=15", rating: 5, text: "Customer service replied in minutes. Returns were painless. Best online shopping I've had." },
];

/* ---------- 2. STATE ---------- */

let cart     = JSON.parse(localStorage.getItem("luxe_cart"))     || [];
let wishlist = JSON.parse(localStorage.getItem("luxe_wishlist")) || [];
let theme    = localStorage.getItem("luxe_theme") || "light";

const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

/* ---------- 3. INIT ---------- */

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(theme);
  renderCategories();
  populateFilters();
  renderProducts();
  renderTestimonials();
  updateCartUI();
  updateWishUI();
  setupNav();
  setupSearch();
  setupFilters();
  setupDrawers();
  setupNewsletter();
  setupScroll();
  setupCountdown();
  setupReveal();
  $("#year").textContent = new Date().getFullYear();

  // Hide loader
  setTimeout(() => $("#loader").classList.add("hidden"), 700);
});

/* ---------- 4. THEME ---------- */

function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  $("#themeToggle").textContent = t === "dark" ? "☀️" : "🌙";
  localStorage.setItem("luxe_theme", t);
}
document.addEventListener("click", (e) => {
  if (e.target.id === "themeToggle") {
    theme = theme === "dark" ? "light" : "dark";
    applyTheme(theme);
  }
});

/* ---------- 5. RENDER CATEGORIES ---------- */

function renderCategories() {
  $("#catGrid").innerHTML = CATEGORIES.map(c => `
    <div class="cat-card" data-cat="${c.id}">
      <img loading="lazy" src="${c.img}" alt="${c.name}" />
      <div class="cat-overlay">
        <h3>${c.name}</h3>
        <span>Shop now →</span>
      </div>
    </div>
  `).join("");

  // Click filters by category
  $$(".cat-card").forEach(card => {
    card.addEventListener("click", () => {
      $("#filterCategory").value = card.dataset.cat;
      renderProducts();
      $("#shop").scrollIntoView({ behavior: "smooth" });
    });
  });
}

/* ---------- 6. FILTERS ---------- */

function populateFilters() {
  const catSel = $("#filterCategory");
  CATEGORIES.forEach(c => {
    catSel.insertAdjacentHTML("beforeend", `<option value="${c.id}">${c.name}</option>`);
  });
  const brands = [...new Set(PRODUCTS.map(p => p.brand))];
  const brandSel = $("#filterBrand");
  brands.forEach(b => brandSel.insertAdjacentHTML("beforeend", `<option value="${b}">${b}</option>`));
}

function setupFilters() {
  ["filterCategory","filterBrand","filterRating","sortBy"].forEach(id => {
    $("#"+id).addEventListener("change", renderProducts);
  });
  $("#filterPrice").addEventListener("input", (e) => {
    $("#priceLabel").textContent = e.target.value;
    renderProducts();
  });
}

/* ---------- 7. RENDER PRODUCTS ---------- */

function renderProducts() {
  const cat    = $("#filterCategory").value;
  const brand  = $("#filterBrand").value;
  const rating = parseFloat($("#filterRating").value);
  const price  = parseFloat($("#filterPrice").value);
  const sort   = $("#sortBy").value;
  const search = ($("#searchInput")?.value || "").toLowerCase().trim();

  let list = PRODUCTS.filter(p =>
    (cat   === "all" || p.category === cat) &&
    (brand === "all" || p.brand === brand) &&
    (p.rating >= rating) &&
    (p.price <= price) &&
    (!search || p.title.toLowerCase().includes(search) || p.brand.toLowerCase().includes(search))
  );

  // Sort
  if (sort === "lowhigh") list.sort((a,b) => a.price - b.price);
  else if (sort === "highlow") list.sort((a,b) => b.price - a.price);
  else if (sort === "newest")  list.sort((a,b) => b.id - a.id);
  else                          list.sort((a,b) => b.sales - a.sales);

  const grid = $("#productGrid");
  grid.innerHTML = list.map(p => productCard(p)).join("");
  $("#noResults").style.display = list.length ? "none" : "block";

  // Wire actions on each card
  $$(".add-cart").forEach(b => b.addEventListener("click", e => {
    addToCart(parseInt(e.currentTarget.dataset.id, 10));
  }));
  $$(".action-wish").forEach(b => b.addEventListener("click", e => {
    toggleWishlist(parseInt(e.currentTarget.dataset.id, 10));
  }));
  $$(".action-quick").forEach(b => b.addEventListener("click", e => {
    openQuickView(parseInt(e.currentTarget.dataset.id, 10));
  }));
}

function productCard(p) {
  const discount = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
  const inWish = wishlist.includes(p.id);
  return `
    <article class="product">
      <div class="product-img">
        ${discount ? `<span class="discount-badge">-${discount}%</span>` : ""}
        <img loading="lazy" src="${p.img}" alt="${p.title}" />
        <div class="product-actions">
          <button class="action-btn action-wish ${inWish ? "active" : ""}" data-id="${p.id}" aria-label="Wishlist">${inWish ? "♥" : "♡"}</button>
          <button class="action-btn action-quick" data-id="${p.id}" aria-label="Quick view">👁</button>
        </div>
      </div>
      <div class="product-body">
        <span class="product-brand">${p.brand}</span>
        <h4 class="product-title">${p.title}</h4>
        <div class="product-rating">
          <span class="stars">${stars(p.rating)}</span>
          <span>${p.rating} (${p.reviews})</span>
        </div>
        <div class="product-price">
          <span class="price-now">Rs. ${p.price}</span>
          ${p.oldPrice ? `<span class="price-old">Rs. ${p.oldPrice}</span>` : ""}
        </div>
        <button class="add-cart" data-id="${p.id}">Add to Cart</button>
      </div>
    </article>
  `;
}

function stars(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - (half ? 1 : 0));
}

/* ---------- 8. CART ---------- */

function saveCart() { localStorage.setItem("luxe_cart", JSON.stringify(cart)); }

function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty++;
  else cart.push({ id, qty: 1 });
  saveCart(); updateCartUI();
  toast(`Added "${p.title}" to cart`);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart(); updateCartUI();
  toast("Removed from cart");
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
  saveCart(); updateCartUI();
}

function emptyCart() {
  cart = []; saveCart(); updateCartUI();
  toast("Cart cleared");
}

let checkoutState = null;

function getCartTotals() {
  const subtotal = cart.reduce((a, c) => a + c.qty * PRODUCTS.find(p => p.id === c.id).price, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const discount = subtotal > 200 ? subtotal * 0.1 : 0;
  const tax      = (subtotal - discount) * 0.08;
  const total    = subtotal - discount + shipping + tax;
  return { subtotal, shipping, discount, tax, total };
}

function makeOrderId() {
  const prefix = "SYM";
  const random = Math.floor(100 + Math.random() * 900);
  return `${prefix}${Date.now().toString().slice(-6)}${random}`;
}

function renderCartUI() {
  const count = cart.reduce((a, c) => a + c.qty, 0);
  $("#cartCount").textContent = count;
  if (checkoutState && cart.length === 0 && checkoutState.step !== 4) checkoutState = null;
  if (checkoutState) renderCheckout();
  else renderCartContent();
}

function updateCartUI() {
  renderCartUI();
}

function renderCartContent() {
  const body = $("#cartItems");
  const foot = $("#cartFoot");

  if (cart.length === 0) {
    body.innerHTML = `<div class="empty-state"><div class="big">🛍️</div>Your cart is empty.<br/>Start shopping!</div>`;
    foot.innerHTML = "";
    return;
  }

  body.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    return `
      <div class="cart-item">
        <img src="${p.img}" alt="${p.title}" />
        <div>
          <h5>${p.title}</h5>
          <small>${p.brand} · Rs. ${p.price}</small>
          <div class="qty">
            <button data-act="dec" data-id="${p.id}">−</button>
            <span>${item.qty}</span>
            <button data-act="inc" data-id="${p.id}">+</button>
          </div>
          <button class="cart-remove" data-act="rm" data-id="${p.id}">Remove</button>
        </div>
        <strong>Rs. ${((p.price * item.qty).toFixed(2))}</strong>
      </div>
    `;
  }).join("");

  const totals = getCartTotals();
  foot.innerHTML = `
    <div class="cart-summary">
      <div class="row"><span>Subtotal</span><span>Rs. ${totals.subtotal.toFixed(2)}</span></div>
      <div class="row"><span>Shipping</span><span>${totals.shipping ? "Rs. "+totals.shipping.toFixed(2) : "Free"}</span></div>
      ${totals.discount ? `<div class="row"><span>Discount (10%)</span><span>−Rs. ${totals.discount.toFixed(2)}</span></div>` : ""}
      <div class="row"><span>Tax</span><span>Rs. ${totals.tax.toFixed(2)}</span></div>
      <div class="row total"><span>Total</span><span>Rs. ${totals.total.toFixed(2)}</span></div>
    </div>
    <button class="btn btn-primary btn-block" id="checkoutBtn">Checkout</button>
    <button class="btn btn-ghost btn-block" style="margin-top:8px" id="emptyCartBtn">Empty Cart</button>
  `;

  // Wire actions
  $$("#cartItems [data-act]").forEach(b => {
    b.addEventListener("click", e => {
      const id  = parseInt(e.currentTarget.dataset.id, 10);
      const act = e.currentTarget.dataset.act;
      if (act === "inc") changeQty(id, 1);
      if (act === "dec") changeQty(id, -1);
      if (act === "rm")  removeFromCart(id);
    });
  });

  $("#checkoutBtn")?.addEventListener("click", startCheckout);
  $("#emptyCartBtn")?.addEventListener("click", emptyCart);
}

function openDrawer(which) {
  $("#backdrop").classList.add("open");
  if (which === "cart") $("#cartDrawer").classList.add("open");
  if (which === "wish") $("#wishDrawer").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  $("#backdrop").classList.remove("open");
  $("#cartDrawer").classList.remove("open");
  $("#wishDrawer").classList.remove("open");
  $("#quickModal").classList.remove("open");
  document.body.style.overflow = "";
  checkoutState = null;
}

function startCheckout() {
  if (!cart.length) return;
  checkoutState = {
    step: 1,
    address: {
      fullName: "",
      mobile: "",
      email: "",
      house: "",
      street: "",
      landmark: "",
      city: "",
      state: "",
      pin: "",
      country: "India",
      type: "Home"
    },
    payment: {
      method: "cod",
      card: { holder: "", number: "", expiry: "", cvv: "" },
      upi: ""
    }
  };
  renderCartUI();
}

function renderCheckout() {
  const body = $("#cartItems");
  const foot = $("#cartFoot");
  const totals = getCartTotals();

  if (!checkoutState || (cart.length === 0 && checkoutState.step !== 4)) {
    checkoutState = null;
    renderCartContent();
    return;
  }

  const stepHeader = `
    <div class="checkout-stepper">
      <div class="step-pill ${checkoutState.step === 1 ? "active" : checkoutState.step > 1 ? "complete" : ""}">
        <span>1</span><div><strong>Delivery</strong><small>Address</small></div>
      </div>
      <div class="step-pill ${checkoutState.step === 2 ? "active" : checkoutState.step > 2 ? "complete" : ""}">
        <span>2</span><div><strong>Order</strong><small>Summary</small></div>
      </div>
      <div class="step-pill ${checkoutState.step === 3 ? "active" : ""}">
        <span>3</span><div><strong>Payment</strong><small>Method</small></div>
      </div>
    </div>
  `;

  let content = "";
  if (checkoutState.step === 1) {
    const a = checkoutState.address;
    content = `
      <div class="checkout-panel">
        <div class="panel-head">
          <div>
            <span class="eyebrow">Step 1 of 3</span>
            <h3>Delivery Address</h3>
            <p>Enter the address where you want your order delivered.</p>
          </div>
        </div>
        <form id="addressForm" class="checkout-form">
          <div class="field-grid">
            ${formField("fullName","Full Name","text",a.fullName,true)}
            ${formField("mobile","Mobile Number","tel",a.mobile,true,"e.g. +91 98765 43210")}
            ${formField("email","Email (optional)","email",a.email,false,"e.g. name@example.com")}
            ${formField("house","House / Flat No.","text",a.house,true)}
            ${formField("street","Street / Area","text",a.street,true)}
            ${formField("landmark","Landmark (optional)","text",a.landmark,false)}
            ${formField("city","City","text",a.city,true)}
            ${formField("state","State","text",a.state,true)}
            ${formField("pin","PIN Code","text",a.pin,true)}
            <div class="form-field">
              <label for="country">Country</label>
              <select id="country">
                <option value="India" ${a.country === "India" ? "selected" : ""}>India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
              <small class="field-error" id="error-country"></small>
            </div>
            <div class="form-field form-field-full">
              <label>Address Type</label>
              <div class="address-type">
                <label class="type-chip ${a.type === "Home" ? "selected" : ""}">
                  <input type="radio" name="addressType" value="Home" ${a.type === "Home" ? "checked" : ""} /> Home
                </label>
                <label class="type-chip ${a.type === "Office" ? "selected" : ""}">
                  <input type="radio" name="addressType" value="Office" ${a.type === "Office" ? "checked" : ""} /> Office
                </label>
              </div>
              <small class="field-error" id="error-type"></small>
            </div>
          </div>
        </form>
      </div>
    `;
    foot.innerHTML = `
      <button class="btn btn-ghost btn-block" id="backToCartBtn">Back to Cart</button>
      <button class="btn btn-primary btn-block" id="nextCheckoutBtn">Continue to Summary</button>
    `;
  } else if (checkoutState.step === 2) {
    content = `
      <div class="checkout-panel">
        <div class="panel-head panel-head-split">
          <div>
            <span class="eyebrow">Step 2 of 3</span>
            <h3>Order Summary</h3>
            <p>Review your items, shipping, discounts, and taxes.</p>
          </div>
          <button class="btn btn-ghost" id="editAddressBtn">Edit Address</button>
        </div>
        <div class="summary-list">
          ${cart.map(item => {
            const p = PRODUCTS.find(x => x.id === item.id);
            return `
              <div class="summary-item">
                <img src="${p.img}" alt="${p.title}" />
                <div>
                  <strong>${p.title}</strong>
                  <small>${item.qty} × Rs. ${p.price.toFixed(2)}</small>
                </div>
                <div>Rs. ${(p.price * item.qty).toFixed(2)}</div>
              </div>
            `;
          }).join("")}
        </div>
        <div class="summary-card">
          <div class="row"><span>Subtotal</span><span>Rs. ${totals.subtotal.toFixed(2)}</span></div>
          <div class="row"><span>Shipping</span><span>${totals.shipping ? "Rs. "+totals.shipping.toFixed(2) : "Free"}</span></div>
          ${totals.discount ? `<div class="row"><span>Discount</span><span>−Rs. ${totals.discount.toFixed(2)}</span></div>` : ""}
          <div class="row"><span>Tax</span><span>Rs. ${totals.tax.toFixed(2)}</span></div>
          <div class="row total"><span>Grand Total</span><span>Rs. ${totals.total.toFixed(2)}</span></div>
        </div>
      </div>
    `;
    foot.innerHTML = `
      <button class="btn btn-ghost btn-block" id="backCheckoutBtn">Back</button>
      <button class="btn btn-primary btn-block" id="nextCheckoutBtn">Proceed to Payment</button>
    `;
  } else if (checkoutState.step === 3) {
    const method = checkoutState.payment.method;
    content = `
      <div class="checkout-panel">
        <div class="panel-head">
          <div>
            <span class="eyebrow">Step 3 of 3</span>
            <h3>Payment</h3>
            <p>Choose your preferred payment method.</p>
          </div>
        </div>
        <div class="payment-methods">
          ${paymentOption("cod","Cash on Delivery", method === "cod", "Pay securely when your order arrives.")}
          ${paymentOption("upi","UPI", method === "upi", "Fast payment via UPI ID.")}
          ${paymentOption("card","Credit / Debit Card", method === "card", "Accepted Visa, Mastercard, Amex.")}
        </div>
        <div id="paymentFields">
          ${method === "card" ? `
            <div class="field-grid">
              ${formField("cardHolder","Card Holder Name","text",checkoutState.payment.card.holder,true)}
              ${formField("cardNumber","Card Number","text",checkoutState.payment.card.number,true,"1234 5678 9012 3456")}
              ${formField("expiry","Expiry","text",checkoutState.payment.card.expiry,true,"MM/YY")}
              ${formField("cvv","CVV","password",checkoutState.payment.card.cvv,true,"3-digit code")}
            </div>
          ` : method === "upi" ? `
            <div class="field-grid">
              ${formField("upiId","UPI ID","text",checkoutState.payment.upi,true,"example@bank")}
            </div>
          ` : `
            <div class="payment-hint">
              <p>Cash on Delivery selected. No additional payment details required.</p>
            </div>
          `}
        </div>
        <div class="summary-card">
          <div class="row"><span>Total</span><span>$${totals.total.toFixed(2)}</span></div>
          <div class="row"><span>Estimated Delivery</span><span>3-5 business days</span></div>
        </div>
      </div>
    `;
    foot.innerHTML = `
      <button class="btn btn-ghost btn-block" id="backCheckoutBtn">Back</button>
      <button class="btn btn-primary btn-block" id="placeOrderBtn">Place Order</button>
    `;
  } else if (checkoutState.step === 4 && checkoutState.order) {
    const order = checkoutState.order;
    const addressHtml = `
      <p>${order.delivery.house}, ${order.delivery.street}${order.delivery.landmark ? `, ${order.delivery.landmark}` : ""}</p>
      <p>${order.delivery.city}, ${order.delivery.state} ${order.delivery.pin}</p>
      <p>${order.delivery.country}</p>
    `;

    content = `
      <div class="checkout-panel success-panel">
        <div class="success-badge">✓</div>
        <h3>Order Placed Successfully</h3>
        <p>Your order is confirmed and will arrive soon.</p>
        <div class="success-grid">
          <div>
            <span>Order ID</span>
            <strong>${order.id}</strong>
          </div>
          <div>
            <span>Customer</span>
            <strong>${order.customerName}</strong>
          </div>
          <div>
            <span>Payment</span>
            <strong>${order.payment.method === "card" ? "Card" : order.payment.method === "upi" ? "UPI" : "Cash on Delivery"}</strong>
          </div>
          <div>
            <span>Total Amount</span>
            <strong>Rs. ${order.totals.total.toFixed(2)}</strong>
          </div>
          <div class="address-block">
            <span>Delivery Address</span>
            ${addressHtml}
          </div>
          <div>
            <span>Estimated Delivery</span>
            <strong>3-5 business days</strong>
          </div>
        </div>
      </div>
    `;
    foot.innerHTML = `
      <button class="btn btn-primary btn-block" id="continueShoppingBtn">Continue Shopping</button>
    `;
  }

  body.innerHTML = `${stepHeader}${content}`;
  attachCheckoutEvents();
}

function formField(id, label, type, value, required, placeholder = "") {
  return `
    <div class="form-field ${id === "country" || id === "addressType" ? "form-field-full" : ""}">
      <label for="${id}">${label}</label>
      <input id="${id}" type="${type}" value="${value || ""}" placeholder="${placeholder}" ${required ? "required" : ""} />
      <small class="field-error" id="error-${id}"></small>
    </div>
  `;
}

function paymentOption(key, title, active, subtitle) {
  return `
    <label class="payment-option ${active ? "active" : ""}">
      <input type="radio" name="paymentMethod" value="${key}" ${active ? "checked" : ""} />
      <div>
        <strong>${title}</strong>
        <small>${subtitle}</small>
      </div>
    </label>
  `;
}

function attachCheckoutEvents() {
  $("#backToCartBtn")?.addEventListener("click", () => { checkoutState = null; renderCartUI(); });
  $("#backCheckoutBtn")?.addEventListener("click", () => { checkoutState.step = Math.max(1, checkoutState.step - 1); renderCheckout(); });
  $("#nextCheckoutBtn")?.addEventListener("click", () => {
    if (checkoutState.step === 1) {
      if (validateAddressForm()) {
        checkoutState.step = 2; renderCheckout();
      }
    } else if (checkoutState.step === 2) {
      checkoutState.step = 3; renderCheckout();
    }
  });
  $("#editAddressBtn")?.addEventListener("click", () => { checkoutState.step = 1; renderCheckout(); });
  $("#placeOrderBtn")?.addEventListener("click", () => {
    if (validatePaymentForm()) placeOrder();
  });
  $("#continueShoppingBtn")?.addEventListener("click", () => {
    checkoutState = null;
    closeDrawer();
    renderCartUI();
    toast("Ready for your next purchase!");
  });

  $$("[name='paymentMethod']").forEach(input => {
    input.addEventListener("change", e => {
      checkoutState.payment.method = e.target.value;
      renderCheckout();
    });
  });
}

function validateAddressForm() {
  const fields = [
    { id: "fullName", label: "Full Name", required: true },
    { id: "mobile", label: "Mobile Number", required: true },
    { id: "house", label: "House / Flat No.", required: true },
    { id: "street", label: "Street / Area", required: true },
    { id: "city", label: "City", required: true },
    { id: "state", label: "State", required: true },
    { id: "pin", label: "PIN Code", required: true }
  ];

  let valid = true;
  fields.forEach(field => {
    const input = $(`#${field.id}`);
    const error = $(`#error-${field.id}`);
    if (!input) return;
    const value = input.value.trim();
    input.classList.remove("invalid");
    error.textContent = "";

    if (field.required && !value) {
      valid = false;
      input.classList.add("invalid");
      error.textContent = `${field.label} is required.`;
    }
    if (field.id === "mobile" && value && !/^\+?[0-9\s-]{7,15}$/.test(value)) {
      valid = false;
      input.classList.add("invalid");
      error.textContent = "Enter a valid mobile number.";
    }
    if (field.id === "pin" && value && !/^\d{4,6}$/.test(value)) {
      valid = false;
      input.classList.add("invalid");
      error.textContent = "Enter a valid PIN code.";
    }
  });

  const emailInput = $("#email");
  if (emailInput) {
    const email = emailInput.value.trim();
    const error = $("#error-email");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      valid = false;
      emailInput.classList.add("invalid");
      error.textContent = "Enter a valid email address.";
    }
  }

  const countryInput = $("#country");
  if (countryInput) checkoutState.address.country = countryInput.value;
  const typeInput = document.querySelector("input[name='addressType']:checked");
  if (typeInput) checkoutState.address.type = typeInput.value;

  fields.forEach(field => {
    const input = $(`#${field.id}`);
    if (input) checkoutState.address[field.id] = input.value.trim();
  });
  if (emailInput) checkoutState.address.email = emailInput.value.trim();

  return valid;
}

function validatePaymentForm() {
  const method = checkoutState.payment.method;
  let valid = true;

  if (method === "card") {
    const cardHolder = $("#cardHolder");
    const cardNumber = $("#cardNumber");
    const expiry = $("#expiry");
    const cvv = $("#cvv");

    [cardHolder, cardNumber, expiry, cvv].forEach(input => {
      input.classList.remove("invalid");
      $(`#error-${input.id}`).textContent = "";
    });

    if (!cardHolder.value.trim()) {
      valid = false; cardHolder.classList.add("invalid"); $(`#error-cardHolder`).textContent = "Enter card holder name.";
    }
    if (!/^[0-9]{13,19}$/.test(cardNumber.value.replace(/\s+/g, ""))) {
      valid = false; cardNumber.classList.add("invalid"); $(`#error-cardNumber`).textContent = "Enter a valid card number.";
    }
    if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiry.value.trim())) {
      valid = false; expiry.classList.add("invalid"); $(`#error-expiry`).textContent = "Expiry must be MM/YY.";
    }
    if (!/^[0-9]{3,4}$/.test(cvv.value.trim())) {
      valid = false; cvv.classList.add("invalid"); $(`#error-cvv`).textContent = "Enter a valid CVV.";
    }

    checkoutState.payment.card.holder = cardHolder.value.trim();
    checkoutState.payment.card.number = cardNumber.value.replace(/\s+/g, "");
    checkoutState.payment.card.expiry = expiry.value.trim();
    checkoutState.payment.card.cvv = cvv.value.trim();
  }

  if (method === "upi") {
    const upiId = $("#upiId");
    const error = $("#error-upiId");
    upiId.classList.remove("invalid");
    error.textContent = "";
    if (!upiId.value.trim() || !/^[^\s@]+@[^\s@]+$/.test(upiId.value.trim())) {
      valid = false;
      upiId.classList.add("invalid");
      error.textContent = "Enter a valid UPI ID.";
    }
    checkoutState.payment.upi = upiId.value.trim();
  }

  return valid;
}

function placeOrder() {
  const order = {
    id: makeOrderId(),
    created: new Date().toISOString(),
    customerName: checkoutState.address.fullName,
    delivery: { ...checkoutState.address },
    payment: { method: checkoutState.payment.method, ...(checkoutState.payment.method === "upi" ? { upiId: checkoutState.payment.upi } : checkoutState.payment.method === "card" ? { cardLast4: checkoutState.payment.card.number.slice(-4) } : {}) },
    totals: getCartTotals(),
    items: cart.map(item => {
      const p = PRODUCTS.find(x => x.id === item.id);
      return { id: p.id, title: p.title, image: p.img, qty: item.qty, price: p.price, total: p.price * item.qty };
    })
  };
console.log(order)
  fetch("https://script.google.com/macros/s/AKfycbzoEy0sFpebmxcoMeKqhqBH9DVkASLTALdxf-DnMLuqIsSHP6l3Mg8IpIazamof2YW3/exec", {
  method: "POST",
  
  
  body: JSON.stringify({
    name: order.customerName,
    phone: order.delivery.mobile,
    address: `${order.delivery.house}, ${order.delivery.street}, ${order.delivery.city}, ${order.delivery.state}, ${order.delivery.pin}`,
    products: order.items.map(item => `${item.title} x${item.qty}`).join(", "),
    total: order.totals.total,
    payment: order.payment.method
  })
})


  const orders = JSON.parse(localStorage.getItem("luxe_orders") || "[]");
  orders.unshift(order);
  localStorage.setItem("luxe_orders", JSON.stringify(orders));
  localStorage.setItem("luxe_last_order", JSON.stringify(order));

  cart = [];
  saveCart();
  checkoutState = { step: 4, order };
  renderCartUI();
  toast("Order placed successfully!");
}

function setupDrawers() {
  $("#cartBtn").addEventListener("click", () => { renderCartUI(); openDrawer("cart"); });
  $("#wishlistBtn").addEventListener("click", () => openDrawer("wish"));
  $("#backdrop").addEventListener("click", closeDrawer);
  $$("[data-close]").forEach(b => b.addEventListener("click", closeDrawer));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });
}

/* ---------- 9. WISHLIST ---------- */

function saveWish() { localStorage.setItem("luxe_wishlist", JSON.stringify(wishlist)); }

function toggleWishlist(id) {
  const idx = wishlist.indexOf(id);
  if (idx >= 0) { wishlist.splice(idx, 1); toast("Removed from wishlist"); }
  else { wishlist.push(id); toast("Added to wishlist ♥"); }
  saveWish(); updateWishUI();
  renderProducts(); // refresh hearts
}

function updateWishUI() {
  $("#wishCount").textContent = wishlist.length;
  const body = $("#wishItems");
  if (wishlist.length === 0) {
    body.innerHTML = `<div class="empty-state"><div class="big">♡</div>No favourites yet.</div>`;
    return;
  }
  body.innerHTML = wishlist.map(id => {
    const p = PRODUCTS.find(x => x.id === id);
    return `
      <div class="cart-item">
        <img src="${p.img}" alt="${p.title}" />
        <div>
          <h5>${p.title}</h5>
          <small>${p.brand} · $${p.price}</small>
          <button class="cart-remove" data-wid="${p.id}">Remove</button>
        </div>
        <button class="add-cart" data-add="${p.id}" style="margin:0;padding:8px 14px;font-size:.8rem">Add</button>
      </div>
    `;
  }).join("");
  $$("[data-wid]").forEach(b => b.addEventListener("click", e => toggleWishlist(parseInt(e.currentTarget.dataset.wid, 10))));
  $$("[data-add]").forEach(b => b.addEventListener("click", e => addToCart(parseInt(e.currentTarget.dataset.add, 10))));
}

/* ---------- 10. NAVIGATION ---------- */

function setupNav() {
  $("#hamburger").addEventListener("click", () => $("#navLinks").classList.toggle("open"));
  $$("#navLinks a").forEach(a => a.addEventListener("click", () => $("#navLinks").classList.remove("open")));

  window.addEventListener("scroll", () => {
    $("#navbar").classList.toggle("scrolled", window.scrollY > 30);
    $("#backTop").classList.toggle("show", window.scrollY > 400);
  });

  $("#backTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- 11. SEARCH ---------- */

function setupSearch() {
  $("#searchToggle").addEventListener("click", () => {
    $("#searchBar").classList.toggle("open");
    if ($("#searchBar").classList.contains("open")) $("#searchInput").focus();
  });
  $("#searchInput").addEventListener("input", () => {
    renderProducts();
  });
}

/* ---------- 1e="margin-top:14px;color:var(--text-soft)">
          Premium ${p.category} crafted with exceptional materials and attention to detail.
          A signature LUXE piece designed to last for years.
        </p>
        <ul class="spec-list">
          <li>Material: Premium grade</li>
          <li>Warranty: 2 years</li>
          <li>Free shipping over $50</li>
          <li>30-day returns</li>
        </ul>
        <div class="quantity-selector">
          <button id="qDec">−</button>
          <span id="qVal">1</span>
          <button id="qInc">+</button>
        </div>
        <button class="btn btn-primary btn-block" id="modalAdd">Add to Cart</button>
      </div>
    </div>
  `;
  $("#quickModal").classList.add("open");
  $("#backdrop").classList.add("open");
  document.body.style.overflow = "hidden";

  let qty = 1;
  $("#qInc").onclick = () => { qty++; $("#qVal").textContent = qty; };
  $("#qDec").onclick = () => { if (qty > 1) { qty--; $("#qVal").textContent = qty; } };
  $("#modalAdd").onclick = () => { for (let i = 0; i < qty; i++) addToCart(p.id); };
  $$(".modal-thumbs img").forEach(t => t.onclick = () => {
    $$(".modal-thumbs img").forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    $("#mainImg").src = t.dataset.src;
  });
}

/* ---------- 14. TESTIMONIALS CAROUSEL ---------- */

let tIndex = 0;
function renderTestimonials() {
  $("#tTrack").innerHTML = TESTIMONIALS.map(t => `
    <div class="t-card">
      <img class="t-avatar" loading="lazy" src="${t.img}" alt="${t.name}" />
      <div class="stars">${"★".repeat(t.rating)}</div>
      <p>"${t.text}"</p>
      <div><strong>${t.name}</strong> · <span class="muted">${t.role}</span></div>
    </div>
  `).join("");

  const move = () => $("#tTrack").style.transform = `translateX(-${tIndex * 100}%)`;
  $("#tNext").onclick = () => { tIndex = (tIndex + 1) % TESTIMONIALS.length; move(); };
  $("#tPrev").onclick = () => { tIndex = (tIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length; move(); };
  setInterval(() => { tIndex = (tIndex + 1) % TESTIMONIALS.length; move(); }, 6000);
}

/* ---------- 15. NEWSLETTER ---------- */

function setupNewsletter() {
  $("#newsForm").addEventListener("submit", e => {
    e.preventDefault();
    const email = $("#newsEmail").value.trim();
    const msg = $("#newsMsg");
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      msg.textContent = "Please enter a valid email address.";
      msg.className = "news-msg error";
      return;
    }
    msg.textContent = "🎉 You're in! Check your inbox for 10% off.";
    msg.className = "news-msg success";
    $("#newsEmail").value = "";
    toast("Subscribed successfully!");
  });
}

/* ---------- 16. COUNTDOWN ---------- */

function setupCountdown() {
  // Ends 24h from first visit (persisted)
  let end = parseInt(localStorage.getItem("luxe_flash_end"), 10);
  if (!end || end < Date.now()) {
    end = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem("luxe_flash_end", end);
  }
  const tick = () => {
    let diff = Math.max(0, end - Date.now());
    const h = Math.floor(diff / 3.6e6);
    const m = Math.floor((diff % 3.6e6) / 6e4);
    const s = Math.floor((diff % 6e4) / 1000);
    $("#cdH").textContent = String(h).padStart(2, "0");
    $("#cdM").textContent = String(m).padStart(2, "0");
    $("#cdS").textContent = String(s).padStart(2, "0");
  };
  tick();
  setInterval(tick, 1000);
}

/* ---------- 17. SCROLL REVEAL + COUNTERS ---------- */

function setupReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        if (e.target.dataset.counter) animateCounter(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  $$(".reveal").forEach(el => io.observe(el));
  $$("[data-counter]").forEach(el => io.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.counter, 10);
  let current = 0;
  const step = Math.max(1, Math.floor(target / 60));
  const t = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(t); }
    el.textContent = current;
  }, 20);
}

function setupScroll() { /* nav scroll handled in setupNav */ }

/* ---------- 18. TOAST ---------- */

function toast(message) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  $("#toastHost").appendChild(el);
  setTimeout(() => el.remove(), 3000);
}
