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
});
