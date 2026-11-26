<script setup>
// Importamos ref y onMounted para cargar y actualizar los favoritos desde localStorage
import { ref, onMounted } from "vue"
// Importamos el componente Table que incluye <TransitionGroup> para animar al quitar favoritos
import Table from "../components/Table.vue"

// Lista reactiva con los pokemones favoritos guardados en localStorage
const favoritos = ref([])

// Función que lee la lista actualizada de favoritos desde localStorage
const cargarFavoritos = () => {
  const usuario = JSON.parse(localStorage.getItem("perfil"))
  favoritos.value = usuario?.favoritos || []
}

// Al montar la vista /favoritos, cargamos los favoritos guardados
onMounted(() => {
  cargarFavoritos()
})
</script>

<template>
  <main class="container py-4">
    <!-- Encabezado de la vista /favoritos -->
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
      <div>
        <h1 class="h2 fw-bold mb-1">❤️ Mis Pokémon Favoritos</h1>
        <p class="text-secondary small mb-0">
          Acá podés ver todos tus Pokémon guardados en localStorage y quitarlos cuando quieras.
        </p>
      </div>
      <span class="badge bg-danger rounded-pill px-3 py-2">
        {{ favoritos.length }} guardados
      </span>
    </div>

    <!-- Si hay favoritos guardados, mostramos la grilla animada con <TransitionGroup> y escuchamos @cambio-favorito -->
    <div v-if="favoritos.length > 0">
      <Table :personajes="favoritos" @cambio-favorito="cargarFavoritos" />
    </div>

    <!-- Si no hay favoritos, mostramos un mensaje e invitamos a explorar la Pokédex -->
    <div v-else class="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-3">
      <div class="fs-1 mb-2">♡</div>
      <h2 class="h5 fw-bold mb-2">Todavía no tenés Pokémon favoritos</h2>
      <p class="text-secondary small mb-4">
        Agregá tus Pokémon preferidos desde la Pokédex o desde la ficha de detalle de cada Pokémon.
      </p>
      <div>
        <RouterLink to="/personajes" class="btn btn-danger rounded-pill px-4 fw-semibold">
          Explorar Pokédex →
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
