document.addEventListener("DOMContentLoaded", () => {
  // ─── 1) Masonry / filtres / favoris ─────────────────────────────
  const gardeRobe    = document.getElementById("gardeRobe");
  const filterCat    = document.getElementById("filterCat");
  const filterSaison = document.getElementById("filterSaison");
  let vetements      = JSON.parse(localStorage.getItem("vetements")) || [];
  let favorites      = JSON.parse(localStorage.getItem("favorites")) || [];

  function renderVetements() {
    gardeRobe.innerHTML = "";
    const cat    = filterCat    ? filterCat.value    : "";
    const saison = filterSaison ? filterSaison.value : "";

    vetements
      .filter(v => !cat    || v.categorie === cat)
      .filter(v => !saison || v.saison    === saison)
      .forEach(v => afficherVetement(v));
  }

  function afficherVetement(v) {
    const isFav = favorites.includes(v.id);

    // wrapper inline-block pour Masonry
    const wrapper = document.createElement("div");
    wrapper.className = "inline-block w-full mb-4 cursor-pointer";
    wrapper.addEventListener("click", () => {
      window.location.href = `item.html?id=${v.id}`;
    });

    // carte
    const card = document.createElement("div");
    card.className = [
      "relative", "break-inside-avoid",
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
              class="absolute top-2 left-2 text-2xl focus:outline-none z-10">
        ${isFav 
          ? `<span class="text-red-500">❤️</span>`
          : `<span class="text-red-500">♡</span>`}
      </button>

      <!-- ℹ️ infos -->
      <span class="absolute bottom-2 right-2 text-xl text-blue-500 hover:text-blue-600">
        ℹ️
      </span>
    `;

    // toggle favoris (stop propagation pour ne pas naviguer)
    card.querySelector("button[data-id]").addEventListener("click", e => {
      e.stopPropagation();
      const id = Number(e.currentTarget.dataset.id);
      favorites = favorites.includes(id)
        ? favorites.filter(x => x !== id)
        : [...favorites, id];
      localStorage.setItem("favorites", JSON.stringify(favorites));
      renderVetements();
    });

    wrapper.appendChild(card);
    gardeRobe.appendChild(wrapper);
  }

  if (filterCat)    filterCat.addEventListener("change", renderVetements);
  if (filterSaison) filterSaison.addEventListener("change", renderVetements);
  renderVetements();

  // ─── 2) Modal “Ajouter un vêtement” ─────────────────────────────
  const openBtn      = document.getElementById("openAddModal");
  const closeBtn     = document.getElementById("closeAddModal");
  const modal        = document.getElementById("addModal");
  const addForm      = document.getElementById("addForm");
  const imageInput   = document.getElementById("imageInput");
  const previewImg   = document.getElementById("itemImagePreview");

  // Ouvrir / fermer
  openBtn .addEventListener("click", () => modal.classList.remove("hidden"));
  closeBtn.addEventListener("click", () => modal.classList.add("hidden"));

  // Aperçu live de l’image
  imageInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const rdr = new FileReader();
    rdr.onload = evt => {
      previewImg.src = evt.target.result;
      previewImg.classList.remove("hidden");
    };
    rdr.readAsDataURL(file);
  });

  // Soumission du formulaire
  addForm.addEventListener("submit", e => {
    e.preventDefault();

    // debug rapide
    console.log("Add form submitted");

    const reference = document.getElementById("reference").value.trim();
    const marque    = document.getElementById("marque").value.trim();
    const categorie = document.getElementById("categorie").value;
    const saison    = document.getElementById("Saison").value;

    if (!imageInput.files.length) {
      alert("Veuillez sélectionner une photo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = ev => {
      // 1) ajoute au tableau
      vetements.push({
        id: Date.now(),
        reference,
        marque,
        categorie,
        saison,
        image: ev.target.result,
        owner: localStorage.getItem("pseudo") || "inconnu"
      });
      localStorage.setItem("vetements", JSON.stringify(vetements));

      // 2) reset, masque modal, ré-affiche
      addForm.reset();
      previewImg.classList.add("hidden");
      modal.classList.add("hidden");
      renderVetements();
    };
    reader.readAsDataURL(imageInput.files[0]);
  });

  // ─── 3) + Plus d’options (si tu as ce bouton) ───────────────────
  const toggleBtn   = document.getElementById("toggleOptions");
  const moreOptions = document.getElementById("moreOptions");
  if (toggleBtn && moreOptions) {
    toggleBtn.addEventListener("click", () => {
      const hidden = moreOptions.classList.toggle("hidden");
      toggleBtn.textContent = hidden
        ? "+ Plus d’options"
        : "– Moins d’options";
    });
  }
});
