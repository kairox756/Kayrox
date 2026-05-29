// tasks.js

const db = firebase.firestore();
const auth = firebase.auth();

// --- Cargar tareas ---
async function loadTasks() {
  try {
    const snapshot = await db.collection("tasks").get();
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    snapshot.forEach((doc) => {
      const task = doc.data();
      const li = document.createElement("li");
      li.textContent = `Título: ${task.title} | Proyecto: ${task.projectId} | Asignado a: ${task.assignedTo} | Estado: ${task.status}`;

      // Botón actualizar
      const updateBtn = document.createElement("button");
      updateBtn.textContent = "Actualizar";
      updateBtn.onclick = () => updateTask(doc.id, task);

      // Botón eliminar
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Eliminar";
      deleteBtn.onclick = () => deleteTask(doc.id);

      li.appendChild(updateBtn);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  } catch (error) {
    console.error("Error al cargar tareas:", error);
  }
}

// --- Asignar tarea ---
const assignTaskBtn = document.getElementById("assignTaskBtn");
if (assignTaskBtn) {
  assignTaskBtn.addEventListener("click", async () => {
    const title = prompt("Título de la tarea:");
    const projectId = prompt("ID del proyecto:");
    const assignedTo = prompt("ID del colaborador:");

    if (title && projectId && assignedTo) {
      try {
        await db.collection("tasks").add({
          title: title,
          projectId: projectId,
          assignedTo: assignedTo,
          status: "pendiente",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        loadTasks();
      } catch (error) {
        console.error("Error al asignar tarea:", error);
      }
    }
  });
}

// --- Actualizar tarea ---
async function updateTask(taskId, taskData) {
  const newTitle = prompt("Nuevo título:", taskData.title);
  const newStatus = prompt("Nuevo estado (pendiente/en progreso/completada):", taskData.status);

  if (newTitle && newStatus) {
    try {
      await db.collection("tasks").doc(taskId).update({
        title: newTitle,
        status: newStatus,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      loadTasks();
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
    }
  }
}

// --- Eliminar tarea ---
async function deleteTask(taskId) {
  if (confirm("¿Seguro que deseas eliminar esta tarea?")) {
    try {
      await db.collection("tasks").doc(taskId).delete();
      loadTasks();
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  }
}

// --- Inicializar panel administrador ---
auth.onAuthStateChanged((user) => {
  if (user) {
    loadTasks();
  } else {
    window.location.href = "index.html"; // Redirigir si no está logueado
  }
});