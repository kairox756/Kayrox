function verificarRuta(ruta) {
  fetch(ruta, { method: "HEAD" }) // solo pide cabeceras
    .then(response => {
      if (!response.ok) {
        window.location.href = "/Error 404/404.html";
      }
    })
    .catch(() => {
      window.location.href = "/Error 404/404.html";
    });
}

window.onload = function() {
  verificarRuta(window.location.pathname);
};