//button orders

    async function updateOrdersCount() {
      try {
        const res = await fetch('/api/admin/orders');
        const orders = await res.json();
        document.getElementById('ordersCount').innerText = orders.length;
      } catch (e) {
        console.error('Failed to load orders:', e);
      }
    }

    window.onload = updateOrdersCount;







//admin products h4x mrx

    async function loadAdmin() {
      const res = await fetch('/api/products');
      const products = await res.json();
      const box = document.getElementById('productsList');
      box.innerHTML = '';
      products.forEach(p => {
        let imgs = p.images.map(i => `<img src="${i}">`).join(' ');
        box.innerHTML += `
      <div class="product-card">
  <div class="product-images">
    ${imgs}
  </div>
  <div class="product-info">
    <h2>${p.title}</h2>
    <p class="price">
      ${p.price} DH 
      ${p.discountPrice ? `<span class="discount">${p.discountPrice} DH</span>` : ''}
    </p>

    <p class="desc">Description 1: ${p.description || ''}</p>

          <p class="desc2"><strong>Description 2:</strong> ${p.description2 || ''}</p>

    <p class="cat">Category: ${p.type || ''}</p>
    <p class="cat">Category2: ${p.typee || ''}</p>

    <button class="delete-btn" onclick="deleteProduct('${p.id}')">
      Delete
    </button>
  </div>
</div>

    `;
      });
    }

    async function addProduct(e) {
      e.preventDefault();
      const form = document.getElementById('addForm');
      const formData = new FormData(form);

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      if (json.ok) {
        alert('Product added!');
        form.reset();
        loadAdmin();
      } else alert('Error: ' + (json.error || ''));
    }

    async function deleteProduct(id) {
      if (!confirm('Delete this product?')) return;
      const res = await fetch('/api/admin/products/' + id, { method: 'DELETE' });
      const json = await res.json();
      if (json.ok) loadAdmin();
    }

    loadAdmin();
    document.getElementById('addForm').addEventListener('submit', addProduct);



  function preview(input, target) {
    const box = document.getElementById(target);
    const file = input.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        box.innerHTML = `<img src="${reader.result}">`;
      };
      reader.readAsDataURL(file);
    }
  }

  document.querySelectorAll('input[type="file"]').forEach((input, i) => {
    input.addEventListener("change", () => {
      preview(input, "prev" + (i + 1));
    });
  });


//description2






















  // categories for admin
  async function loadCategories() {
  const res = await fetch("/api/categories");
  const cats = await res.json();
  const select = document.getElementById("categorySelect");
  select.innerHTML = '<option value="">-- Select category --</option>';
  cats.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
  });
}

document.getElementById("deleteCategoryBtn").addEventListener("click", async () => {
  const select = document.getElementById("categorySelect");
  const name = select.value;
  if (!name) return alert("Select a category to delete");

  if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

  const res = await fetch("/api/categories", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });
  const json = await res.json();
  if (json.ok) {
    loadCategories();
  } else {
    alert("Error: " + (json.error || ""));
  }
});

loadCategories();



//bloger text editor

  //meni admin mobil
        const sidebar = document.getElementById("sidebar");
  const menuBtn = document.querySelector(".mobile-menu-btn");

  function toggleSidebar() {
    sidebar.classList.toggle("active");
    menuBtn.classList.toggle("open");
  }

  // تسدّ المينو إلا ضغطتي براها
  document.addEventListener("click", function (e) {
    const isClickInsideSidebar = sidebar.contains(e.target);
    const isClickOnMenuBtn = menuBtn.contains(e.target);

    if (!isClickInsideSidebar && !isClickOnMenuBtn) {
      sidebar.classList.remove("active");
      menuBtn.classList.remove("open");
    }
  });



          // control banner 3

// جلب الحالة من السيرفر عند فتح admin
(async () => {
  const res = await fetch('/api/settings');
  const data = await res.json();

  ["banner1","banner2","banner3"].forEach(id => {
    const preview = document.getElementById("preview" + id.charAt(0).toUpperCase() + id.slice(1));
    if (data[id]) {
      preview.src = data[id]; 
      preview.style.display = "block";
    }
  });
})();

// Upload + preview مباشر
async function uploadBanner(id, input) {
  const file = input.files[0];
  if (!file) return;

  const preview = document.getElementById("preview" + id.charAt(0).toUpperCase() + id.slice(1));
  preview.src = URL.createObjectURL(file);
  preview.style.display = "block";

  const form = new FormData();
  form.append("banner", file);
  form.append("id", id);

  const res = await fetch("/api/admin/upload-banner", {
    method: "POST",
    credentials: "include",
    body: form
  });
  const resp = await res.json();
  if(resp.ok) preview.src = resp.banner;
}

// Delete + hide preview
async function deleteBanner(id) {
  if(!confirm("Delete this banner?")) return;

  const res = await fetch("/api/admin/delete-banner", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    credentials:"include",
    body: JSON.stringify({id})
  });
  const resp = await res.json();
  if(resp.ok){
    const preview = document.getElementById("preview" + id.charAt(0).toUpperCase() + id.slice(1));
    preview.src = "";
    preview.style.display = "none";
    document.getElementById(id + "Input").value = "";
  }
}

