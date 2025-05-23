document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const pseudo = params.get("pseudo");
  const userPseudo = document.getElementById("userPseudo");
  const userAvatar = document.getElementById("userAvatar");
  const wardrobeDiv = document.getElementById("userWardrobe");

  if (!pseudo) {
    userPseudo.textContent = "Utilisateur introuvable";
    return;
  }

  // Récupère les infos utilisateurs
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.pseudo === pseudo);

  if (!user) {
    userPseudo.textContent = "Utilisateur introuvable";
    return;
  }

  userPseudo.textContent = user.pseudo;
  userAvatar.src = user.avatar || "https://via.placeholder.com/100";

  // Récupère et affiche ses vêtements
  const vetements = JSON.parse(localStorage.getItem("vetements")) || [];
  const userItems = vetements.filter(v => v.pseudo === pseudo && v.public !== false); // publics uniquement

  if (userItems.length === 0) {
    wardrobeDiv.innerHTML = "<p class='text-gray-500 text-sm'>Aucun vêtement public.</p>";
    return;
  }

  userItems.forEach(v => {
    const card = document.createElement("div");
    card.className = "break-inside-avoid mb-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg shadow overflow-hidden p-2";

    card.innerHTML = `
      <img src="${v.image}" alt="${v.nom}" class="w-full object-contain mb-2 rounded">
      <h3 class="font-semibold text-sm">${v.nom}</h3>
      <p class="text-xs text-gray-500">${v.categorie} - ${v.saison}</p>
    `;

    wardrobeDiv.appendChild(card);
  });
});
