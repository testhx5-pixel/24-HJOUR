(async function () {
  try {
    const res = await fetch('/api/settings');
    if (!res.ok) return;
    const ui = await res.json();

    if (ui.siteName) {
      document.title = ui.siteName;
      document.querySelectorAll('.logo').forEach(el => {
        el.textContent = ui.siteName;
      });
    }

    // COLORS
    document.documentElement.style.setProperty('--site-background', ui.backgroundColor);
    document.documentElement.style.setProperty('--site-font-color', ui.fontColor);
    document.documentElement.style.setProperty('--accent-color', ui.accentColor);

    // LOGO IMAGE
    const logoImg = document.querySelector('#siteLogoImg');
    if (logoImg && ui.logo) {
      logoImg.src = ui.logo;
      logoImg.style.display = 'block';
    }

    const headerText = document.querySelector('.header-text');
    if (headerText && ui.headerText) {
      headerText.textContent = ui.headerText;
    }

  } catch (err) {
    console.error('UI Settings Error:', err);
  }
})();
