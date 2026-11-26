<script setup>
// Recibimos por props la URL de página anterior, el número de página actual, el total de páginas y la URL de página siguiente
defineProps(["previous", "currentPage", "count", "next"])

// Definimos el evento personalizado "fetch" para avisarle al componente padre que debe cargar otra página
const emit = defineEmits(["fetch"])

// Función que emite el evento "fetch" enviando la URL de PokéAPI y el nuevo número de página
const fetchApi = (uri = "https://pokeapi.co/api/v2/pokemon?limit=10&offset=0", current = 1) => {
  emit("fetch", { uri, current })
}
</script>

<template>
  <!-- Contenedor de paginación centrado con botones redondeados -->
  <nav aria-label="Paginación de Pokédex" class="d-flex justify-content-center my-4">
    <ul class="pagination pagination-poke shadow-sm rounded-pill bg-white p-1 gap-1">
      <!-- Botón "Anterior": se deshabilita si estamos en la página 1 -->
      <li class="page-item">
        <button
          class="page-link rounded-pill border-0 px-3"
          :class="currentPage > 1 ? 'text-dark' : 'disabled text-muted'"
          @click="fetchApi(previous, currentPage - 1)"
        >
          ← Anterior
        </button>
      </li>

      <!-- Botón con el número de la página anterior (solo se muestra si currentPage > 1) -->
      <li v-if="currentPage > 1" class="page-item">
        <button
          class="page-link rounded-circle border-0 text-dark"
          @click="fetchApi(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${(currentPage - 2) * 10}`, currentPage - 1)"
        >
          {{ currentPage - 1 }}
        </button>
      </li>

      <!-- Botón con el número de la página actual (resaltado en rojo Pokédex) -->
      <li class="page-item">
        <button
          class="page-link rounded-circle border-0 bg-danger text-white fw-bold"
          @click="fetchApi(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${(currentPage - 1) * 10}`, currentPage)"
        >
          {{ currentPage }}
        </button>
      </li>

      <!-- Botón con el número de la página siguiente (solo se muestra si no llegamos a la última página) -->
      <li v-if="currentPage < count" class="page-item">
        <button
          class="page-link rounded-circle border-0 text-dark"
          @click="fetchApi(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${currentPage * 10}`, currentPage + 1)"
        >
          {{ currentPage + 1 }}
        </button>
      </li>

      <!-- Botón "Siguiente": se deshabilita si estamos en la última página -->
      <li class="page-item">
        <button
          class="page-link rounded-pill border-0 px-3"
          :class="currentPage >= count ? 'disabled text-muted' : 'text-dark'"
          @click="fetchApi(next, currentPage + 1)"
        >
          Siguiente →
        </button>
      </li>
    </ul>
  </nav>
</template>
