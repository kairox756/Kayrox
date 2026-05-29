// projects.js

const db = firebase.firestore();
const auth = firebase.auth();

// --- Cargar proyectos ---
async function loadProjects() {
  try {
    const snapshot = await db.collection("projects").get();
    const projectList = document.getElementById("project-list");
    projectList.innerHTML = "";

    snapshot.forEach((doc) => {
      const project = doc.data();
      const li = document.createElement("li");
      li.textContent = `${project.name} - ${project.description}`;

      // Botón eliminar
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Eliminar";
      deleteBtn.onclick = () => deleteProject(doc.id);

      // Botón actualizar
      const updateBtn = document.createElement("button");
      updateBtn.textContent = "Actualizar";
      updateBtn.onclick = () => updateProject(doc.id, project);

      li.appendChild(updateBtn);
      li.appendChild(deleteBtn);
      projectList.appendChild(li);
    });
  } catch (error) {
    console.error("Error al cargar proyectos:", error);
  }
}

// --- Agregar proyecto ---
const addProjectBtn = document.getElementById("addProjectBtn");
if (addProjectBtn) {
  addProjectBtn.addEventListener("click", async () => {
    const name = prompt("Nombre del proyecto:");
    const description = prompt("Descripción del proyecto:");

    if (name && description) {
      try {
        await db.collection("projects").add({
          name: name,
          description: description,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        loadProjects();
      } catch (error) {
        console.error("Error al agregar proyecto:", error);
      }
    }
  });
}

// --- Actualizar proyecto ---
async function updateProject(projectId, projectData) {
  const newName = prompt("Nuevo nombre:", projectData.name);
  const newDescription = prompt("Nueva descripción:", projectData.description);

  if (newName && newDescription) {
    try {
      await db.collection("projects").doc(projectId).update({
        name: newName,
        description: newDescription,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      loadProjects();
    } catch (error) {
      console.error("Error al actualizar proyecto:", error);
    }
  }
}

// --- Eliminar proyecto ---
async function deleteProject(projectId) {
  if (confirm("¿Seguro que deseas eliminar este proyecto?")) {
    try {
      await db.collection("projects").doc(projectId).delete();
      loadProjects();
    } catch (error) {
      console.error("Error al eliminar proyecto:", error);
    }
  }
}

// --- Inicializar panel administrador ---
auth.onAuthStateChanged((user) => {
  if (user) {
    loadProjects();
  } else {
    window.location.href = "index.html"; // Redirigir si no está logueado
  }
});