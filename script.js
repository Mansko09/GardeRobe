document.addEventListener("DOMContentLoaded", () => {
  // --- 1) Références DOM & données ---
  const gardeRobe    = document.getElementById("gardeRobe");
  const filterCat    = document.getElementById("filterCat");
  const filterSaison = document.getElementById("filterSaison");

  let vetements  = JSON.parse(localStorage.getItem("vetements")) || [];
  let favorites  = JSON.parse(localStorage.getItem("favorites")) || [];

  // --- 2) Fonction qui (re)rend la liste filtrée ---
  function renderVetements() {
    gardeRobe.innerHTML = "";

    const cat   = filterCat    ? filterCat.value    : "";
    const saison = filterSaison ? filterSaison.value : "";

    vetements
      .filter(v => !cat    || v.categorie === cat)
      .filter(v => !saison || v.saison    === saison)
      .forEach(v => afficherVetement(v));
  }

  // --- 3) Création d’une carte « inline-block » pour le masonry ---
  function afficherVetement(v) {
    const isFav = favorites.includes(v.id);

    // wrapper inline-block
    const wrapper = document.createElement("div");
    wrapper.className = "inline-block w-full mb-4";

    // la carte
    const card = document.createElement("div");
    card.className = [
      "relative",
      "break-inside-avoid",
      "bg-white dark:bg-gray-800",
      "text-gray-800 dark:text-white",
      "rounded-lg shadow-sm overflow-hidden p-2"
    ].join(" ");

    card.innerHTML = `
      <img src="${v.image}" alt="${v.reference}"
           class="w-full rounded mb-2 object-contain
                  transition-transform duration-300 hover:scale-105" />
      <h3 class="font-semibold">${v.reference}</h3>
      <p class="text-xs text-gray-600 dark:text-gray-300">
        ${v.categorie} · ${v.saison}
      </p>

      <!-- ❤️ favoris -->
      <button data-id="${v.id}"
              class="absolute top-2 left-2 text-2xl focus:outline-none">
        ${isFav ? `<span class="text-red-500">❤️</span>`
               : `<span class="text-red-500">♡</span>`}
      </button>

      <!-- ℹ️ détails -->
      <a href="item.html?id=${v.id}"
         class="absolute bottom-2 right-2 text-xl text-blue-500 hover:text-blue-600">
        ℹ️
      </a>
    `;

    // toggle favoris
    card.querySelector("button[data-id]").addEventListener("click", e => {
      e.stopPropagation();
      const id = Number(e.currentTarget.dataset.id);
      if (favorites.includes(id)) {
        favorites = favorites.filter(x => x !== id);
      } else {
        favorites.push(id);
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
      renderVetements();
    });

    wrapper.appendChild(card);
    gardeRobe.appendChild(wrapper);
  }

  // --- 4) Écouteurs filtres ---
  if (filterCat)    filterCat.addEventListener("change", renderVetements);
  if (filterSaison) filterSaison.addEventListener("change", renderVetements);

  // --- 5) Premier rendu ---
  renderVetements();
});
