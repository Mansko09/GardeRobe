document.addEventListener("DOMContentLoaded", () => {
  const params         = new URLSearchParams(window.location.search);
  const pseudo         = params.get("pseudo");
  const userNameEl     = document.getElementById("userName");
  const userAvatarEl   = document.getElementById("userAvatar");
  const wardrobeDiv    = document.getElementById("userWardrobe");

  if (!pseudo) {
    userNameEl.textContent = "Utilisateur introuvable";
    return;
  }

  // 1) Afficher nom & avatar
  // On stocke displayName et avatar dans localStorage / profilePhotos
  const displayName = localStorage.getItem("displayName") || "";
  userNameEl.textContent = displayName
    ? `${displayName} (@${pseudo})`
    : `@${pseudo}`;

  // On récupère la photo de visage si elle existe dans profilePhotos
  const photos = JSON.parse(localStorage.getItem("profilePhotos")) || [];
  const facePhoto = photos.find(p => p.type === "face");
  userAvatarEl.src = facePhoto?.data || "https://via.placeholder.com/100";

  // 2) Filtrer et afficher les vêtements publics de cet utilisateur
  const allVetements = JSON.parse(localStorage.getItem("vetements")) || [];
  const userItems = allVetements.filter(v =>
    v.owner === pseudo && (v.public ?? true)
  );

  if (userItems.length === 0) {
    wardrobeDiv.innerHTML = `
      <p class="text-gray-500 text-sm text-center">
        Cet utilisateur n’a aucun vêtement public.
      </p>
    `;
    return;
  }

  userItems.forEach(v => {
    // wrapper <a> vers item.html?id=…
    const link = document.createElement("a");
    link.href = `item.html?id=${v.id}`;
    link.className = "block";

    const card = document.createElement("div");
    card.className =
      "break-inside-avoid mb-4 bg-white dark:bg-gray-800 text-gray-800 " +
      "dark:text-white rounded-lg shadow overflow-hidden p-2 cursor-pointer";

    card.innerHTML = `
      <img src="${v.image}" alt="${v.nom}"
        class="w-full h-auto object-contain mb-2 rounded" />
      <h3 class="font-semibold text-sm">${v.nom}</h3>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        ${v.categorie} · ${v.saison}
      </p>
    `;

    link.appendChild(card);
    wardrobeDiv.appendChild(link);
  });
});