// ربط كل input
document.getElementById("banner1Input").onchange = function(){ uploadBanner("banner1", this); };
document.getElementById("banner2Input").onchange = function(){ uploadBanner("banner2", this); };
document.getElementById("banner3Input").onchange = function(){ uploadBanner("banner3", this); };



        ///control admin 

      function updateLogoPreview(logo) {
        const img = document.getElementById("logoPreview");
        const svgDiv = document.getElementById("svgPreviewDiv");

        if (!logo) {
          img.style.display = "none";
          svgDiv.style.display = "none";
          svgDiv.innerHTML = "";
          return;
        }

        if (logo.startsWith("<svg")) {
          svgDiv.innerHTML = logo;
          svgDiv.style.display = "block";
          img.style.display = "none";
        } else {
          img.src = logo;
          img.style.display = "inline-block";
          svgDiv.style.display = "none";
          svgDiv.innerHTML = "";
        }
      }

 
      function uploadImage() {
        const file = document.getElementById("fileInput").files[0];
        if (!file) return alert("Select a file first!");

        const fd = new FormData();
        fd.append("logo", file);

        fetch("/api/admin/upload-logo", { method: "POST", body: fd })
          .then(r => r.json())
          .then(d => {
            document.getElementById("msg").innerText = d.ok ? "Logo updated!" : d.error;
            if (d.ok) {
              document.getElementById("logoUrlInput").value = d.logo;
              updateLogoPreview(d.logo);
            }
          });
      }

      function setUrl() {
        const url = document.getElementById("logoUrlSet").value.trim();
        if (!url) return alert("Enter URL!");

        fetch("/api/admin/logo-set", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "url", value: url })
        })
          .then(r => r.json())
          .then(d => {
            document.getElementById("msg").innerText = d.ok ? "Logo set from URL!" : d.error;
            if (d.ok) {
              document.getElementById("logoUrlInput").value = url;
              updateLogoPreview(url);
            }
          });
      }

      function setSvg() {
        const svg = document.getElementById("svgInput").value.trim();
        if (!svg) return alert("Enter SVG!");

        fetch("/api/admin/logo-set", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "svg", value: svg })
        })
          .then(r => r.json())
          .then(d => {
            document.getElementById("msg").innerText = d.ok ? "SVG saved!" : d.error;
            if (d.ok) {
              document.getElementById("logoUrlInput").value = "svg-inline";
              updateLogoPreview(svg);
            }
          });
      }

  
      (async function () {
        const qs = sel => document.querySelector(sel);
        const msg = qs('#uiMsg');
        const form = qs('#uiSettingsForm');

        const siteNameInput = qs('#siteName');
        const headerTextInput = qs('#headerText');
        const bgInput = qs('#backgroundColor');
        const fontInput = qs('#fontColor');
        const accentInput = qs('#accentColor');
        const logoUrlInput = qs('#logoUrlInput');

        function showMsg(text, ok = true) {
          msg.textContent = text;
          msg.style.color = ok ? 'green' : 'red';
          setTimeout(() => msg.textContent = "", 3500);
        }

        async function loadSettings() {
          try {
            const r = await fetch("/api/admin/settings");
            const ui = await r.json();

            siteNameInput.value = ui.siteName || "";
            headerTextInput.value = ui.headerText || "";
            bgInput.value = ui.backgroundColor || "#ffffff";
            fontInput.value = ui.fontColor || "#111827";
            accentInput.value = ui.accentColor || "#dc2626";

            logoUrlInput.value = ui.logo || "";
            updateLogoPreview(ui.logo);
          } catch {
            showMsg("Failed to load settings", false);
          }
        }

        form.addEventListener("submit", async (e) => {
          e.preventDefault();

          const payload = {
            siteName: siteNameInput.value,
            headerText: headerTextInput.value,
            backgroundColor: bgInput.value,
            fontColor: fontInput.value,
            accentColor: accentInput.value,
            logo: logoUrlInput.value
          };

          try {
            const r = await fetch("/api/admin/settings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });

            const j = await r.json();
            if (!r.ok) throw new Error(j.error);
            showMsg("Appearance saved");
          } catch {
            showMsg("Save failed", false);
          }
        });

        loadSettings();
      })();

      // admin top benner 

fetch("/api/top-banner").then(r=>r.json()).then(b=>{
  for (let k in b) {
    const el = document.querySelector(`[name="${k}"]`);
    if (!el) return;
    el.type === "checkbox" ? el.checked = b[k] : el.value = b[k];
  }
});

document.getElementById("bannerForm").onsubmit = e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const data = Object.fromEntries(f);
  data.animate = f.get("animate") === "on";
  data.enabled = f.get("enabled") === "on";
  data.speed = Number(data.speed);

  fetch("/api/admin/top-banner",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(data)
  }).then(()=>alert("Banner updated"));
};
// admin show media

fetch("/api/socials").then(r=>r.json()).then(s=>{
  for (let k in s) document.querySelector(`[name="${k}"]`).value = s[k];
});

document.getElementById("socialForm").onsubmit = e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  fetch("/api/admin/socials",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(data)
  }).then(()=>alert("Saved"));
};