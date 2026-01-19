
    async function loadOrders() {
      const res = await fetch('/api/admin/orders');
      const orders = await res.json();

      const tbody = document.querySelector('#ordersTable tbody');
      tbody.innerHTML = '';

      for (const o of orders) {
        const prodRes = await fetch('/api/products');
        const products = await prodRes.json();
        const p = products.find(pr => pr.id === o.productId);
        if (!p) continue;

        const totalPrice = (p.price) * o.quantity;

        tbody.innerHTML += `<tr>
  <td><img src="${p.images[0]}" alt="${p.title}"></td>
  <td>${p.title}</td>
  <td>x${o.quantity}</td>
  <td>${totalPrice} DH</td>
  <td>${o.name}</td>
  <td>${o.phone}</td>
  <td>${o.address}</td>

  <td class="action-cell">
    <div class="menu-wrapper">
      <div class="menu-dots">⋮</div>
      <div class="menu-box">
        <button onclick="printOrder('${o.id}')">Print Order</button>
        <button onclick="deleteOrder('${o.id}')">Delete Product</button>
      </div>
    </div>
  </td>
</tr>

    `;
      }
    }

    async function deleteOrder(id) {
      if (!confirm('Remove this order?')) return;
      const res = await fetch('/api/admin/orders/' + id, { method: 'DELETE' });
      const data = await res.json();
      if (data.ok) loadOrders();
    }

    loadOrders();




    /// menu
      document.addEventListener("click", function(e) {
  const isMenu = e.target.classList.contains("menu-dots");
  const menus = document.querySelectorAll(".menu-box");

  menus.forEach(m => m.classList.remove("show"));

  if (isMenu) {
    const box = e.target.nextElementSibling;
    box.classList.toggle("show");
  }
});
