(async () => {
  const res = await fetch('/api/settings');
  const ui = await res.json();
  const favicon = document.getElementById("favicon");
  const ver = Date.now(); 

  if (!ui.logo) return;

  let type = "image/png";
  if (ui.logo.endsWith(".svg")) type = "image/svg+xml";
  else if (ui.logo.endsWith(".jpg") || ui.logo.endsWith(".jpeg")) type = "image/jpeg";

  favicon.setAttribute("type", type);
  favicon.href = ui.logo + "?v=" + ver;
})();






























// ----- Admin upload logo

    async function loadLogo() {
    try {
      const res = await fetch('/api/settings'); // endpoint public
      const ui = await res.json();

      const containers = document.querySelectorAll('.logoContainer');
      containers.forEach(container => {
        container.innerHTML = ''; // n9i kolchi qdim

        if (!ui.logo) return;

        // 1️⃣ SVG inline
        if (ui.logo.startsWith('<svg')) {
          container.innerHTML = ui.logo;
          return;
        }

        // 2️⃣ SVG file
        if (ui.logo.endsWith('.svg')) {
          fetch(ui.logo)
            .then(r => r.text())
            .then(svgText => container.innerHTML = svgText)
            .catch(err => console.error('SVG fetch error', err));
          return;
        }

        
        const img = document.createElement('img');
        img.src = ui.logo;
        img.alt = ui.siteName || 'Logo';
        img.style.height = '50px';
        img.style.width = 'auto';
        container.appendChild(img);
      });
    } catch (err) {
      console.error('Failed to load logo:', err);
    }
  }

  loadLogo();