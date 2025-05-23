document.addEventListener("DOMContentLoaded", () => {
  const params     = new URLSearchParams(window.location.search);
  const id         = Number(params.get("id"));
  const detail     = document.getElementById("itemDetail");
  let vetements    = JSON.parse(localStorage.getItem("vetements")) || [];

  // Récupère l'item
  const item = vetements.find(v => v.id === id);
  if (!item) {
    detail.innerHTML = "<p class='text-center text-red-500'>Élément introuvable.</p>";
    return;
  }

  // Fonction pour (re)rendre le détail avec boutons
  function renderDetail(v) {
    detail.innerHTML = `
      <img src="${v.image}" alt="${v.nom}"
        class="w-full rounded shadow mb-4 object-contain max-h-96" />
      <h2 class="text-xl font-bold">${v.nom}</h2>
      <p class="text-sm text-gray-600 dark:text-gray-300">Référence : ${v.reference}</p>
      <p class="text-sm text-gray-600 dark:text-gray-300">Marque : ${v.marque}</p>
      <p class="text-sm text-gray-600 dark:text-gray-300">Catégorie : ${v.categorie}</p>
      <p class="text-sm text-gray-600 dark:text-gray-300">Saison : ${v.saison}</p>
      <div class="flex gap-2 mt-4">
        <button id="editBtn"
          class="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition">
          ✏️ Modifier
        </button>
        <button id="deleteBtn"
          class="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition">
          🗑️ Supprimer
        </button>
      </div>
    `;

    // Supprimer
    document.getElementById("deleteBtn").addEventListener("click", () => {
      if (confirm("Êtes-vous sûr de vouloir le supprimer ?")) {
        vetements = vetements.filter(x => x.id !== id);
        localStorage.setItem("vetements", JSON.stringify(vetements));
        window.location.href = "index.html";
      }
    });

    // Modifier
    document.getElementById("editBtn").addEventListener("click", () => {
      showEditForm(v);
    });
  }

  // Affiche le formulaire d'édition
  function showEditForm(v) {
    detail.innerHTML = `
      <form id="editForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium">Nom</label>
          <input type="text" id="editNom" value="${v.nom}"
            class="w-full p-2 border rounded dark:bg-gray-800 dark:text-white" required>
        </div>
        <div>
          <label class="block text-sm font-medium">Référence</label>
          <input type="text" id="editReference" value="${v.reference}"
            class="w-full p-2 border rounded dark:bg-gray-800 dark:text-white" >
        </div>
        <div>
          <label class="block text-sm font-medium">Marque</label>
          <input type="text" id="editMarque" value="${v.marque}"
            class="w-full p-2 border rounded dark:bg-gray-800 dark:text-white">
        </div>
        <div>
          <label class="block text-sm font-medium">Catégorie</label>
          <select id="editCategorie"
            class="w-full p-2 border rounded dark:bg-gray-800 dark:text-white">
            <option ${v.categorie === "Robe"        ? "selected" : ""}>Robe</option>
            <option ${v.categorie === "Haut"        ? "selected" : ""}>Haut</option>
            <option ${v.categorie === "Bas"         ? "selected" : ""}>Bas</option>
            <option ${v.categorie === "Chaussures"  ? "selected" : ""}>Chaussures</option>
            <option ${v.categorie === "Accessoire"  ? "selected" : ""}>Accessoire</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium">Saison</label>
          <select id="editSaison"
            class="w-full p-2 border rounded dark:bg-gray-800 dark:text-white">
            <option ${v.saison === "Été"          ? "selected" : ""}>Été</option>
            <option ${v.saison === "Hiver"        ? "selected" : ""}>Hiver</option>
            <option ${v.saison === "Automne"      ? "selected" : ""}>Automne</option>
            <option ${v.saison === "Printemps"    ? "selected" : ""}>Printemps</option>
            <option ${v.saison === "Inter-saison" ? "selected" : ""}>Inter-saison</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium">Changer l’image</label>
          <input type="file" id="editImage" accept="image/*"
            class="w-full p-2 border rounded bg-white dark:bg-gray-800">
        </div>
        <div class="flex gap-2">
          <button type="submit"
            class="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
            💾 Enregistrer
          </button>
          <button type="button" id="cancelBtn"
            class="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition">
            ❌ Annuler
          </button>
        </div>
      </form>
    `;

    // Annuler
    document.getElementById("cancelBtn").addEventListener("click", () => {
      renderDetail(v);
    });

    // Soumettre les modifications
    document.getElementById("editForm").addEventListener("submit", e => {
      e.preventDefault();

      const newNom       = document.getElementById("editNom").value.trim();
      const newReference = document.getElementById("editReference").value.trim();
      const newMarque    = document.getElementById("editMarque").value.trim();
      const newCategorie = document.getElementById("editCategorie").value;
      const newSaison    = document.getElementById("editSaison").value;
      const fileInput    = document.getElementById("editImage");

      function applyChanges(imageData) {
        // Met à jour l'objet et le stockage
        v.nom       = newNom;
        v.reference= newReference;
        v.marque    = newMarque;
        v.categorie = newCategorie;
        v.saison    = newSaison;
        v.image     = imageData;
        localStorage.setItem("vetements", JSON.stringify(vetements));
        renderDetail(v);
      }

      if (fileInput.files.length) {
        const reader = new FileReader();
        reader.onload = evt => applyChanges(evt.target.result);
        reader.readAsDataURL(fileInput.files[0]);
      } else {
        applyChanges(v.image);
      }
    });
  }

  // Premier rendu
  renderDetail(item);
});
