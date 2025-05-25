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
      <img src="${vetement.image}" alt="${vetement.reference}"
        class="w-full rounded mb-1 object-contain transition-transform duration-300 hover:scale-105 max-h-32"/>
      <h3 class="font-semibold">${vetement.reference}</h3>
      <p class="text-xs text-gray-600 dark:text-gray-300">
        ${vetement.categorie} · ${vetement.saison}
      </p>
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

//Ajout de vêtements
document.addEventListener("DOMContentLoaded", () => {
  const openBtn  = document.getElementById("openAddModal");
  const closeBtn = document.getElementById("closeAddModal");
  const modal    = document.getElementById("addModal");
  const form     = document.getElementById("addForm");

  const imageInput   = document.getElementById("imageInput");
  const previewImg   = document.getElementById("itemImagePreview");

  // Ouvrir / fermer le modal
  openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
  closeBtn.addEventListener("click", () => modal.classList.add("hidden"));

  // Aperçu live de l’image
  imageInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      previewImg.src = evt.target.result;
      previewImg.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  });

  // Soumission du formulaire
  form.addEventListener("submit", e => {
    e.preventDefault();

    // Récupérer les valeurs
    const reference       = document.getElementById("reference").value.trim();
    const marque    = document.getElementById("marque").value.trim();
    const categorie = document.getElementById("categorie").value;
    const saison    = document.getElementById("Saison").value;
    const color     = document.getElementById("colorInput").value;
    const material  = document.getElementById("material").value;
    const washType  = document.getElementById("washType").value;
    const dryType   = document.getElementById("dryType").value;

    if (!imageInput.files.length) {
      alert("Veuillez sélectionner une photo.");
      return;
    }

    // Lire l’image en base64
    const reader = new FileReader();
    reader.onload = event => {
      // Construire l’objet vêtement
      const vetement = {
        id: Date.now(),
        reference,
        marque,
        categorie,
        saison,
        color,
        material,
        washType,
        dryType,
        image: event.target.result,
        owner: localStorage.getItem("pseudo") || "inconnu",
        public: localStorage.getItem("accountPublic")==="true"
      };

      // Sauvegarde
      const arr = JSON.parse(localStorage.getItem("vetements")) || [];
      arr.push(vetement);
      localStorage.setItem("vetements", JSON.stringify(arr));

      // Fermer modal et revenir à l’accueil
      modal.classList.add("hidden");
      window.location.href = "index.html";
    };
    reader.readAsDataURL(imageInput.files[0]);
  });

  //  ➕ Affichage des options avancées
  const toggleBtn    = document.getElementById("toggleOptions");
  const moreOptions  = document.getElementById("moreOptions");

  toggleBtn.addEventListener("click", () => {
    const isHidden = moreOptions.classList.toggle("hidden");
    toggleBtn.textContent = isHidden
      ? "+ Plus d’options"
      : "– Moins d’options";
      });
});

document.addEventListener("DOMContentLoaded", () => {
  const gardeRobe   = document.getElementById("gardeRobe");
  const currentUser = localStorage.getItem("pseudo") || "inconnu";
  let vetements     = JSON.parse(localStorage.getItem("vetements")) || [];
  let favorites     = JSON.parse(localStorage.getItem("favorites")) || [];

  // Rend tous les vêtements
  function renderVetements(items) {
    gardeRobe.innerHTML = "";
    items.forEach(v => afficherVetement(v));
  }

  // Toggle favoris
  function toggleFavorite(id) {
    if (favorites.includes(id)) {
      favorites = favorites.filter(x => x !== id);
    } else {
      favorites.push(id);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderVetements(vetements);
  }

  // Affiche une carte
  function afficherVetement(v) {
    const isFav = favorites.includes(v.id);
    const card = document.createElement("div");
    card.className = "relative break-inside-avoid mb-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg shadow overflow-hidden p-2";

    card.innerHTML = `
      <img src="${v.image}" alt="${v.reference}" class="w-full rounded mb-2 object-contain transition-transform duration-300 hover:scale-105" />
      <h3 class="font-semibold text-lg">${v.reference}</h3>
      <p class="text-sm text-gray-600 dark:text-gray-300">${v.categorie} · ${v.saison}</p>
      <button data-id="${v.id}" 
              class="absolute top-2 right-2 text-xl focus:outline-none">
        ${isFav ? '❤️' : '♡'}
      </button>
      <a href="item.html?id=${v.id}" 
         class="absolute bottom-2 right-2 text-sm text-blue-500 hover:underline">
        ℹ️
      </a>
    `;

    // bookmark toggle listener
    card.querySelector("button[data-id]").addEventListener("click", e => {
      e.stopPropagation();
      toggleFavorite(v.id);
    });

    gardeRobe.appendChild(card);
  }

  // initial render
  renderVetements(vetements);

});
