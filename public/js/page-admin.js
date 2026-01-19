//page 1 - 2 - 3 
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('nav a');

    function showSection(id) {
      sections.forEach(s => s.classList.toggle('active', s.id === id));
      navLinks.forEach(a => a.classList.toggle('active', a.dataset.target === id));
      if (document.getElementById(id)) {
        document.title = document.getElementById(id).querySelector('h1, h2')?.innerText || 'موقع متعدد الصفحات';
      }
    }

   
    window.addEventListener('hashchange', () => {
      const id = location.hash.replace('#', '') || 'home';
      showSection(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    navLinks.forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      const target = a.dataset.target;
      location.hash = target;
    }));

    document.addEventListener('DOMContentLoaded', () => {
      const id = location.hash.replace('#', '') || 'home';
      showSection(id);
      document.getElementById('year').innerText = new Date().getFullYear();

      document.getElementById('contactForm').addEventListener('submit', e => {
        e.preventDefault();
        alert('تم استلام رسالتك — شكراً!');
        e.target.reset();
      });
    });

    //change passworde admin 


       const form = document.getElementById('changeCredForm');
    const msg = document.getElementById('msgg');

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const oldUsername = document.getElementById('oldUsername').value;
      const oldPassword = document.getElementById('oldPassword').value;
      const newUsername = document.getElementById('newUsername').value;
      const newPassword = document.getElementById('newPassword').value;

      try {
        const res = await fetch('/api/admin/change-credentials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ oldUsername, oldPassword, newUsername, newPassword })
        });
        const data = await res.json();
        msg.textContent = data.message || data.error;
      } catch (err) {
        msg.textContent = 'Server error!';
      }
    });