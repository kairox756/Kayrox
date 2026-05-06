// script.js
function verificarRuta(ruta) {
  fetch(ruta)
    .then(response => {
      if (!response.ok) {
        window.location.href = "/Error 404/404.html";
      }
    })
    .catch(() => {
      window.location.href = "/Error 404/404.html";
    });
}

// Ejemplo: verificar que exista la página actual
window.onload = function() {
  // Aquí puedes comprobar un archivo específico o la ruta actual
  verificarRuta(window.location.pathname);
};