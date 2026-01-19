  // Show 
  function chof() {
    const codeEl = document.getElementById('code');
    const isPwd = codeEl.type === 'password';
    codeEl.type = isPwd ? 'text' : 'password';
    toggle.textContent = isPwd ? '🙈' : '🙈';
  }