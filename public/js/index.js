

    function getCart() {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    }

    function saveCart(cart) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    function updateCartCount() {
      const cart = getCart();
      const total = cart.reduce((s, item) => s + (item.quantity || 1), 0);
      document.getElementById("cartCount").textContent = total;
    }

    function addToCart(id, qty = 1) {
      const cart = getCart();
      const item = cart.find(p => p.id === id);

      if (item) item.quantity += qty;
      else cart.push({ id, quantity: qty });

      saveCart(cart);
      updateCartCount();
    }


function buyNow(id, qty ){
  localStorage.setItem("selectedProductId", id);
      location.href = "products.html";
    }



   async function loadProductsByCategory() {
  try {
    const res = await fetch("/api/products");
    const products = await res.json();

    const list = document.getElementById("productList");
    list.innerHTML = "";

   
    const byCategory = {};
    const defaultCategory = "Products";

    products.forEach(p => {
      const cat = p.typee || defaultCategory;
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(p);
    });

  
    for (const [cat, prods] of Object.entries(byCategory)) {
      const section = document.createElement("div");
      section.className = "category-section";

      const title = document.createElement("h2");
      title.className = "Ti";
      title.textContent = cat;
      section.appendChild(title);

      const grid = document.createElement("div");
      grid.className = "griiid";

      prods.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";

        const img = p.images?.[0] ? `<img src="${p.images[0]}" class="prod-img">` : "";
        const price = p.discountPrice
          ? `<span class="price">${p.price} DH</span> <span class="old-price"><del>${p.discountPrice} DH</del></span>`
          : `<span class="price">${p.price} DH</span>`;

        card.innerHTML = `
          <div class="imgwrap" onclick="buyNow('${p.id}')">
            ${img}
          </div>
          <div class="prod-name">${p.title}</div>
          <div class="price">${price}</div>
          <div class="actions">
            <button class="btn primary" onclick="addToCart('${p.id}')">Add to Cart</button>
            <button class="btn ghost" onclick="buyNow('${p.id}')">Buy Now</button>
            <button class="carte-plus primary" onclick="addToCart('${p.id}')"> <i class="fa-solid fa-cart-plus"></i></button>

           

          </div>
        `;

        grid.appendChild(card);
      });

      section.appendChild(grid);
      list.appendChild(section);
    }

  } catch (err) {
    console.error("API Error:", err);
  }
}


window.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  loadProductsByCategory();
});


    window.addEventListener("storage", updateCartCount);
