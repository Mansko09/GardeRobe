document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const nom = document.getElementById("nom").value.trim();
      const reference=document.getElementById("reference").value.trim();
      const marque = document.getElementById("marque").value.trim();
      const categorie = document.getElementById("categorie").value;
      const saison = document.getElementById("Saison").value;
      const imageInput = document.getElementById("image");

      if (!imageInput.files.length) return;

      const reader = new FileReader();
      reader.onload = function (event) {
        const vetement = {
          id: Date.now(),
          nom,
          reference,
          marque,
          categorie,
          saison,
          image: event.target.result
        };

        let vetements = JSON.parse(localStorage.getItem("vetements")) || [];
        vetements.push(vetement);
        localStorage.setItem("vetements", JSON.stringify(vetements));

        window.location.href = "index.html";
      };

      reader.readAsDataURL(imageInput.files[0]);
    });
  }

});
