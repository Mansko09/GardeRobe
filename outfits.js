document.addEventListener("DOMContentLoaded", () => {
  const grid       = document.getElementById("itemsGrid");
  const preview    = document.getElementById("preview");
  const saveBtn    = document.getElementById("saveLook");
  const lookNameEl = document.getElementById("lookName");

  let vetements = JSON.parse(localStorage.getItem("vetements")) || [];
  let outfits   = JSON.parse(localStorage.getItem("outfits"))   || [];
  let selected  = new Set();

  // 1) Affiche toutes les pièces pour sélection
  vetements.forEach(v => {
    const wrapper = document.createElement("div");
    wrapper.className = "inline-block w-full mb-4 cursor-pointer relative";
    wrapper.innerHTML = `
      <img src="${v.image}" alt="${v.reference}"
           class="w-full rounded mb-2 object-contain"/>
      <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition"></div>
    `;
    // toggle sélection
    wrapper.addEventListener("click", () => {
      if (selected.has(v.id)) {
        selected.delete(v.id);
        wrapper.classList.remove("ring-4","ring-blue-400");
      } else {
        selected.add(v.id);
        wrapper.classList.add("ring-4","ring-blue-400");
      }
      renderPreview();
    });
    grid.appendChild(wrapper);
  });

  // 2) Affiche l'aperçu des pièces sélectionnées
  function renderPreview() {
    preview.innerHTML = "";
    // on superpose ou on aligne
    selected.forEach(id => {
      const v = vetements.find(x => x.id === id);
      const img = document.createElement("img");
      img.src = v.image;
      img.className = "absolute top-0 left-0 w-full h-full object-contain";
      preview.appendChild(img);
    });
  }

  // 3) Enregistrer la tenue
  saveBtn.addEventListener("click", () => {
    const name = lookNameEl.value.trim();
    if (!name || selected.size === 0) {
      return alert("Donnez un nom et sélectionnez au moins 1 pièce.");
    }
    const look = {
      id: Date.now(),
      name,
      items: Array.from(selected)
    };
    outfits.push(look);
    localStorage.setItem("outfits", JSON.stringify(outfits));
    window.location.href = "lookbook.html";
  });
});
