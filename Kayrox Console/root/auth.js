// auth.js (solo folio y contraseña)

const db = firebase.firestore();

// --- LOGIN ---
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const folio = loginForm["folio"].value;
    const password = loginForm["password"].value;

    try {
      // Buscar usuario por folio en Firestore
      const snapshot = await db.collection("usuarios")
        .where("folio", "==", folio)
        .limit(1)
        .get();

      if (snapshot.empty) {
        document.getElementById("error-message").innerText =
          "Folio no encontrado.";
        return;
      }

      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();

      // Validar contraseña (aquí se compara directamente, si usas hash deberías verificar con bcrypt en backend)
      if (userData.password !== password) {
        document.getElementById("error-message").innerText =
          "Contraseña incorrecta.";
        return;
      }

      // Redirección según rol
      if (userData.rol === "admin") {
        window.location.href = "admin_dashboard.html";
      } else if (userData.rol === "colaborador") {
        window.location.href = "collab_dashboard.html";
      } else {
        document.getElementById("error-message").innerText =
          "Rol inválido o no definido.";
      }
    } catch (error) {
      document.getElementById("error-message").innerText =
        "Error en login: " + error.message;
    }
  });
}

// --- ACTUALIZACIÓN DE PERFIL ---
const configForm = document.getElementById("configForm");
if (configForm) {
  configForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = configForm["name"].value;
    const birthdate = configForm["birthdate"].value;
    const role = configForm["role"].value;
    const project = configForm["project"].value;
    const newPassword = configForm["password"].value;

    try {
      // Buscar usuario por folio
      const folio = configForm["folio"].value;
      const snapshot = await db.collection("usuarios")
        .where("folio", "==", folio)
        .limit(1)
        .get();

      if (snapshot.empty) {
        document.getElementById("update-message").innerText =
          "Usuario no encontrado.";
        return;
      }

      const userDoc = snapshot.docs[0];

      // Actualizar datos en Firestore
      await db.collection("usuarios").doc(userDoc.id).update({
        nombre: name,
        fecha_nacimiento: birthdate,
        rol: role,
        proyecto_asignado: project,
        ...(newPassword && { password: newPassword }) // actualizar contraseña si se ingresó
      });

      document.getElementById("update-message").innerText =
        "Datos actualizados correctamente.";
    } catch (error) {
      document.getElementById("update-message").innerText =
        "Error al actualizar: " + error.message;
    }
  });
}