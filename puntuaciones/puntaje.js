// 1. Importaciones corregidas (Solo lo necesario para que funcione el ranking)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

// 2. Configuración (Tus credenciales)
const firebaseConfig = {
    apiKey: "AIzaSyDFp1zxnhqGNh2J2rVsKpydvrr-7AtGW50",
    authDomain: "juego-serpiente-62d20.firebaseapp.com",
    databaseURL: "https://juego-serpiente-62d20-default-rtdb.firebaseio.com",
    projectId: "juego-serpiente-62d20",
    storageBucket: "juego-serpiente-62d20.firebasestorage.app",
    messagingSenderId: "87032827699",
    appId: "1:87032827699:web:dd8d2282d0f3ecbc05b846",
    measurementId: "G-VX5Y5EG3JV"
};

// 3. Inicialización CRÍTICA
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // <--- SIN ESTO, 'get' NO SABE A DÓNDE IR

// 4. Función de carga con manejo de errores
async function loadRanking() {
    try {
        // Referencia a la base de datos usando 'db' y 'scores'
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, 'scores'));

        const list = document.getElementById("ranking-list");
        if (!list) return; // Seguridad por si el ID no existe en el HTML

        if (snapshot.exists()) {
            const data = snapshot.val();
            // Convertimos el objeto de Firebase en una lista (Array)
            const scores = Object.keys(data).map(key => data[key]);

            // Ordenar de mayor a menor
            scores.sort((a, b) => b.score - a.score);
            const top10 = scores.slice(0, 10);

            list.innerHTML = "";
            top10.forEach((s, i) => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <span class="player">${i + 1}. ${s.name || "Anónimo"}</span> 
                    <span class="score">${s.score} pts</span>
                `;
                list.appendChild(li);
            });
        } else {
            list.innerHTML = "<li>No hay puntajes registrados aún.</li>";
        }
    } catch (error) {
        console.error("Error detallado de Firebase:", error);
        const list = document.getElementById("ranking-list");
        if (list) list.innerHTML = "<li>Error al conectar con la base de datos.</li>";
    }
}

// 5. Ejecutar la función
loadRanking();