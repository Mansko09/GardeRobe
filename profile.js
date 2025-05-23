const total = document.getElementById("total");

const vetements = JSON.parse(localStorage.getItem("vetements")) || [];

total.textContent = `👕 Tu as ${vetements.length} vêtement(s) enregistré(s).`;


document.addEventListener("DOMContentLoaded", () => {
  const displayName = localStorage.getItem("displayName") || "Utilisateur";
  const pseudo      = localStorage.getItem("pseudo")      || "mon_pseudo";
  const nameEl      = document.getElementById("displayNameText");
  const pseudoEl    = document.getElementById("pseudoText");

  if (nameEl)   nameEl.textContent   = displayName;
  if (pseudoEl) pseudoEl.textContent = `@${pseudo}`;

  const profilePic = document.getElementById("profilePic");
  const profileInput = document.getElementById("photoProfil");

  const ageInput = document.getElementById("age");
  const poidsInput = document.getElementById("poids");
  const mensuInput = document.getElementById("mensurations");

  const fullBody = document.getElementById("fullBody");
  const upperBody = document.getElementById("upperBody");
  const backBody = document.getElementById("backBody");
  const face = document.getElementById("face");

  // Charger le thème si stocké
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
  }

  // Charger les données du profil
  if (localStorage.getItem("profilePic")) {
    profilePic.src = localStorage.getItem("profilePic");
  }
  ageInput.value = localStorage.getItem("age") || "";
  poidsInput.value = localStorage.getItem("poids") || "";
  mensuInput.value = localStorage.getItem("mensurations") || "";

  // Charger les images corps
  const setPreview = (id, imgId) => {
    const data = localStorage.getItem(id);
    if (data) {
      const img = document.createElement("img");
      img.src = data;
      img.className = "w-full mt-2 rounded shadow object-contain max-h-32";
      document.getElementById(imgId).after(img);
    }
  };
  setPreview("fullBody", "fullBody");
  setPreview("upperBody", "upperBody");
  setPreview("backBody", "backBody");
  setPreview("face", "face");

  // Enregistrer la photo de profil
  profileInput.addEventListener("change", () => {
    const file = profileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      localStorage.setItem("profilePic", e.target.result);
      profilePic.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Enregistrer les infos de base
  [ageInput, poidsInput, mensuInput].forEach(input => {
    input.addEventListener("change", () => {
      localStorage.setItem(input.id, input.value);
    });
  });

  // Sauver les 4 photos
  const saveImg = (input, key) => {
    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        localStorage.setItem(key, e.target.result);
        location.reload(); // pour mettre à jour la prévisualisation
      };
      reader.readAsDataURL(file);
    });
  };
  saveImg(fullBody, "fullBody");
  saveImg(upperBody, "upperBody");
  saveImg(backBody, "backBody");
  saveImg(face, "face");
});

const photos = [
  { type: "full",      data: fullBodyData },
  { type: "upper",     data: upperBodyData },
  { type: "back",      data: backData },
  { type: "face",      data: faceData }
];
localStorage.setItem("profilePhotos", JSON.stringify(photos));
