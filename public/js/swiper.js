(async () => {
  const res = await fetch('/api/settings');
  const ui = await res.json();

  ["banner1", "banner2", "banner3"].forEach(id => {
    const img = document.getElementById(id);
    const slide = img.closest(".swiper-slide");

    if (ui[id]) {
      img.src = ui[id];
    } else {
      slide.remove(); 
    }
  });

  
  new Swiper(".slide-swp", {
    pagination: {
      el: ".swiper-pagination",
      dynamicBullets: true,
      clickable: true
    },
    autoplay: {
      delay: 2500,
    },
    loop: true
  });

})();





