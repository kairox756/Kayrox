// collaborators.js

const db = firebase.firestore();
const auth = firebase.auth();

// --- Cargar proyectos asignados ---
async function loadProjects() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const userDoc = await db.collection("users").doc(user.uid).get();
    const userData = userDoc.data();

    const projectsRef = db.collection("projects").where("assignedTo", "==", user.uid);
    const snapshot = await projectsRef.get();

    const projectList = document.getElementById("project-list");
    projectList.innerHTML = "";

    snapshot.forEach((doc) => {
      const project = doc.data();
      const li = document.createElement("li");
      li.textContent = `${project.name} - ${project.description}`;
      projectList.appendChild(li);
    });
  } catch (error) {
    console.error("Error al cargar proyectos:", error);
  }
}

// --- Cargar tareas asignadas ---
async function loadTasks() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const tasksRef = db.collection("tasks").where("assignedTo", "==", user.uid);
    const snapshot = await tasksRef.get();

    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    snapshot.forEach((doc) => {
      const task = doc.data();
      const li = document.createElement("li");
      li.textContent = `${task.title} - Estado: ${task.status}`;
      taskList.appendChild(li);
    });
  } catch (error) {
    console.error("Error al cargar tareas:", error);
  }
}

// --- Entregar avances ---
const progressForm = document.getElementById("progressForm");
if (progressForm) {
  progressForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const taskId = progressForm["taskId"].value;
    const progressText = progressForm["progressText"].value;

    try {
      await db.collection("reports").add({
        taskId: taskId,
        progress: progressText,
        userId: auth.currentUser.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

      document.getElementById("progress-message").innerText =
        "Avance enviado correctamente.";
      progressForm.reset();
    } catch (error) {
      document.getElementById("progress-message").innerText =
        "Error al enviar avance: " + error.message;
    }
  });
}

// --- Notificaciones en tiempo real ---
function loadNotifications() {
  const user = auth.currentUser;
  if (!user) return;

  db.collection("notifications")
    .where("userId", "==", user.uid)
    .onSnapshot((snapshot) => {
      const notificationList = document.getElementById("notification-list");
      notificationList.innerHTML = "";

      snapshot.forEach((doc) => {
        const notif = doc.data();
        const li = document.createElement("li");
        li.textContent = notif.message;
        notificationList.appendChild(li);
      });
    });
}

// --- Inicializar panel colaborador ---
auth.onAuthStateChanged((user) => {
  if (user) {
    loadProjects();
    loadTasks();
    loadNotifications();
  } else {
    window.location.href = "index.html"; // Redirigir si no está logueado
  }
});