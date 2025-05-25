document.addEventListener("DOMContentLoaded", () => {
  const grid      = document.getElementById("favoritesGrid");
  let vetements   = JSON.parse(localStorage.getItem("vetements"))   || [];
  let favorites   = JSON.parse(localStorage.getItem("favorites"))   || [];

  // Filtrer les vêtements bookmarkés
  const favItems = vetements.filter(v => favorites.includes(v.id));

  if (favItems.length === 0) {
    grid.innerHTML = `<p class="text-center text-gray-500">Vous n’avez aucun favori pour le moment.</p>`;
    return;
  }

  // Affichage similaire à script.js
  favItems.forEach(v => {
    const card = document.createElement("div");
    card.className = "relative break-inside-avoid mb-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg shadow overflow-hidden p-2";

    card.innerHTML = `
      <img src="${v.image}" alt="${v.reference}" class="w-full rounded mb-2 object-contain" />
      <h3 class="font-semibold text-lg">${v.reference}</h3>
      <p class="text-sm text-gray-600 dark:text-gray-300">${v.categorie} · ${v.saison}</p>
      <a href="item.html?id=${v.id}" class="absolute bottom-2 right-2 text-sm text-blue-500 hover:underline">ℹ️</a>
    `;
    grid.appendChild(card);
  });
});
