// reports.js

const db = firebase.firestore();
const auth = firebase.auth();

// --- Cargar reportes ---
async function loadReports() {
  try {
    const snapshot = await db.collection("reports")
      .orderBy("timestamp", "desc")
      .get();

    const reportList = document.getElementById("report-list");
    reportList.innerHTML = "";

    snapshot.forEach((doc) => {
      const report = doc.data();
      const li = document.createElement("li");
      li.textContent = `Tarea: ${report.taskId} | Usuario: ${report.userId} | Avance: ${report.progress} | Fecha: ${report.timestamp?.toDate().toLocaleString()}`;
      reportList.appendChild(li);
    });
  } catch (error) {
    console.error("Error al cargar reportes:", error);
  }
}

// --- Generar reporte consolidado ---
async function generateProjectReport(projectId) {
  try {
    const tasksRef = db.collection("tasks").where("projectId", "==", projectId);
    const tasksSnapshot = await tasksRef.get();

    let reportData = `Reporte del proyecto ${projectId}\n\n`;

    for (const taskDoc of tasksSnapshot.docs) {
      const task = taskDoc.data();
      reportData += `Tarea: ${task.title} - Estado: ${task.status}\n`;

      const reportsRef = db.collection("reports").where("taskId", "==", taskDoc.id);
      const reportsSnapshot = await reportsRef.get();

      reportsSnapshot.forEach((reportDoc) => {
        const report = reportDoc.data();
        reportData += `   Avance: ${report.progress} | Usuario: ${report.userId} | Fecha: ${report.timestamp?.toDate().toLocaleString()}\n`;
      });

      reportData += "\n";
    }

    console.log(reportData); // Aquí podrías exportar a PDF o CSV en el futuro
    alert("Reporte generado en consola.");
  } catch (error) {
    console.error("Error al generar reporte:", error);
  }
}

// --- Inicializar panel administrador ---
auth.onAuthStateChanged((user) => {
  if (user) {
    loadReports();
  } else {
    window.location.href = "index.html"; // Redirigir si no está logueado
  }
});