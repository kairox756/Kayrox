// auth.js

// Referencia a Firestore
const db = firebase.firestore();
const auth = firebase.auth();

// --- LOGIN ---
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const folio = loginForm["folio"].value;
    const password = loginForm["password"].value;

    try {
      // Autenticación con Firebase usando email simulado (folio@kayrox.com)
      const userCredential = await auth.signInWithEmailAndPassword(
        `${folio}@kayrox.com`,
        password
      );

      const user = userCredential.user;

      // Obtener rol desde Firestore
      const userDoc = await db.collection("users").doc(user.uid).get();
      const userData = userDoc.data();

      if (userData.role === "admin") {
        window.location.href = "admin_dashboard.html";
      } else {
        window.location.href = "collab_dashboard.html";
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
      const user = auth.currentUser;

      // Actualizar datos en Firestore
      await db.collection("users").doc(user.uid).update({
        name: name,
        birthdate: birthdate,
        role: role,
        project: project,
      });

      // Cambiar contraseña si se ingresó una nueva
      if (newPassword) {
        await user.updatePassword(newPassword);
      }

      document.getElementById("update-message").innerText =
        "Datos actualizados correctamente.";
    } catch (error) {
      document.getElementById("update-message").innerText =
        "Error al actualizar: " + error.message;
    }
  });
}