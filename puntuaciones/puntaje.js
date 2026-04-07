import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
// 1. Importamos las funciones necesarias
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDFp1zxnhqGNh2J2rVsKpydvrr-7AtGW50",
    authDomain: "juego-serpiente-62d20.firebaseapp.com",
    databaseURL: "https://juego-serpiente-62d20-default-rtdb.firebaseio.com",
    projectId: "juego-serpiente-62d20",
    storageBucket: "juego-serpiente-62d20.firebasestorage.app",
    messagingSenderId: "87032827699",
    appId: "1:87032827699:web:dd8d2282d0f3ecbc05b846",
    measurementId: "G-VX5Y6EG3JV"
};

// 2. Inicializamos Firebase y la Base de Datos
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // <-- ESTO FALTABA

// Cargar ranking
async function loadRanking() {
    try {
        // 3. Usamos la variable 'db' que definimos arriba
        const snapshot = await get(child(ref(db), 'scores'));
        
        if (snapshot.exists()) {
            const scores = Object.values(snapshot.val());
            scores.sort((a, b) => b.score - a.score);
            const top10 = scores.slice(0, 10);

            const list = document.getElementById("ranking-list");
            list.innerHTML = "";
            top10.forEach((s, i) => {
                const li = document.createElement("li");
                li.innerHTML = `<span class="player">${i+1}. ${s.name || "Anónimo"}</span> <span class="score">${s.score}</span>`;
                list.appendChild(li);
            });
        } else {
            const list = document.getElementById("ranking-list");
            if(list) list.innerHTML = "<li>No hay puntajes aún</li>";
        }
    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

loadRanking();