// Importamos signInWithPopup de Firebase para abrir la ventana emergente de login
import { signInWithPopup } from "firebase/auth"
// Importamos la configuración de auth y los proveedores desde nuestro archivo firebase.js
import { auth, githubProvider, googleProvider } from "./firebase"

// Función auxiliar para conservar los favoritos que el usuario ya haya guardado en localStorage antes de loguearse
function obtenerFavoritosPrevios() {
  const guardado = JSON.parse(localStorage.getItem("perfil"))
  return guardado?.favoritos || []
}

// Función asíncrona para iniciar sesión con una cuenta de Google
export async function loginGoogle(){
  // Abre el popup de Google y espera a que el usuario elija su cuenta
  const result = await signInWithPopup(auth, googleProvider)
  // Armamos un objeto sencillo con los datos principales del usuario autenticado y sus favoritos previos
  const perfil = {
    uid: result.user.uid,               // ID único del usuario en Firebase
    nombre: result.user.displayName,    // Nombre completo del usuario
    email: result.user.email,          // Correo electrónico
    photoURL: result.user.photoURL,     // URL de su foto de perfil
    favoritos: obtenerFavoritosPrevios() // Conserva la lista de favoritos existente
  }

  // Guardamos el perfil en localStorage convertido a texto JSON para mantener la sesión y sus favoritos
  localStorage.setItem("perfil", JSON.stringify(perfil))
  // Retornamos el objeto perfil a la vista LoginView
  return perfil
}

// Función asíncrona para iniciar sesión con una cuenta de GitHub
export async function loginGithub(){
  // Abre el popup de GitHub y espera la autorización del usuario
  const result = await signInWithPopup(auth, githubProvider)
  // Extraemos los datos del usuario devueltos por GitHub conservando sus favoritos
  const perfil = {
    uid: result.user.uid,
    nombre: result.user.displayName,
    email: result.user.email,
    photoURL: result.user.photoURL,
    favoritos: obtenerFavoritosPrevios()
  }

  // Guardamos el perfil en localStorage en formato JSON
  localStorage.setItem("perfil", JSON.stringify(perfil))
  // Retornamos el perfil
  return perfil
}
