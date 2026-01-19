
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    async function loadCheckout() {
      const res = await fetch('/api/products');
      const products = await res.json();
      const tbody = document.querySelector('#checkoutTable .tbody');
      tbody.innerHTML = '';

      let total = 0;

      cart.forEach(item => {
        const p = products.find(pr => pr.id === item.id);
        if (!p) return;

        const price = p.price || p.price;
        total += price * item.quantity;

        tbody.innerHTML += `
                    <div class="row border-top border-bottom">
                        <div class="row main align-items-center">
     
        <div class="col-2"><img class="img-fluid" src="${p.images[0] || ''}" alt="${p.title}"></div>
                            <div class="col">
        <div class="row text-muted">${p.type}</div>
        <div class="row">${p.title}</div>
        </div>

        <div class="coll col">
          <button  onclick="updateQty('${p.id}', -1)">-</button>
          <b >${item.quantity}</b>
          <button  onclick="updateQty('${p.id}', 1)">+</button>
        </div>
        <div class="col">
          ${price * item.quantity} DH
        <a class="close" onclick="removeItem('${p.id}')">&#10005;</a>

        </div>
         
                    
        
        </div>
      
                    </div>

     

    `;
      });

      document.getElementById('totalPrice').innerText = total;
    }

    function updateQty(id, delta) {
      cart = cart.map(item => {
        if (item.id === id) {
          item.quantity += delta;
          if (item.quantity < 1) item.quantity = 1;
        }
        return item;
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      loadCheckout();
    }

    function removeItem(id) {
      cart = cart.filter(item => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(cart));
      loadCheckout();
    }

    document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      if (cart.length === 0) {
        alert('Cart is empty!');
        return;
      }

      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const address = document.getElementById('address').value.trim();

      if (!name || !phone || !address) {
        alert('Please fill all fields!');
        return;
      }

      for (const item of cart) {
        await fetch('/api/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: item.id,
            quantity: item.quantity,
            name, phone, address
          })
        });
      }
document.getElementById('card').style.display = 'none';

      document.getElementById('message').innerHTML = `
      
      
      
<div class="success-container">
  <div class="success-card">
    
    <div class="circle">
      <span>✓</span>
    </div>

    <h1>Payment Successful</h1>

    <p class="subtitle">
      Your transaction has been completed safely.
    </p>

   
      <p class="note">Thank you for your purchase.</p>

  </div>
</div>

      
      `;

      localStorage.removeItem('cart');

      setTimeout(() => { location.href = 'index.html'; }, 3000);
    });

    window.onload = () => {
      cart = cart.map(id => {
        if (typeof id === 'string') return { id, quantity: 1 };
        return id;
      });
      loadCheckout();
    };