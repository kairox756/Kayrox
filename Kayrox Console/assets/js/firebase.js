// firebase.js

// Configuración de Firebase (reemplaza con tus credenciales)
const firebaseConfig = {
    
    apiKey: "AIzaSyBps4a6CxXbddScEwncmO37vSiHWceNR1Q",
    authDomain: "kayrox-17b10.firebaseapp.com",
    projectId: "kayrox-17b10",
    storageBucket: "kayrox-17b10.firebasestorage.app",
    messagingSenderId: "926965928296",
    appId: "1:926965928296:web:7d4a3f769be66852b086dd",
    measurementId: "G-1HHKTMQQWC"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar servicios
const auth = firebase.auth();
const db = firebase.firestore();
