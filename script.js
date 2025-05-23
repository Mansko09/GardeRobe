document.addEventListener("DOMContentLoaded", () => {
  const form         = document.getElementById("addForm");
  const gardeRobe    = document.getElementById("gardeRobe");
  const currentUser   = localStorage.getItem("pseudo") || "inconnu";
  const filterCat    = document.getElementById("filterCat");
  const filterSaison = document.getElementById("filterSaison");

  let vetements = JSON.parse(localStorage.getItem("vetements")) || [];

  // Affiche les vêtements en appliquant les filtres
  function renderVetements() {
    if (!gardeRobe) return;
    gardeRobe.innerHTML = "";

    const catValue   = filterCat    ? filterCat.value    : "";
    const saisonValue= filterSaison ? filterSaison.value : "";

    vetements
      .filter(v => !catValue   || v.categorie === catValue)
      .filter(v => !saisonValue|| v.saison    === saisonValue)
      .forEach(v => afficherVetement(v));
  }

  // Création et insertion d’une carte
  function afficherVetement(vetement) {
    const card = document.createElement("div");
    card.className = 
      "break-inside-avoid mb-2 bg-white dark:bg-gray-800 text-gray-800 " +
      "dark:text-white rounded shadow-sm overflow-hidden p-1 text-sm";

    card.innerHTML = `
      <img src="${vetement.image}" alt="${vetement.nom}"
        class="w-full rounded mb-1 object-contain transition-transform duration-300 hover:scale-105 max-h-32"/>
      <h3 class="font-semibold">${vetement.nom}</h3>
      <p class="text-xs text-gray-600 dark:text-gray-300">
        ${vetement.categorie} · ${vetement.saison}
      </p>
      <button onclick="supprimerVetement(${vetement.id})"
        class="mt-1 text-xs text-red-500 hover:underline">🗑️</button>
    `;
     // on crée un lien autour de la carte
    const link = document.createElement("a");
    link.href = `item.html?id=${vetement.id}`;
    link.appendChild(card);

    gardeRobe.appendChild(link);
  }


  // Gestion du formulaire d’ajout
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const nom        = document.getElementById("nom").value.trim();
      const reference = document.getElementById("reference").value.trim();
      const marque     = document.getElementById("marque").value.trim();
      const categorie  = document.getElementById("categorie").value;
      const saison     = document.getElementById("Saison").value;
      const imageInput = document.getElementById("image");
      if (!imageInput.files.length) return;

      const reader = new FileReader();
      reader.onload = event => {
        vetements.push({
          id: Date.now(),
          nom,
          reference,
          marque,
          categorie,
          saison,
          image: event.target.result,
          owner: currentUser
        });
        localStorage.setItem("vetements", JSON.stringify(vetements));
        form.reset();
        renderVetements();
      };
      reader.readAsDataURL(imageInput.files[0]);
    });
  }

  // Écouteurs pour les filtres
  if (filterCat)    filterCat.addEventListener("change", renderVetements);
  if (filterSaison) filterSaison.addEventListener("change", renderVetements);

  // Premier affichage
  renderVetements();
});
