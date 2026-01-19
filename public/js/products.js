 async function loadProduct() {
      const id = localStorage.getItem('selectedProductId');
      if (!id) { document.body.innerHTML = 'No product selected'; return; }

      const res = await fetch('/api/products');
      const products = await res.json();
      const p = products.find(pr => pr.id === id);
      if (!p) { document.body.innerHTML = 'Product not found'; return; }

    const container = document.getElementById('productDetail');
container.innerHTML = `

  <div class="left">

  <div class="product-preview">
    <img id="mainImg" class="main-img" src="${p.images[0]}">

    <div class="thumbs">
      ${p.images
        .map(i => `<img class="thumbs-img" src="${i}" onclick="changeImg(this)">`)
        .join('')}
    </div>
  </div>
  </div>

  <div class="right">
  <h4 class="company">${p.type} Company</h4>

  <h1 class="titlee">Buy ${p.title}</h1>

  <p class="descc">${p.description}</p>
    <div class="price-box">

  <p class="pricee">${p.price} DH</p>
    </div>

  <p class="old-pricee"><del>${p.discountPrice}</del> DH</p>

  
    <div class="actionss">
      <div class="qty">

    <button class="qty-btn" onclick="changeQty(-1)">
      
       <svg width="12" height="4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs>
                  <path
                    d="M11.357 2.694H.643A.641.641 0 0 1 0 2.051V1.282c0-.356.287-.643.643-.643h10.714c.356 0 .643.287.643.643v.769a.641.641 0 0 1-.643.643Z"
                    id="a" />
                </defs>
                <use fill-rule="nonzero" xlink:href="#a" />
              </svg>
      </button>
    <span id="qty" class="qty-display">1</span>
    <button class="qty-btn" onclick="changeQty(1)">
      
      <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs>
                  <path
                    d="M12 7.023V4.977a.641.641 0 0 0-.643-.643h-3.69V.643A.641.641 0 0 0 7.022 0H4.977a.641.641 0 0 0-.643.643v3.69H.643A.641.641 0 0 0 0 4.978v2.046c0 .356.287.643.643.643h3.69v3.691c0 .356.288.643.644.643h2.046a.641.641 0 0 0 .643-.643v-3.69h3.691A.641.641 0 0 0 12 7.022Z"
                    id="b" />
                </defs>
                <use  fill-rule="nonzero" xlink:href="#b" />
              </svg>
      </button>
      </div>
  <button class="add-btn" onclick="addAndCheckout('${p.id}')">Add to Cart & Checkout</button>

      </div>
  













      
<br>
<p class="descc2">${p.description2 || ""}</p>

  

  </div>


  `;

    }

    function changeQty(amount) {
      const span = document.getElementById('qty');
      let val = parseInt(span.innerText);
      val += amount;
      if (val < 1) val = 1;
      span.innerText = val;
    }

    function addAndCheckout(id) {
      const qty = parseInt(document.getElementById('qty').innerText) || 1;
      const selected = JSON.parse(localStorage.getItem('cart') || '[]');
      const exists = selected.find(p => p.id === id);
      if (exists) { exists.quantity += qty; }
      else { selected.push({ id, quantity: qty }); }
      localStorage.setItem('cart', JSON.stringify(selected));
      // Redirect to checkout
      location.href = 'checkout.html';
    }

    loadProduct();
       function changeImg(el) {
  document.getElementById("mainImg").src = el.src;
}