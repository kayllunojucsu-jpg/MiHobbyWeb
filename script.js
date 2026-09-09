// Importar Firebase modular desde CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC2y7XEJn87_3qHJqXPBJu9Umz6oCp-Gdc",
  authDomain: "apuntologia-xp.firebaseapp.com",
  projectId: "apuntologia-xp",
  storageBucket: "apuntologia-xp.firebasestorage.app",
  messagingSenderId: "883040965448",
  appId: "1:883040965448:web:a2e0ed33deef10e59a997d",
  measurementId: "G-6XB71ZGFZC"
};
const app = initializeApp(firebaseConfig);

// Firestore
const db = getFirestore(app);

// Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Guardar nota
document.getElementById("btnGuardar").addEventListener("click", async () => {
  const texto = document.getElementById("campoNota").value;
  if (texto.trim() !== "") {
    await addDoc(collection(db, "notas"), {
      contenido: texto,
      fecha: new Date().toISOString()
    });
    document.getElementById("campoNota").value = "";
    mostrarNotas();
  }
});

// Login con Google
document.getElementById("loginBtn").addEventListener("click", () => {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("Usuario conectado:", result.user.email);

      // mostrar el correo en la página
      document.getElementById("usuario").textContent =
        "Conectado: " + result.user.email;
    })
    .catch((error) => {
      console.error("Error en login:", error);
    });
});

// Mostrar notas
async function mostrarNotas() {
    const lista = document.getElementById("listaNotas");
    lista.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "notas"));
    querySnapshot.forEach((docSnap) => {
        const li = document.createElement("li");
        li.textContent = docSnap.data().contenido;

        // Botón eliminar con contraseña
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";

        const CLAVE = "pompompurin67"; // 👈 tu contraseña fija

        btnEliminar.addEventListener("click", async () => {
            const claveIngresada = prompt("Ingresa la contraseña para borrar:");
            if (claveIngresada === CLAVE) {
                await deleteDoc(doc(db, "notas", docSnap.id));
                mostrarNotas();
            } else {
                alert("Contraseña incorrecta. No puedes borrar notas.");
            }
        });

        li.appendChild(btnEliminar);
        lista.appendChild(li);
    });
}

// Llamar al inicio
mostrarNotas();
