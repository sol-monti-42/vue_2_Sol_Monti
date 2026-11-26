<script setup>
// Importamos ref para crear variables reactivas
import { ref } from "vue"
// Importamos useRouter para poder navegar por código (programáticamente) a otra ruta
import { useRouter } from "vue-router"

// Obtenemos la instancia del router
const router = useRouter()
// Variable reactiva donde se guarda lo que el usuario escribe en el input de búsqueda
const nombre = ref("")

// Función que se ejecuta al enviar el formulario de búsqueda
const buscar = () => {
  // Redirige a la ruta /search pasando el texto buscado como query param (?search=...)
  router.push(
    {
      path: "/search",
      query: { search: nombre.value }
    }
  )
}
</script>

<template>
  <!-- Formulario de búsqueda con bordes redondeados; @submit.prevent evita que la página se recargue -->
  <form class="d-flex align-items-center gap-2" role="search" @submit.prevent="buscar">
    <!-- Input vinculado con v-model a la variable reactiva "nombre" -->
    <input
      v-model="nombre"
      class="form-control form-control-sm rounded-pill px-3 border-0 shadow-sm"
      name="search"
      type="search"
      placeholder="Buscar Pokémon..."
      aria-label="Search"
    />
    <!-- Botón amarillo estilo Pokémon que dispara el submit del formulario -->
    <button class="btn btn-warning btn-sm rounded-pill fw-semibold px-3 shadow-sm" type="submit">
      Buscar
    </button>
  </form>
</template>
