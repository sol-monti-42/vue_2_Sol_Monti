<script setup>
// Importamos ref para guardar el estado del usuario autenticado
import { ref } from "vue"
// Importamos las funciones de login con Google y GitHub desde nuestro servicio de autenticación
import { loginGoogle, loginGithub } from "../services/auth"
// Importamos useRouter para redirigir al usuario a /perfil luego de iniciar sesión
import { useRouter } from "vue-router"

// Estado reactivo del usuario (null si todavía no inició sesión)
const usuario = ref(null)
// Instancia del router para navegar por código
const route = useRouter()

// Función que llama al login de Google y redirige a la vista de Perfil
async function ingresarGoogle(){
  try {
    usuario.value = await loginGoogle()
    route.push({ path: "/perfil" })
  } catch (error) {
    console.log(error)
  }
}

// Función que llama al login de GitHub y redirige a la vista de Perfil
async function ingresarGithub(){
  try {
    usuario.value = await loginGithub()
    route.push({ path: "/perfil" })
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <!-- Contenedor centrado con tarjeta de acceso estilo Entrenador Pokémon -->
  <div class="container py-5 d-flex justify-content-center">
    <div class="card border-0 shadow rounded-5 p-4 p-md-5 text-center" style="max-width: 440px; width: 100%;">
      <div class="mx-auto mb-3 login-badge d-flex align-items-center justify-content-center">
        ⚡
      </div>
      <h1 class="h4 fw-bold mb-2">Acceso de Entrenador</h1>
      <p class="text-secondary small mb-4">
        Conectá tu cuenta para guardar tus Pokémon favoritos y acceder a tu perfil.
      </p>

      <!-- Si no hay usuario autenticado, mostramos los botones de inicio de sesión -->
      <div v-if="!usuario" class="d-grid gap-3">
        <button class="btn btn-danger rounded-pill py-2 fw-semibold shadow-sm" @click="ingresarGoogle">
          Continuar con Google
        </button>
        <button class="btn btn-dark rounded-pill py-2 fw-semibold shadow-sm" @click="ingresarGithub">
          Continuar con GitHub
        </button>
      </div>

      <!-- Si ya inició sesión, mostramos su saludo con nombre y email -->
      <div v-else class="alert alert-success rounded-4 mb-0">
        <p class="mb-0 fw-semibold">Hola, {{ usuario.nombre }} ({{ usuario.email }})</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-badge {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #fef3c7;
  font-size: 1.75rem;
}
</style>
