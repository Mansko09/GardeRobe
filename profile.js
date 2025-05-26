// Affiche le nombre total de vêtements
const totalEl    = document.getElementById("total");
const vetements  = JSON.parse(localStorage.getItem("vetements")) || [];
totalEl.textContent = `👕 Tu as ${vetements.length} vêtement(s) enregistré(s).`;

document.addEventListener("DOMContentLoaded", () => {
  // — Affichage du nom et du pseudo —
  const displayName = localStorage.getItem("displayName") || "Utilisateur";
  const pseudo      = localStorage.getItem("pseudo")      || "mon_pseudo";
  document.getElementById("displayNameText").textContent = displayName;
  document.getElementById("pseudoText").textContent      = `@${pseudo}`;

  // — Thème sombre si besoin —
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
  }

  // — Photo de profil —
  const profilePic   = document.getElementById("profilePic");
  const profileInput = document.getElementById("photoProfil");
  const storedPic    = localStorage.getItem("profilePic");
  if (storedPic) profilePic.src = storedPic;

  profileInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      localStorage.setItem("profilePic", evt.target.result);
      profilePic.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  });

  // — Infos personnelles —
  ["age", "poids", "mensurations"].forEach(id => {
    const input = document.getElementById(id);
    input.value = localStorage.getItem(id) || "";
    input.addEventListener("change", () => {
      localStorage.setItem(id, input.value);
    });
  });

  // — Section “Mon corps” interactive —
  const parts = [
    { btn: "fullBodyBtn",  input: "fullBodyInput",  preview: "fullBodyPreview",  type: "full"  },
    { btn: "upperBodyBtn", input: "upperBodyInput", preview: "upperBodyPreview", type: "upper" },
    { btn: "backBodyBtn",  input: "backBodyInput",  preview: "backBodyPreview",  type: "back"  },
    { btn: "faceBtn",      input: "faceInput",      preview: "facePreview",      type: "face"  },
  ];

  // 1) Charger les photos existantes
  const storedPhotos = JSON.parse(localStorage.getItem("profilePhotos")) || [];
  storedPhotos.forEach(p => {
    const cfg = parts.find(x => x.type === p.type);
    if (cfg) {
      const img = document.getElementById(cfg.preview);
      img.src = p.data;
      img.classList.remove("hidden");
    }
  });

  // 2) Rendre chaque bouton interactif avec son input & preview
  parts.forEach(({ btn, input, preview, type }) => {
    const b   = document.getElementById(btn);
    const inp = document.getElementById(input);
    const img = document.getElementById(preview);

    if (!b || !inp || !img) return;

    // Clic sur le bouton → ouvrir le file picker
    b.addEventListener("click", () => inp.click());

    // Choix du fichier → sauvegarde + preview
    inp.addEventListener("change", e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = evt => {
        // Met à jour localStorage
        let arr = JSON.parse(localStorage.getItem("profilePhotos")) || [];
        arr = arr.filter(x => x.type !== type);
        arr.push({ type, data: evt.target.result });
        localStorage.setItem("profilePhotos", JSON.stringify(arr));
        // Met à jour l’aperçu
        img.src = evt.target.result;
        img.classList.remove("hidden");
      };
      reader.readAsDataURL(file);
    });
  });

  // — Boutons de suppression —
const deleteConfig = [
  { btn: "deleteFullBodyBtn", type: "full",  preview: "fullBodyPreview" },
  { btn: "deleteUpperBodyBtn", type: "upper", preview: "upperBodyPreview" },
  { btn: "deleteBackBodyBtn",  type: "back",  preview: "backBodyPreview" },
  { btn: "deleteFaceBtn",      type: "face",  preview: "facePreview" }
];

deleteConfig.forEach(({ btn, type, preview }) => {
  const delBtn = document.getElementById(btn);
  const img    = document.getElementById(preview);
  if (!delBtn || !img) return;
  delBtn.addEventListener("click", () => {
    if (!confirm("Supprimer cette photo ?")) return;
    // 1) Retirer du storage
    let arr = JSON.parse(localStorage.getItem("profilePhotos")) || [];
    arr = arr.filter(x => x.type !== type);
    localStorage.setItem("profilePhotos", JSON.stringify(arr));
    // 2) Cacher l’aperçu
    img.src = "";
    img.classList.add("hidden");
  });
});
});
