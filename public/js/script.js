
        const navLinks = document.querySelectorAll('.nav-links a');
        const sections = document.querySelectorAll('.section');

        function updateActiveNav() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', updateActiveNav);

        const menuToggle = document.getElementById('menuToggle');
        const navLinksContainer = document.getElementById('navLinks');

        menuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinksContainer.contains(e.target)) {
                navLinksContainer.classList.remove('active');
            }
        });



















          $(document).ready(function(){
    $('.slick-slider').slick({
      slidesToShow: 5,        
      slidesToScroll: 1,
      autoplay: true,         
      autoplaySpeed: 0,       
      speed: 3000,            
      cssEase: 'linear',     
      infinite: true,
      arrows: false,          
      pauseOnHover: false,    
    });
  });

















   function searchProduct() {
      let input = document.getElementById("searchInput").value.toLowerCase();
      let products = document.getElementsByClassName("product");

      for (let i = 0; i < products.length; i++) {
        let title = products[i].getElementsByTagName("h3")[0].innerText.toLowerCase();

        if (title.includes(input)) {
          products[i].style.display = "block";
        } else {
          products[i].style.display = "none";
        }
      }
    }




    /// top bannner 



    fetch("/api/top-banner")
  .then(r => r.json())
  .then(b => {
    if (!b.enabled) return;

    const banner = document.getElementById("topBanner");
    const text = document.getElementById("bannerText");

    text.innerText = b.text;
    banner.style.background = b.background;
    banner.style.color = b.color;
    banner.style.display = "block";

    if (b.animate) {
      text.style.animation = `scrollBanner ${b.speed}s linear infinite`;
    } else {
      text.style.animation = "none";
      text.style.paddingLeft = "0";
      text.style.transform = "none";

    }
  });



  // banner cennter
         (async () => {
  const res = await fetch('/api/settings');
  const ui = await res.json();

  ["banner1", "banner2", "banner3"].forEach(id => {
    const img = document.getElementById(id);
    const slide = img.closest(".swiper-slide");

    if (ui[id]) {
      img.src = ui[id];
    } else {
      slide.style.display = "none";
    }
  });
})();




          /// show media

          fetch("/api/socials").then(r=>r.json()).then(s=>{
  const map = {
    email:'fa-solid fa-envelope',
    support:'fa-solid fa-headset',
    whatsapp:'fa-brands fa-whatsapp',
    instagram:'fa-brands fa-instagram',
    facebook:'fa-brands fa-facebook'
  };
  document.getElementById("socialLinks").innerHTML =
    Object.entries(map)
      .filter(([k])=>s[k])
      .map(([k,i])=>`<a href="${s[k]}" target="_blank"><i class="fa ${i}"></i></a>`)
      .join("");
});