document.addEventListener("DOMContentLoaded", () => {
  const wardrobeItemsContainer = document.getElementById("wardrobeItems");
  const tryOnBtn               = document.getElementById("tryOnBtn");
  const resultContainer        = document.getElementById("tryOnResult");

  // 1) Récupère les vêtements et les photos de profil (full body) depuis localStorage
  const vetements     = JSON.parse(localStorage.getItem("vetements"))    || [];
  const profilePhotos = JSON.parse(localStorage.getItem("profilePhotos"))|| [];

  // On cherche la photo full-body
  const fullPhotoObj = profilePhotos.find(p => p.type === "fullBody");
  const userPhoto    = fullPhotoObj ? fullPhotoObj.data : null;

  let selectedItemImage = null;

  // 2) Affiche la liste des vêtements
  vetements.forEach(item => {
    const card = document.createElement("div");
    card.className = "cursor-pointer";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.nom}"
           class="w-full h-24 object-contain rounded border-2 mb-1" />
      <div class="text-xs text-center">${item.nom}</div>
    `;
    card.addEventListener("click", () => {
      selectedItemImage = item.image;
      // Visuel de sélection
      wardrobeItemsContainer.querySelectorAll("img")
        .forEach(img => img.classList.remove("border-blue-500"));
      card.querySelector("img").classList.add("border-blue-500");
    });
    wardrobeItemsContainer.appendChild(card);
  });

  // 3) Au clic sur "Essayer", on envoie à l'API Google Flash 2.5
  tryOnBtn.addEventListener("click", () => {
    if (!userPhoto) {
      alert("Aucune photo de profil 'full body' trouvée. Veuillez la télécharger dans votre profil.");
      return;
    }
    if (!selectedItemImage) {
      alert("Veuillez sélectionner un vêtement.");
      return;
    }

    resultContainer.innerHTML = `<p class="text-gray-500">Chargement…</p>`;

    fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=AIzaSyAadutuuWnzino3WcMwUf-syFh3MTTK4Ds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // On passe la photo full-body et l'image du vêtement
        userPhoto:    userPhoto,
        garmentImage: selectedItemImage
      })
    })
    .then(res => {
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      return res.json();
    })
    .then(data => {
      // Affiche le résultat renvoyé par l'API
      // (on suppose que l'API renvoie { resultUrl: "<url>" })
      resultContainer.innerHTML = `
        <img src="${data.resultUrl}" alt="Essayage final"
             class="mx-auto rounded shadow-lg max-w-full mt-4"/>
      `;
    })
    .catch(err => {
      console.error(err);
      resultContainer.innerHTML = `<p class="text-red-500">Une erreur est survenue lors de l’essayage.</p>`;
    });
  });
});
