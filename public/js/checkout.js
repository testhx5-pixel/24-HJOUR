const searchInput = document.getElementById("search");

searchInput.addEventListener("keyup", () => {
  const text = searchInput.value.toLowerCase();
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    const name = card.querySelector(".prod-name").innerText.toLowerCase();
    
    card.style.display = name.includes(text) ? "block" : "none";
  });
});
