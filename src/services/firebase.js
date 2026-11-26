// Importamos initializeApp para conectar nuestra app con el proyecto de Firebase
import { initializeApp } from "firebase/app";
// Importamos las funciones de autenticación y los proveedores de Google y GitHub
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";

// Objeto de configuración con las credenciales del proyecto de Firebase de la materia
const firebaseConfig = {
  apiKey: "AIzaSyD8DDXtLPHTXa1D8YsmsX9QJJmTkwIdltE",
  authDomain: "dwn3ap-2026-2.firebaseapp.com",
  projectId: "dwn3ap-2026-2",
  storageBucket: "dwn3ap-2026-2.firebasestorage.app",
  messagingSenderId: "873802122605",
  appId: "1:873802122605:web:d1fcdc903434bf058ec664"
};

// Inicializamos la aplicación de Firebase y la exportamos
export const app = initializeApp(firebaseConfig);

// Inicializamos el servicio de Autenticación de Firebase y lo exportamos
export const auth = getAuth(app)

// Creamos y exportamos las instancias de los proveedores para iniciar sesión con ventana emergente (popup)
export const googleProvider = new GoogleAuthProvider()
export const githubProvider = new GithubAuthProvider()
