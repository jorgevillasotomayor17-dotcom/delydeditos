/*
 * Carrito de DelyDeditos.
 * IMPORTANTE: cambia WHATSAPP_NUMBER por el número del negocio en formato internacional,
 * solo números, sin +, espacios ni guiones. Ejemplo Colombia: 573001234567.
 */
const WHATSAPP_NUMBER = "573018344134";

document.addEventListener("DOMContentLoaded", () => {
  const cart = [];
  const money = value => new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", maximumFractionDigits: 0
  }).format(value);

  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");
  const checkoutForm = document.getElementById("checkout-form");
  const checkoutMessage = document.getElementById("checkout-message");

  function renderCart() {
    cartItems.innerHTML = "";
    if (!cart.length) {
      cartItems.innerHTML = '<p class="empty-cart">Tu carrito está esperando algo rico. Agrega tus favoritos para comenzar.</p>';
    } else {
      cart.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "cart-item";
        const description = `${item.flavor}${item.size ? " · " + item.size : ""} · ${item.cooking} · Cant. ${item.qty}`;
        const info = document.createElement("div");
        const title = document.createElement("strong");
        title.textContent = item.name;
        const details = document.createElement("small");
        details.textContent = description;
        const remove = document.createElement("button");
        remove.className = "remove-item";
        remove.type = "button";
        remove.textContent = "Quitar";
        remove.setAttribute("aria-label", `Quitar ${item.name} del carrito`);
        remove.addEventListener("click", () => { cart.splice(index, 1); renderCart(); });
        info.append(title, details, remove);
        const price = document.createElement("span");
        price.className = "item-price";
        price.textContent = money(item.unitPrice * item.qty);
        row.append(info, price);
        cartItems.appendChild(row);
      });
    }
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const total = cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
    cartTotal.textContent = money(total);
    cartCount.textContent = `${totalQty} ${totalQty === 1 ? "producto" : "productos"}`;
  }

  document.querySelectorAll(".add-button").forEach(button => {
    button.addEventListener("click", () => {
      const card = button.closest(".product-card");
      const flavorSelect = card.querySelector(".option-flavor");
      const flavorOption = flavorSelect.options[flavorSelect.selectedIndex];
      const cooking = card.querySelector(".option-cooking")?.value || "No especificado";
      const sizeSelect = card.querySelector(".option-size");
      const sizeOption = sizeSelect?.options[sizeSelect.selectedIndex];
      const qtyInput = card.querySelector(".product-qty");
      const qty = Number.parseInt(qtyInput.value, 10);
      if (!Number.isInteger(qty) || qty < 1 || qty > 500) {
        checkoutMessage.textContent = "Indica una cantidad entre 1 y 500 unidades.";
        qtyInput.focus();
        return;
      }
      const basePrice = Number(flavorOption.dataset.price || 0);
      const extra = Number(sizeOption?.dataset.extra || 0);
      const unitPrice = basePrice + extra;
      cart.push({
        name: button.dataset.product,
        flavor: flavorSelect.value,
        cooking,
        size: sizeSelect?.value || "",
        qty,
        unitPrice
      });
      renderCart();
      checkoutMessage.textContent = `${button.dataset.product} agregado al pedido.`;
      document.getElementById("carrito").scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });

  document.querySelectorAll(".filter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".filter-pill").forEach(p => p.classList.toggle("active", p === pill));
      const category = pill.dataset.filter;
      document.querySelectorAll(".product-card").forEach(card => {
        card.hidden = category !== "todos" && card.dataset.category !== category;
      });
    });
  });

  const search = document.getElementById("buscar-producto");
  if (search) {
    search.addEventListener("input", () => {
      const term = search.value.trim().toLocaleLowerCase("es");
      document.querySelectorAll(".product-card").forEach(card => {
        card.hidden = !card.dataset.name.includes(term);
        if (term) card.hidden = card.hidden || !card.textContent.toLocaleLowerCase("es").includes(term);
      });
      document.querySelectorAll(".filter-pill").forEach(p => p.classList.toggle("active", p.dataset.filter === "todos"));
    });
  }

  checkoutForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!cart.length) {
      checkoutMessage.textContent = "Primero agrega al menos un producto a tu carrito.";
      return;
    }
    if (WHATSAPP_NUMBER === "PON_AQUI_TU_NUMERO" || !/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
      checkoutMessage.textContent = "Antes de enviar pedidos, configura tu número de WhatsApp en el archivo menu.js.";
      return;
    }
    const name = document.getElementById("customer-name").value.trim();
    const zone = document.getElementById("customer-zone").value.trim();
    const address = document.getElementById("customer-address").value.trim();
    const notes = document.getElementById("customer-notes").value.trim();
    const total = cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
    const lines = [
      "¡Hola, DelyDeditos! Quiero confirmar este pedido:",
      "",
      ...cart.map((item, i) =>
        `${i + 1}. ${item.name} — ${item.flavor}${item.size ? " (" + item.size + ")" : ""}, ${item.cooking}, cantidad: ${item.qty} — ${money(item.unitPrice * item.qty)}`
      ),
      "",
      `Total estimado de productos: ${money(total)}`,
      `Nombre: ${name}`,
      `Barrio/zona: ${zone}`,
      `Dirección: ${address}`,
      ...(notes ? [`Notas: ${notes}`] : []),
      "",
      "Por favor, confírmame disponibilidad, costo del domicilio y total final."
    ];
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });

  renderCart();
});